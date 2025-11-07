// =================== INISIALISASI DATA ===================
if (!localStorage.getItem('users')) {
  const defaultUser = [{ username: 'admin', password: '12345', role: 'admin' }];
  localStorage.setItem('users', JSON.stringify(defaultUser));
}
if (!localStorage.getItem('kendaraan')) {
  localStorage.setItem('kendaraan', JSON.stringify([]));
}

// =================== LOGIN ===================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      window.location.href = 'dashboard.html';
    } else {
      alert('Username atau password salah!');
    }
  });
}

// =================== LOGOUT ===================
function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function () {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
});

// =================== MENU NAVIGASI ===================
document.addEventListener('DOMContentLoaded', function () {
  const kendaraanBtn = document.getElementById('kendaraanBtn');
  const userBtn = document.getElementById('userBtn');

  if (kendaraanBtn) {
    kendaraanBtn.addEventListener('click', function () {
      window.location.href = 'kendaraan.html';
    });
  }

  if (userBtn) {
    userBtn.addEventListener('click', function () {
      window.location.href = 'user.html';
    });
  }
});

// =================== TAMPILKAN DATA KENDARAAN ===================
function renderKendaraan() {
  const tableBody = document.getElementById('kendaraanTableBody');
  if (!tableBody) return;

  const kendaraanList = JSON.parse(localStorage.getItem('kendaraan')) || [];
  tableBody.innerHTML = '';

  kendaraanList.forEach((item, index) => {
    const row = `
      <tr>
        <td>${item.plat}</td>
        <td>${item.lokasi}</td>
        <td>${item.stnk}</td>
        <td>${item.statusSTNK}</td>
        <td>${item.kir}</td>
        <td>${item.statusKIR}</td>
        <td>${item.servisTerakhir}</td>
        <td>${item.selisihServis}</td>
      </tr>
    `;
    tableBody.insertAdjacentHTML('beforeend', row);
  });
}

document.addEventListener('DOMContentLoaded', renderKendaraan);

// =================== FITUR TOMBOL MATA PASSWORD ===================
document.addEventListener('DOMContentLoaded', function () {
  const togglePassword = document.getElementById('togglePassword');
  const passwordField = document.getElementById('password');

  if (togglePassword && passwordField) {
    togglePassword.addEventListener('click', function () {
      const type = passwordField.type === 'password' ? 'text' : 'password';
      passwordField.type = type;
    });
  }
});
