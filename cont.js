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


// Import Firestore database instance from firebase_config.js
import { db } from "./firebase_config.js";
// Import collection and addDoc from Firebase v9.15.0 CDN to match firebase_config.js version
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Handle Contact Form Submission
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const message = document.getElementById("message").value;

            try {
                await addDoc(collection(db, "messages"), { name, email, message });
                alert("Message Sent Successfully!");
                contactForm.reset();
            } catch (error) {
                console.error("Error submitting message:", error);
                alert("Failed to send message!");
            }
        });
    }
});
