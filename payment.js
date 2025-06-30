import { db } from './firebase_config.js';
import { collection, addDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Get course name and amount from query params
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const courseName = getQueryParam('course');
const amount = getQueryParam('amount');

// Update UI with course name and amount
document.getElementById('course-name').textContent = courseName || 'Unknown';
document.getElementById('amount').textContent = amount || '0';

const payButton = document.getElementById('pay-button');
const paymentStatus = document.getElementById('payment-status');

// Handle pay button click
payButton.addEventListener('click', async () => {
  // Validate input
  if (!amount || !courseName) {
    paymentStatus.textContent = 'Invalid payment details.';
    paymentStatus.style.color = 'red';
    return;
  }

  const auth = getAuth();

  // Wait until user is authenticated
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("You must be logged in to make a payment.");
      return;
    }

    const userId = user.uid;

    // Razorpay options for payment
    const options = {
      key: 'rzp_live_fn4tJyW5DakjWy', // Replace with your actual key
      amount: parseInt(amount) * 100, // Amount in paise
      currency: 'INR',
      name: 'United Learning',
      description: `Payment for ${courseName}`,
      handler: async function (response) {
        try {
          // Capture payment on backend (updated endpoint)
          var localUrl='http://localhost:3000/server_capture_payment';
          var liveUrl='https://united-learning-backend-fvnq.onrender.com/';
          const captureResponse = await fetch(liveUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              amount: parseInt(amount) * 100,
            }),
          });

          const captureResult = await captureResponse.json();

          if (captureResult.success) {
            // Save payment in Firestore
            const paymentRef = await addDoc(collection(db, "payments"), {
              userId: userId,
              userName: user.displayName || '',
              userPhone: user.phoneNumber || '',
              userEmail: user.email || '',
              course: courseName,
              isPaid: true, // Set isPaid true on success
              amountPaid: parseInt(amount), // Set amountPaid to paid amount
              paymentId: response.razorpay_payment_id,
              timestamp: new Date().toISOString()
            });

            // Optionally, update user profile in signupUser collection
            try {
              await updateDoc(doc(db, "signupUser", userId), {
                isPaid: true,
                amountPaid: parseInt(amount)
              });
            } catch (e) {
              // If user profile doesn't exist, ignore or handle as needed
              console.warn("Could not update signupUser profile:", e);
            }

            paymentStatus.textContent = 'Payment successful!';
            paymentStatus.style.color = 'green';

            // Optional: Redirect after success
            setTimeout(() => {
              window.location.href = 'index.html'; // Change as needed
            }, 2000);
          } else {
            paymentStatus.textContent = 'Payment capture failed.';
            paymentStatus.style.color = 'red';
          }
        } catch (error) {
          // Log and display payment error
          console.error('Payment error:', error);
          paymentStatus.textContent = 'An error occurred during payment.';
          paymentStatus.style.color = 'red';
        }
      },

      prefill: {
        name: user.displayName || '',
        email: user.email || '',
        contact: user.phoneNumber || ''
      },
      theme: {
        color: '#528ff0'
      }
    };

    // Open Razorpay Checkout
    const rzp = new Razorpay(options);
    rzp.open();
  });
});