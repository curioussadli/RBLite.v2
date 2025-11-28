// ======================================
// APP MAIN SCRIPT
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  // ===== ELEMENT REFERENSI =====
  const loginForm   = document.getElementById("login-form");
  const loginScreen = document.getElementById("login-screen");
  const appWrapper  = document.getElementById("app-wrapper");
  const appHeader   = document.getElementById("main-header");
  const sidebar     = document.getElementById("sidebar");

  // ===== SET SIDEBAR DEFAULT (tersembunyi) =====
  if (sidebar) sidebar.style.left = "-240px";

  // ===== CEK STATUS LOGIN =====
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const lastPage   = localStorage.getItem("lastPage") || "beranda";

  if (isLoggedIn === "true") {
    // Jika sudah login
    loginScreen.classList.add("hidden");
    appWrapper.classList.remove("hidden");
    appHeader.classList.remove("hidden");
    sidebar.classList.remove("hidden");
    openPage(lastPage, false);
  } else {
    // Jika belum login
    loginScreen.classList.add("active");
    appWrapper.classList.add("hidden");
    appHeader.classList.add("hidden");
    sidebar.classList.add("hidden");
  }

// ===== FORM LOGIN =====
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    // const photo    = document.getElementById("photo").files[0]; // tidak dipakai

    // Simpan status login
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);
    localStorage.setItem("lastPage", "beranda");

    // Tampilkan app
    loginScreen.classList.add("hidden");
    appWrapper.classList.remove("hidden");
    appHeader.classList.remove("hidden");
    sidebar.classList.remove("hidden");

    openPage("beranda", false);
  });
}

// AUTO LOGIN 
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const username = localStorage.getItem("username");

  if (isLoggedIn === "true" && username) {
    loginScreen.classList.add("hidden");
    appWrapper.classList.remove("hidden");
    appHeader.classList.remove("hidden");
    sidebar.classList.remove("hidden");
    openPage("beranda", false);
  }
});



  // ===== JAM (REAL-TIME CLOCK) =====
  function updateClock(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = new Date().toLocaleTimeString("id-ID");
  }
  setInterval(() => updateClock("clock"), 1000);
  setInterval(() => updateClock("login-clock"), 1000);
  updateClock("clock");
  updateClock("login-clock");

  // ===== SIDEBAR AUTO CLOSE =====
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

// ===== FORM PENGELUARAN =====
const belanjaForm = document.querySelector("#belanja form");
if (belanjaForm) {
  belanjaForm.addEventListener("submit", e => {
    e.preventDefault();
    const jumlah = Number(belanjaForm.querySelector('input[type="number"]').value) || 0;
    const keterangan = belanjaForm.querySelector('input[type="text"]').value || "";
    let data = JSON.parse(localStorage.getItem("pengeluaranData") || "[]");

    // Hapus tanggal, hanya simpan jumlah dan keterangan
    data.push({ jumlah, keterangan });
    localStorage.setItem("pengeluaranData", JSON.stringify(data));

    belanjaForm.reset();
    updateDashboard();
    renderPengeluaran();
  });
}


  // ===== FORM PEMASUKAN =====
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

  // ===== FORM STOK =====
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

  // ===== FORM PERSIAPAN =====
  const formPersiapan = document.getElementById("persiapanForm");
  if (formPersiapan) {
    const ket = document.getElementById("keterangan");

    // Load data persiapan saat reload
    window.addEventListener("load", () => {
      const saved = JSON.parse(localStorage.getItem("persiapanData")) || {};
      formPersiapan.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (saved[cb.value]) {
          cb.checked = true;
          cb.disabled = true;
        }
      });
      if (saved.keterangan) ket.value = saved.keterangan;
    });

    // Simpan data persiapan
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
      alert("Data persiapan tersimpan");
    });
  }

  // ==== INIT DASHBOARD ====
  updateDashboard();
  renderPengeluaran();

  // ======================================
  // STOK (Simpan Pilihan Select)
  // ======================================
  document.querySelectorAll(".stok-row select").forEach((select, index) => {
  // Simpan default value agar bisa dipakai saat reset
  if (!select.dataset.default) {
    select.dataset.default = select.value;  
  }

  // Simpan pilihan saat berubah
  select.addEventListener("change", function () {
    localStorage.setItem("stokSelect_" + index, this.value);
    this.classList.add("used"); // kasih warna kuning
  });

    // Saat halaman reload → cek apakah ada data tersimpan
    const savedValue = localStorage.getItem("stokSelect_" + index);
    if (savedValue) {
      select.value = savedValue;
      select.classList.add("used");
    }
  });

  // Tombol reset stok → reset tampilan + hapus localStorage
  const resetBtn = document.getElementById("reset-stok");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      document.querySelectorAll(".stok-row select").forEach((select, index) => {
        // kembalikan ke default value, bukan kosong
        select.value = select.dataset.default || "";
        select.classList.remove("used"); // warna kembali putih
        localStorage.removeItem("stokSelect_" + index);
      });
      alert("Stok sudah dikembalikan ke default.");
    });
  }
});

