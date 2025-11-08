const scriptURL = 'https://script.google.com/macros/s/AKfycbwsDMvJGPUTbqhqhJNgsXNHSgEh6AxMzZXdRFtSBrRUKHiPMG86Gi1xn3G345Z7oJ6g/exec'; // dari Google Apps Script deployment

function goTo(page) {
  window.location.href = page;
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({ action: 'login', username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } else {
      alert('Login gagal');
    }
  });
}

function tambahUser() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({ action: 'addUser', username, password, role })
  })
  .then(() => alert('User berhasil ditambah!'));
}

function tambahKendaraan() {
  const data = {
    action: 'addKendaraan',
    platNomor: document.getElementById('platNomor').value,
    letak: document.getElementById('letak').value,
    stnk: document.getElementById('stnk').value,
    statusStnk: document.getElementById('statusStnk').value,
    kir: document.getElementById('kir').value,
    statusKir: document.getElementById('statusKir').value,
    servisTerakhir: document.getElementById('servisTerakhir').value
  };

  fetch(scriptURL, { method: 'POST', body: JSON.stringify(data) })
  .then(() => alert('Kendaraan disimpan!'));
}
const scriptURL = 'https://script.google.com/macros/s/AKfycbx4_kLI7M7VK5QleIV1EkbP9uItlw2dDqQNalg_PsOmSZ4lr5TITVs-3ZTjiAjqtLov/exec'; // dari Google Apps Script deployment

function goTo(page) {
  window.location.href = page;
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({ action: 'login', username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } else {
      alert('Login gagal');
    }
  });
}

function tambahUser() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({ action: 'addUser', username, password, role })
  })
  .then(() => alert('User berhasil ditambah!'));
}

function tambahKendaraan() {
  const data = {
    action: 'addKendaraan',
    platNomor: document.getElementById('platNomor').value,
    letak: document.getElementById('letak').value,
    stnk: document.getElementById('stnk').value,
    statusStnk: document.getElementById('statusStnk').value,
    kir: document.getElementById('kir').value,
    statusKir: document.getElementById('statusKir').value,
    servisTerakhir: document.getElementById('servisTerakhir').value
  };

  fetch(scriptURL, { method: 'POST', body: JSON.stringify(data) })
  .then(() => alert('Kendaraan disimpan!'));
}
