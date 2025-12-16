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
    openPage(lastPage);
    setActiveNav(lastPage); // 🔥 TAMBAHKAN INI

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




/* ===============================
   DATA MASTER ITEM STOK
=============================== */
const STOK_ITEMS = [
  { id: "roti-balok", nama: "ROTI BALOK", satuan: "PCS", rata: 42, step: 1 },
  
  { id: "cokelat-cream", nama: "COKELAT CREAM", satuan: "BTL", rata: 4, step: 1 },
  { id: "vanilla-cream", nama: "VANILLA CREAM", satuan: "BTL", rata: 4, step: 1 },
  { id: "tiramisu-cream", nama: "TIRAMISU CREAM", satuan: "BTL", rata: 2, step: 1 },
  { id: "greentea-cream", nama: "GREENTEA CREAM", satuan: "BTL", rata: 2, step: 1 },
  { id: "strawberry-cream", nama: "STRAWBRRY CREAM", satuan: "BTL", rata: 1, step: 1 },
  { id: "mocha-cream", nama: "MOCHA CREAM", satuan: "BTL", rata: 1, step: 1 },

  { id: "choco-crunchy", nama: "CHOCO CRUNCHY", satuan: "TOP", rata: 2, step: 1 },

  { id: "keju-cheddar", nama: "KEJU CHEDDAR", satuan: "PCS", rata: 8, step: 1 },

  { id: "cookies-crumble", nama: "COOKIES CRUMB", satuan: "TOP", rata: 2, step: 1 },
  { id: "caramel-crumble", nama: "CARAMEL CRUMB", satuan: "TOP", rata: 1, step: 1 },
  { id: "red-velvet-crumble", nama: "RED VELVET CRUMB", satuan: "TOP", rata: 1, step: 1 },
  { id: "matcha-crumble", nama: "MATCHA CRUMB", satuan: "TOP", rata: 1, step: 1 },
  { id: "peanuts-crumbs", nama: "PEANUTS CRUMB", satuan: "TOP", rata: 1, step: 1 },

  { id: "chocolate-powder", nama: "CHOCOLATE PWD", satuan: "PCS", rata: 10, step: 1 },
  { id: "milo-powder", nama: "MILO POWDER", satuan: "PCS", rata: 10, step: 1 },
  { id: "vanilla-latte-powder", nama: "VANILLA LTE PWD", satuan: "PCS", rata: 10, step: 1 },
  { id: "taro-powder", nama: "TARO POWDER", satuan: "PCS", rata: 10, step: 1 },
  { id: "red-velvet-powder", nama: "RED VELVET PWD", satuan: "PCS", rata: 10, step: 1 },
  { id: "greentea-powder", nama: "GREENTEA PWD", satuan: "PCS", rata: 10, step: 1 },

  { id: "lychee-tea-powder", nama: "LYCHEE TEA PWD", satuan: "PCS", rata: 5, step: 1 },
  { id: "blackcurrant-powder", nama: "BLACKCRRT PWD", satuan: "PCS", rata: 5, step: 1 },
  { id: "lemon-tea-powder", nama: "LEMON TEA PWD", satuan: "PCS", rata: 15, step: 1 },

  { id: "kertas-cokelat", nama: "KERTAS COKELAT", satuan: "PCS", rata: 20, step: 1 },
  { id: "kresek-roti", nama: "KRESEK ROTI", satuan: "PCS", rata: 3, step: 1 },
  { id: "tisu-garpu", nama: "TISU GARPU", satuan: "PCS", rata: 1, step: 1 },
  { id: "kresek-1-cup", nama: "KRESEK 1 CUP", satuan: "PCS", rata: 2, step: 1 },
  { id: "kresek-2-cup", nama: "KRESEK 2 CUP", satuan: "PCS", rata: 1, step: 1 },
  { id: "sedotan-es", nama: "SEDOTAN ES", satuan: "PCS", rata: 20, step: 1 },

  { id: "kertas-struk", nama: "KERTAS STRUK", satuan: "ROL", rata: 5, step: 1 },
  { id: "air-galon", nama: "AIR GALON", satuan: "VOL", rata: 50, step: 0.5 },
  { id: "gas-lpg", nama: "GAS LPG", satuan: "TBG", rata: 1, step: 1 },
  { id: "cup-ice", nama: "CUP ICE", satuan: "CUP", rata: 12, step: 1 },

  { id: "minyak-crunchy", nama: "MINYAK CRUNCHY", satuan: "BTL", rata: 1, step: 1 },
  { id: "minyak-kelapa", nama: "MINYAK KELAPA", satuan: "BTL", rata: 1, step: 1 }

];


/* ===============================
   LOCAL STORAGE
=============================== */
const STORAGE_KEY = "rb_stok_data";
const stokState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

STOK_ITEMS.forEach(item => {
  if (!stokState[item.id]) {
    stokState[item.id] = {
      persediaan: 0,
      stokBahanInt: 0,
      stokBahanDec: 0
    };
  }
});


function saveStok() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stokState));
}

/* ===============================
   FORMAT ANGKA
=============================== */
function fmt(n) {
  return Number(parseFloat(n).toFixed(2));
}

