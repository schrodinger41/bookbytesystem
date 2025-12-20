import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-T24O-KDLJQCzSL1kFaQARHp9-JERNEo",
  authDomain: "bookbyte-c17d0.firebaseapp.com",
  projectId: "bookbyte-c17d0",
  storageBucket: "bookbyte-c17d0.firebasestorage.app",
  messagingSenderId: "126759884776",
  appId: "1:126759884776:web:ef901273a27fedaf42f65d",
  measurementId: "G-T9VKCS54FK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
