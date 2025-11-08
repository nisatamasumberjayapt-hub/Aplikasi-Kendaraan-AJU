// === KONFIGURASI URL GOOGLE APPS SCRIPT ===
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxYourID/exec"; // Ganti dengan URL Web App kamu

// === LOGIN ===
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!username || !password) {
        alert("Isi username dan password!");
        return;
      }

      try {
        const res = await fetch(SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "login",
            username,
            password
          })
        });

        const data = await res.json();

        if (data.success) {
          // Simpan sesi user
          localStorage.setItem("user", JSON.stringify(data.user));
          alert("Login berhasil!");
          window.location.href = "dashboard.html";
        } else {
          alert(data.message || "Login gagal!");
        }
      } catch (err) {
        alert("Gagal terhubung ke server: " + err);
      }
    });
  }

  // === DASHBOARD: CEK LOGIN & LOAD DATA ===
  const userData = localStorage.getItem("user");
  const dashboard = document.getElementById("dashboard");

  if (dashboard && userData) {
    const user = JSON.parse(userData);
    document.getElementById("welcome").textContent = user.nama || user.username;
    loadKendaraan();
  } else if (dashboard && !userData) {
    alert("Silakan login dulu.");
    window.location.href = "index.html";
  }

  // === LOGOUT ===
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("user");
      window.location.href = "index.html";
    });
  }
});

// === AMBIL DATA KENDARAAN ===
async function loadKendaraan() {
  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getKendaraan" })
    });

    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    const tbody = document.getElementById("kendaraanTableBody");
    if (tbody) tbody.innerHTML = "";

    data.kendaraan.forEach((k) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${k["Plat Nomor"] || ""}</td>
        <td>${k["Letak"] || ""}</td>
        <td>${k["STNK"] || ""}</td>
        <td>${k["KIR"] || ""}</td>
        <td>${k["Servis Terakhir"] || ""}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    alert("Gagal memuat data kendaraan: " + err.message);
  }
}

// === TAMBAH DATA KENDARAAN ===
async function tambahKendaraan(e) {
  e.preventDefault();
  const platNomor = document.getElementById("platNomor").value.trim();
  const letak = document.getElementById("letak").value.trim();
  const stnk = document.getElementById("stnk").value.trim();
  const kir = document.getElementById("kir").value.trim();
  const servisTerakhir = document.getElementById("servisTerakhir").value.trim();

  if (!platNomor) {
    alert("Plat nomor wajib diisi!");
    return;
  }

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "addKendaraan",
        platNomor,
        letak,
        stnk,
        kir,
        servisTerakhir
      })
    });

    const data = await res.json();

    if (data.success) {
      alert("Data kendaraan berhasil ditambahkan!");
      loadKendaraan();
      document.getElementById("formKendaraan").reset();
    } else {
      alert(data.message || "Gagal menyimpan kendaraan!");
    }
  } catch (err) {
    alert("Gagal mengirim data ke server: " + err.message);
  }
}
