const API_URL = "YOUR_WEBAPP_URL";

// ================= LOGIN =================
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "login", data: { username, password } }),
  });
  const result = await res.json();

  if (result.success) {
    localStorage.setItem("user", JSON.stringify(result));
    window.location.href = "index.html";
  } else {
    alert(result.message);
  }
}

// ================= KENDARAAN =================
async function loadKendaraan() {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "getKendaraan" }),
  });
  const result = await res.json();

  const tbody = document.querySelector("#tabelKendaraan tbody");
  tbody.innerHTML = "";
  result.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.Plat}</td>
      <td>${r.Letak}</td>
      <td>${r.STNK}</td>
      <td>${r["Status STNK"]}</td>
      <td>${r.KIR}</td>
      <td>${r["Status KIR"]}</td>
      <td>${r["Servis Terakhir"]}</td>
      <td>${r["Selisih Servis"]}</td>
    `;
    tbody.appendChild(tr);
  });
}

async function tambahKendaraan() {
  const data = {
    Plat: document.getElementById("plat").value,
    Letak: document.getElementById("letak").value,
    STNK: document.getElementById("stnk").value,
    "Status STNK": document.getElementById("statusStnk").value,
    KIR: document.getElementById("kir").value,
    "Status KIR": document.getElementById("statusKir").value,
    "Servis Terakhir": document.getElementById("servis").value,
    "Selisih Servis": document.getElementById("selisih").value,
  };

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "addKendaraan", data }),
  });

  const result = await res.json();
  alert(result.message);
  loadKendaraan();
}

// ================= USER =================
async function tambahUser() {
  const data = {
    Username: document.getElementById("username").value,
    Password: document.getElementById("password").value,
    Nama: document.getElementById("nama").value,
    Role: document.getElementById("role").value,
  };

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "addUser", data }),
  });

  const result = await res.json();
  alert(result.message);
}
