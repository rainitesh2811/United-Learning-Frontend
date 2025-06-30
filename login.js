import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCE4nJ2I6Einte73wFhLl-3WK8nR55k9X4",
  authDomain: "united-learning.firebaseapp.com",
  projectId: "united-learning",
  storageBucket: "united-learning.appspot.com",
  messagingSenderId: "94585715202",
  appId: "1:94585715202:web:216bffaafe5756e3a4851b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-button")?.addEventListener("click", login);
  document.getElementById("forgot-password")?.addEventListener("click", resetPassword);
});

// 🟡 Login Function
async function login(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("error-message");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      errorMessage.innerHTML = `⚠️ Please verify your email before logging in.`;
      return;
    }

    // Email verified
    alert("Login successful!");
    // Store userId in localStorage
    localStorage.setItem('userId', user.uid);
    window.location.href = "index.html";

  } catch (error) {
    console.error("Login error:", error.message);
    errorMessage.textContent = "Error: " + error.message;
  }
}

// 🔁 Forgot Password Function
async function resetPassword(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const resetMessage = document.getElementById("reset-message");

  if (!email) {
    resetMessage.textContent = "⚠️ Please enter your email above first.";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    resetMessage.textContent = `✅ Password reset email sent to ${email}. Check your inbox.`;
  } catch (error) {
    console.error("Reset password error:", error.message);
    resetMessage.textContent = "❌ Error: " + error.message;
  }
}
