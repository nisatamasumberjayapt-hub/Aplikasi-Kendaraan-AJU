const API_URL = "https://script.google.com/macros/s/AKfycbw3KBQRVDeOD5H28fcBdil2QCtGwnW819LiKMtK5PMwGsqqSeWvCz7iVAEvdjK7AnH_/exec";

// Fungsi hitung hari dan status warna
function hitungStatus(tanggal) {
  if (!tanggal) return { teks: "-", warna: "" };
  const now = new Date();
  const tgl = new Date(tanggal);
  const selisih = Math.floor((tgl - now) / (1000 * 60 * 60 * 24));
  
  if (selisih < 0) return { teks: `Telah lewat ${Math.abs(selisih)} hari`, warna: "red" };
  if (selisih <= 7) return { teks: `${selisih} hari lagi`, warna: "orange" };
  return { teks: `${selisih} hari lagi`, warna: "green" };
}

// Tambah kendaraan
async function tambahKendaraan() {
  const PlatNomor = document.getElementById("plat").value.trim();
  const Letak = document.getElementById("letak").value.trim();
  const STNK = document.getElementById("stnk").value;
  const KIR = document.getElementById("kir").value;
  const ServisTerakhir = document.getElementById("servis").value;

  if (!PlatNomor) return alert("Plat nomor wajib diisi!");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "addKendaraan",
        PlatNomor, Letak, STNK, KIR, ServisTerakhir
      }),
    });
    const result = await res.json();
    alert(result.message);
    if (result.success) loadKendaraan();
  } catch (err) {
    alert("Gagal menyimpan data!");
  }
}

// Ambil & tampilkan data
async function loadKendaraan() {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "getData" }),
    });
    const result = await res.json();

    if (result.success) {
      const tbody = document.getElementById("kendaraanBody");
      tbody.innerHTML = "";

      result.data.forEach((item, i) => {
        const stnkStatus = hitungStatus(item.STNK);
        const kirStatus = hitungStatus(item.KIR);
        const servisStatus = hitungStatus(item.ServisTerakhir);

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.PlatNomor}</td>
          <td>${item.Letak}</td>
          <td>${item.STNK || "-"}</td>
          <td style="color:${stnkStatus.warna}">${stnkStatus.teks}</td>
          <td>${item.KIR || "-"}</td>
          <td style="color:${kirStatus.warna}">${kirStatus.teks}</td>
          <td>${item.ServisTerakhir || "-"}</td>
          <td style="color:${servisStatus.warna}">${servisStatus.teks}</td>
          <td>
            <button onclick="editData('${item.PlatNomor}')">Edit</button>
            <button onclick="hapusData('${item.PlatNomor}')">Hapus</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    } else {
      alert("Gagal memuat data kendaraan!");
    }
  } catch (err) {
    alert("Gagal terhubung ke server!");
  }
}

// Cari data kendaraan
function cariData() {
  const keyword = document.getElementById("search").value.toLowerCase();
  const rows = document.querySelectorAll("#kendaraanBody tr");
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(keyword) ? "" : "none";
  });
}

// Hapus data kendaraan
async function hapusData(plat) {
  if (!confirm(`Hapus data kendaraan ${plat}?`)) return;
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "deleteKendaraan", PlatNomor: plat }),
  });
  const result = await res.json();
  alert(result.message);
  loadKendaraan();
}

// Edit data kendaraan
async function editData(plat) {
  const letakBaru = prompt("Masukkan letak baru:");
  if (!letakBaru) return;
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "editKendaraan", PlatNomor: plat, Letak: letakBaru }),
  });
  const result = await res.json();
  alert(result.message);
  loadKendaraan();
}

// Load otomatis
window.onload = loadKendaraan;
