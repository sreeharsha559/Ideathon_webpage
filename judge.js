// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { 
  getFirestore, collection, getDocs, updateDoc, doc, onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { 
  getAuth, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

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

// 🔒 Protect page
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

// 🚪 Logout
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

  const user = auth.currentUser;
  let judgeField = "";

  if (user && user.email.includes("judge1")) {
    judgeField = "judge1Score";
  } else if (user && user.email.includes("judge2")) {
    judgeField = "judge2Score";
  } else {
    alert("⚠️ Judge email must include 'judge1' or 'judge2'");
    return;
  }

  await updateDoc(doc(db, "teams", teamId), {
    [judgeField]: score
  });

  alert("✅ Score saved!");
});

// -----------------------------
// Live Leaderboard (table view)
// -----------------------------
onSnapshot(collection(db, "teams"), (snapshot) => {
  const tbody = document.querySelector("#leaderboardTable tbody");
  if (!tbody) return;

  let teams = [];
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const total = (data.judge1Score || 0) + (data.judge2Score || 0);
    teams.push({
      id: docSnap.id,
      name: data.name,
      judge1: data.judge1Score || 0,
      judge2: data.judge2Score || 0,
      total,
      duration: data.duration || "00:00"
    });
  });

  teams.sort((a, b) => b.total - a.total);

  tbody.innerHTML = "";
  teams.forEach((t, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${t.id}</td>
      <td>${t.name}</td>
      <td>${t.judge1}</td>
      <td>${t.judge2}</td>
      <td>${t.total}</td>
      <td>${t.duration}</td>
    `;
    tbody.appendChild(tr);
  });
});

// -----------------------------
// Download Leaderboard as Excel
// -----------------------------
document.getElementById("downloadExcelBtn").addEventListener("click", async () => {
  const rows = [];
  const snapshot = await getDocs(collection(db, "teams"));
  snapshot.forEach((docSnap) => {
    const d = docSnap.data();
    const total = (d.judge1Score || 0) + (d.judge2Score || 0);
    rows.push({
      TeamID: docSnap.id,
      TeamName: d.name,
      Judge1: d.judge1Score || 0,
      Judge2: d.judge2Score || 0,
      TotalMarks: total,
      Duration: d.duration || "00:00"
    });
  });

  rows.sort((a, b) => b.TotalMarks - a.TotalMarks);
  rows.forEach((r, i) => (r.Rank = i + 1));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leaderboard");
  XLSX.writeFile(wb, "Leaderboard.xlsx");
});
