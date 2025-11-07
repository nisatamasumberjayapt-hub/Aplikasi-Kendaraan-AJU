/* app.js — logic for all pages (login, register, dashboard, kendaraan, user) */

/* ---------- bootstrap default users if empty ---------- */
if (!localStorage.getItem("aj_users")) {
  const defaultUsers = [
    { username: "admin", nama: "Administrator", password: "admin123", role: "admin", foto: "" },
    { username: "user", nama: "Pengguna Biasa", password: "user123", role: "user", foto: "" }
  ];
  localStorage.setItem("aj_users", JSON.stringify(defaultUsers));
}

/* ---------- helpers ---------- */
function qs(sel){ return document.querySelector(sel) }
function qsa(sel){ return Array.from(document.querySelectorAll(sel)) }
function nowISO(d){ return (d instanceof Date? d : new Date(d)).toISOString().slice(0,10) }

/* ---------- LOGIN (used on login.html) ---------- */
(function setupLogin(){
  const uname = qs("#username"), pass = qs("#password");
  if (!uname || !pass) return;

  let attempts = 0;
  const msgEl = qs("#msg");

  window.togglePassword = function(){
    pass.type = pass.type === "password" ? "text" : "password";
  }

  window.login = function(){
    const u = uname.value.trim(), p = pass.value.trim();
    const users = JSON.parse(localStorage.getItem("aj_users") || "[]");
    const found = users.find(x => x.username === u && x.password === p);

    if (!found) {
      attempts++;
      msgEl && (msgEl.textContent = `Username atau password salah! Percobaan ke-${attempts}`);
      uname.value = ""; pass.value = "";
      if (attempts >= 3) {
        alert("Terlalu banyak percobaan salah. Aplikasi ditutup.");
        document.body.innerHTML = "<h1 style='text-align:center;color:red;'>Akses ditolak!</h1>";
      }
      return;
    }

    // success
    localStorage.setItem("aj_session", JSON.stringify({ username: found.username, nama: found.nama, role: found.role }));
    alert(`Selamat datang, ${found.nama}!`);
    window.location.href = "dashboard.html";
  }
})();

/* ---------- REGISTER (used on register.html) ---------- */
(function setupRegister(){
  const rUser = qs("#regUsername"), rPass = qs("#regPassword"), rRole = qs("#regRole");
  if (!rUser) return;

  window.register = function(){
    const u = rUser.value.trim(), p = rPass.value.trim(), role = rRole.value;
    if (!u || !p) { alert("Lengkapi username & password."); return; }
    let users = JSON.parse(localStorage.getItem("aj_users") || "[]");
    if (users.find(x => x.username === u)) { alert("Username sudah dipakai."); return; }
    users.push({ username: u, nama: u, password: p, role, foto:"" });
    localStorage.setItem("aj_users", JSON.stringify(users));
    alert("Pendaftaran berhasil. Silakan login.");
    window.location.href = "login.html";
  }
})();

/* ---------- GLOBAL auth guard & UI setup (for pages except login/register) ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  const session = JSON.parse(localStorage.getItem("aj_session") || "null");
  const path = location.pathname.split("/").pop();

  // if not on login/register and no session -> redirect to login
  if (!/login.html|register.html/i.test(path)) {
    if (!session) return location.href = "login.html";
  }

  // show user name in pages with .user-name
  qsa(".user-name").forEach(el=>{
    el.textContent = session ? `${session.nama} (${session.role.toUpperCase()})` : "";
  });

  // hide admin menu if not admin
  if (session && session.role !== "admin") {
    qsa(".admin-only").forEach(el=>el.style.display = "none");
  }
});

/* ---------- logout function ---------- */
window.logout = function(){
  localStorage.removeItem("aj_session");
  location.href = "login.html";
}

