// =====================================================
// 📅 TODAY (ANTI ERROR TIMEZONE)
// =====================================================
const now = new Date();
const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 10);


// =====================================================
// 🎛️ TAB SYSTEM
// =====================================================
const saldoBtn = document.getElementById("saldoBtn");
const inputBtn = document.getElementById("inputBtn");

const saldoContent = document.getElementById("saldoContent");
const inputContent = document.getElementById("inputContent");

function setActiveTab(type) {
  if (!saldoBtn || !inputBtn) return;

  if (type === "saldo") {
    saldoBtn.classList.add("active");
    inputBtn.classList.remove("active");

    saldoContent.style.display = "block";
    inputContent.style.display = "none";
  } else {
    inputBtn.classList.add("active");
    saldoBtn.classList.remove("active");

    inputContent.style.display = "block";
    saldoContent.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  saldoBtn?.addEventListener("click", () => setActiveTab("saldo"));
  inputBtn?.addEventListener("click", () => setActiveTab("input"));
  if (window.location.pathname.includes("dashboard")) {
  setActiveTab("saldo");
}
});


// =====================================================
// 🔥 FIREBASE
// =====================================================
import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// =====================================================
// 📦 STATE
// =====================================================
let saldoAwalVal = 0;
let saldoAkhirVal = 0;
let pemasukanVal = 0;
let pengeluaranVal = 0;

let penjualan = [];
let transaksi = [];


// =====================================================
// 💰 FORMAT INPUT
// =====================================================
function formatInput(el) {
  if (!el) return;

  el.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    e.target.value = new Intl.NumberFormat("id-ID").format(value);
  });
}

formatInput(document.getElementById("saldoAwalInput"));
formatInput(document.getElementById("saldoAkhirInput"));


// =====================================================
// 💾 SIMPAN SALDO
// =====================================================
async function saveSaldo() {

  const saldoAwal =
    parseInt(document.getElementById("saldoAwalInput")?.value.replace(/\./g, "")) || 0;

  const saldoAkhir =
    parseInt(document.getElementById("saldoAkhirInput")?.value.replace(/\./g, "")) || 0;

  await setDoc(doc(db, "saldo", today), {
    saldoAwal,
    saldoAkhir,
    tanggal: today,
    updatedAt: serverTimestamp()
  });

  showToast("Saldo tersimpan");
}

document.getElementById("saveSaldoBtn")?.addEventListener("click", saveSaldo);
document.getElementById("saveSaldoAkhirBtn")?.addEventListener("click", saveSaldo);


// =====================================================
// 🔄 REALTIME SALDO
// =====================================================
onSnapshot(doc(db, "saldo", today), (snap) => {

  if (!snap.exists()) {
    saldoAwalVal = 0;
    saldoAkhirVal = 0;
  } else {
    const data = snap.data();
    saldoAwalVal = data.saldoAwal || 0;
    saldoAkhirVal = data.saldoAkhir || 0;
  }

  document.getElementById("saldoAwal").textContent =
    saldoAwalVal.toLocaleString("id-ID");

  document.getElementById("saldoAkhir").textContent =
    saldoAkhirVal.toLocaleString("id-ID");

  updateSummary();
});


// =====================================================
// 🔄 REALTIME DATA (HARI INI)
// =====================================================
const qTodayPenjualan = query(
  collection(db, "penjualan"),
  where("tanggal", "==", today)
);

onSnapshot(qTodayPenjualan, (snapshot) => {
  penjualan = snapshot.docs.map(doc => doc.data());
  hitungPemasukan();
});

const qTodayTransaksi = query(
  collection(db, "transaksi"),
  where("tanggal", "==", today)
);

onSnapshot(qTodayTransaksi, (snapshot) => {
  transaksi = snapshot.docs.map(doc => doc.data());
  hitungPengeluaran();
});