// ======================================
// NAVIGASI & LOGIN
// ======================================
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

  if (loginScreen) loginScreen.classList.remove("hidden");
  if (appWrapper)  appWrapper.classList.add("hidden");
  if (appHeader)   appHeader.classList.add("hidden");
  if (sidebar)     sidebar.classList.add("hidden");

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const beranda = document.getElementById("beranda");
  if (beranda) beranda.classList.add("active");
}

// ======================================
// DASHBOARD
// ======================================
function updateDashboard() {
  const saldoAwal = parseFloat(localStorage.getItem("saldoAwal")) || 0;
  const pengeluaranData = JSON.parse(localStorage.getItem("pengeluaranData") || "[]");
  const pemasukanData   = JSON.parse(localStorage.getItem("pemasukanData") || "[]");
  const stokData        = JSON.parse(localStorage.getItem("stokData") || "[]");

  const totalPengeluaran = pengeluaranData.reduce((s, i) => s + i.jumlah, 0);
  const totalPemasukan   = pemasukanData.reduce((s, i) => s + i.jumlah, 0);
  const saldoAkhir       = saldoAwal + totalPemasukan - totalPengeluaran;

  // Update angka di dashboard
  if (document.getElementById("saldoAwal")) {
    document.getElementById("saldoAwal").textContent   = "Rp " + saldoAwal.toLocaleString();
    document.getElementById("pengeluaran").textContent = "Rp " + totalPengeluaran.toLocaleString();
    document.getElementById("pemasukan").textContent   = "Rp " + totalPemasukan.toLocaleString();
  }

  if (document.getElementById("saldoAwalKas")) {
    document.getElementById("saldoAwalKas").textContent   = "Rp " + saldoAwal.toLocaleString();
    document.getElementById("pemasukanKas").textContent   = "Rp " + totalPemasukan.toLocaleString();
    document.getElementById("pengeluaranKas").textContent = "Rp " + totalPengeluaran.toLocaleString();
    document.getElementById("saldoAkhirKas").textContent  = "Rp " + saldoAkhir.toLocaleString();
  }

  renderPengeluaranKas();
}


// ======================================
// RENDER PENGELUARAN
// ======================================
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
      <thead>
        <tr>
        </tr>
      </thead>
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

  // Tombol hapus data
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

// ======================================
// RENDER PENGELUARAN KAS (opsional, jika ada tabel lain)
// ======================================
function renderPengeluaranKas() {
  const data = JSON.parse(localStorage.getItem("pengeluaranData") || "[]");
  const container = document.getElementById("pengeluaranKasList");
  if (!container) return;

  if (data.length === 0) {
    container.innerHTML = "<p>Belum ada data pengeluaran.</p>";
    return;
  }

  let html = `
    <table cellpadding="6" cellspacing="0" width="100%">
      <tr>
        <th>Keterangan</th>
        <th>Jumlah (Rp)</th>
      </tr>
  `;
  data.forEach(item => {
    html += `
      <tr>
        <td>${item.keterangan}</td>
        <td style="text-align:right">${item.jumlah.toLocaleString()}</td>
      </tr>
    `;
  });
  html += "</table>";
  container.innerHTML = html;
}




