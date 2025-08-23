// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// 🔹 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAmORNJuMqLINMqIsmfwhg0nLT1molA3fs",
  authDomain: "ideathon-b4c3c.firebaseapp.com",
  projectId: "ideathon-b4c3c",
  storageBucket: "ideathon-b4c3c.appspot.com",
  messagingSenderId: "459070551009",
  appId: "1:459070551009:web:92341920b145cfe43e18a0"
};

// 🔹 Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Protect page
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "index.html";
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => window.location.href = "index.html");
});

// ----------------------
// Load Leaderboard
// ----------------------
async function loadLeaderboard() {
  const snapshot = await getDocs(collection(db, "teams"));
  let teams = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const score = (data.judge1 || 0) + (data.judge2 || 0);
    teams.push({ id: docSnap.id, name: data.name, score, order: data.order || 999 });
  });

  // Sort by score desc
  teams.sort((a, b) => b.score - a.score);

  const leaderboard = document.getElementById("leaderboard");
  leaderboard.innerHTML = "";

  teams.forEach((t, index) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<h3>${index + 1}. ${t.name}</h3><p>Score: ${t.score}</p>`;
    leaderboard.appendChild(div);
  });

  // Load next participant for demo (assuming first one is current)

}

loadLeaderboard();