/* ===============================
   RENDER CARD STOK
=============================== */
function renderStokCards() {
  const c = document.getElementById("stokContainer");
  c.innerHTML = "";

  STOK_ITEMS.forEach(item => {
    c.innerHTML += `
      <div class="stok-card" data-id="${item.id}">
        <div class="stok-header">
          <div>
            <div class="stok-nama">${item.nama}</div>
            <div class="stok-satuan">${item.satuan}</div>
          </div>
          <div class="stok-total" id="total-${item.id}">0</div>
        </div>

        <div class="stok-detail">
          <div class="stok-line">
            <span>STOK MASUK</span>
            <input type="number" step="${item.step}" id="masuk-${item.id}" value="0">
          </div>

          <div class="stok-line">
            <span>STOK KELUAR</span>
            <input type="number" step="${item.step}" id="keluar-${item.id}" value="0">
          </div>

          <div class="stok-line">
            <span>PERSEDIAAN (GUDANG)</span>
            <strong id="persediaan-${item.id}">0</strong>
          </div>

          <div class="stok-line is-bahan-int">
            <span>STOK BAHAN</span>
            <input type="number" step="1" id="bahan-int-${item.id}" value="0">
          </div>

          <div class="stok-line is-bahan-dec">
            <span></span>
            <input type="number" step="0.1" id="bahan-dec-${item.id}" value="0.0">
          </div>


          <div class="stok-line">
            <span>STOK MINIMAL</span>
            <strong>${item.rata}</strong>
          </div>

          <div class="stok-line request">
            <span>REQUEST ?</span>
            <strong id="request-${item.id}">0</strong>
          </div>
        </div>
      </div>
    `;
  });
}




