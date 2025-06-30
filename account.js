import { auth, db } from "./firebase_config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
// Wait for user authentication
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User logged in:", user.email);
        document.getElementById("user-email").textContent = user.email;

        // Fetch user data from Firestore
        await fetchUserData(user.uid);
    } else {
        console.log("No user logged in.");
        alert("You are not logged in. Redirecting to login page.");
        window.location.href = "login.html"; // Redirect to login page
    }
});

// Fetch User Data from Firestore
async function fetchUserData(uid) {
    try {
        const userDoc = await getDoc(doc(db, "signupUsers", uid)); // Change collection to "signupUsers"
        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById("user-username").textContent = userData.username || "Not set";
            document.getElementById("user-phone").textContent = userData.phone || "Not set";

            // Pre-fill editable fields with current values
            document.getElementById("edit-username").value = userData.username || "";
            document.getElementById("edit-phone").value = userData.phone || "";

            // Check payment status and unlock courses
            await checkPaymentStatus(uid);
        } else {
            console.log("No user data found.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

// Check Payment Status and Unlock Courses
async function checkPaymentStatus(uid) {
    try {
        const paymentsRef = collection(db, "Payments");
        const q = query(paymentsRef, where("userId", "==", uid));
        const querySnapshot = await getDocs(q);

        let unlockedCourses = [];
        querySnapshot.forEach((doc) => {
            if (doc.data().paymentStatus) {
                unlockedCourses.push(doc.data().courseId);
            }
        });

        // Display unlocked courses (this is just an example, adjust as needed)
        console.log("Unlocked Courses:", unlockedCourses);
    } catch (error) {
        console.error("Error checking payment status:", error);
    }
}

// Enable Editing
document.getElementById("edit-btn").addEventListener("click", () => {
    document.getElementById("edit-username").disabled = false;
    document.getElementById("edit-phone").disabled = false;
    document.getElementById("save-btn").style.display = "inline-block";
    document.getElementById("edit-btn").style.display = "none";
});

// Save User Data
document.getElementById("save-btn").addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
        alert("You are not logged in.");
        return;
    }

    const username = document.getElementById("edit-username").value.trim();
    const phone = document.getElementById("edit-phone").value.trim();

    if (!username || !phone) {
        alert("Please enter both username and phone number.");
        return;
    }

    try {
        const userRef = doc(db, "signupUsers", user.uid); // Change collection to "signupUsers"
        await setDoc(userRef, { 
            username: username, 
            phone: phone,
            email: user.email,
            uid: user.uid
        }, { merge: true });

        alert("User details updated successfully!");

        // Disable inputs and switch back buttons
        document.getElementById("edit-username").disabled = true;
        document.getElementById("edit-phone").disabled = true;
        document.getElementById("save-btn").style.display = "none";
        document.getElementById("edit-btn").style.display = "inline-block";
    } catch (error) {
        console.error("Error updating user details:", error);
        alert("Failed to update details.");
    }
});

// Logout Function
document.getElementById("logout-btn").addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            alert("Logged out successfully");
            window.location.href = "login.html"; // Redirect to login page
        })
        .catch((error) => console.error("Error logging out:", error));
});