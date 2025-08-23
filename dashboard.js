// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Your Firebase config (replace with your own)
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

// Redirect to login if not logged in
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
    }
});

// Logout function
document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            console.log("User logged out");
            window.location.href = "index.html"; // Redirect to login page
        })
        .catch((error) => {
            console.error("Logout Error:", error);
        });
});
