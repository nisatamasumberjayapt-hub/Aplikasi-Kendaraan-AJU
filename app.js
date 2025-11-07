<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login Aplikasi - PT Anisa Jaya Utama</title>
  <link rel="stylesheet" href="styles.css" />
  <style>
    body {
      font-family: "Segoe UI", sans-serif;
      background: #eaf2fc;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .login-box {
      background: white;
      padding: 30px 40px;
      border-radius: 12px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      width: 360px;
      text-align: center;
    }

    h2 {
      color: #003366;
      margin-bottom: 10px;
    }

    input {
      width: 100%;
      padding: 10px;
      margin: 8px 0;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-sizing: border-box;
    }

    button {
      width: 100%;
      padding: 10px;
      background: #0059b3;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
    }

    button:hover {
      background: #004080;
    }

    .show-pass {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      color: #555;
    }

    .pass-container {
      position: relative;
    }

    .register {
      margin-top: 12px;
    }

    a {
      color: #4303d3;
    }

    .reset-btn {
      margin-top: 10px;
      font-size: 13px;
      background: #888;
    }

    .reset-btn:hover {
      background: #555;
    }
  </style>
</head>
<body>
  <div class="login-box">
    <h2>PT ANISA JAYA UTAMA</h2>
    <p>Login Aplikasi</p>

    <input type="text" id="username" placeholder="Username" />
    <div class="pass-container">
      <input type="password" id="password" placeholder="Password" />
      <span id="togglePass" class="show-pass">👁️</span>
    </div>
    <button id="loginBtn">Masuk</button>

    <div class="register">
      Belum punya akun? <a href="register.html">Daftar</a>
    </div>

    <button id="resetData" class="reset-btn">🔄 Reset Data Lokal</button>
  </div>

  <script>
    // === Toggle password visibility ===
    document.getElementById("togglePass").onclick = function () {
      const pass = document.getElementById("password");
      pass.type = pass.type === "password" ? "text" : "password";
    };

    // === Tombol reset data ===
    document.getElementById("resetData").onclick = function () {
      if (confirm("Hapus semua data pengguna & kendaraan di browser ini?")) {
        localStorage.clear();
        alert("Data lokal telah dihapus. Silakan refresh halaman.");
      }
    };

    // === Fungsi login utama ===
    document.getElementById("loginBtn").onclick = function () {
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!username || !password) {
        alert("Silakan isi username dan password.");
        return;
      }

      // Ambil data user
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const found = users.find(
        (u) => u.username === username && u.password === password
      );

      if (found) {
        alert(`Selamat datang, ${found.role === "admin" ? "Administrator" : found.nama}!`);
        localStorage.setItem("loggedUser", JSON.stringify(found));
        window.location.href = "dashboard.html";
      } else {
        alert("Username atau password salah!");
      }
    };

    // === Buat user default kalau belum ada ===
    if (!localStorage.getItem("users")) {
      const defaultUsers = [
        { username: "admin", password: "12345", nama: "Administrator", role: "admin" },
        { username: "user", password: "12345", nama: "Pengguna", role: "user" },
      ];
      localStorage.setItem("users", JSON.stringify(defaultUsers));
      console.log("✅ Default users dibuat:", defaultUsers);
    }
  </script>
</body>
</html>