function initStokLogic() {
  document.querySelectorAll(".stok-card").forEach(card => {
    const id = card.dataset.id;
    const item = STOK_ITEMS.find(x => x.id === id);

    /* ===============================
       EXPAND / COLLAPSE
    =============================== */
    card.querySelector(".stok-header").onclick = () => {
    const isActive = card.classList.contains("active");

    // tutup card lain
    document.querySelectorAll(".stok-card.active").forEach(c => {
      c.classList.remove("active");
    });

    if (!isActive) {
      card.classList.add("active");

      // scroll card ke atas layar
      card.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };


    /* ===============================
       STOK MASUK
    =============================== */
    const masuk = document.getElementById(`masuk-${id}`);
    masuk.parentElement.appendChild(makeSaveBtn(() => {
      stokState[id].persediaan = fmt(
        stokState[id].persediaan + (parseFloat(masuk.value) || 0)
      );
      masuk.value = 0;
      saveStok();
      renderStok(id, item);
    }));

    /* ===============================
       STOK KELUAR
    =============================== */
    const keluar = document.getElementById(`keluar-${id}`);
    keluar.parentElement.appendChild(makeSaveBtn(() => {
      stokState[id].persediaan = fmt(
        stokState[id].persediaan - (parseFloat(keluar.value) || 0)
      );
      if (stokState[id].persediaan < 0) stokState[id].persediaan = 0;
      keluar.value = 0;
      saveStok();
      renderStok(id, item);
    }, true));

    /* =================================================
       STOK BAHAN INTEGER (− / +)
    ================================================= */
    const bahanInt = document.getElementById(`bahan-int-${id}`);
    bahanInt.value = stokState[id].stokBahanInt;

    const intRow = bahanInt.parentElement;

    const btnIntMinus = document.createElement("button");
    btnIntMinus.className = "stok-btn adjust";
    btnIntMinus.textContent = "−";

    const btnIntPlus = document.createElement("button");
    btnIntPlus.className = "stok-btn adjust";
    btnIntPlus.textContent = "+";

    intRow.insertBefore(btnIntMinus, bahanInt);
    intRow.appendChild(btnIntPlus);

    btnIntMinus.onclick = () => {
      stokState[id].stokBahanInt = Math.max(
        0,
        stokState[id].stokBahanInt - 1
      );
      bahanInt.value = stokState[id].stokBahanInt;
      saveStok();
      renderStok(id, item);
    };

    btnIntPlus.onclick = () => {
      stokState[id].stokBahanInt += 1;
      bahanInt.value = stokState[id].stokBahanInt;
      saveStok();
      renderStok(id, item);
    };

    bahanInt.oninput = () => {
      stokState[id].stokBahanInt = parseInt(bahanInt.value) || 0;
      saveStok();
      renderStok(id, item);
    };

    /* =================================================
       STOK BAHAN DESIMAL (− / +)
    ================================================= */
    const bahanDec = document.getElementById(`bahan-dec-${id}`);
    bahanDec.value = stokState[id].stokBahanDec.toFixed(1);

    const decRow = bahanDec.parentElement;

    const btnDecMinus = document.createElement("button");
    btnDecMinus.className = "stok-btn adjust";
    btnDecMinus.textContent = "−";

    const btnDecPlus = document.createElement("button");
    btnDecPlus.className = "stok-btn adjust";
    btnDecPlus.textContent = "+";

    decRow.insertBefore(btnDecMinus, bahanDec);
    decRow.appendChild(btnDecPlus);

    btnDecMinus.onclick = () => {
      stokState[id].stokBahanDec = Math.max(
        0,
        fmt(stokState[id].stokBahanDec - 0.1)
      );
      bahanDec.value = stokState[id].stokBahanDec.toFixed(1);
      saveStok();
      renderStok(id, item);
    };

    btnDecPlus.onclick = () => {
      stokState[id].stokBahanDec = Math.min(
        0.9,
        fmt(stokState[id].stokBahanDec + 0.1)
      );
      bahanDec.value = stokState[id].stokBahanDec.toFixed(1);
      saveStok();
      renderStok(id, item);
    };

    bahanDec.oninput = () => {
      let v = parseFloat(bahanDec.value) || 0;
      v = Math.max(0, Math.min(0.9, v));
      stokState[id].stokBahanDec = fmt(v);
      bahanDec.value = stokState[id].stokBahanDec.toFixed(1);
      saveStok();
      renderStok(id, item);
    };

    /* ===============================
       RENDER AWAL
    =============================== */
    renderStok(id, item);
  });
}





/* ===============================
   BUTTON SAVE
=============================== */
function makeSaveBtn(fn, danger = false) {
  const b = document.createElement("button");
  b.className = "stok-btn" + (danger ? " danger" : "");
  b.textContent = "💾";
  b.onclick = fn;
  return b;
}

/* ===============================
   RENDER PER ITEM
=============================== */
function renderStok(id, item) {
  const p = stokState[id].persediaan;
  const bInt = stokState[id].stokBahanInt;
  const bDec = stokState[id].stokBahanDec;

  const stokBahan = fmt(bInt + bDec);
  const total = fmt(p + stokBahan);
  const request = total < item.rata ? fmt(item.rata - total) : 0;

  document.getElementById(`persediaan-${id}`).textContent = p;
  document.getElementById(`total-${id}`).textContent = total;
  document.getElementById(`request-${id}`).textContent = request;

  document
    .getElementById(`total-${id}`)
    .classList.toggle("need-request", request > 0);
}



/* ===============================
   START
=============================== */
renderStokCards();
initStokLogic();


/* ===============================
   FORMAT TANGGAL INDONESIA
=============================== */
function getTanggalID() {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

/* ===============================
   COPY SEMUA STOK
=============================== */
document.getElementById("copyAllStock").onclick = () => {
  let text = `📊 STOCK BAHAN\n🗓️ ${getTanggalID()}\n\n`;

  STOK_ITEMS.forEach(item => {
    const id = item.id;
    const p = stokState[id].persediaan || 0;
    const bi = stokState[id].stokBahanInt || 0;
    const bd = stokState[id].stokBahanDec || 0;
    const total = fmt(p + bi + bd);

    text += `- ${item.nama} (${item.satuan}): ${total}\n`;
  });

  navigator.clipboard.writeText(text);
  alert("✅ Semua stok berhasil dicopy");
};

/* ===============================
   COPY REQUEST SAJA
=============================== */
document.getElementById("copyRequestStock").onclick = () => {
  let text = `📊 REQUEST BAHAN\n🗓️ ${getTanggalID()}\n\n`;
  let ada = false;

  STOK_ITEMS.forEach(item => {
    const id = item.id;
    const p = stokState[id].persediaan || 0;
    const bi = stokState[id].stokBahanInt || 0;
    const bd = stokState[id].stokBahanDec || 0;
    const total = fmt(p + bi + bd);

    if (total < item.rata) {
      const req = fmt(item.rata - total);
      text += `- ${item.nama} (${item.satuan}): ${req}\n`;
      ada = true;
    }
  });

  if (!ada) {
    text += "Semua stok aman ✅";
  }

  navigator.clipboard.writeText(text);
  alert("🚨 Request stok berhasil dicopy");
};












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
// SALDO AKHIR
// =========================================================
const saldoAkhirInput = document.getElementById("saldoAkhirInput");
const saveSaldoAkhirBtn = document.getElementById("saveSaldoAkhir");
const dashboardSaldoAkhirEl =
  document.getElementById("saldoAkhir") ||
  document.getElementById("dashboardSaldoAkhir");

// Ambil saldo akhir yang tersimpan
const savedSaldoAkhir = localStorage.getItem("saldoAkhir");

if (savedSaldoAkhir !== null && saldoAkhirInput) {
  saldoAkhirInput.value = savedSaldoAkhir;

  if (dashboardSaldoAkhirEl) {
    dashboardSaldoAkhirEl.textContent =
      " " + Number(savedSaldoAkhir).toLocaleString("id-ID");
  }
}

// Simpan saldo akhir
if (saveSaldoAkhirBtn) {
  saveSaldoAkhirBtn.addEventListener("click", () => {
    const val = saldoAkhirInput.value.trim();
    const num = val === "" ? 0 : Number(val);

    localStorage.setItem("saldoAkhir", String(num));

    if (dashboardSaldoAkhirEl) {
      dashboardSaldoAkhirEl.textContent = 
        " " + num.toLocaleString("id-ID");
    }

    updateDashboard();
    alert("Saldo Akhir disimpan!");
  });
}


  // =========================================================
  // INIT
  // =========================================================
  updateDashboard();
  renderPengeluaran();

}); // END DOMContentLoaded




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
        <td style="text-align:right; font-weight:bold; color:#d62828"> ${item.jumlah.toLocaleString()}</td>
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
//  NAVIGASI (FINAL — SIDEBAR KANAN)
// ===========================================================

