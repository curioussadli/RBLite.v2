import { db } from "./firebase.js";

import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =========================
   ELEMENT
========================= */

const shopeeInput =
  document.getElementById("shopeeInput");

const grabInput =
  document.getElementById("grabInput");

const gofoodInput =
  document.getElementById("gofoodInput");

const qrisInput =
  document.getElementById("qrisInput");

const cashInput =
  document.getElementById("cashInput");

const tanggalInput =
  document.getElementById("filterTanggal");

const saveLabaBtn =
  document.getElementById("saveLabaBtn");

const totalPenjualan =
  document.getElementById("totalPenjualan");

const laporanList =
  document.getElementById("laporanList");

/* =========================
   ARRAY INPUT
========================= */

const inputs = [
  shopeeInput,
  grabInput,
  gofoodInput,
  qrisInput,
  cashInput
];

/* =========================
   TODAY DEFAULT
========================= */

const now = new Date();

const today = new Date(
  now.getTime() - now.getTimezoneOffset() * 60000
)
  .toISOString()
  .slice(0, 10);

tanggalInput.value = today;

/* =========================
   FORMAT ANGKA
========================= */

function formatAngka(value) {

  return new Intl.NumberFormat("id-ID")
    .format(value || 0);

}

/* =========================
   AMBIL ANGKA
========================= */

function getNumber(value) {

  return Number(
    value.replace(/\./g, "")
  ) || 0;

}

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
   HITUNG TOTAL
========================= */

function hitungTotal() {

  let total = 0;

  inputs.forEach(input => {

    total += getNumber(input.value);

  });

  totalPenjualan.textContent =
    "Rp " + formatAngka(total);

}

/* =========================
   FORMAT INPUT
========================= */

inputs.forEach(input => {

  input.addEventListener("input", (e) => {

    let angka =
      e.target.value.replace(/\D/g, "");

    e.target.value =
      formatAngka(angka);

    hitungTotal();

  });

});

/* =========================
   LOAD DATA BY TANGGAL
========================= */

async function loadDataByTanggal(tanggal) {

  const docRef =
    doc(db, "laporanLaba", tanggal);

  const snap =
    await getDoc(docRef);

  if (!snap.exists()) {

    shopeeInput.value = "";
    grabInput.value = "";
    gofoodInput.value = "";
    qrisInput.value = "";
    cashInput.value = "";

    hitungTotal();

    return;
  }

  const data = snap.data();

  shopeeInput.value =
    data.shopeefood
      ? formatAngka(data.shopeefood)
      : "";

  grabInput.value =
    data.grabfood
      ? formatAngka(data.grabfood)
      : "";

  gofoodInput.value =
    data.grabfood
      ? formatAngka(data.grabfood)
      : "";

  gofoodInput.value =
    data.gofood
      ? formatAngka(data.gofood)
      : "";

  qrisInput.value =
    data.qris
      ? formatAngka(data.qris)
      : "";

  cashInput.value =
    data.cash
      ? formatAngka(data.cash)
      : "";

  // =========================
  // LOAD TERJUAL
  // =========================
  makananInput.value =
    data.makananTerjual || "";

  minumanInput.value =
    data.minumanTerjual || "";

  hitungTotal();

  updateTotalTerjual();

  hitungTotal();

}

/* =========================
   CHANGE TANGGAL
========================= */

tanggalInput.addEventListener(
  "change",
  () => {

    loadDataByTanggal(
      tanggalInput.value
    );

  }
);

/* =========================
   SIMPAN
========================= */

