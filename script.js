// ===========================================================
//  APP SCRIPT FINAL — versi sudah dirapikan & tidak duplikat
// ===========================================================
document.addEventListener("DOMContentLoaded", () => {

  // =========================================================
  // ELEMENT REFERENSI
  // =========================================================
  const loginForm   = document.getElementById("login-form");
  const loginScreen = document.getElementById("login-screen");
  const appWrapper  = document.getElementById("app-wrapper");
  const appHeader   = document.getElementById("main-header");
  const sidebar     = document.getElementById("sidebar");

  // Sidebar default tertutup
  if (sidebar) sidebar.style.left = "-240px";

  // =========================================================
  // CEK STATUS LOGIN
  // =========================================================
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const lastPage   = localStorage.getItem("lastPage") || "beranda";

  if (isLoggedIn === "true") {
    loginScreen.classList.add("hidden");
    appWrapper.classList.remove("hidden");
    appHeader.classList.remove("hidden");
    sidebar.classList.remove("hidden");
    openPage(lastPage, false);
  } else {
    loginScreen.classList.add("active");
    appWrapper.classList.add("hidden");
    appHeader.classList.add("hidden");
    sidebar.classList.add("hidden");
  }

  // =========================================================
  // LOGIN
  // =========================================================
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("lastPage", "beranda");

      loginScreen.classList.add("hidden");
      appWrapper.classList.remove("hidden");
      appHeader.classList.remove("hidden");
      sidebar.classList.remove("hidden");

      openPage("beranda", false);
    });
  }

  // =========================================================
  // JAM REALTIME
  // =========================================================
  function updateClock(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = new Date().toLocaleTimeString("id-ID");
  }
  setInterval(() => updateClock("clock"), 1000);
  setInterval(() => updateClock("login-clock"), 1000);
  updateClock("clock");
  updateClock("login-clock");

  // =========================================================
  // AUTO CLOSE SIDEBAR
  // =========================================================
  document.addEventListener("click", (event) => {
    const menuBtn = document.querySelector(".menu-btn");
    if (!sidebar || !menuBtn) return;

    if (
      sidebar.style.left === "0px" &&
      !sidebar.contains(event.target) &&
      !menuBtn.contains(event.target)
    ) {
      sidebar.style.left = "-240px";
    }
  });

  // =========================================================
  // FORM PENGELUARAN
  // =========================================================
  const belanjaForm = document.querySelector("#belanja form");
  if (belanjaForm) {
    belanjaForm.addEventListener("submit", e => {
      e.preventDefault();
      const jumlah = Number(belanjaForm.querySelector('input[type="number"]').value) || 0;
      const keterangan = belanjaForm.querySelector('input[type="text"]').value || "";

      let data = JSON.parse(localStorage.getItem("pengeluaranData") || "[]");
      data.push({ jumlah, keterangan });

      localStorage.setItem("pengeluaranData", JSON.stringify(data));
      belanjaForm.reset();
      updateDashboard();
      renderPengeluaran();
    });
  }

  // =========================================================
  // FORM PEMASUKAN
  // =========================================================
  const laciForm = document.querySelector("#laci form");
  if (laciForm) {
    laciForm.addEventListener("submit", e => {
      e.preventDefault();
      const jumlah = Number(laciForm.querySelector('input[type="number"]').value) || 0;
      const keterangan = laciForm.querySelector('input[type="text"]').value || "";

      let data = JSON.parse(localStorage.getItem("pemasukanData") || "[]");
      data.push({ jumlah, keterangan, tanggal: new Date().toISOString() });

      localStorage.setItem("pemasukanData", JSON.stringify(data));
      laciForm.reset();
      updateDashboard();
    });
  }

  // =========================================================
  // FORM STOK
  // =========================================================
  const stokForm = document.querySelector("#stok form");
  if (stokForm) {
    stokForm.addEventListener("submit", e => {
      e.preventDefault();
      const nama = stokForm.querySelector('input[type="text"]').value || "";
      const jumlah = Number(stokForm.querySelector('input[type="number"]').value) || 0;

      let data = JSON.parse(localStorage.getItem("stokData") || "[]");
      data.push({ nama, jumlah });

      localStorage.setItem("stokData", JSON.stringify(data));
      stokForm.reset();
      updateDashboard();
    });
  }

  // =========================================================
  // FORM PERSIAPAN
  // =========================================================
  const formPersiapan = document.getElementById("persiapanForm");
  if (formPersiapan) {
    const ket = document.getElementById("keterangan");

    const saved = JSON.parse(localStorage.getItem("persiapanData")) || {};
    formPersiapan.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      if (saved[cb.value]) {
        cb.checked = true;
        cb.disabled = true;
      }
    });
    if (saved.keterangan) ket.value = saved.keterangan;

    formPersiapan.addEventListener("submit", e => {
      e.preventDefault();
      const data = {};
      formPersiapan.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (cb.checked) {
          cb.disabled = true;
          data[cb.value] = true;
        }
      });
      data.keterangan = ket.value;

      localStorage.setItem("persiapanData", JSON.stringify(data));
      alert("Data persiapan disimpan.");
    });
  }

  // =========================================================
  // STOK — SIMPAN PILIHAN SELECT
  // =========================================================
  document.querySelectorAll(".stok-row select").forEach((select, index) => {
    if (!select.dataset.default) {
      select.dataset.default = select.value;
    }

    select.addEventListener("change", function () {
      localStorage.setItem("stokSelect_" + index, this.value);
      this.classList.add("used");
    });

    const savedValue = localStorage.getItem("stokSelect_" + index);
    if (savedValue) {
      select.value = savedValue;
      select.classList.add("used");
    }
  });

  // RESET STOK
  const resetBtn = document.getElementById("reset-stok");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      document.querySelectorAll(".stok-row select").forEach((select, index) => {
        select.value = select.dataset.default || "";
        select.classList.remove("used");
        localStorage.removeItem("stokSelect_" + index);
      });
      alert("Stok berhasil di-reset ke default.");
    });
  }

  // =========================================================
  // COPY STOK
  // =========================================================
  const copyBtn = document.getElementById("copy-stok");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {

          // -------------------------
    // Buat tanggal otomatis
    // -------------------------
    const hariArray = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
    const bulanArray = [
      "Januari","Februari","Maret","April","Mei","Juni",
      "Juli","Agustus","September","Oktober","November","Desember"
    ];

    const now = new Date();
    const hari = hariArray[now.getDay()];
    const tanggal = now.getDate();
    const bulan = bulanArray[now.getMonth()];
    const tahun = now.getFullYear();

    const tanggalLengkap = `${hari}, ${tanggal} ${bulan} ${tahun}`;

    // -------------------------
    // Judul laporan otomatis
    // -------------------------
    let laporan = `📊 STOCK BAHAN ${tanggalLengkap}\n\n`;
      
      let ada = false;

      document.querySelectorAll("#stok .stok-row").forEach(row => {
        const nama   = row.querySelector(".stok-nama").innerText.trim();
        const satuan = row.querySelector(".stok-satuan").innerText.trim();
        const select = row.querySelector("select");
        const nilai  = select.options[select.selectedIndex].text;
        const defOpt = select.querySelector("option[selected]");
        const defVal = defOpt ? defOpt.text : "";

        if (nilai !== defVal) {
          laporan += `- ${nama} (${satuan}): ${nilai}\n`;
          ada = true;
        }
      });

      if (!ada) return alert("Tidak ada perubahan stok.");

      navigator.clipboard.writeText(laporan).then(() => {
        alert("Laporan stok berhasil dicopy!");
      });
    });
  }

  // =========================================================
  // COPY PERSEDIAAN
  // =========================================================
  const copyPersediaanBtn = document.getElementById("copy-persediaan");
  if (copyPersediaanBtn) {
    copyPersediaanBtn.addEventListener("click", function () {

          // -------------------------
    // Buat tanggal otomatis
    // -------------------------
    const hariArray = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
    const bulanArray = [
      "Januari","Februari","Maret","April","Mei","Juni",
      "Juli","Agustus","September","Oktober","November","Desember"
    ];

    const now = new Date();
    const hari = hariArray[now.getDay()];
    const tanggal = now.getDate();
    const bulan = bulanArray[now.getMonth()];
    const tahun = now.getFullYear();

    const tanggalLengkap = `${hari}, ${tanggal} ${bulan} ${tahun}`;

    // -------------------------
    // Judul laporan otomatis
    // -------------------------
    let laporan = `📊 PERSEDIAAN ${tanggalLengkap}\n\n`;
      
      let ada = false;

      document.querySelectorAll("#storage .stok-row").forEach(row => {
        const nama   = row.querySelector(".stok-nama").innerText.trim();
        const satuan = row.querySelector(".stok-satuan").innerText.trim();
        const select = row.querySelector("select");
        const nilai  = select.options[select.selectedIndex].text;

        const defOpt = select.querySelector("option[selected]");
        const defVal = defOpt ? defOpt.text : "";

        if (nilai !== defVal) {
          laporan += `- ${nama} (${satuan}): ${nilai}\n`;
          ada = true;
        }
      });

      if (!ada) return alert("Tidak ada perubahan persediaan.");

      navigator.clipboard.writeText(laporan).then(() => {
        alert("Laporan persediaan berhasil dicopy!");
      });
    });
  }

  // =========================================================
