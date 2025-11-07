// Simulasi database di localStorage
if (!localStorage.getItem("users")) {
  const defaultUsers = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "user", password: "user123", role: "user" }
  ];
  localStorage.setItem("users", JSON.stringify(defaultUsers));
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const users = JSON.parse(localStorage.getItem("users"));

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("loggedUser", JSON.stringify(user));
    alert(`Selamat datang, ${user.username}!`);
    if (user.role === "admin") {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "user.html";
    }
  } else {
    alert("Username atau password salah!");
  }
}

function register() {
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const role = document.getElementById("regRole").value;
  let users = JSON.parse(localStorage.getItem("users"));

  if (users.find(u => u.username === username)) {
    alert("Username sudah digunakan!");
    return;
  }

  users.push({ username, password, role });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Pendaftaran berhasil! Silakan login.");
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("loggedUser");
  window.location.href = "login.html";
}
