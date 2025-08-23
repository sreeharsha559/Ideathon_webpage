// authGuard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Firebase Config (Replace with your own from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyAmORNJuMqLINMqIsmfwhg0nLT1molA3fs",
  authDomain: "ideathon-b4c3c.firebaseapp.com",
  projectId: "ideathon-b4c3c",
 storageBucket: "ideathon-b4c3c.appspot.com",
  messagingSenderId: "459070551009",
  appId: "1:459070551009:web:92341920b145cfe43e18a0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Protects page and enables logout button
 * @param {string} buttonId - The ID of the logout button in HTML
 */
export function setupLogout(buttonId) {
  // Protect page: Redirect to login if not authenticated
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "index.html"; // Redirect to login page
    }
  });

  // Logout logic
  const logoutBtn = document.getElementById(buttonId);
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          console.log("User logged out");
          window.location.href = "index.html"; // Back to login page
        })
        .catch((error) => {
          console.error("Logout Error:", error);
        });
    });
  }
}
