document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
});

import { auth } from "./firebase_config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Check authentication state
window.onload = () => {
    const loginBtn = document.getElementById("login-btn");
    const userAccount = document.getElementById("user-account");
    const logoutBtn = document.getElementById("logout-btn");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is logged in
            loginBtn.style.display = "none";
            userAccount.style.display = "block";
            logoutBtn.style.display = "block";
        } else {
            // User is logged out
            loginBtn.style.display = "block";
            userAccount.style.display = "none";
            logoutBtn.style.display = "none";
        }
    });
};

// Logout function
window.logout = function () {
    signOut(auth)
        .then(() => alert("Logged out successfully"))
        .catch((error) => console.error("Error logging out:", error));
};
