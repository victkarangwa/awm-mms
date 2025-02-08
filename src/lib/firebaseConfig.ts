import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";  // Import Realtime Database

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
const db = getDatabase(app);  // Connect to Realtime Database

export { auth, db };
