// Ganti URL ini dengan milikmu (sudah benar)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw3nbLRitPMoc4cgLTLRfONspfv2aMQR1LVJ7lPOCSCinHRHgLUj57VoGZvQCdCBxxG/exec";

document.getElementById("formData").addEventListener("submit", async function(e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const email = document.getElementById("email").value;
  const pesan = document.getElementById("pesan").value;

  const data = { nama, email, pesan };

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (result.result === "success") {
      alert("✅ Data berhasil disimpan!");
      document.getElementById("formData").reset();
    } else {
      alert("⚠️ Gagal menyimpan: " + result.message);
    }
  } catch (err) {
    alert("❌ Terjadi kesalahan: " + err.message);
  }
});
