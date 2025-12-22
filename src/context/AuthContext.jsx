import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase"; // Ensure db is imported
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const ADMIN_EMAILS = [
  "jhetdizon41@gmail.com",
  "jerrakirstenr22@gmail.com",
  "labulovetreasures@gmail.com",
  "kirstenblackheart22@gmail.com",
];

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(true);

      if (firebaseUser) {
        setIsAdmin(ADMIN_EMAILS.includes(firebaseUser.email));

        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            // If Google auth created the user but we haven't created a doc yet (race condition or first login), we handle it in AuthPage usually.
            // But if we are here, we might just have null.
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      } else {
        setIsAdmin(false);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, isAdmin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
