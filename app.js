// URL Web App kamu (sudah aktif)
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
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) throw new Error("Gagal menghubungi server");

    const result = await response.json();

    if (result.success) {
      alert("Login berhasil!");
      localStorage.setItem("user", JSON.stringify(result));
      window.location.href = "dashboard.html";
    } else {
      alert(result.message);
    }
  } catch (err) {
    alert("Terjadi kesalahan: " + err.message);
  }
}
