// ========================== LOGIN ==========================
let attempts = 0;

if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify([
    { username: "admin", password: "12345", nama: "Administrator", role: "admin" },
    { username: "user", password: "12345", nama: "Pengguna", role: "user" }
  ]));
}

function togglePassword() {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");
  const users = JSON.parse(localStorage.getItem("users"));

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    alert(`Selamat datang, ${user.nama}!`);
    window.location.href = "dashboard.html";
  } else {
    attempts++;
    msg.innerText = `Username atau password salah! Percobaan ke-${attempts}`;
    if (attempts >= 3) {
      alert("Terlalu banyak percobaan salah. Aplikasi ditutup.");
      document.body.innerHTML = "<h1 style='text-align:center;color:red;'>Akses ditolak!</h1>";
    }
  }
}

// ========================== LOGOUT ==========================
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// ========================== KENDARAAN ==========================
function simpanKendaraan() {
  const plat = document.getElementById("plat").value.trim().toUpperCase();
  const lokasi = document.getElementById("lokasi").value.trim();
  const tglSTNK = document.getElementById("tglSTNK").value;
  const tglKIR = document.getElementById("tglKIR").value;
  const tglServis = document.getElementById("tglServis").value;

  if (!plat || !lokasi || !tglSTNK || !tglKIR || !tglServis) return alert("Semua kolom wajib diisi!");

  let data = JSON.parse(localStorage.getItem("kendaraan") || "[]");

  if (data.some(k => k.plat === plat)) return alert("Plat nomor sudah terdaftar!");

  data.push({ plat, lokasi, tglSTNK, tglKIR, tglServis });
  localStorage.setItem("kendaraan", JSON.stringify(data));
  alert("Data kendaraan disimpan!");
  tampilkanKendaraan();
}

function tampilkanKendaraan() {
  const tbody = document.querySelector("#kendaraanList tbody, #kendaraanTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  const data = JSON.parse(localStorage.getItem("kendaraan") || "[]");

  data.forEach((k, i) => {
    const stnk = hitungStatus(k.tglSTNK);
    const kir = hitungStatus(k.tglKIR);
    const servis = hitungServis(k.tglServis);

    const row = `
      <tr>
        <td>${k.plat}</td>
        <td>${k.lokasi}</td>
        <td>${k.tglSTNK}</td>
        <td><span class="status ${stnk.cls}">${stnk.text}</span></td>
        <td>${k.tglKIR}</td>
        <td><span class="status ${kir.cls}">${kir.text}</span></td>
        <td>${k.tglServis}</td>
        <td>${servis.text}</td>
        ${tbody.id === "kendaraanList"
          ? `<td>
              <button onclick="editKendaraan(${i})">Edit</button>
              <button onclick="hapusKendaraan(${i})">Hapus</button>
            </td>` : ""
        }
      </tr>`;
    tbody.innerHTML += row;
  });
}

function hitungStatus(tgl) {
  const now = new Date();
  const exp = new Date(tgl);
  const diff = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));

  if (diff < 0) return { cls: "bahaya", text: "Terlewat" };
  if (diff <= 7) return { cls: "waspada", text: `${diff} hari lagi` };
  return { cls: "aman", text: `${diff} hari lagi` };
}

function hitungServis(tgl) {
  const now = new Date();
  const last = new Date(tgl);
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  const months = Math.floor(diffDays / 30);
  const days = diffDays % 30;
  return { text: `${months} bln ${days} hr lalu` };
}

function hapusKendaraan(i) {
  if (!confirm("Yakin hapus data ini?")) return;
  let data = JSON.parse(localStorage.getItem("kendaraan") || "[]");
  data.splice(i, 1);
  localStorage.setItem("kendaraan", JSON.stringify(data));
  tampilkanKendaraan();
}

function editKendaraan(i) {
  if (!confirm("Edit data kendaraan ini?")) return;
  let data = JSON.parse(localStorage.getItem("kendaraan"));
  const item = data[i];
  document.getElementById("plat").value = item.plat;
  document.getElementById("lokasi").value = item.lokasi;
  document.getElementById("tglSTNK").value = item.tglSTNK;
  document.getElementById("tglKIR").value = item.tglKIR;
  document.getElementById("tglServis").value = item.tglServis;
  data.splice(i, 1);
  localStorage.setItem("kendaraan", JSON.stringify(data));
}

function cariKendaraan() {
  const q = document.getElementById("search").value.toLowerCase();
  const rows = document.querySelectorAll("#kendaraanList tbody tr");
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(q) ? "" : "none";
  });
}

// ========================== USER ==========================
function tambahUser() {
  const username = document.getElementById("newUsername").value.trim();
  const nama = document.getElementById("nama").value.trim();
  const password = document.getElementById("newPassword").value.trim();
  const role = document.getElementById("role").value;

  if (!username || !nama || !password) return alert("Semua kolom wajib diisi!");

  let users = JSON.parse(localStorage.getItem("users"));
  if (users.some(u => u.username === username)) return alert("Username sudah ada!");

  users.push({ username, nama, password, role });
  localStorage.setItem("users", JSON.stringify(users));
  alert("User ditambahkan!");
  tampilkanUser();
}

function tampilkanUser() {
  const tbody = document.querySelector("#userTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  const users = JSON.parse(localStorage.getItem("users"));
  users.forEach(u => {
    tbody.innerHTML += `<tr><td>${u.username}</td><td>${u.nama}</td><td>${u.role}</td></tr>`;
  });
}

// ========================== LOAD DATA SAAT MASUK ==========================
document.addEventListener("DOMContentLoaded", () => {
  tampilkanKendaraan();
  tampilkanUser();

  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user && !location.href.endsWith("login.html")) {
    location.href = "login.html";
  }

  if (user?.role !== "admin") {
    const adminMenu = document.getElementById("adminOnly");
    if (adminMenu) adminMenu.style.display = "none";
  }
});
