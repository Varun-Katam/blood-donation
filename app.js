// 🔥 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8LYxLXy0iDvS24YC5qViUxV64p9IWsY0",
  authDomain: "blood-donation-4c44a.firebaseapp.com",
  databaseURL: "https://blood-donation-4c44a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "blood-donation-4c44a",
  storageBucket: "blood-donation-4c44a.firebasestorage.app",
  messagingSenderId: "417183371166",
  appId: "1:417183371166:web:f45094db0bf6f66e68108f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Get elements
const form = document.getElementById("bloodForm");
const donorSection = document.getElementById("donorSection");
const donorList = document.getElementById("donorList");
const message = document.getElementById("message");
const roleSelect = document.getElementById("role");

let requiredBlood = "";

// ⚡ Load matching donors (FAST)
function loadMatchingDonors() {
  donorList.innerHTML = "🔍 Searching donors...";

  db.ref("users")
    .orderByChild("blood")
    .equalTo(requiredBlood)
    .once("value", snapshot => {

      donorList.innerHTML = "";

      if (!snapshot.exists()) {
        donorList.innerHTML = "No donors available.";
        return;
      }

      snapshot.forEach(child => {
        const donor = child.val();

        donorList.innerHTML += `
          <div class="card">
            <b>${donor.name}</b><br>
            Blood: ${donor.blood}<br>
            Location: ${donor.location}<br>
            📞 ${donor.mobile}
          </div>`;
      });
    });
}

// Submit form
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const role = roleSelect.value;
  const bloodGroup = document.getElementById("blood").value;

  const user = {
    name: document.getElementById("name").value,
    mobile: document.getElementById("mobile").value,
    location: document.getElementById("location").value,
    role: role,
    blood: bloodGroup.trim().toUpperCase()
  };

  if (role === "Donor") {
    db.ref("users").push(user);
    message.innerText = "Thank you for donating blood!";
    donorSection.style.display = "none";
  } else {
    requiredBlood = bloodGroup.trim().toUpperCase();
    message.innerText = "Searching for donors...";
    donorSection.style.display = "block";
    loadMatchingDonors();
  }

  form.reset();
});