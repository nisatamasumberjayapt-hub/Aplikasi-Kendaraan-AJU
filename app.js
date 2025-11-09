// === KONFIGURASI URL GOOGLE APPS SCRIPT ===
const API_URL = "https://script.google.com/macros/s/AKfycbxXA1Ml0WiwbWjU10CHkr7LVMM4WG-gSuBN7fPKRo73Xx4FA46HGKLPjjNQbPRxdkj3/exec"; 

// === LOGIN ===
async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Isi username dan password!");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "login",
        username,
        password
      }),
    });

    const result = await res.json();

    if (result.success) {
      localStorage.setItem("user", JSON.stringify(result.user));
      alert("Login berhasil!");
      window.location.href = "dashboard.html";
    } else {
      alert(result.message);
    }
  } catch (err) {
    alert("Gagal terhubung ke server!");
    console.error(err);
  }
}

// === REGISTER ===
async function register() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "register",
        username,
        password
      }),
    });

    const result = await res.json();
    alert(result.message);

    if (result.success) {
      window.location.href = "login.html";
    }
  } catch (err) {
    alert("Gagal terhubung ke server!");
    console.error(err);
  }
}

// === TAMPILKAN DATA KENDARAAN ===
async function loadKendaraan() {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getKendaraan" }),
    });

    const result = await res.json();

    if (result.success) {
      const tbody = document.getElementById("kendaraanBody");
      tbody.innerHTML = "";

      result.kendaraan.forEach((item) => {
        const row = `<tr>
          <td>${item["Plat Nomor"] || ""}</td>
          <td>${item["Letak"] || ""}</td>
          <td>${item["STNK"] || ""}</td>
          <td>${item["KIR"] || ""}</td>
          <td>${item["Servis Terakhir"] || ""}</td>
        </tr>`;
        tbody.innerHTML += row;
      });
    } else {
      alert("Gagal memuat data kendaraan!");
    }
  } catch (err) {
    alert("Gagal menghubungi server!");
    console.error(err);
  }
}

// === LOGOUT ===
function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
