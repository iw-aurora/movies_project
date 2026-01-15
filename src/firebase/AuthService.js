import { auth, firebaseConfig } from "./firebaseConfig";
import { initializeApp, deleteApp } from "firebase/app";
import {
  getAuth as getSecondaryAuth,
  createUserWithEmailAndPassword as createSecondaryUserAuth,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { createUserProfile, getUserProfile } from "./UserService";

/* ĐĂNG KÝ (USER PRIMARY) - Logs in automatically, so we force logout */
export const register = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  // optionally set display name on the Firebase user profile
  if (displayName) {
    try {
      await updateProfile(user, { displayName });
    } catch (err) {
      // non-fatal: profile update failed (logging for visibility)
      console.warn('updateProfile failed', err);
    }
  }

  // PHÂN ROLE MẶC ĐỊNH - attempt to write user doc but don't fail registration when rules block it
  try {
    await createUserProfile(user.uid, {
      role: "user",
      displayName: displayName || null,
      username: displayName || null,
      email: email,
      status: "active",
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    // Firestore write failed.
    console.warn('Failed to write users/{uid} doc', err);
  }

  // Force logout so user must manually sign in
  await signOut(auth);

  return user;
};

/* CREATE USER (ADMIN MODE) - Does NOT log out current admin */
export const createSecondaryUser = async (email, password, displayName) => {
  // 1. Init temporary app instance to create user without overriding current Auth session
  const appName = "SecondaryApp_" + Date.now();
  const secondaryApp = initializeApp(firebaseConfig, appName);
  const secondaryAuth = getSecondaryAuth(secondaryApp);

  try {
    const userCredential = await createSecondaryUserAuth(secondaryAuth, email, password);
    const user = userCredential.user;

    // 2. Update Profile
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    // 3. Write to Firestore (using MAIN db instance via UserService)
    await createUserProfile(user.uid, {
      role: "user",
      displayName: displayName || null,
      username: displayName || null,
      email: email,
      password: password,
      status: "active",
      createdAt: new Date().toISOString()
    });

    return user;
  } finally {
    // 4. Cleanup
    await deleteApp(secondaryApp);
  }
};

/* ĐĂNG NHẬP */
export const login = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  // Check if locked
  const userProfile = await getUserProfile(user.uid);

  if (userProfile && userProfile.status === 'locked') {
    await signOut(auth);
    throw new Error('Tài khoản của bạn đã bị khóa.');
  }

  return credential;
};

/* GOOGLE SIGN-IN */
export const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // ensure user doc exists and assign default role if missing
  try {
    const existingUser = await getUserProfile(user.uid);
    if (!existingUser) {
      await createUserProfile(user.uid, {
        role: "user",
        createdAt: new Date()
      });
    }
  } catch (err) {
    // non-fatal - Firestore may be blocked by security rules
    console.warn('googleSignIn: failed to read/write users/{uid} doc', err);
  }

  return user;
};

/* ĐĂNG XUẤT */
export const logout = async () => {
  return signOut(auth);
};

/* LẤY ROLE */
export const getUserRole = async (uid) => {
  try {
    const user = await getUserProfile(uid);
    return user ? user.role : null;
  } catch (err) {
    console.error('getUserRole error', err);
    // Return null on permission/read errors so the app can continue
    return null;
  }
};
