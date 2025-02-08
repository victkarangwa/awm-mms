import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD92o3NuMbLJcFwfmL3rPXtBkc6CWTjlU8",
  authDomain: "awm-mms.firebaseapp.com",
  projectId: "awm-mms",
  storageBucket: "awm-mms.firebasestorage.app",
  messagingSenderId: "706317958146",
  appId: "1:706317958146:web:856c5d23ea417f71f07b1b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
