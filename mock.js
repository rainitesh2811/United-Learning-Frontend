import { auth, db } from "./firebase_config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// ========== USER AUTHENTICATION HANDLING ==========
window.onload = () => {
    onAuthStateChanged(auth, async (user) => {
        const loginBtn = document.getElementById("login-btn");
        const userAccount = document.getElementById("user-account");
        const logoutBtn = document.getElementById("logout-btn");

        if (user) {
            console.log("User logged in:", user.email);
            loginBtn.style.display = "none";
            userAccount.style.display = "block";
            logoutBtn.style.display = "block";
            await checkUserPaymentStatus(user);
        } else {
            console.log("No user logged in.");
            loginBtn.style.display = "block";
            userAccount.style.display = "none";
            logoutBtn.style.display = "none";
            lockExtraContent();
        }
    });
};

// ========== LOGOUT FUNCTION ==========
window.logout = function () {
    signOut(auth)
        .then(() => {
            alert("Logged out successfully");
            lockExtraContent();
        })
        .catch((error) => console.error("Error logging out:", error));
};

// ========== CHECK USER PAYMENT STATUS (MULTIPLE PAYMENTS) ==========
async function checkUserPaymentStatus(user) {
    try {
        const paymentsRef = collection(db, "payments");
        const q = query(paymentsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        let unlocked = false;
        querySnapshot.forEach((doc) => {
            const payment = doc.data();
            if (payment.course) {
                unlockMockTestsByCourse(payment.course);
                unlocked = true;
            }
        });

        if (!unlocked) {
            lockExtraContent();
        }
    } catch (error) {
        console.error("Error checking payment status:", error);
        lockExtraContent();
    }
}

// Unlock mock tests based on course name (class-wise)
function unlockMockTestsByCourse(courseName) {
    lockExtraContent();

    // Map course names to class container IDs
    const courseClassMap = {
        "CLASS 6TH MOCKS": "classVI",
        "CLASS 7TH MOCKS": "classVII",
        "CLASS 8TH MOCKS": "classVIII",
        "CLASS 9TH MOCKS": "classIX",
        "CLASS 10TH MOCKS": "classX",
        "CLASS 11TH MOCKS": "classXI",
        "CLASS 12TH MOCKS": "classXII",
        "AGNIVEER MOCKS": "agniveer"
    };

    const classIdToUnlock = courseClassMap[courseName];
    if (!classIdToUnlock) {
        console.log("No class matched for courseName:", courseName);
        return;
    }

    const classContainer = document.getElementById(classIdToUnlock);
    if (!classContainer) {
        console.log("Class container not found for id:", classIdToUnlock);
        return;
    }

    const links = classContainer.querySelectorAll(".dropdown a");
    links.forEach((link) => {
        link.classList.remove("locked");
        link.classList.add("unlocked");
        const lockIcon = link.querySelector(".premium-lock");
        if (lockIcon) {
            lockIcon.remove();
        }
    });

    document.querySelectorAll('.dropdown a[id="unlock"]').forEach((link) => {
        link.classList.remove("locked");
        link.classList.add("unlocked");
        const lockIcon = link.querySelector(".premium-lock");
        if (lockIcon) {
            lockIcon.remove();
        }
    });
}

// ========== LOCK/UNLOCK EXTRA MOCK TESTS ==========
function lockExtraContent() {
    document.querySelectorAll(".dropdown a").forEach((link) => {
        if (!link.classList.contains("unlocked") && link.id !== "unlock") {
            if (!link.classList.contains("locked")) {
                link.classList.add("locked");
                if (!link.querySelector(".premium-lock")) {
                    link.innerHTML += ' <span class="premium-lock">🔒</span>';
                }
            }
        }
    });

    document.querySelectorAll('.dropdown a[id="unlock"]').forEach((link) => {
        link.classList.remove("locked");
        link.classList.add("unlocked");
        const lockIcon = link.querySelector(".premium-lock");
        if (lockIcon) {
            lockIcon.remove();
        }
    });
}

// ========== PREVENT ACCESS TO LOCKED MOCK TESTS ==========
function preventAccess(event) {
    event.preventDefault();
    showPaymentPopup();
}

// ========== NAVBAR TOGGLE ==========
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }
});

// ========== SUBJECT DROPDOWN FUNCTION ==========
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".subject h4").forEach((subject) => {
        subject.addEventListener("click", function () {
            let dropdown = this.nextElementSibling;
            if (dropdown && dropdown.classList.contains("dropdown")) {
                dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
            }
        });
    });
});

// ========== LOGIN & PAYMENT POPUP HANDLING ==========
document.addEventListener("DOMContentLoaded", () => {
    const loginModal = document.getElementById("loginModal");
    const closeModal = document.getElementById("closeModal");
    const paymentPopup = document.getElementById("paymentPopup");
    const closePayment = document.getElementById("closePayment");

    if (!loginModal || !closeModal || !paymentPopup || !closePayment) {
        console.warn("Login or payment popups not found.");
        return;
    }

    window.showLoginModal = () => {
        console.log("Showing login modal");
        loginModal.style.display = "flex";
    };

    window.showPaymentPopup = () => {
        console.log("Showing payment required popup");
        paymentPopup.style.display = "flex";
    };

    closeModal.addEventListener("click", () => {
        loginModal.style.display = "none";
    });

    closePayment.addEventListener("click", () => {
        paymentPopup.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === loginModal) loginModal.style.display = "none";
        if (e.target === paymentPopup) paymentPopup.style.display = "none";
    });
});

// ========== EVENT DELEGATION FOR LOCKED LINKS ==========
document.body.addEventListener("click", function (e) {
    let target = e.target;
    while (target && target !== document.body) {
        if (target.tagName === "A" && target.classList.contains("locked")) {
            e.preventDefault();
            showPaymentPopup();
            break;
        }
        target = target.parentElement;
    }
});
window.showClass = function () {
    const selectedClass = document.getElementById("classSelect").value;

    document.querySelectorAll(".class-container").forEach((element) => {
        element.style.display = "none";
    });

    if (selectedClass) {
        const classElement = document.getElementById(selectedClass);
        if (classElement) {
            classElement.style.display = "block";
        }
    }
};