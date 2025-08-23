


import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase configuration
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
const db = getFirestore(app);

// Elements
const loginBtn = document.getElementById("loginBtn");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");
const roleDisplay = document.getElementById("roleDisplay");

function showLoader() {
  btnText.textContent = "Logging in...";
  btnLoader.style.display = "inline-block";
  loginBtn.disabled = true;
}

function hideLoader() {
  btnText.textContent = "Login";
  btnLoader.style.display = "none";
  loginBtn.disabled = false;
}

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    roleDisplay.textContent = "Please enter email & password!";
    return;
  }

  showLoader();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    const userDoc = await getDoc(doc(db, "users", uid));

    if (userDoc.exists()) {
    const role = userDoc.data().role;

    // Role-based redirection
    if (role === "admin") {
        window.location.href = "admin.html";
    } else if (role === "judge1" || role === "judge2") {
        window.location.href = "judge.html";
    } else if (role === "participant") {
        window.location.href = "participant.html";
    } else {
        roleDisplay.textContent = "Unknown role!";
    }
} else {
    roleDisplay.textContent = "No role found for this user in Firestore.";
}

  } catch(error) {
    roleDisplay.textContent = "Login failed: " + error.message;
  }

  hideLoader();
});