// === COPY STOK ===
const copyBtn = document.getElementById("copy-stok");
if (copyBtn) {
  copyBtn.addEventListener("click", function () {
    let laporan = "📦 STOK HARI INI\n\n";
    let adaData = false;

    document.querySelectorAll("#stok .stok-row").forEach((row) => {
      const nama   = row.querySelector(".stok-nama").innerText.trim();
      const satuan = row.querySelector(".stok-satuan").innerText.trim();
      const select = row.querySelector("select");
      const nilai  = select.options[select.selectedIndex].text; 

      // Ambil nilai default dari attribute selected
      const defaultOption = select.querySelector("option[selected]");
      const nilaiDefault  = defaultOption ? defaultOption.text : "";

      // Hanya masukkan kalau berbeda dari default
      if (nilai !== nilaiDefault) {
        laporan += `- ${nama} (${satuan}): ${nilai}\n`;
        adaData = true;
      }
    });

    if (!adaData) {
      alert("Tidak ada perubahan stok yang dicatat.");
      return;
    }

    navigator.clipboard.writeText(laporan).then(() => {
      alert("✅ Laporan stok berhasil dicopy!");
    }).catch(err => {
      alert("❌ Gagal menyalin laporan: " + err);
    });
  });
}




document.addEventListener("DOMContentLoaded", () => {
  const saldoAwalInput = document.getElementById("saldoAwalInput");

  // Ambil saldo awal dari localStorage saat load
  const savedSaldoAwal = localStorage.getItem("saldoAwal");
  if (savedSaldoAwal) {
    saldoAwalInput.value = savedSaldoAwal;
  }

  // Simpan saldo awal ke localStorage setiap kali berubah
  saldoAwalInput.addEventListener("input", () => {
    localStorage.setItem("saldoAwal", saldoAwalInput.value);
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const saldoAwalInput = document.getElementById("saldoAwalInput");
  const saveSaldoAwalBtn = document.getElementById("saveSaldoAwal");

  // dashboard element: coba dua id yang mungkin ada (fallback)
  const dashboardSaldoEl = document.getElementById("saldoAwal") || document.getElementById("dashboardSaldoAwal");

  // Ambil saldo awal dari localStorage saat load (cek !== null supaya "0" tetap dianggap valid)
  const savedSaldoAwal = localStorage.getItem("saldoAwal");
  if (savedSaldoAwal !== null) {
    if (saldoAwalInput) saldoAwalInput.value = savedSaldoAwal;
    if (dashboardSaldoEl) {
      const n = Number(savedSaldoAwal) || 0;
      dashboardSaldoEl.textContent = " " + n.toLocaleString("id-ID");
    }
  }

  // Jika tombol ada, pasang listener untuk menyimpan saldo awal
  if (saveSaldoAwalBtn) {
    saveSaldoAwalBtn.addEventListener("click", () => {
      if (!saldoAwalInput) return;

      // ambil dan normalisasi nilai (kosong = 0)
      const raw = saldoAwalInput.value.trim();
      const num = raw === "" ? 0 : Number(raw);

      // simpan di localStorage sebagai string
      localStorage.setItem("saldoAwal", String(num));

      // update tampilan dashboard (format Rupiah)
      if (dashboardSaldoEl) {
        dashboardSaldoEl.textContent = " " + num.toLocaleString("id-ID");
      }

      // jika ada fungsi updateDashboard di scope global, panggil agar nilai sinkron
      if (typeof updateDashboard === "function") {
        updateDashboard();
      }

      alert("Saldo Awal berhasil disimpan!");
    });
  }
});


function updatePendapatan() {
  const saldoAwal = parseFloat(localStorage.getItem("saldoAwal")) || 0;
  const pengeluaranData = JSON.parse(localStorage.getItem("pengeluaranData") || "[]");
  const pemasukanData   = JSON.parse(localStorage.getItem("pemasukanData") || "[]");

  const totalPengeluaran = pengeluaranData.reduce((sum, i) => sum + (i.jumlah || 0), 0);
  const totalPemasukan   = pemasukanData.reduce((sum, i) => sum + (i.jumlah || 0), 0);

  // Rumus Pendapatan yang baru
  const pendapatan = totalPengeluaran + totalPemasukan - saldoAwal;

  const pendapatanEl = document.getElementById("pendapatan");
  if (pendapatanEl) {
    pendapatanEl.textContent = ` ${pendapatan.toLocaleString("id-ID")}`;
  }
}

// updateDashboard tetap sama, panggil updatePendapatan di akhir
function updateDashboard() {
  const saldoAwal = parseFloat(localStorage.getItem("saldoAwal")) || 0;
  const pengeluaranData = JSON.parse(localStorage.getItem("pengeluaranData") || "[]");
  const pemasukanData   = JSON.parse(localStorage.getItem("pemasukanData") || "[]");

  const totalPengeluaran = pengeluaranData.reduce((s, i) => s + (i.jumlah || 0), 0);
  const totalPemasukan   = pemasukanData.reduce((s, i) => s + (i.jumlah || 0), 0);
  const saldoAkhir       = saldoAwal + totalPemasukan - totalPengeluaran;

  if (document.getElementById("saldoAwal")) {
    document.getElementById("saldoAwal").textContent   = " " + saldoAwal.toLocaleString();
    document.getElementById("pengeluaran").textContent = " " + totalPengeluaran.toLocaleString();
    document.getElementById("pemasukan").textContent   = " " + totalPemasukan.toLocaleString();
  }

  if (document.getElementById("saldoAwalKas")) {
    document.getElementById("saldoAwalKas").textContent   = "Rp " + saldoAwal.toLocaleString();
    document.getElementById("pemasukanKas").textContent   = "Rp " + totalPemasukan.toLocaleString();
    document.getElementById("pengeluaranKas").textContent = "Rp " + totalPengeluaran.toLocaleString();
    document.getElementById("saldoAkhirKas").textContent  = "Rp " + saldoAkhir.toLocaleString();
  }

  renderPengeluaranKas();

  // update Pendapatan setelah semua update selesai
  updatePendapatan();
}


// === COPY KAS HARIAN ===
const copyKasBtn = document.getElementById("copy-btn");
if (copyKasBtn) {
  copyKasBtn.addEventListener("click", () => {
    // Ambil elemen dashboard
    const saldoAwal   = document.getElementById("saldoAwal")?.textContent || "Rp0";
    const pengeluaran = document.getElementById("pengeluaran")?.textContent || "Rp0";
    const pemasukan   = document.getElementById("pemasukan")?.textContent || "Rp0";
    const pendapatan  = document.getElementById("pendapatan")?.textContent || "Rp0";

    // Buat string laporan
    const laporan = 
`📊 KAS HARIAN
Saldo Awal : ${saldoAwal}
Pengeluaran : ${pengeluaran}
Kas Harian  : ${pemasukan}
Pendapatan  : ${pendapatan}`;

    // Salin ke clipboard
    navigator.clipboard.writeText(laporan).then(() => {
      alert("✅ Laporan Kas Harian berhasil dicopy!");
    }).catch(err => {
      alert("❌ Gagal menyalin laporan: " + err);
    });
  });
}


// ===== RESET HARIAN JAM 6 PAGI =====
function resetDaily() {
  const now = new Date();
  if (now.getHours() === 6 && !localStorage.getItem("dailyResetDone")) {
    // Reset pengeluaran, pemasukan, stok
    localStorage.removeItem("pengeluaranData");
    localStorage.removeItem("pemasukanData");
    localStorage.removeItem("stokData");
    localStorage.removeItem("persiapanData");

    // Reset select stok ke default
    document.querySelectorAll(".stok-row select").forEach((select, index) => {
      select.value = select.dataset.default || "";
      select.classList.remove("used");
      localStorage.removeItem("stokSelect_" + index);
    });

    // Logout otomatis
    logout();

    // Tandai reset hari ini sudah dilakukan
    localStorage.setItem("dailyResetDone", "true");
  }

  // Reset flag setiap jam 0:00 (untuk siap besok)
  if (now.getHours() === 0) {
    localStorage.removeItem("dailyResetDone");
  }
}

// Jalankan setiap menit
setInterval(resetDaily, 60 * 1000); // 60 detik sekali


