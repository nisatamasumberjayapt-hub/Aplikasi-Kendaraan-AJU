const API_URL = "https://script.google.com/macros/s/AKfycbw3nbLRitPMoc4cgLTLRfONspfv2aMQR1LVJ7lPOCSCinHRHgLUj57VoGZvQCdCBxxG/exec";

// === LOGIN ===
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "login", username, password }),
    });
    const result = await res.json();

    if (result.success) {
      localStorage.setItem("userRole", result.role);
      window.location.href = "dashboard.html";
    } else {
      alert(result.message);
    }
  } catch (err) {
    alert("Gagal terhubung ke server!");
  }
}

// === REGISTER ===
async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "register", username, password }),
  });

  const result = await res.json();
  alert(result.message);
  if (result.success) window.location.href = "login.html";
}

// === TAMPILKAN DATA KENDARAAN ===
async function loadKendaraan() {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "getData" }),
  });
  const result = await res.json();

  if (result.success) {
    const tbody = document.getElementById("kendaraanBody");
    tbody.innerHTML = "";
    result.data.forEach((item) => {
      const row = `<tr>
        <td>${item.PlatNomor}</td>
        <td>${item.Letak}</td>
        <td>${item.STNK}</td>
        <td>${item.StatusSTNK}</td>
        <td>${item.KIR}</td>
        <td>${item.StatusKIR}</td>
        <td>${item.ServisTerakhir}</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  } else {
    alert("Gagal memuat data kendaraan!");
  }
}