// =====================================================
// 💰 HITUNG
// =====================================================
function hitungPemasukan() {

  const total = penjualan
    .filter(item => (item.metode || "").toLowerCase() === "tunai")
    .reduce((sum, item) => sum + (item.total || 0), 0);

  pemasukanVal = total;

  document.getElementById("pemasukanValue").textContent =
    total.toLocaleString("id-ID");

  updateSummary();
}

function hitungPengeluaran() {
  const total = transaksi.reduce((sum, item) => sum + (item.nominal || 0), 0);
  pengeluaranVal = total;
  document.getElementById("pengeluaranValue").textContent =
    total.toLocaleString("id-ID");
  updateSummary();
}


// =====================================================
// 📊 SUMMARY
// =====================================================
function updateSummary() {

  const pendapatan = pemasukanVal - pengeluaranVal;
  const selisih = (saldoAkhirVal - saldoAwalVal) - pendapatan;

  document.getElementById("pendapatan").textContent =
    "Rp " + pendapatan.toLocaleString("id-ID");

  const selisihEl = document.getElementById("selisih");

  const sign = selisih >= 0 ? "+" : "-";

  selisihEl.textContent =
    sign + "Rp " + Math.abs(selisih).toLocaleString("id-ID");

  selisihEl.style.color =
    selisih >= 0 ? "#2ecc71" : "#e74c3c";
}


// =====================================================
// 📤 KIRIM LAPORAN
// =====================================================
document.getElementById("kirimLaporanBtn")?.addEventListener("click", async () => {

  const pendapatan = pemasukanVal - pengeluaranVal;
  const selisih = (saldoAkhirVal - saldoAwalVal) - pendapatan;

  await addDoc(collection(db, "laporan"), {
    tanggal: today,
    saldoAwal: saldoAwalVal,
    saldoAkhir: saldoAkhirVal,
    pemasukan: pemasukanVal,
    pengeluaran: pengeluaranVal,
    pendapatan,
    selisih,
    createdAt: serverTimestamp()
  });

  showToast("Laporan terkirim");
});



// =====================================================
// 📊 CHART RIWAYAT PENJUALAN
// =====================================================
let chart;

Chart.defaults.font.family =
  "Roboto, sans-serif";

Chart.defaults.color = "#333";

function updateChart() {

  // 🔥 ambil 7 hari terbaru
  const dataChart =
    [...semuaLaporanLaba]
      .sort((a, b) =>
        new Date(a.tanggal) -
        new Date(b.tanggal)
      )
      .slice(-7);

  const labels =
    dataChart.map(item => {

      const d =
        new Date(item.tanggal);

return String(d.getDate()).padStart(2, "0");

    });

  const values =
    dataChart.map(item =>
      item.total || 0
    );

  const ctx =
    document.getElementById(
      "chartKeuangan"
    );

  if (!ctx) return;

  if (chart) chart.destroy();

  chart = new Chart(ctx, {

    type: "bar",

    data: {

      labels,

      datasets: [

        {

          data: values,

          backgroundColor:
            "rgba(46, 204, 113, 0.7)",

          borderRadius: 2

        }

      ]

    },

    options: {

      responsive: true,

      plugins: {

        legend: {
          display: false
        }

      },

      scales: {

        x: {

          grid: {
            display: false
          }

        },

        y: {

          beginAtZero: true,

          grid: {
            display: false
          }

        }

      }

    }

  });

}



// =====================================================
// 📜 RIWAYAT LAPORAN (REALTIME)
// =====================================================
const riwayatEl = document.getElementById("riwayatLaporan");

const qLaporan = query(
  collection(db, "laporan"),
  orderBy("createdAt", "desc")
);

