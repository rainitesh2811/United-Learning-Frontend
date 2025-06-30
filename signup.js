// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCE4nJ2I6Einte73wFhLl-3WK8nR55k9X4",
  authDomain: "united-learning.firebaseapp.com",
  projectId: "united-learning",
  storageBucket: "united-learning.appspot.com",
  messagingSenderId: "94585715202",
  appId: "1:94585715202:web:216bffaafe5756e3a4851b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign Up Function
async function signUp() {
  const username = document.getElementById("username").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user info to Firestore
    await setDoc(doc(db, "signupUsers", user.uid), {
      uid: user.uid,
      username: username,
      phone: phone,
      email: email,
      createdAt: new Date()
    });

    // Send email verification
    await sendEmailVerification(user);

    alert("Sign-up successful! Verification email sent.");
    // Store userId in localStorage
    localStorage.setItem('userId', user.uid);
    window.location.href = "login.html";

  } catch (error) {
    console.error("Error:", error.message);
    alert(error.message);
  }
}

// Event Listener
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("signup-form").addEventListener("submit", async function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!username) {
      alert("Please enter your username.");
      return false;
    }
    if (!phone.match(/^[0-9]{10,15}$/)) {
      alert("Please enter a valid phone number (10-15 digits).");
      return false;
    }
    // Call signUp only if all fields are valid
    await signUp();
  });
});
