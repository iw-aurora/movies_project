import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig.js";
import { getUserRole } from "../firebase/AuthService.js";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user_data");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [role, setRole] = useState(() => Cookies.get("user_role") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        Cookies.set('user_data', JSON.stringify({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        }), { expires: 7 });

        try {
          const userRole = await getUserRole(currentUser.uid);
          setRole(userRole);
          if (userRole) {
             Cookies.set('user_role', userRole, { expires: 7 });
          } else {
             Cookies.remove('user_role');
          }
        } catch (err) {
          console.error('Error fetching user role', err);
          // Don't clear role immediately on error if we have a stale one? 
          // Actually better to fail safe, or keep stale? 
          // Let's keep existing behavior: setNull.
          setRole(null);
          Cookies.remove('user_role');
        }
      } else {
        setUser(null);
        setRole(null);
        Cookies.remove('user_data');
        Cookies.remove('user_role');
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