onSnapshot(qLaporan, (snapshot) => {

  if (!riwayatEl) return;

  riwayatEl.innerHTML = "";

  snapshot.forEach((doc) => {

    const data = doc.data();

    const waktu = data.createdAt?.toDate
      ? data.createdAt.toDate().toLocaleString("id-ID")
      : "-";

    const div = document.createElement("div");

    div.classList.add("laporan-card");

    div.innerHTML = `
  <div class="laporan-date">${waktu}</div>

  <div class="laporan-row laporan-akhir">
    <span class="laporan-label">Saldo Akhir</span>
    <span class="laporan-value">
      Rp ${(data.saldoAkhir || 0).toLocaleString("id-ID")}
    </span>
  </div>

  <div class="laporan-row laporan-awal">
    <span class="laporan-label">Saldo Awal</span>
    <span class="laporan-value">
      Rp ${(data.saldoAwal || 0).toLocaleString("id-ID")}
    </span>
  </div>

  <div class="laporan-divider"></div>

  <div class="laporan-row">
    <span class="laporan-label">Pemasukan</span>
    <span class="laporan-value pemasukan">
      + Rp ${(data.pemasukan || 0).toLocaleString("id-ID")}
    </span>
  </div>

  <div class="laporan-row">
    <span class="laporan-label">Pengeluaran</span>
    <span class="laporan-value pengeluaran">
      - Rp ${(data.pengeluaran || 0).toLocaleString("id-ID")}
    </span>
  </div>

  <div class="laporan-row">
    <span class="laporan-label">Pendapatan</span>
    <span class="laporan-value">
      Rp ${(data.pendapatan || 0).toLocaleString("id-ID")}
    </span>
  </div>

  <div class="laporan-row">
    <span class="laporan-label">Selisih</span>
    <span class="laporan-value ${data.selisih >= 0 ? "plus" : "minus"}">
      ${data.selisih >= 0 ? "+" : "-"} Rp ${Math.abs(data.selisih || 0).toLocaleString("id-ID")}
    </span>
  </div>
`;

    riwayatEl.appendChild(div);
  });

});




// =====================================================
// 📈 RIWAYAT PENJUALAN
// =====================================================

const riwayatPenjualanList =
  document.getElementById("riwayatPenjualanList");

const filterBtn =
  document.getElementById("filterBtn");

const filterDropdown =
  document.getElementById("filterDropdown");

const filterRange =
  document.getElementById("filterRange");

const filterText =
  document.querySelector(".filter-text");

let semuaLaporanLaba = [];


/* =========================
   FORMAT TANGGAL
========================= */
function formatTanggal(tanggal) {

  const d = new Date(tanggal);

  const day =
    String(d.getDate()).padStart(2, "0");

  const month =
    String(d.getMonth() + 1).padStart(2, "0");

  const year =
    d.getFullYear();

  return `${day}.${month}.${year}`;

}


/* =========================
   RENDER LIST
========================= */
function renderRiwayatPenjualan(data) {

  if (!riwayatPenjualanList) return;

  riwayatPenjualanList.innerHTML = "";

  if (!data.length) {

    riwayatPenjualanList.innerHTML = `
      <div class="empty-riwayat">
        Tidak ada data
      </div>
    `;

    // 🔥 reset rata rata
    updateRataRata([]);

    return;

  }

  data.forEach(item => {

    riwayatPenjualanList.innerHTML += `

    <div class="riwayat-item">

      <span class="tanggal ${getHariClass(item.tanggal)}">
        ${formatTanggal(item.tanggal)}
      </span>

      <span class="average-box">
        Rp ${(item.rataRataPerBox || 0)
          .toLocaleString("id-ID")}
      </span>

      <strong class="nominal">
        Rp ${item.total.toLocaleString("id-ID")}
      </strong>

    </div>

    `;

  });

  // 🔥 UPDATE RATA RATA
  updateRataRata(data);

}


/* =========================
   REALTIME FIREBASE
========================= */

onSnapshot(
  collection(db, "laporanLaba"),
  (snapshot) => {

    semuaLaporanLaba = [];

    snapshot.forEach(doc => {

      const data = doc.data();

    semuaLaporanLaba.push({

      tanggal: doc.id,
      total: data.total || 0,
      rataRataPerBox:
        data.rataRataPerBox || 0

    });

    });

    // 🔥 terbaru di atas
    semuaLaporanLaba.sort((a, b) =>
      new Date(b.tanggal) -
      new Date(a.tanggal)
    );

    // 🔥 default tampil 7 data terbaru
    const tujuhHariTerbaru =
      semuaLaporanLaba.slice(0, 7);

    renderRiwayatPenjualan(
      tujuhHariTerbaru
    );

    updateChart();

  }
);


