const scriptURL = "https://script.google.com/macros/s/AKfycbx.../exec"; // ganti dengan URL Web App milikmu

// === LOGIN ===
async function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch(scriptURL + '?action=loginUser', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });

  const result = await response.json();
  if (result.success) {
    localStorage.setItem('loggedInUser', username);
    window.location.href = 'dashboard.html';
  } else {
    alert('Login gagal. Periksa username dan password.');
  }
}

// === REGISTER ===
async function handleRegister(event) {
  event.preventDefault();
  const username = document.getElementById('regUsername').value;
  const password = document.getElementById('regPassword').value;
  const role = document.getElementById('regRole').value;

  const response = await fetch(scriptURL + '?action=registerUser', {
    method: 'POST',
    body: JSON.stringify({ username, password, role })
  });

  const result = await response.json();
  alert(result.message);
}

// === TAMBAH KENDARAAN ===
async function handleTambahKendaraan(event) {
  event.preventDefault();
  const formData = {
    plat: document.getElementById('plat').value,
    letak: document.getElementById('letak').value,
    stnk: document.getElementById('stnk').value,
    statusStnk: document.getElementById('statusStnk').value,
    kir: document.getElementById('kir').value,
    statusKir: document.getElementById('statusKir').value,
    servis: document.getElementById('servis').value
  };

  const response = await fetch(scriptURL + '?action=tambahKendaraan', {
    method: 'POST',
    body: JSON.stringify(formData)
  });

  const result = await response.json();
  alert(result.message);
}
