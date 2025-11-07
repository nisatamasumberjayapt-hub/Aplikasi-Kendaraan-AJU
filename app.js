// =============================
// PT ANISA JAYA UTAMA - FRONTEND
// =============================
const scriptURL = "MASUKKAN_URL_WEBAPP_DISINI"; // dari Google Apps Script

// === LOGIN ===
async function login(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({ action: 'login', username, password }),
  });
  const result = await res.json();

  if (result.success) {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('role', result.role);
    alert('Login berhasil!');
    window.location.href = 'dashboard.html';
  } else {
    alert(result.message);
  }
}

// === REGISTER ===
async function register(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({ action: 'register', username, password, role: 'user' }),
  });
  const result = await res.json();

  alert(result.message);
  if (result.success) window.location.href = 'login.html';
}

// === SIMPAN KENDARAAN ===
async function tambahKendaraan(event) {
  event.preventDefault();
  const data = {
    action: 'saveKendaraan',
    plat_nomor: document.getElementById('plat').value,
    letak: document.getElementById('letak').value,
    stnk: document.getElementById('stnk').value,
    status_stnk: document.getElementById('status_stnk').value,
    kir: document.getElementById('kir').value,
    status_kir: document.getElementById('status_kir').value,
    servis_terakhir: document.getElementById('servis_terakhir').value,
    selisih_servis: document.getElementById('selisih_servis').value
  };

  const res = await fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const result = await res.json();

  alert(result.message);
}

// === AMBIL DATA KENDARAAN ===
async function loadKendaraan() {
  const res = await fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({ action: 'getKendaraan' }),
  });
  const data = await res.json();
  const tbody = document.querySelector('#tabelKendaraan tbody');
  tbody.innerHTML = '';

  data.forEach(item => {
    const row = `<tr>
      <td>${item.plat_nomor}</td>
      <td>${item.letak}</td>
      <td>${item.stnk}</td>
      <td>${item.status_stnk}</td>
      <td>${item.kir}</td>
      <td>${item.status_kir}</td>
      <td>${item.servis_terakhir}</td>
      <td>${item.selisih_servis}</td>
    </tr>`;
    tbody.insertAdjacentHTML('beforeend', row);
  });
}

// === LOGOUT ===
function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}