/* =========================
   OPEN / CLOSE DROPDOWN
========================= */

filterBtn?.addEventListener(
  "click",
  (e) => {

    e.stopPropagation();

    filterDropdown?.classList.toggle(
      "show"
    );

  }
);


/* =========================
   CLOSE CLICK OUTSIDE
========================= */

document.addEventListener(
  "click",
  (e) => {

    if (
      filterBtn &&
      filterDropdown &&
      !filterBtn.contains(e.target) &&
      !filterDropdown.contains(e.target)
    ) {

      filterDropdown.classList.remove(
        "show"
      );

    }

  }
);

/* =========================
   RANGE CALENDAR
========================= */

flatpickr(filterRange, {

  mode: "range",

  dateFormat: "Y-m-d",

  onChange: function(selectedDates) {

// =========================
// RESET FILTER
// =========================
if (selectedDates.length === 0) {

  // 🔥 kembali ke 7 data terbaru
  const tujuhHariTerbaru =
    semuaLaporanLaba.slice(0, 7);

  renderRiwayatPenjualan(
    tujuhHariTerbaru
  );

  if (filterText) {

    filterText.textContent =
      "Filter";

  }

  return;

}

    // =========================
    // RANGE TERPILIH
    // =========================
    if (selectedDates.length === 2) {

      // 🔥 FORMAT LOCAL TANPA TIMEZONE
      function formatLocalDate(date) {

        const year =
          date.getFullYear();

        const month =
          String(date.getMonth() + 1)
            .padStart(2, "0");

        const day =
          String(date.getDate())
            .padStart(2, "0");

        return `${year}-${month}-${day}`;

      }

      // 🔥 FIX TIMEZONE
      const start =
        formatLocalDate(selectedDates[0]);

      const end =
        formatLocalDate(selectedDates[1]);

      // FILTER DATA
      const hasil =
        semuaLaporanLaba.filter(item => {

          return (
            item.tanggal >= start &&
            item.tanggal <= end
          );

        });

      renderRiwayatPenjualan(
        hasil
      );

      // UPDATE TEXT
      if (filterText) {

        filterText.textContent =
          `${formatTanggal(start)} - ${formatTanggal(end)}`;

      }

      // TUTUP DROPDOWN
      filterDropdown?.classList.remove(
        "show"
      );

    }

  }

});





/* =========================
   HITUNG RATA RATA
========================= */
function updateRataRata(data) {

  const rataRataEl =
    document.getElementById(
      "rataRataPenjualan"
    );

  if (!rataRataEl) return;

  // kosong
  if (!data.length) {

    rataRataEl.textContent =
      "Rp 0";

    return;
  }

  // total semua
  const total = data.reduce(
    (sum, item) =>
      sum + (item.total || 0),
    0
  );

  // rata rata
  const rata =
    Math.round(total / data.length);

  rataRataEl.textContent =
    "Rp " +
    rata.toLocaleString("id-ID");

}





/* =========================
   WARNA HARI
========================= */

function getHariClass(tanggal) {

  const d = new Date(tanggal);

  const hari = d.getDay();

  // =========================
  // LIBUR NASIONAL
  // =========================
  const hariLibur = [

    "2026-05-14", // Kenaikan Isa Almasih
    "2026-03-19", // nyepi contoh
    "2026-03-20", // idul fitri contoh
    "2026-03-21",

    "2026-12-25" // natal

  ];

  // hari raya
  if (hariLibur.includes(tanggal)) {
    return "hari-merah";
  }

  // minggu
  if (hari === 0) {
    return "hari-merah";
  }

  // sabtu
  if (hari === 6) {
    return "hari-sabtu";
  }

  return "";

}
