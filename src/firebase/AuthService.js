import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

/* ĐĂNG KÝ */
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
    await setDoc(doc(db, "users", user.uid), {
      role: "user",
      displayName: displayName || null,
      createdAt: new Date()
    });
  } catch (err) {
    // Firestore write failed (often due to rules). Log and continue — user account was still created.
    console.warn('Failed to write users/{uid} doc; check Firestore rules or permissions', err);
  }

  return user;
};

/* ĐĂNG NHẬP */
export const login = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/* GOOGLE SIGN-IN */
export const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // ensure user doc exists and assign default role if missing
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) {
      await setDoc(doc(db, "users", user.uid), {
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
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data().role : null;
  } catch (err) {
    console.error('getUserRole error', err);
    // Return null on permission/read errors so the app can continue
    return null;
  }
};
