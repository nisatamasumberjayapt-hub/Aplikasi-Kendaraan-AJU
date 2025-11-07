// ====== DATA DEFAULT ======
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify([{ username: 'admin', password: '12345', role: 'admin' }]));
}
if (!localStorage.getItem('kendaraan')) {
  localStorage.setItem('kendaraan', JSON.stringify([]));
}

// ====== LOGIN ======
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const togglePassword = document.getElementById('togglePassword');
  const registerBtn = document.getElementById('registerBtn');
  const formKendaraan = document.getElementById('formKendaraan');

  // Toggle password
  if (togglePassword) {
    togglePassword.addEventListener('click', () => {
      const passField = document.getElementById('password');
      passField.type = passField.type === 'password' ? 'text' : 'password';
    });
  }

  // Login
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem('session', JSON.stringify(user));
        alert(`Selamat datang, ${user.username}!`);
        window.location.href = 'dashboard.html';
      } else {
        alert('Username atau password salah!');
      }
    });
  }

  // Register
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      const username = document.getElementById('regUsername').value.trim();
      const password = document.getElementById('regPassword').value.trim();
      const role = document.getElementById('regRole').value;

      if (!username || !password) return alert('Isi semua field!');
      const users = JSON.parse(localStorage.getItem('users')) || [];
      if (users.find(u => u.username === username)) return alert('Username sudah ada!');
      users.push({ username, password, role });
      localStorage.setItem('users', JSON.stringify(users));
      alert('User berhasil ditambahkan!');
    });
  }

  // Dashboard
  if (document.getElementById('welcome')) {
    const session = JSON.parse(localStorage.getItem('session'));
    if (!session) return (window.location.href = 'login.html');
    document.getElementById('welcome').textContent = `Halo, ${session.username} (${session.role})`;
    tampilkanKendaraan();
  }

  // Form kendaraan
  if (formKendaraan) {
    formKendaraan.addEventListener('submit', (e) => {
      e.preventDefault();
      const plat = document.getElementById('plat').value.trim();
      const letak = document.getElementById('letak').value.trim();
      const stnk = document.getElementById('stnk').value;
      const kir = document.getElementById('kir').value;
      const servis = document.getElementById('servis').value;

      let kendaraan = JSON.parse(localStorage.getItem('kendaraan')) || [];
      if (kendaraan.find(k => k.plat === plat)) return alert('Plat nomor sudah ada!');
      kendaraan.push({ plat, letak, stnk, kir, servis });
      localStorage.setItem('kendaraan', JSON.stringify(kendaraan));
      alert('Data tersimpan!');
      formKendaraan.reset();
      tampilkanKendaraan();
    });
    tampilkanKendaraan();
  }
});

// ====== FUNGSI TAMBAHAN ======
function tampilkanKendaraan() {
  const tabel = document.querySelector('#tabelKendaraan tbody');
  if (!tabel) return;
  const kendaraan = JSON.parse(localStorage.getItem('kendaraan')) || [];
  tabel.innerHTML = kendaraan.map(k => `
    <tr>
      <td>${k.plat}</td>
      <td>${k.letak}</td>
      <td>${k.stnk}</td>
      <td>${k.kir}</td>
      <td>${k.servis}</td>
      <td><button onclick="hapusKendaraan('${k.plat}')">Hapus</button></td>
    </tr>
  `).join('');
}

function hapusKendaraan(plat) {
  if (!confirm('Yakin hapus data ini?')) return;
  let kendaraan = JSON.parse(localStorage.getItem('kendaraan')) || [];
  kendaraan = kendaraan.filter(k => k.plat !== plat);
  localStorage.setItem('kendaraan', JSON.stringify(kendaraan));
  tampilkanKendaraan();
}

function logout() {
  localStorage.removeItem('session');
  window.location.href = 'login.html';
}

function goTo(page) {
  window.location.href = page;
}
