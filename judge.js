// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAmORNJuMqLINMqIsmfwhg0nLT1molA3fs",
  authDomain: "ideathon-b4c3c.firebaseapp.com",
  projectId: "ideathon-b4c3c",
  storageBucket: "ideathon-b4c3c.appspot.com",
  messagingSenderId: "459070551009",
  appId: "1:459070551009:web:92341920b145cfe43e18a0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🔹 Protect page
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

// 🔹 Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});

// -----------------------------
// Load Teams into Dropdown
// -----------------------------
async function loadTeams() {
  const snapshot = await getDocs(collection(db, "teams"));
  const select = document.getElementById("teamSelect");
  select.innerHTML = `<option value="">-- Select Team --</option>`;
  snapshot.forEach((docSnap) => {
    let option = document.createElement("option");
    option.value = docSnap.id;
    option.textContent = docSnap.data().name;
    select.appendChild(option);
  });
}
loadTeams();

// -----------------------------
// Save Score
// -----------------------------
document.getElementById("saveScoreBtn").addEventListener("click", async () => {
  const teamId = document.getElementById("teamSelect").value;
  const score = parseInt(document.getElementById("scoreInput").value);

  if (!teamId || isNaN(score) || score < 0 || score > 10) {
    alert("⚠️ Please select a team and enter a valid score (0–10).");
    return;
  }

  // Decide which judge is giving marks (Judge1 or Judge2)
  const user = auth.currentUser;
  const judgeField = user.email.includes("judge1") ? "judge1" : "judge2";

  await updateDoc(doc(db, "teams", teamId), {
    [judgeField]: score
  });

  alert("✅ Score saved!");
});

// -----------------------------
// Live Leaderboard
// -----------------------------
onSnapshot(collection(db, "teams"), (snapshot) => {
  const leaderboard = document.getElementById("leaderboard");
  leaderboard.innerHTML = "";

  let teams = [];
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const total = (data.judge1 || 0) + (data.judge2 || 0);
    teams.push({ name: data.name, total });
  });

  teams.sort((a, b) => b.total - a.total);

  teams.forEach((t, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${t.name} - ${t.total} points`;
    leaderboard.appendChild(li);
  });
});