// COPY DASHBOARD
// =========================================================
const copyDashboardBtn = document.getElementById("copy-dashboard");
if (copyDashboardBtn) {
  copyDashboardBtn.addEventListener("click", function () {

    // -------------------------
    // Buat tanggal otomatis
    // -------------------------
    const hariArray = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
    const bulanArray = [
      "Januari","Februari","Maret","April","Mei","Juni",
      "Juli","Agustus","September","Oktober","November","Desember"
    ];

    const now = new Date();
    const hari = hariArray[now.getDay()];
    const tanggal = now.getDate();
    const bulan = bulanArray[now.getMonth()];
    const tahun = now.getFullYear();

    const tanggalLengkap = `${hari}, ${tanggal} ${bulan} ${tahun}`;

    // -------------------------
    // Judul laporan otomatis
    // -------------------------
    let laporan = `📊 LAPORAN KAS ${tanggalLengkap}\n\n`;

    const map = [
      ["Saldo Awal", "saldoAwal"],
      ["Pengeluaran", "pengeluaran"],
      ["Kas Harian", "pemasukan"],
      ["Pendapatan", "pendapatan"]
    ];

    map.forEach(([label, id]) => {
      const el = document.getElementById(id);
      if (el && el.textContent.trim() !== "") {
        laporan += `${label}: ${el.textContent.trim()}\n`;
      }
    });

    navigator.clipboard
      .writeText(laporan)
      .then(() => alert("Laporan dashboard berhasil dicopy!"))
      .catch(() => alert("Gagal menyalin teks!"));
  });
}


  // =========================================================
  // SALDO AWAL
  // =========================================================
  const saldoAwalInput = document.getElementById("saldoAwalInput");
  const saveSaldoAwalBtn = document.getElementById("saveSaldoAwal");
  const dashboardSaldoEl = document.getElementById("saldoAwal") || document.getElementById("dashboardSaldoAwal");

  const savedSaldoAwal = localStorage.getItem("saldoAwal");
  if (savedSaldoAwal !== null && saldoAwalInput) {
    saldoAwalInput.value = savedSaldoAwal;
    if (dashboardSaldoEl) {
      dashboardSaldoEl.textContent = " " + Number(savedSaldoAwal).toLocaleString("id-ID");
    }
  }

  if (saveSaldoAwalBtn) {
    saveSaldoAwalBtn.addEventListener("click", () => {
      const val = saldoAwalInput.value.trim();
      const num = val === "" ? 0 : Number(val);

      localStorage.setItem("saldoAwal", String(num));

      if (dashboardSaldoEl)
        dashboardSaldoEl.textContent = " " + num.toLocaleString("id-ID");

      updateDashboard();
      alert("Saldo Awal disimpan!");
    });
  }

  // =========================================================
  // INIT
  // =========================================================
  updateDashboard();
  renderPengeluaran();

}); // END DOMContentLoaded



