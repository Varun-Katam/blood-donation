// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8LYxLXy0iDvS24YC5qViUxV64p9IWsY0",
  authDomain: "blood-donation-4c44a.firebaseapp.com",
  databaseURL: "https://blood-donation-4c44a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "blood-donation-4c44a",
  storageBucket: "blood-donation-4c44a.firebasestorage.app",
  messagingSenderId: "417183371166",
  appId: "1:417183371166:web:f45094db0bf6f66e68108f"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Elements
const form = document.getElementById("bloodForm");
const donorSection = document.getElementById("donorSection");
const donorList = document.getElementById("donorList");
const donorTitle = document.getElementById("donorTitle");
const alertBox = document.getElementById("alertBox");
const roleSelect = document.getElementById("role");

let requiredBlood = "";
let isReceiver = false;

// CENTER ALERT
function showAlert(msg, color = "#d63031") {
  alertBox.innerText = msg;
  alertBox.style.color = color;
  alertBox.style.display = "block";

  setTimeout(() => {
    alertBox.style.display = "none";
  }, 2500);
}

// LOAD DONORS
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
        const donorId = child.key;

        // 👤 DONOR VIEW (hide personal info)
        if (!isReceiver) {

          donorList.innerHTML = `
            <div class="card" style="text-align:center;">
              <b>You are registered as a donor</b><br><br>

              <button onclick="deleteDonor('${donorId}', '${donor.mobile}')">
                Remove My Name
              </button>
            </div>`;

        } 
        // 🩸 RECEIVER VIEW (show donor details)
        else {

          donorList.innerHTML += `
            <div class="card">
              <b>${donor.name}</b><br>
              Blood: ${donor.blood}<br>
              Location: ${donor.location}<br>
              📞 ${donor.mobile}
            </div>`;
        }
      });

    });
}

// FORM SUBMIT
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

  donorSection.style.display = "block";

  if (role === "Donor") {

    db.ref("users").push(user);

    donorTitle.style.display = "none";
    requiredBlood = user.blood;
    isReceiver = false;

    loadMatchingDonors();
    showAlert("You are registered as a donor", "green");

  } else {

    requiredBlood = bloodGroup.trim().toUpperCase();
    donorTitle.style.display = "block";
    isReceiver = true;

    loadMatchingDonors();
    showAlert("Searching for donors...", "green");
  }

  form.reset();
});

// DELETE DONOR (secure)
function deleteDonor(id, mobile) {

  const enteredMobile = prompt("Enter your mobile number to confirm:");

  if (!enteredMobile) return;

  if (enteredMobile.trim() !== mobile) {
    showAlert("Mobile number does not match.");
    return;
  }

  if (confirm("Are you sure you want to remove your name?")) {
    db.ref("users/" + id).remove()
      .then(() => {
        donorList.innerHTML = "";
        showAlert("You have been removed from donor list", "green");
      });
  }
}