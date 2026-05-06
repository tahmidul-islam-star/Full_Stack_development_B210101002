// Members (normalized to lowercase for case-insensitive name check)
const members = [
  "rifat imam","tahmidul islam","tohidul islam","sohanur rahman","md sohag ali",
  "mehraj akash","imtiaz rabbi","mursalin akungi","miad","mozammel haque munna",
  "hasibul mahmud","h.m raihan sakib","kaji muzahidul islam"
];

const pageName = (() => {
  const path = location.pathname.split("/").pop();
  return path ? path.replace(".html", "") : "login";
})();

const loginRequired = ["notice", "members", "contest"];
const publicPages = ["login", "executive", "advisor"];
const storedName = localStorage.getItem("clubUserName") || "";
const isLoggedIn = localStorage.getItem("clubLoggedIn") === "true";

function updateLogoutButton() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";
  }
}

function redirectIfNeeded() {
  if (!isLoggedIn && loginRequired.includes(pageName)) {
    alert("Please login first to access this section.");
    location.href = "login.html";
    return;
  }

  if (isLoggedIn && pageName === "login") {
    location.href = "executive.html";
  }
}

function setWelcomeName() {
  const welcomeName = document.getElementById("welcomeName");
  if (welcomeName && storedName) {
    welcomeName.textContent = `Welcome back, ${storedName}!`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateLogoutButton();
  redirectIfNeeded();
  setWelcomeName();
});

function login() {
  const userInput = document.getElementById("userid").value.trim();
  const passInput = document.getElementById("password").value.trim();
  const msg = document.getElementById("loginMessage");

  if (!userInput || !passInput) {
    msg.style.color = "var(--danger)";
    msg.textContent = "Please enter name and password.";
    return;
  }

  const normalized = userInput.toLowerCase();
  const passwordOk = passInput === "12345678";
  const nameOk = members.includes(normalized);

  if (nameOk && passwordOk) {
    localStorage.setItem("clubLoggedIn", "true");
    localStorage.setItem("clubUserName", userInput);
    msg.style.color = "var(--success)";
    msg.textContent = `Login successful — welcome, ${userInput}!`;
    setTimeout(() => {
      location.href = "executive.html";
    }, 600);
  } else {
    localStorage.removeItem("clubLoggedIn");
    localStorage.removeItem("clubUserName");
    msg.style.color = "var(--danger)";
    msg.textContent = "Login failed. Check your name and password.";
  }
}

function logout() {
  localStorage.removeItem("clubLoggedIn");
  localStorage.removeItem("clubUserName");
  location.href = "login.html";
}
