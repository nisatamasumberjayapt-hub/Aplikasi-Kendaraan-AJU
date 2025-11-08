// === KONFIGURASI API ===
const scriptURL = 'https://script.google.com/macros/s/AKfycbzsQf0zEQaUInQJzaJv_GwCpiyMPURh1htbVE6ZITMtmAbz8NaTy_RQjbImAYJmpM59/exec'; 
// Ganti sesuai URL WebApp kamu (sudah benar)

// === NAVIGASI ANTAR HALAMAN ===
function goTo(page) {
  window.location.href = page;
}

// === LOGOUT ===
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// === LOGIN ===
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Isi username dan password!');
    return;
  }

  fetch(scriptURL, {
    method: 'POST',
    mode: 'cors', // penting untuk koneksi dari GitHub Pages ke Apps Script
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', username, password })
  })
  .then(res => {
    if (!res.ok) throw new Error('Server tidak merespon');
    return res.json();
  })
  .then(data => {
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Login gagal');
    }
  })
  .catch(err => {
    console.error('Error saat login:', err);
    alert('Gagal terhubung ke server. Pastikan Apps Script di-deploy sebagai WebApp (akses: Siapa pun).');
  });
}

// === TAMBAH USER ===
function tambahUser() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const role = document.getElementById('role').value.trim();

  if (!username || !password || !role) {
    alert('Semua kolom harus diisi!');
    return;
  }

  fetch(scriptURL, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'addUser', username, password, role })
  })
  .then(res => {
    if (!res.ok) throw new Error('Server error');
    return res.json();
  })
  .then(data => {
    alert(data.message || 'User berhasil ditambah!');
  })
  .catch(err => {
    console.error('Error tambah user:', err);
    alert('Gagal menambah user');
  });
}

// === TAMBAH KENDARAAN ===
function tambahKendaraan() {
  const data = {
    action: 'addKendaraan',
    platNomor: document.getElementById('platNomor').value.trim(),
    letak: document.getElementById('letak').value.trim(),
    stnk: document.getElementById('stnk').value.trim(),
    statusStnk: document.getElementById('statusStnk').value.trim(),
    kir: document.getElementById('kir').value.trim(),
    statusKir: document.getElementById('statusKir').value.trim(),
    servisTerakhir: document.getElementById('servisTerakhir').value.trim()
  };

  fetch(scriptURL, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => {
    if (!res.ok) throw new Error('Server error');
    return res.json();
  })
  .then(result => {
    alert(result.message || 'Data kendaraan berhasil disimpan!');
  })
  .catch(err => {
    console.error('Error tambah kendaraan:', err);
    alert('Gagal menyimpan kendaraan');
  });
}
