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
            if (loginBtn) loginBtn.style.display = "none";
            if (userAccount) userAccount.style.display = "block";
            if (logoutBtn) logoutBtn.style.display = "block";
        } else {
            // User is logged out
            if (loginBtn) loginBtn.style.display = "block";
            if (userAccount) userAccount.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "none";
        }
    });
};

// Logout function
window.logout = function () {
    signOut(auth)
        .then(() => alert("Logged out successfully"))
        .catch((error) => console.error("Error logging out:", error));
};

document.addEventListener("DOMContentLoaded", function () {
    // Responsive menu toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });
    }

    // Read More / Read Less toggle
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', () => {
            const readMoreText = button.previousElementSibling;
            if (readMoreText) {
                if (readMoreText.style.display === 'none' || !readMoreText.style.display) {
                    readMoreText.style.display = 'block';
                    button.textContent = 'Read Less';
                } else {
                    readMoreText.style.display = 'none';
                    button.textContent = 'Read More';
                }
            }
        });
    });

    // Dropdown for course sections
    document.querySelectorAll(".dropdown-btn").forEach(button => {
        button.addEventListener("click", function () {
            let dropdownContent = this.nextElementSibling;

            // Close all other dropdowns before opening a new one
            document.querySelectorAll(".dropdown-content").forEach(content => {
                if (content !== dropdownContent) {
                    content.style.maxHeight = null;
                    content.style.padding = "0px";
                    content.classList.remove("active");
                }
            });

            // Toggle the clicked dropdown
            if (dropdownContent && dropdownContent.classList.contains("active")) {
                dropdownContent.style.maxHeight = null;
                dropdownContent.style.padding = "0px";
                dropdownContent.classList.remove("active");
            } else if (dropdownContent) {
                dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
                dropdownContent.style.padding = "10px";
                dropdownContent.classList.add("active");
            }
        });
    });

    // Achiever slider
    const track = document.querySelector(".achiever-track");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const images = document.querySelectorAll(".achiever-track img");
    let imgWidth = 0;
    if (images.length > 0) {
        imgWidth = images[0].offsetWidth + 20; // Image width + gap
    }
    let index = 0;
    let interval;

    function updateSlider() {
        if (track) {
            track.style.transform = `translateX(${-index * imgWidth}px)`;
        }
    }

    function nextSlide() {
        if (images.length === 0) return;
        if (index < images.length - 3) {
            index++;
        } else {
            index = 0; // Loop back to start
        }
        updateSlider();
    }

    function prevSlide() {
        if (images.length === 0) return;
        if (index > 0) {
            index--;
        } else {
            index = images.length - 3; // Go to last set
        }
        updateSlider();
    }

    // Auto-scroll every 2 seconds
    function startAutoSlide() {
        if (interval) clearInterval(interval);
        interval = setInterval(nextSlide, 2000);
    }

    // Stop auto-scroll when hovered
    function stopAutoSlide() {
        if (interval) clearInterval(interval);
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", function () {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", function () {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
    }

    if (track && images.length > 0) {
        startAutoSlide();
    }
});