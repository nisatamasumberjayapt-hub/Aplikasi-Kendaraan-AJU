// =================== INISIALISASI DATA ===================
if (!localStorage.getItem('users')) {
  const defaultUser = [
    { username: "admin", password: "12345", name: "Administrator", role: "admin" },
    { username: "user", password: "12345", name: "Pengguna", role: "user" }
  ];
  localStorage.setItem("users", JSON.stringify(defaultUser));
}

if (!localStorage.getItem('kendaraan')) {
  localStorage.setItem('kendaraan', JSON.stringify([]));
}

// =================== FUNGSI LOGIN ===================
function login(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    alert(`Selamat datang, ${user.name}!`);
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    window.location.href = "dashboard.html";
  } else {
    alert("Username atau password salah!");
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
  }
}

// =================== TOMBOL LIHAT PASSWORD ===================
function togglePassword() {
  const pass = document.getElementById("password");
  pass.type = pass.type === "password" ? "text" : "password";
}

// =================== REGISTRASI USER BARU ===================
function daftar(event) {
  event.preventDefault();
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value.trim();
  const name = document.getElementById('reg-name').value.trim();
  const role = document.getElementById('reg-role').value;

  let users = JSON.parse(localStorage.getItem('users')) || [];

  if (users.some(u => u.username === username)) {
    alert("Username sudah digunakan!");
    return;
  }

  users.push({ username, password, name, role });
  localStorage.setItem('users', JSON.stringify(users));
  alert("Pendaftaran berhasil! Silakan login.");
  window.location.href = "login.html";
}

// =================== LOGOUT ===================
function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = "login.html";
}

// =================== CEK LOGIN DI DASHBOARD ===================
function cekLogin() {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  document.getElementById('userInfo').innerText = `${user.name} (${user.role})`;
}

// =================== FUNGSI TAMBAH / HAPUS / EDIT KENDARAAN ===================
function simpanKendaraan(event) {
  event.preventDefault();

  const plat = document.getElementById("plat").value.trim().toUpperCase();
  const stnk = document.getElementById("stnk").value;
  const kir = document.getElementById("kir").value;
  const servis = document.getElementById("servis").value;
  const lokasi = document.getElementById("lokasi").value.trim();

  let data = JSON.parse(localStorage.getItem("kendaraan")) || [];

  if (data.some(k => k.plat === plat)) {
    alert("Plat nomor sudah ada!");
    return;
  }

  data.push({ plat, stnk, kir, servis, lokasi });
  localStorage.setItem("kendaraan", JSON.stringify(data));
  alert("Data kendaraan berhasil disimpan!");
  tampilkanKendaraan();
  document.getElementById("formKendaraan").reset();
}

function hapusKendaraan(plat) {
  if (!confirm("Yakin ingin menghapus kendaraan ini?")) return;
  let data = JSON.parse(localStorage.getItem("kendaraan")) || [];
  data = data.filter(k => k.plat !== plat);
  localStorage.setItem("kendaraan", JSON.stringify(data));
  tampilkanKendaraan();
}

function tampilkanKendaraan() {
  const tabel = document.getElementById("tabelKendaraan");
  if (!tabel) return;

  let data = JSON.parse(localStorage.getItem("kendaraan")) || [];
  tabel.innerHTML = "";

  data.forEach(k => {
    const tr = document.createElement("tr");
    const now = new Date();

    function hitungStatus(tgl) {
      const selisih = Math.ceil((new Date(tgl) - now) / (1000 * 3600 * 24));
      let warna = "🟩 Aman";
      if (selisih < 0) warna = "🟥 Lewat";
      else if (selisih <= 7) warna = "🟨 Hampir Habis";
      return { warna, selisih };
    }

    const stnkStat = hitungStatus(k.stnk);
    const kirStat = hitungStatus(k.kir);
    const servisDiff = Math.floor((now - new Date(k.servis)) / (1000 * 3600 * 24));
    const bulan = Math.floor(servisDiff / 30);
    const hari = servisDiff % 30;

    tr.innerHTML = `
      <td>${k.plat}</td>
      <td>${k.lokasi}</td>
      <td>${k.stnk}</td>
      <td>${stnkStat.warna} (${stnkStat.selisih} hari)</td>
      <td>${k.kir}</td>
      <td>${kirStat.warna} (${kirStat.selisih} hari)</td>
      <td>${k.servis}</td>
      <td>${bulan} bln ${hari} hr lalu</td>
      <td><button onclick="hapusKendaraan('${k.plat}')">Hapus</button></td>
    `;
    tabel.appendChild(tr);
  });
}

// =================== SAAT HALAMAN DIMUAT ===================
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").addEventListener("submit", login);
  }
  if (document.getElementById("regForm")) {
    document.getElementById("regForm").addEventListener("submit", daftar);
  }
  if (document.getElementById("formKendaraan")) {
    document.getElementById("formKendaraan").addEventListener("submit", simpanKendaraan);
    tampilkanKendaraan();
  }
  if (document.getElementById("userInfo")) {
    cekLogin();
  }
});
