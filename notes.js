import { auth, db } from "./firebase_config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

let isContentUnlocked = false;

const courseIdMap = {
    "CLASS 6TH NOTES": "class-6-access",
    "CLASS 7TH NOTES": "class-7-access",
    "CLASS 8TH NOTES": "class-8-access",
    "CLASS 9TH NOTES": "class-9-access",
    "CLASS 10TH NOTES": "class-10-access",
    "CLASS 11TH NOTES": "class-11-access",
    "CLASS 12TH NOTES": "class-12-access",
    // Add more if needed
};

window.onload = () => {
    const loginBtn = document.getElementById("login-btn");
    const userAccount = document.getElementById("user-account");
    const logoutBtn = document.getElementById("logout-btn");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Logged-in UID:", user.uid);
            loginBtn.style.display = "none";
            userAccount.style.display = "block";
            logoutBtn.style.display = "block";
            checkUserPaymentStatus(user);
        } else {
            loginBtn.style.display = "block";
            userAccount.style.display = "none";
            logoutBtn.style.display = "none";
            if (!isContentUnlocked) lockAllPremiumContent();
        }
    });
};

window.logout = function () {
    signOut(auth)
        .then(() => alert("Logged out successfully"))
        .catch((error) => console.error("Error logging out:", error));
};

window.toggleLinks = function (element) {
    element.classList.toggle("active");
};

document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });
    }

    document.body.addEventListener("click", function (e) {
        let target = e.target;
        while (target && target !== document.body) {
            if (target.tagName === "A" && target.classList.contains("locked")) {
                e.preventDefault();
                showPaymentModal();
                break;
            }
            target = target.parentElement;
        }
    });
});

const loginModal = document.getElementById("loginModal");
const closeModal = document.getElementById("closeModal");
const paymentModal = document.getElementById("paymentModal");
const closePaymentModal = document.getElementById("closePaymentModal");

function showLoginModal() {
    if (loginModal) loginModal.classList.add("show");
}

function hideLoginModal() {
    if (loginModal) loginModal.classList.remove("show");
}

function showPaymentModal() {
    if (paymentModal) paymentModal.classList.add("show");
}

function hidePaymentModal() {
    if (paymentModal) paymentModal.classList.remove("show");
}

if (closeModal) {
    closeModal.addEventListener("click", () => hideLoginModal());
}
if (closePaymentModal) {
    closePaymentModal.addEventListener("click", () => hidePaymentModal());
}
window.addEventListener("click", (e) => {
    if (e.target === loginModal) hideLoginModal();
    if (e.target === paymentModal) hidePaymentModal();
});

function lockAllPremiumContent() {
    const lockedLinks = document.querySelectorAll("div.subject a.locked, div.subject a.unlocked");
    lockedLinks.forEach((link) => {
        link.classList.remove("unlocked");
        if (!link.classList.contains("locked")) link.classList.add("locked");
        if (!link.querySelector(".premium-lock")) {
            link.innerHTML += ' <span class="premium-lock">🔒</span>';
        }
    });
}

function unlockClassLinks(classId) {
    const classElement = document.getElementById(classId);
    if (classElement) {
        const links = classElement.querySelectorAll("a.locked");
        links.forEach((link) => {
            link.classList.remove("locked");
            link.classList.add("unlocked");
            const lockIcon = link.querySelector(".premium-lock");
            if (lockIcon) lockIcon.remove();
        });
    }
}

function unlockContentBasedOnCourse(course) {
    const normalizedCourse = course.trim().toUpperCase();
    const classId = courseIdMap[normalizedCourse];
    if (classId) {
        console.log(`✅ Unlocking for course: "${normalizedCourse}", classId: "${classId}"`);
        unlockClassLinks(classId);
        isContentUnlocked = true;
    } else {
        console.warn("⚠️ No matching classId for course:", normalizedCourse);
    }
}

function checkUserPaymentStatus(user) {
    const paymentsRef = collection(db, "payments");
    console.log("🔍 Checking payment status for UID:", user.uid);

    const q = query(
        paymentsRef,
        where("userId", "==", user.uid),
        where("isPaid", "==", true)
    );

    getDocs(q)
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                console.warn("🚫 No valid payment record found.");
                if (!isContentUnlocked) lockAllPremiumContent();
                return;
            }

            let unlocked = false;
            querySnapshot.forEach((doc) => {
                const payment = doc.data();
                console.log("✅ Found payment record:", payment);
                if (payment.course) {
                    unlockContentBasedOnCourse(payment.course);
                    unlocked = true;
                }
            });

            if (!unlocked && !isContentUnlocked) {
                lockAllPremiumContent();
            }
        })
        .catch((error) => {
            console.error("❌ Error checking payment:", error);
            if (!isContentUnlocked) lockAllPremiumContent();
        });
}

document.addEventListener("DOMContentLoaded", function () {
    const upgradeButton = document.getElementById("upgradeNow");
    if (upgradeButton) {
        upgradeButton.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }
});
