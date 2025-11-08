// === URL Web App dari Google Apps Script ===
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw3nbLRitPMoc4cgLTLRfONspfv2aMQR1LVJ7lPOCSCinHRHgLUj57VoGZvQCdCBxxG/exec";

// === LOGIN ===
async function loginUser(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const data = { action: "login", username, password };

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (result.result === "success") {
      localStorage.setItem("user", JSON.stringify(result.user));
      alert("Login berhasil!");
      window.location.href = "dashboard.html";
    } else {
      alert("Login gagal: " + result.message);
    }
  } catch (err) {
    alert("Terjadi kesalahan: " + err.message);
  }
}

// === REGISTER ===
async function registerUser(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const namalengkap = document.getElementById("namalengkap").value.trim();

  const data = { action: "register", username, password, role: "user", namalengkap };

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (result.result === "success") {
      alert("Registrasi berhasil! Silakan login.");
      window.location.href = "index.html";
    } else {
      alert("Gagal registrasi: " + result.message);
    }
  } catch (err) {
    alert("Terjadi kesalahan: " + err.message);
  }
}
