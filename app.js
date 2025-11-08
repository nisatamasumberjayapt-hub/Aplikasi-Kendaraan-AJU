async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Harap isi username dan password!");
    return;
  }

  const url = "https://script.google.com/macros/s/AKfycbw3nbLRitPMoc4cgLTLRfONspfv2aMQR1LVJ7lPOCSCinHRHgLUj57VoGZvQCdCBxxG/exec";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "login",
        username: username,
        password: password,
      }),
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("Login berhasil!");
      window.location.href = "index.html"; // halaman utama
    } else {
      alert("Username atau password salah!");
    }
  } catch (error) {
    alert("Terjadi kesalahan koneksi: " + error.message);
  }
}