function openPage(pageId) {
  // reset state UI
  document.body.classList.remove("sidebar-open");

  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.style.right = "-260px";

  // ganti halaman
  document.querySelectorAll(".page").forEach(p =>
    p.classList.remove("active")
  );

  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add("active");
    localStorage.setItem("lastPage", pageId);
  }

  // set icon aktif
  setActiveNav(pageId);

  // ===============================
  // 🔥 KHUSUS HALAMAN MENU (POS)
  // ===============================
  if (pageId === "pointofsales" || pageId === "transaksi") {
    // selalu scroll ke atas
    target.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (typeof updateCartBottomBar === "function")

    // tampilkan cart jika ada item
    updateCartBottomBar();
  }
}



function toggleMenu(forceClose = false) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const isOpen = sidebar.style.right === "24px";

  if (forceClose || isOpen) {
    sidebar.style.right = "-260px";
    document.body.classList.remove("sidebar-open");
  } else {
    sidebar.style.right = "24px";
    document.body.classList.add("sidebar-open");
  }
}

document.getElementById("sidebar-overlay")
  ?.addEventListener("click", () => toggleMenu(true));


function setActiveNav(pageId) {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  const activeBtn = document.querySelector(
    `.nav-btn[data-page="${pageId}"]`
  );

  if (activeBtn) activeBtn.classList.add("active");
}