// ===========================================================
//  NAVIGASI
// ===========================================================
function openPage(pageId, closeSidebar = true) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);

  if (target) {
    target.classList.add('active');
    localStorage.setItem("lastPage", pageId);
  }

  if (closeSidebar) toggleMenu();
}

function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  sidebar.style.left = (sidebar.style.left === "0px") ? "-240px" : "0px";
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("lastPage");
  localStorage.removeItem("username");

  const loginScreen = document.getElementById("login-screen");
  const appWrapper  = document.getElementById("app-wrapper");
  const appHeader   = document.getElementById("main-header");
  const sidebar     = document.getElementById("sidebar");

  loginScreen.classList.remove("hidden");
  appWrapper.classList.add("hidden");
  appHeader.classList.add("hidden");
  sidebar.classList.add("hidden");

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("beranda")?.classList.add("active");
}



// ===========================================================
//  RENDER PENGELUARAN
// ===========================================================
function renderPengeluaran() {
  const container = document.getElementById("pengeluaranList");
  if (!container) return;

  const data = JSON.parse(localStorage.getItem("pengeluaranData") || "[]");

  if (data.length === 0) {
    container.innerHTML = "<p>Belum ada data pengeluaran.</p>";
    return;
  }

  let html = `
    <table width="100%">
      <tbody>
  `;

  data.forEach((item, index) => {
    html += `
      <tr>
        <td>${item.keterangan}</td>
        <td style="text-align:right; font-weight:bold; color:#d62828">Rp ${item.jumlah.toLocaleString()}</td>
        <td><button class="hapus-btn" data-index="${index}">❌</button></td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  container.innerHTML = html;

  document.querySelectorAll(".hapus-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      data.splice(idx, 1);
      localStorage.setItem("pengeluaranData", JSON.stringify(data));
      updateDashboard();
      renderPengeluaran();
    });
  });
}



// ===========================================================
//  DASHBOARD FINAL
// ===========================================================
function updateDashboard() {
  const saldoAwal = parseFloat(localStorage.getItem("saldoAwal")) || 0;
  const pengeluaranData = JSON.parse(localStorage.getItem("pengeluaranData") || "[]");
  const pemasukanData = JSON.parse(localStorage.getItem("pemasukanData") || "[]");

  const totalPengeluaran = pengeluaranData.reduce((s, i) => s + (i.jumlah || 0), 0);
  const totalPemasukan   = pemasukanData.reduce((s, i) => s + (i.jumlah || 0), 0);
  const saldoAkhir = saldoAwal + totalPemasukan - totalPengeluaran;
  const pendapatan = totalPengeluaran + totalPemasukan - saldoAwal;

  const ids = {
    saldoAwal: saldoAwal,
    pengeluaran: totalPengeluaran,
    pemasukan: totalPemasukan,
    pendapatan: pendapatan,
    saldoAwalKas: saldoAwal,
    pemasukanKas: totalPemasukan,
    pengeluaranKas: totalPengeluaran,
    saldoAkhirKas: saldoAkhir
  };

  for (const [id, val] of Object.entries(ids)) {
    const el = document.getElementById(id);
    if (el) el.textContent = "Rp " + val.toLocaleString();
  }
}




