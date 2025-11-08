// Ganti URL di bawah ini dengan URL Web App kamu yang baru
const scriptURL = "https://script.google.com/macros/s/AKfycbw3nbLRitPMoc4cgLTLRfONspfv2aMQR1LVJ7lPOCSCinHRHgLUj57VoGZvQCdCBxxG/exec";

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Isi username dan password dulu!");
    return;
  }

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (result.success) {
      alert("Login berhasil! Selamat datang " + result.namalengkap);
      localStorage.setItem("user", JSON.stringify(result));
      window.location.href = "dashboard.html";
    } else {
      alert(result.message);
    }
  } catch (err) {
    alert("Gagal terhubung ke server: " + err.message);
  }
}