// ===========================================================
//  DASHBOARD FINAL
// ===========================================================
function updateDashboard() {
  const saldoAwal = Number(localStorage.getItem("saldoAwal")) || 0;
  const saldoAkhir = Number(localStorage.getItem("saldoAkhir")) || 0;

  const pengeluaranData = JSON.parse(localStorage.getItem("pengeluaranData") || "[]");
  const salesData = JSON.parse(localStorage.getItem("salesData") || "[]");

  // 1. Hitung total pengeluaran
  const totalPengeluaran = pengeluaranData.reduce((s, i) => s + (i.jumlah || 0), 0);

  // 2. Hitung pemasukan (Tunai saja)
  let totalPemasukan = 0;
  salesData.forEach(tx => {
    if (tx.payMethod === "Tunai") {
      const total = tx.totalSetelahDiskon || tx.total;
      totalPemasukan += total;
    }
  });

  // 3. Pendapatan = saldo akhir - saldo awal + pengeluaran
  const pendapatan = saldoAkhir - saldoAwal + totalPengeluaran;

  // 4. Selisih = pemasukan - pendapatan
  const selisih = totalPemasukan - pendapatan;

  // UPDATE UI
  const ids = {
    saldoAwal: saldoAwal,
    pemasukan: totalPemasukan,
    pengeluaran: totalPengeluaran,
    saldoAkhir: saldoAkhir,
    pendapatan: pendapatan,
    selisih: selisih
  };

  for (const [id, val] of Object.entries(ids)) {
    const el = document.getElementById(id);
    if (el) el.textContent = " " + val.toLocaleString("id-ID");
  }
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
    let laporan = `📊 LAPORAN KAS\n🗓️ ${tanggalLengkap}\n\n`;

    const map = [
      ["Saldo Awal", "saldoAwal"],
      ["Pemasukan", "pemasukan"],
      ["Pengeluaran", "pengeluaran"],
      ["Saldo Akhir", "saldoAkhir"],
      ["Pendapatan", "pendapatan"],
      ["Selisih (+/-)", "selisih"]
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





/* =====================================================
   POS — SALES — STAFF (FINAL STABLE)
===================================================== */

(function () {

  /* -----------------------------------------------
     SAMPLE MENU
  ------------------------------------------------ */
  const defaultMenu = [
    { id: 'r1', name: 'Choco Cheese', price: 15000, img: 'img/chococheese.jpeg' },
    { id: 'r2', name: 'Cookies n Cream', price: 15000, img: 'img/cookiesncream.jpeg' },
    { id: 'r3', name: 'Choco Crunchy', price: 15000, img: 'img/chococrunchy.jpeg' },
    { id: 'r4', name: 'Tiramisu Caramel', price: 15000, img: 'img/tiramisucaramel.jpeg' },
    { id: 'r5', name: 'Greentea Matcha', price: 15000, img: 'img/greenteamatcha.jpeg' },
    { id: 'r6', name: 'Red Velvet Cream', price: 15000, img: 'img/redvelvetcream.jpeg' },
    { id: 'r7', name: 'Choco Caramel', price: 15000, img: 'img/chococaramel.jpeg' },
    { id: 'r8', name: 'Vanilla Cheese', price: 15000, img: 'img/vanillacheese.jpeg' },
    { id: 'r9', name: 'Strawberry Cheese', price: 15000, img: 'img/strawberrycheese.jpeg' },
    { id: 'r10', name: 'Choco Peanuts', price: 15000, img: 'img/chocopeanuts.jpeg' },
    { id: 'r11', name: 'Ice Chocolate', price: 10000, img: 'img/icechocolate.jpeg' },
    { id: 'r12', name: 'Ice Milo', price: 10000, img: 'img/icemilo.jpeg' },
    { id: 'r13', name: 'Ice Vanilla Latte', price: 10000, img: 'img/icevanillalatte.jpeg' },
    { id: 'r14', name: 'Ice Red Velvet', price: 10000, img: 'img/iceredvelvet.jpeg' },
    { id: 'r15', name: 'Ice Taro', price: 10000, img: 'img/icetaro.jpeg' },
    { id: 'r16', name: 'Ice Green Tea', price: 10000, img: 'img/icegreentea.jpeg' },
    { id: 'r17', name: 'Ice Lychee Tea', price: 10000, img: 'img/icelycheetea.jpeg' },
    { id: 'r18', name: 'Ice Blackcurrant', price: 10000, img: 'img/iceblackcurrant.jpeg' },
    { id: 'r19', name: 'Ice Lemon Tea', price: 8000, img: 'img/icelemontea.jpeg' },
    { id: 'r20', name: 'Ice Americano', price: 8000, img: 'img/iceamericano.jpeg' },
  ];

  let menuData = defaultMenu;
  let cart = JSON.parse(localStorage.getItem("cartSession") || "[]");

  /* STAFF */
  const defaultStaff =
    JSON.parse(localStorage.getItem("staffList") || "null") || [
      "CREW 1 - RAMA",
      "CREW 2 - ????",
      "CREW 3 - ????",
    ];
  localStorage.setItem("staffList", JSON.stringify(defaultStaff));


  /* =====================================================
        RENDER MENU POS
  ===================================================== */
  function renderPOSMenu() {
    const wrap = document.getElementById("posMenu");
    if (!wrap) return;

    wrap.innerHTML = "";

    menuData.forEach(item => {
      const card = document.createElement("div");
      card.className = "pos-item";
      card.dataset.id = item.id;

      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="name">${item.name}</div>
        <div class="price">${item.price.toLocaleString()}</div>
      `;

      card.addEventListener("click", () => addToCart(item.id, 1));
      wrap.appendChild(card);
    });
  }


  /* =====================================================
        ADD / REMOVE / UPDATE CART
  ===================================================== */
  function addToCart(id, qty = 1) {
    const item = menuData.find(m => m.id === id);
    if (!item) return;

    const exist = cart.find(c => c.id === id);

    if (exist) {
      exist.qty += qty;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        qty
      });
    }

    localStorage.setItem("cartSession", JSON.stringify(cart));
    renderCart();
    updateCartBottomBar();
  }


  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cartSession", JSON.stringify(cart));
    renderCart();
    updateCartBottomBar();
  }

  function updateQty(id, qty) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.qty = qty;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }

    localStorage.setItem("cartSession", JSON.stringify(cart));
    renderCart();
    updateCartBottomBar();
  }


  

/* =====================================================
   CART FUNCTIONS — FINAL STABLE (NO BEHAVIOR CHANGE)
===================================================== */

// asumsi cart GLOBAL sudah ada
// let cart = JSON.parse(localStorage.getItem("cartSession")) || [];

/* =========================
   RENDER CART
========================= */
function renderCart() {
  const wrap = document.getElementById("cartList");
  if (!wrap) return;

  if (cart.length === 0) {
    wrap.innerHTML = "<p>Keranjang kosong.</p>";
    updateTotal();
    updateCartBottomBar();
    return;
  }

  let html = "";

  cart.forEach((c, i) => {
    html += `
      <div class="cart-item">
        <div class="ci-row">
          <span class="ci-label">Item</span>
          <span class="ci-value">${c.name}</span>
        </div>

        <div class="ci-row">
          <span class="ci-label">Qty</span>
          <span class="ci-value">${c.qty}</span>
        </div>

        <div class="ci-row">
          <span class="ci-label">Subtotal</span>
          <span class="ci-value">${(c.qty * c.price).toLocaleString()}</span>
        </div>

        <div class="ci-actions">
          <button class="qty-btn" data-i="${i}" data-act="dec">-</button>
          <button class="qty-btn" data-i="${i}" data-act="inc">+</button>
          <button class="delete-btn" data-i="${i}" data-act="rm">x</button>
        </div>
      </div>
    `;
  });

  wrap.innerHTML = html;

  wrap.querySelectorAll(".qty-btn, .delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.i);
      const act = btn.dataset.act;

      if (!cart[i]) return;

      if (act === "inc") cart[i].qty++;
      if (act === "dec") {
        cart[i].qty--;
        if (cart[i].qty <= 0) cart.splice(i, 1);
      }
      if (act === "rm") cart.splice(i, 1);

      localStorage.setItem("cartSession", JSON.stringify(cart));
      renderCart();
    });
  });

  updateTotal();
  updateCartBottomBar();
}

/* =========================
   CART BOTTOM BAR
========================= */
function updateCartBottomBar() {
  const bar   = document.getElementById("cartBottomBar");
  const count = document.getElementById("cartCount");
  const total = document.getElementById("cartBottomTotal");

  if (!bar || !count || !total) return;

  if (cart.length === 0) {
    bar.style.display = "none";
    return;
  }

  bar.style.display = "flex";

  const qtyTotal   = cart.reduce((s, i) => s + i.qty, 0);
  const hargaTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  count.textContent = qtyTotal + " Menu";
  total.textContent = hargaTotal.toLocaleString("id-ID");
}

/* =========================
   CLICK CART BOTTOM BAR — FINAL FIX
========================= */
document.addEventListener("click", function (e) {
  const cartBar = e.target.closest(".cart-bottom-bar");
  if (!cartBar) return;

  // 🔥 JANGAN ganggu tombol checkout
  if (e.target.closest("#checkoutBtn")) return;

  // 🔥 JANGAN buka cart kalau sudah di halaman cart
  const cartPage = document.getElementById("cart");
  if (cartPage && cartPage.classList.contains("active")) return;

  openCart();
});




function openCart() {
  openPage("cart");

  // 🔥 tunggu browser render halaman cart
  requestAnimationFrame(() => {
    renderCart();
    updateCartBottomBar();
  });
}



  /* =====================================================
        TOTAL, BAYAR, KEMBALIAN
  ===================================================== */
  function updateTotal() {
    const total = cart.reduce((s, i) => s + i.qty * i.price, 0);

    const totalEl = document.getElementById("cartTotal");
    const inputEl = document.getElementById("uangBayarInput");
    const selectEl = document.getElementById("uangBayarSelect");
    const kembaliEl = document.getElementById("kembalian");

    if (totalEl) totalEl.textContent = total.toLocaleString();

    let bayar = 0;
    if (selectEl && selectEl.value !== "") bayar = parseInt(selectEl.value);
    else if (inputEl && inputEl.value !== "") bayar = parseInt(inputEl.value);

    if (isNaN(bayar)) bayar = 0;

    const kembali = Math.max(0, bayar - total);
    if (kembaliEl) kembaliEl.textContent = kembali.toLocaleString();
  }




/* =====================================================
   CHECKOUT — FINAL SAFE VERSION
===================================================== */
function checkout() {


  if (!Array.isArray(cart) || cart.length === 0) {
    alert("Keranjang kosong!");
    return;
  }

  const now = new Date();

  // =========================
  // HITUNG TOTAL SEKALI SAJA
  // =========================
  const totalBelanja = cart.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  // =========================
  // BUAT RECORD TRANSAKSI
  // =========================
  const record = {
    id: Date.now(),

    // fallback aman jika function belum ada
    code:
      typeof getTodayOrderNumber === "function"
        ? getTodayOrderNumber()
        : "ORD-" + Date.now(),

    name: document.getElementById("custName")?.value || "Leonesta",
    gen: document.getElementById("custGen")?.value || "Gen Z",

    items: JSON.parse(JSON.stringify(cart)), // deep copy aman

    total: totalBelanja,

    // ⭐ FIELD WAJIB UNTUK DASHBOARD
    payMethod: "Tunai",
    payBayar: 0,
    totalSetelahDiskon: totalBelanja,

    date: now.toISOString(),
    time: now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    })
  };

  // =========================
  // SIMPAN KE SALES DATA
  // =========================
  const sales = JSON.parse(localStorage.getItem("salesData")) || [];
  sales.push(record);
  localStorage.setItem("salesData", JSON.stringify(sales));

  // =========================
  // UPDATE DASHBOARD (SAFE)
  // =========================
  if (typeof updateDashboard === "function") {
    updateDashboard();
  }

  // =========================
  // RESET CART TOTAL
  // =========================
  cart.length = 0; // lebih aman daripada cart = []
  localStorage.removeItem("cartSession");

  renderCart();
  updateCartBottomBar();

  // =========================
  // PINDAH KE TRANSAKSI
  // =========================
  openPage("transaksi");

  if (typeof renderTransactionHistory === "function") {
    renderTransactionHistory();
  }
}

/* =========================
   EVENT LISTENERS (FINAL)
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", checkout);
  }
});



/* =====================================================
   INITIAL LOAD — FINAL SAFE
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // POS
  if (typeof renderPOSMenu === "function") renderPOSMenu();
  renderCart();

  // INPUT BAYAR
  const inputEl  = document.getElementById("uangBayarInput");
  const selectEl = document.getElementById("uangBayarSelect");

  if (inputEl)  inputEl.addEventListener("input", updateTotal);
  if (selectEl) selectEl.addEventListener("change", updateTotal);

  // CHECKOUT
  document
    .getElementById("checkoutBtn")
    ?.addEventListener("click", checkout);

  // CLEAR CART
  document
    .getElementById("clearCartBtn")
    ?.addEventListener("click", () => {
      if (!cart.length) return;

      if (confirm("Kosongkan keranjang?")) {
        cart.length = 0; // 🔥 lebih aman
        localStorage.removeItem("cartSession");
        renderCart();
        updateCartBottomBar();
      }
    });

  // STAFF & TRANSAKSI
  if (typeof populateStaff === "function") populateStaff();
  if (typeof renderTransactionHistory === "function") {
    renderTransactionHistory();
  }
});

/* =====================================================
   FLOATING BACK BUTTON — SAFE
===================================================== */
document.addEventListener("click", function (e) {
  const backBtn = e.target.closest("#floatingBackBtn");
  if (!backBtn) return;

  openPage("pointofsales");
  updateCartBottomBar();
});







/* =====================================================
   STAFF SELECT OPTION — FINAL
===================================================== */
function populateStaff() {
  const sel = document.getElementById("posPetugas");
  if (!sel) return;

  const arr = JSON.parse(localStorage.getItem("staffList") || "[]");

  // jika belum ada staff, beri placeholder
  if (arr.length === 0) {
    sel.innerHTML = `<option value="">-- Pilih Petugas --</option>`;
    return;
  }

  sel.innerHTML = arr
    .map(name => `<option value="${name}">${name}</option>`)
    .join("");
}

/* =====================================================
   BACK TO MENU BUTTON — FINAL (SPA FRIENDLY)
===================================================== */
document.addEventListener("click", function (e) {
  const backBtn = e.target.closest("#backToMenuBtn");
  if (!backBtn) return;

  // kembali ke halaman POS / Menu
  openPage("pointofsales");

  // pastikan bottom cart tetap sinkron
  updateCartBottomBar();
});






/* ====================== HALAMAN TRANSAKSI ====================== */
// ====== AUTO NUMBER RB ======
function getTodayOrderNumber() {
  const today = new Date().toISOString().slice(0,10);
  const key = "orderCounter_" + today;

  let num = parseInt(localStorage.getItem(key) || "0") + 1;
  localStorage.setItem(key, num);

  return "RB " + String(num).padStart(3, "0");
}


// ====== FORMAT TANGGAL ======
function formatTanggal(tglISO) {
  const d = new Date(tglISO);
  const hari = String(d.getDate()).padStart(2, "0");
  const bulan = String(d.getMonth() + 1).padStart(2, "0");
  const tahun = d.getFullYear();
  return `${hari}.${bulan}.${tahun}`;
}





// =========================================================
// togglePayment: ganti metode pembayaran, hitung diskon,
// sembunyikan/tampilkan dropdown di kartu yang sedang aktif
// =========================================================
function togglePayment(btn, tx, data, card) {
  const current = btn.dataset.method || tx.payMethod || "Tunai";
  const next = current === "Tunai" ? "QRIS" : "Tunai";

  // --- Update UI tombol segera ---
  btn.dataset.method = next;
  btn.textContent = next;
  btn.classList.toggle("pay-tunai", next === "Tunai");
  btn.classList.toggle("pay-qris", next === "QRIS");

  // --- Update data model ---
  tx.payMethod = next;
  // reset pilihan bayar ketika metode berubah
  tx.payBayar = 0;

  // Elemen pada kartu saat ini
  const paySelect = card.querySelector(".tx-pay-select");
  const kembaliEl = card.querySelector(".tx-kembalian");
  const totalEl = card.querySelector(".tx-total");

  // Hitung diskon (QRIS => -2000 bila total >= 20000)
  let totalSetelahDiskon = tx.total;
  if (next === "QRIS" && tx.total >= 20000) {
    totalSetelahDiskon = tx.total - 2000;
  }

  tx.totalSetelahDiskon = totalSetelahDiskon;

  // --- Update tampilan pada kartu sekarang ---
  if (totalEl) totalEl.textContent = totalSetelahDiskon.toLocaleString();

  // Sembunyikan / tampilkan dropdown sesuai metode
  if (paySelect) {
    if (next === "QRIS") {
      paySelect.style.display = "none";
      paySelect.value = "";
    } else {
      // pastikan tampil lagi untuk Tunai
      paySelect.style.display = "inline-block";
      paySelect.value = tx.payBayar || "";
    }
  }

  // reset kembalian di kartu sekarang
  if (kembaliEl) kembaliEl.textContent = "";

  // --- Simpan permanen & langsung render ulang untuk konsistensi ---
  localStorage.setItem("salesData", JSON.stringify(data));
  updateDashboard();


  // render ulang supaya semua kartu mencerminkan state terbaru
  renderTransactionHistory();
}



// =========================================================
// renderTransactionHistory: saat build DOM, pastikan
// dropdown dan total mengikuti tx.payMethod sehingga
// kondisi bertahan setelah refresh
// =========================================================
function renderTransactionHistory() {
  const wrap = document.getElementById("transactionList");
  const template = document.getElementById("txCardTemplate");
  if (!wrap || !template) return;

  const data = JSON.parse(localStorage.getItem("salesData")) || [];
  wrap.innerHTML = "";

  if (data.length === 0) {
    wrap.innerHTML = "<p>Belum ada transaksi.</p>";
    return;
  }

  // tampilkan terbaru di atas
  data.slice().reverse().forEach(tx => {
    const card = template.content.cloneNode(true);

    // Header
    card.querySelector(".tx-code").textContent = tx.code;
    card.querySelector(".tx-name").textContent = tx.name;
    card.querySelector(".tx-gen").textContent = tx.gen;

    // === Warna nama berdasarkan nama ===
    const nameEl = card.querySelector(".tx-name");

    if (tx.name.toLowerCase() === "leonesta") {
      nameEl.style.color = "#FF2E8A";   // pink pekat
    }

    if (tx.name.toLowerCase() === "leonardo") {
      nameEl.style.color = "#0066FF";   // biru pekat
    }


    // Items
    const itemsContainer = card.querySelector(".tx-items");
    itemsContainer.innerHTML = tx.items.map(i => `
      <div class="tx-item">
        <div class="tx-qty">${i.qty}x</div>
        <div class="tx-name-item">${i.name}</div>
        <div class="tx-price">${(i.qty * i.price).toLocaleString()}</div>
      </div>
    `).join("");

    // Hitung total awal (jika sebelumnya disimpan totalSetelahDiskon gunakan itu)
    let totalSetelahDiskon = typeof tx.totalSetelahDiskon !== "undefined" ? tx.totalSetelahDiskon : tx.total;
    // Jika belum ada saved totalSetelahDiskon tapi payMethod QRIS, hitung sekarang
    if ((tx.payMethod === "QRIS") && (typeof tx.totalSetelahDiskon === "undefined")) {
      totalSetelahDiskon = tx.total >= 20000 ? tx.total - 2000 : tx.total;
      tx.totalSetelahDiskon = totalSetelahDiskon;
      // simpan agar persist
      // (we will save whole array below once per render to avoid many writes)
    }

    // Tampilkan total
    const totalEl = card.querySelector(".tx-total");
    if (totalEl) totalEl.textContent = (totalSetelahDiskon || 0).toLocaleString();

    // Tanggal
    card.querySelector(".tx-date").textContent =
      `${formatTanggal(tx.date)} • ${tx.time || "--:--"}`;

    // ===== tombol payment (toggle) =====
    const btn = card.querySelector(".payToggleBtn");
    const method = tx.payMethod || "Tunai";
    btn.dataset.method = method;
    btn.textContent = method;
    // reset classes then add proper class
    btn.classList.remove("pay-tunai", "pay-qris");
    btn.classList.add(method === "Tunai" ? "pay-tunai" : "pay-qris");

    // Pasang event: pass card supaya kita bisa update DOM langsung
    btn.addEventListener("click", () => togglePayment(btn, tx, data, card));

    // ============================ DELETE BUTTON ============================
    const deleteBtn = card.querySelector(".deleteTxBtn");
    deleteBtn.addEventListener("click", () => {
      const ok = confirm(`Hapus transaksi ${tx.code}?`);
      if (ok) deleteTransaction(tx.id);
    });

    // ======================== DROPDOWN BAYAR ================================
    const paySelect = card.querySelector(".tx-pay-select");
    const kembaliEl = card.querySelector(".tx-kembalian");

    // Pastikan dropdown terlihat atau tidak sesuai metode yang tersimpan
    if (paySelect) {
      if (method === "QRIS") {
        paySelect.style.display = "none";
        paySelect.value = "";
      } else {
        paySelect.style.display = "inline-block";
        // restore pilihan bayar kalau ada
        if (tx.payBayar) paySelect.value = tx.payBayar;
        else paySelect.value = "";
      }
    }

    // function update kembalian untuk perubahan dropdown
    function updateKembalian() {
      const totalToUse = tx.totalSetelahDiskon ?? tx.total;
      const bayar = parseInt(paySelect?.value || 0);
      const kembali = bayar - (totalToUse || 0);
      if (kembaliEl) {
        kembaliEl.textContent = kembali > 0 ? `Kembalian: ${kembali.toLocaleString()}` : "";
      }
    }

    if (paySelect) {
      paySelect.addEventListener("change", () => {
        tx.payBayar = parseInt(paySelect.value) || 0;
        // simpan perubahan
        localStorage.setItem("salesData", JSON.stringify(data));
        updateDashboard();

        updateKembalian();
      });
    }

    // tampilkan kembalian pada load (jika ada)
    updateKembalian();

    // Masukkan kartu ke list
    wrap.appendChild(card);
  });

  // pastikan perubahan computed (mis. totalSetelahDiskon) tersimpan setelah loop
  localStorage.setItem("salesData", JSON.stringify(data));
}





function deleteTransaction(id) {
  const data = JSON.parse(localStorage.getItem("salesData")) || [];
  const filtered = data.filter(tx => tx.id !== id);

  localStorage.setItem("salesData", JSON.stringify(filtered));
  updateDashboard();


  renderTransactionHistory();
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

  document.querySelectorAll(".page").forEach(p =>
    p.classList.remove("active")
  );

  document.getElementById("beranda")?.classList.add("active");
}





})();


