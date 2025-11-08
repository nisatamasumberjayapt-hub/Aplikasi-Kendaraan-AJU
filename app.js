// === KONFIGURASI ===
const scriptURL = 'https://script.google.com/macros/s/AKfycbz6ZM9TIAmAn_GxzJQFZZesJFpd0BULrzgyY-vM-yDDQnFj9liIughEyQxTcEM31mHe/exec'; 
// Ganti dengan URL Web App kamu (ini sudah benar)

// === NAVIGASI ===
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
    alert('Isi username dan password terlebih dahulu!');
    return;
  }

  fetch(scriptURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Login berhasil!');
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Username atau password salah!');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Gagal terhubung ke server. Pastikan Google Script kamu aktif.');
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'addUser',
      username,
      password,
      role
    })
  })
  .then(res => res.json())
  .then(result => {
    alert(result.message || 'User berhasil ditambahkan!');
  })
  .catch(err => {
    console.error('Error:', err);
    alert('Gagal menambah user!');
  });
}

// === TAMBAH DATA KENDARAAN ===
function tambahKendaraan() {
  const platNomor = document.getElementById('platNomor').value.trim();
  const letak = document.getElementById('letak').value.trim();
  const stnk = document.getElementById('stnk').value.trim();
  const statusStnk = document.getElementById('statusStnk').value.trim();
  const kir = document.getElementById('kir').value.trim();
  const statusKir = document.getElementById('statusKir').value.trim();
  const servisTerakhir = document.getElementById('servisTerakhir').value.trim();

  if (!platNomor || !letak) {
    alert('Plat Nomor dan Letak wajib diisi!');
    return;
  }

  fetch(scriptURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'addKendaraan',
      platNomor,
      letak,
      stnk,
      statusStnk,
      kir,
      statusKir,
      servisTerakhir
    })
  })
  .then(res => res.json())
  .then(result => {
    alert(result.message || 'Data kendaraan berhasil disimpan!');
  })
  .catch(err => {
    console.error('Error:', err);
    alert('Gagal menyimpan data kendaraan!');
  });
}

// === AMBIL DATA KENDARAAN ===
function getKendaraan() {
  fetch(scriptURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'getKendaraan' })
  })
  .then(res => res.json())
  .then(result => {
    if (result.success && result.data) {
      const tbody = document.querySelector('#dataKendaraan tbody');
      tbody.innerHTML = '';

      result.data.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
          const td = document.createElement('td');
          td.textContent = cell;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    } else {
      alert('Gagal memuat data kendaraan');
    }
  })
  .catch(err => {
    console.error('Error:', err);
    alert('Gagal terhubung ke server!');
  });
}
