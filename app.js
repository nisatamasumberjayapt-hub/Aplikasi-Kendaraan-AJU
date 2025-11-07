// ============================
// APP.JS - APLIKASI KENDARAAN
// ============================

// --- Inisialisasi User Default (Admin Awal) ---
if (!localStorage.getItem("users")) {
    const defaultAdmin = [
        { username: "admin", password: "123", name: "Administrator", role: "admin" }
    ];
    localStorage.setItem("users", JSON.stringify(defaultAdmin));
}

// --- LOGIN PAGE ---
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const togglePassword = document.getElementById("togglePassword");
    const passwordField = document.getElementById("password");
    const loginAttemptsKey = "loginAttempts";

    // Tampilkan / sembunyikan password
    if (togglePassword) {
        togglePassword.addEventListener("click", () => {
            const type = passwordField.type === "password" ? "text" : "password";
            passwordField.type = type;
            togglePassword.textContent = type === "password" ? "👁️" : "🙈";
        });
    }

    // Proses login
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const foundUser = users.find(u => u.username === username && u.password === password);

            let attempts = parseInt(localStorage.getItem(loginAttemptsKey)) || 0;

            if (foundUser) {
                localStorage.setItem("currentUser", JSON.stringify(foundUser));
                localStorage.removeItem(loginAttemptsKey);
                alert(`Selamat datang, ${foundUser.name}!`);
                window.location.href = "dashboard.html";
            } else {
                attempts++;
                localStorage.setItem(loginAttemptsKey, attempts);
                alert("Username atau password salah!");
                document.getElementById("username").value = "";
                document.getElementById("password").value = "";
                if (attempts >= 3) {
                    alert("Gagal 3 kali. Aplikasi akan ditutup.");
                    window.close();
                }
            }