/* ---------- VEHICLE CRUD (used on kendaraan.html & tampil on dashboard) ---------- */
(function vehicleModule(){
  // init vehicles store
  if (!localStorage.getItem("aj_vehicles")) localStorage.setItem("aj_vehicles", JSON.stringify([]));

  const formPlat = qs("#plat"), formLokasi = qs("#lokasi"),
        formSTNK = qs("#tglSTNK"), formKIR = qs("#tglKIR"), formServis = qs("#tglServis"),
        tableBody = qs("#kendaraanList tbody"),
        tableAll = qs("#kendaraanTable tbody"),
        searchInput = qs("#search");

  function loadVehicles(){ return JSON.parse(localStorage.getItem("aj_vehicles") || "[]") }

  function saveVehicles(v){ localStorage.setItem("aj_vehicles", JSON.stringify(v)) }

  function daysBetween(dateStr){
    const now = new Date(); const d = new Date(dateStr);
    return Math.ceil((d - now)/(1000*60*60*24));
  }

  function serviceSince(dateStr){
    const now = new Date(); const d = new Date(dateStr);
    const diff = Math.floor((now - d)/(1000*60*60*24));
    const months = Math.floor(diff/30); const days = diff%30;
    return { months, days };
  }

  function statusBadge(diffDays){
    if (diffDays < 0) return { cls:"red", text:`Lewat ${Math.abs(diffDays)} hr` };
    if (diffDays <= 7) return { cls:"yellow", text:`${diffDays} hr` };
    return { cls:"green", text:`${diffDays} hr` };
  }

  // render functions
  window.renderVehiclesTable = function(){
    const data = loadVehicles();
    if (tableBody) {
      tableBody.innerHTML = "";
      data.forEach((k, i)=>{
        const stnkDays = daysBetween(k.tglSTNK), kirDays = daysBetween(k.tglKIR);
        const stnkB = statusBadge(stnkDays), kirB = statusBadge(kirDays);
        const serv = serviceSince(k.tglServis);
        const servText = `${serv.months} bln ${serv.days} hr lalu`;
        const row = `<tr>
          <td>${k.plat}</td>
          <td>${k.lokasi}</td>
          <td>${k.tglSTNK}</td>
          <td><span class="status ${stnkB.cls}">${stnkB.text}</span></td>
          <td>${stnkDays < 0 ? `Lewat ${Math.abs(stnkDays)} hr` : `${stnkDays} hr`}</td>
          <td>${k.tglKIR}</td>
          <td><span class="status ${kirB.cls}">${kirB.text}</span></td>
          <td>${kirDays < 0 ? `Lewat ${Math.abs(kirDays)} hr` : `${kirDays} hr`}</td>
          <td>${k.tglServis}</td>
          <td>${servText}</td>
          <td class="actions">
            <button class="btn small" onclick="editKendaraan(${i})">Edit</button>
            <button class="btn small" style="background:#c62828" onclick="hapusKendaraan(${i})">Hapus</button>
          </td>
        </tr>`;
        tableBody.insertAdjacentHTML('beforeend',row);
      });
    }

    // dashboard readonly table
    if (tableAll) {
      tableAll.innerHTML = "";
      loadVehicles().forEach(k=>{
        const stnkDays = daysBetween(k.tglSTNK), kirDays = daysBetween(k.tglKIR);
        const stnkB = statusBadge(stnkDays), kirB = statusBadge(kirDays);
        const serv = serviceSince(k.tglServis);
        const servText = `${serv.months} bln ${serv.days} hr lalu`;
        const row = `<tr>
          <td>${k.plat}</td><td>${k.lokasi}</td>
          <td>${k.tglSTNK}</td><td><span class="status ${stnkB.cls}">${stnkB.text}</span></td>
          <td>${k.tglKIR}</td><td><span class="status ${kirB.cls}">${kirB.text}</span></td>
          <td>${k.tglServis}</td><td>${servText}</td>
        </tr>`;
        tableAll.insertAdjacentHTML('beforeend',row);
      });
    }
  }

  // add / save vehicle
  window.simpanKendaraan = function(){
    if (!formPlat) return;
    const plat = (formPlat.value||"").trim().toUpperCase();
    const lokasi = (formLokasi.value||"").trim();
    const tglSTNK = formSTNK.value, tglKIR = formKIR.value, tglServis = formServis.value;
    if (!plat || !lokasi || !tglSTNK || !tglKIR || !tglServis) { alert("Isi semua kolom!"); return; }

    let data = loadVehicles();
    if (data.some(x=>x.plat===plat)) { alert("Plat sudah terdaftar!"); return; }

    data.push({ plat, lokasi, tglSTNK, tglKIR, tglServis });
    saveVehicles(data);
    alert("Tersimpan.");
    formPlat.value = formLokasi.value = ""; formSTNK.value = formKIR.value = formServis.value = "";
    renderVehiclesTable();
  }

  window.hapusKendaraan = function(i){
    if (!confirm("Yakin ingin menghapus?")) return;
    let d = loadVehicles(); d.splice(i,1); saveVehicles(d); renderVehiclesTable();
  }

  window.editKendaraan = function(i){
    if (!confirm("Edit data ini? Tekan OK untuk load ke form.")) return;
    const d = loadVehicles();
    const it = d[i];
    formPlat.value = it.plat; formLokasi.value = it.lokasi;
    formSTNK.value = it.tglSTNK; formKIR.value = it.tglKIR; formServis.value = it.tglServis;
    d.splice(i,1); saveVehicles(d); renderVehiclesTable();
  }

  window.cariKendaraan = function(){
    const q = (searchInput? searchInput.value.trim().toLowerCase() : "");
    if (!tableBody) return;
    Array.from(tableBody.querySelectorAll("tr")).forEach(tr=>{
      const txt = tr.innerText.toLowerCase(); tr.style.display = q ? (txt.includes(q) ? "" : "none") : "";
    });
  }

  // attach render on load
  document.addEventListener("DOMContentLoaded", ()=>{
    renderVehiclesTable();
    if (searchInput) searchInput.addEventListener("input", cariKendaraan);
  });

})();

/* ---------- USER Management (on user.html and admin add) ---------- */
(function userModule(){
  if (!localStorage.getItem("aj_users")) {
    localStorage.setItem("aj_users", JSON.stringify([]));
  }

  const usersTable = qs("#userTable tbody");

  window.tambahUserAdmin = function(){
    const u = qs("#newUsername"), n = qs("#namaUser"), p = qs("#passwordUser"), r = qs("#roleUser");
    if (!u) return;
    const username = u.value.trim(), nama = n.value.trim(), pass = p.value.trim(), role = r.value;
    if (!username || !pass || !nama) { alert("Lengkapi semua field"); return; }
    let users = JSON.parse(localStorage.getItem("aj_users")||"[]");
    if (users.find(x=>x.username===username)) { alert("Username sudah ada"); return; }
    users.push({ username, nama, password:pass, role, foto:"" });
    localStorage.setItem("aj_users", JSON.stringify(users));
    alert("User tersimpan");
    u.value=""; n.value=""; p.value="";
    renderUsers();
  }

  window.renderUsers = function(){
    if (!usersTable) return;
    const users = JSON.parse(localStorage.getItem("aj_users")||"[]");
    usersTable.innerHTML = "";
    users.forEach(u=>{
      usersTable.insertAdjacentHTML('beforeend',
        `<tr><td>${u.username}</td><td>${u.nama}</td><td>${u.role}</td></tr>`);
    });
  }

  document.addEventListener("DOMContentLoaded", renderUsers);
})();
