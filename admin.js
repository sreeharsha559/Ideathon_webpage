// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, doc, updateDoc, getDoc 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
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

// -----------------------------
// Variables
// -----------------------------
let pptWindow = null;
let timer = null;
let timeLeft = 7 * 60;   // default 7 mins
let startTime = null;    // to calculate actual time taken
const timerDisplay = document.getElementById("timerDisplay");

// 🔒 Protect page
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "index.html";
});

// 🚪 Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => window.location.href = "index.html");
});

// 📝 Register Team
document.getElementById("registerTeamBtn").addEventListener("click", async () => {
  const teamName = document.getElementById("teamName").value.trim();
  const teamMembers = document.getElementById("teamMembers").value.trim();

  if (!teamName || !teamMembers) {
    alert("Please fill all fields");
    return;
  }

  await addDoc(collection(db, "teams"), {
    name: teamName,
    members: teamMembers.split(","),
    pptUrl: null,
    judge1: 0,
    judge2: 0,
    duration: "00:00"
  });

  alert("✅ Team registered!");
  loadTeams();
});

// 📥 Load Teams Dropdown
async function loadTeams() {
  const snapshot = await getDocs(collection(db, "teams"));
  const select = document.getElementById("teamSelect");
  select.innerHTML = "";
  snapshot.forEach((docSnap) => {
    let option = document.createElement("option");
    option.value = docSnap.id;
    option.textContent = docSnap.data().name;
    select.appendChild(option);
  });
}
loadTeams();

// 🔗 Save PPT Link
document.getElementById("savePptBtn").addEventListener("click", async () => {
  const teamId = document.getElementById("teamSelect").value;
  let link = document.getElementById("pptLink").value.trim();

  if (!teamId || !link) {
    alert("Please select a team and paste link");
    return;
  }

  // Extract fileId from Google Drive link
  const match = link.match(/[-\w]{25,}/);
  if (!match) {
    alert("Invalid Google Drive link");
    return;
  }
  const fileId = match[0];

  // Google Docs preview link
  const previewLink = `https://drive.google.com/file/d/${fileId}/preview`;

  await updateDoc(doc(db, "teams", teamId), { pptUrl: previewLink });
  alert("✅ PPT link saved!");
});

// 📂 Open PPT
document.getElementById("openPptBtn").addEventListener("click", async () => {
  const teamId = document.getElementById("teamSelect").value;
  if (!teamId) {
    alert("Please select a team");
    return;
  }

  const teamDoc = await getDoc(doc(db, "teams", teamId));
  if (!teamDoc.exists()) {
    alert("Team not found!");
    return;
  }

  const teamData = teamDoc.data();
  if (!teamData.pptUrl) {
    alert("No PPT link saved!");
    return;
  }

  pptWindow = window.open(teamData.pptUrl, "_blank");
  document.getElementById("startTimerBtn").click(); // auto start timer
});

// -----------------------------
// Timer + Duration Saving
// -----------------------------

// Format mm:ss
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Update timer text
function updateDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
}

// Save duration to Firestore
async function saveDuration(teamId, durationStr) {
  if (!teamId) return;
  await updateDoc(doc(db, "teams", teamId), { duration: durationStr });
  console.log("⏱ Duration saved:", durationStr);
}

// Start Timer
document.getElementById("startTimerBtn").addEventListener("click", () => {
  if (timer) clearInterval(timer);
  timeLeft = 7 * 60;
  startTime = Date.now();
  updateDisplay();

  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();

    // detect if PPT closed manually
    if (pptWindow && pptWindow.closed) {
      clearInterval(timer);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      saveDuration(document.getElementById("teamSelect").value, formatTime(elapsed));
    }

    if (timeLeft <= 0) {
      clearInterval(timer);

      if (confirm("Time’s up! Extend by 2 minutes?")) {
        timeLeft = 2 * 60;
        updateDisplay();

        timer = setInterval(() => {
          timeLeft--;
          updateDisplay();

          if (pptWindow && pptWindow.closed) {
            clearInterval(timer);
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            saveDuration(document.getElementById("teamSelect").value, formatTime(elapsed));
          }

          if (timeLeft <= 0) {
            clearInterval(timer);
            if (pptWindow && !pptWindow.closed) pptWindow.close();
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            saveDuration(document.getElementById("teamSelect").value, formatTime(elapsed));
          }
        }, 1000);
      } else {
        if (pptWindow && !pptWindow.closed) pptWindow.close();
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        saveDuration(document.getElementById("teamSelect").value, formatTime(elapsed));
      }
    }
  }, 1000);
});

// Stop Timer manually
document.getElementById("stopTimerBtn").addEventListener("click", () => {
  if (timer) clearInterval(timer);
  if (pptWindow && !pptWindow.closed) pptWindow.close();

  if (startTime) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    saveDuration(document.getElementById("teamSelect").value, formatTime(elapsed));
  }
});
