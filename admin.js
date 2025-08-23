// // Import Firebase SDK
// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
// import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";
// import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// // Firebase Config
// const firebaseConfig = {
//   apiKey: "AIzaSyAmORNJuMqLINMqIsmfwhg0nLT1molA3fs",
//   authDomain: "ideathon-b4c3c.firebaseapp.com",
//   projectId: "ideathon-b4c3c",
//   storageBucket: "ideathon-b4c3c.appspot.com",  // ✅ Correct bucket format
//   messagingSenderId: "459070551009",
//   appId: "1:459070551009:web:92341920b145cfe43e18a0"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const storage = getStorage(app);
// const auth = getAuth(app);

// let pptWindow = null;

// // ✅ Protect page
// onAuthStateChanged(auth, (user) => {
//   if (!user) {
//     window.location.href = "index.html";
//   } else {
//     console.log("✅ Logged in as:", user.email, "UID:", user.uid);
//   }
// });

// // ✅ Logout
// document.getElementById("logoutBtn").addEventListener("click", () => {
//   signOut(auth).then(() => window.location.href = "index.html");
// });

// // ✅ Register Team
// document.getElementById("registerTeamBtn").addEventListener("click", async () => {
//   const teamName = document.getElementById("teamName").value.trim();
//   const teamMembers = document.getElementById("teamMembers").value.trim();

//   if (!teamName || !teamMembers) {
//     alert("Please fill all fields");
//     return;
//   }

//   await addDoc(collection(db, "teams"), {
//     name: teamName,
//     members: teamMembers.split(","),
//     pptUrl: null
//   });

//   alert("Team registered successfully!");
//   loadTeams();
// });

// // ✅ Load Teams into Dropdown
// async function loadTeams() {
//   const snapshot = await getDocs(collection(db, "teams"));
//   const select = document.getElementById("teamSelect");
//   select.innerHTML = "";
//   snapshot.forEach((doc) => {
//     let option = document.createElement("option");
//     option.value = doc.id;
//     option.textContent = doc.data().name;
//     select.appendChild(option);
//   });
// }
// loadTeams();

// // ✅ Upload PPT
// // Save Google Drive PPT link
// // document.getElementById("savePptBtn").addEventListener("click", async () => {
// //   const teamId = document.getElementById("teamSelect").value;
// //   const link = document.getElementById("pptLink").value.trim();

// //   if (!teamId || !link) {
// //     alert("Please select a team and paste a link");
// //     return;
// //   }

// //   await updateDoc(doc(db, "teams", teamId), { pptUrl: link });

// //   alert("PPT link saved successfully!");
// // });

// // Save Google Drive direct link into Firestore
// document.getElementById("saveDriveLinkBtn").addEventListener("click", async () => {
//   const teamId = document.getElementById("teamSelect").value;
//   const driveLink = document.getElementById("driveLink").value.trim();

//   if (!teamId || !driveLink) {
//     alert("Please select a team and enter a Google Drive link");
//     return;
//   }

//   // Extract file ID from Google Drive link
//   const match = driveLink.match(/[-\w]{25,}/);
//   if (!match) {
//     alert("Invalid Google Drive link");
//     return;
//   }

//   // Convert into direct download link
//   const directLink = `https://drive.google.com/uc?id=${match[0]}&export=download`;

//   // Save in Firestore
//   await updateDoc(doc(db, "teams", teamId), { pptUrl: directLink });

//   alert("Google Drive link saved successfully!");
// });


// // Open PPT
// document.getElementById("openPptBtn").addEventListener("click", async () => {
//   const teamId = document.getElementById("teamSelect").value;

//   if (!teamId) {
//     alert("Please select a team");
//     return;
//   }

//   const teamDoc = await getDoc(doc(db, "teams", teamId));
//   if (!teamDoc.exists()) {
//     alert("Team not found!");
//     return;
//   }

//   const teamData = teamDoc.data();
//   if (!teamData.pptUrl) {
//     alert("No PPT link saved for this team!");
//     return;
//   }

//   // Open via Google Docs Viewer
//   pptWindow = window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(teamData.pptUrl)}&embedded=true`, "_blank");
//   document.getElementById("startTimerBtn").click(); // auto start timer
// });
// // ✅ Timer
// let timer;
// let timeLeft = 6 * 60;
// const timerDisplay = document.getElementById("timerDisplay");

// function updateDisplay() {
//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;
//   timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
// }

// document.getElementById("startTimerBtn").addEventListener("click", () => {
//   clearInterval(timer);
//   timeLeft = 6 * 60;
//   updateDisplay();

//   timer = setInterval(() => {
//     timeLeft--;
//     updateDisplay();

//     if (timeLeft <= 0) {
//       clearInterval(timer);
//       if (pptWindow && !pptWindow.closed) pptWindow.close();
//       if (confirm("Time’s up! Extend by 2 minutes?")) {
//         timeLeft = 2 * 60;
//         updateDisplay();
//         document.getElementById("startTimerBtn").click();
//       }
//     }
//   }, 1000);
// });

// document.getElementById("stopTimerBtn").addEventListener("click", () => {
//   clearInterval(timer);
//   if (pptWindow && !pptWindow.closed) pptWindow.close();
// });

// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
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

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let pptWindow = null;

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
    pptUrl: null
  });

  alert("Team registered!");
  loadTeams();
});

// 📥 Load Teams Dropdown
async function loadTeams() {
  const snapshot = await getDocs(collection(db, "teams"));
  const select = document.getElementById("teamSelect");
  select.innerHTML = "";
  snapshot.forEach((doc) => {
    let option = document.createElement("option");
    option.value = doc.id;
    option.textContent = doc.data().name;
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
  alert("PPT link saved!");
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

// ⏳ Timer
let timer = null;
let timeLeft = 7 * 60;
const timerDisplay = document.getElementById("timerDisplay");

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

document.getElementById("startTimerBtn").addEventListener("click", () => {
  if (timer) clearInterval(timer);
  timeLeft = 7 * 60;
  updateDisplay();

  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);

      if (confirm("Time’s up! Extend by 2 minutes?")) {
        timeLeft = 2 * 60;
        updateDisplay();

        // Restart 2-min countdown without closing PPT
        timer = setInterval(() => {
          timeLeft--;
          updateDisplay();
          if (timeLeft <= 0) {
            clearInterval(timer);
            if (pptWindow && !pptWindow.closed) {
              pptWindow.close();
            }
          }
        }, 1000);
      } else {
        if (pptWindow && !pptWindow.closed) {
          pptWindow.close();
        }
      }
    }
  }, 1000);
});

// ⏹ Stop Timer
document.getElementById("stopTimerBtn").addEventListener("click", () => {
  if (timer) clearInterval(timer);
  if (pptWindow && !pptWindow.closed) pptWindow.close();
});

