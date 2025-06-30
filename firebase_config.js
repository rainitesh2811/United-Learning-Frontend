

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCE4nJ2I6Einte73wFhLl-3WK8nR55k9X4",
  authDomain: "united-learning.firebaseapp.com",
  projectId: "united-learning",
  storageBucket: "united-learning.firebasestorage.app",
  messagingSenderId: "94585715202",
  appId: "1:94585715202:web:216bffaafe5756e3a4851b",
  measurementId: "G-D854YD4WN9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Add this line

// Export Firebase services
export { auth, db, storage }; // ✅ Ensure storage is exported