saveLabaBtn.addEventListener(
  "click",
  async () => {

    try {

      const tanggal =
        tanggalInput.value;

      if (!tanggal) {

        alert("Pilih tanggal");

        return;
      }

      const total =
        getNumber(shopeeInput.value) +
        getNumber(grabInput.value) +
        getNumber(gofoodInput.value) +
        getNumber(qrisInput.value) +
        getNumber(cashInput.value);

      await setDoc(
        doc(db, "laporanLaba", tanggal),
        {

          tanggal,

          shopeefood:
            getNumber(shopeeInput.value),

          grabfood:
            getNumber(grabInput.value),

          gofood:
            getNumber(gofoodInput.value),

          qris:
            getNumber(qrisInput.value),

          cash:
            getNumber(cashInput.value),

          total,

          createdAt:
            serverTimestamp()

        }
      );

      alert(
        "Laporan berhasil disimpan"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Gagal simpan data"
      );

    }

  }
);

/* =========================
   REALTIME RIWAYAT
========================= */

const q = query(
  collection(db, "laporanLaba"),
  orderBy("tanggal", "desc")
);

onSnapshot(q, (snapshot) => {

  laporanList.innerHTML = "";

  snapshot.forEach((docSnap) => {

    const item =
      docSnap.data();

    laporanList.innerHTML += `

      <div class="rincian-item">

        <div class="rincian-top">

          <span class="rincian-date">
            ${formatTanggal(item.tanggal)}
          </span>

        </div>

        <div class="rincian-bottom">

          <span class="rincian-desc">
            Total Penjualan
          </span>

          <strong class="rincian-nominal">
            Rp ${formatAngka(item.total)}
          </strong>

        </div>

      </div>

    `;

  });

});

/* =========================
   INIT
========================= */

loadDataByTanggal(today);

hitungTotal();





// =========================
// TOTAL TERJUAL
// =========================
const makananInput = document.getElementById("makananTerjualInput");
const minumanInput = document.getElementById("minumanTerjualInput");
const totalTerjualEl = document.getElementById("totalTerjual");
const rataRataPerBoxEl = document.getElementById("rataRataPerBox");

// ambil total penjualan
const totalPenjualanEl = document.getElementById("totalPenjualan");

function ambilAngkaRupiah(text) {
  return Number(text.replace(/[^\d]/g, "")) || 0;
}

function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

function updateTotalTerjual() {
  const makanan = parseInt(makananInput.value) || 0;
  const minuman = parseInt(minumanInput.value) || 0;

  const totalTerjual = makanan + minuman;

  // tampilkan total terjual
  totalTerjualEl.textContent = totalTerjual;

  // ambil total penjualan
  const totalPenjualan = ambilAngkaRupiah(
    totalPenjualanEl.textContent
  );

  // hitung rata-rata per box
  const rataRata =
    totalTerjual > 0
      ? Math.round(totalPenjualan / totalTerjual)
      : 0;

  // tampilkan
  rataRataPerBoxEl.textContent =
    formatRupiah(rataRata);
}

makananInput.addEventListener("input", updateTotalTerjual);
minumanInput.addEventListener("input", updateTotalTerjual);



// =========================
// SIMPAN LAPORAN TERJUAL
// =========================
const saveTerjualBtn =
  document.getElementById("saveTerjualBtn");

saveTerjualBtn.addEventListener("click", async () => {

  try {

    const tanggal = tanggalInput.value;

    const makanan =
      parseInt(makananInput.value) || 0;

    const minuman =
      parseInt(minumanInput.value) || 0;

    const totalTerjual =
      makanan + minuman;

    const totalPenjualan =
      ambilAngkaRupiah(
        totalPenjualanEl.textContent
      );

    const rataRata =
      totalTerjual > 0
        ? Math.round(
            totalPenjualan / totalTerjual
          )
        : 0;

    // simpan ke firestore
    await setDoc(
      doc(db, "laporanLaba", tanggal),
      {

        tanggal,

        total: totalPenjualan,

        makananTerjual: makanan,

        minumanTerjual: minuman,

        totalTerjual: totalTerjual,

        rataRataPerBox: rataRata

      },
      { merge: true }
    );

    alert("Laporan terjual berhasil disimpan");

  } catch (err) {

    console.error(err);
    alert("Gagal menyimpan laporan");

  }

});
