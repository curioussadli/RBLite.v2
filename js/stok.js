console.log("🔥 STOK JS LOADED");

import {
  db, collection, doc, onSnapshot, setDoc
} from "./firebase.js";

const container = document.getElementById("stokContainer");

// =========================
// STATE
// =========================
let produkData = {};
let draftData = {};
let searchKeyword = "";
let filterMode = false;
let firstLoad = true;

// =========================
// LOAD DATA
// =========================
onSnapshot(collection(db, "produk"), (snap) => {

  snap.docChanges().forEach((change) => {

    const id = change.doc.id;
    const data = change.doc.data();

    // tambah / update
    if (
      change.type === "added" ||
      change.type === "modified"
    ) {

      produkData[id] = data;

      // realtime setelah load awal
      if (!firstLoad) {
        updateCard(id);
      }

    }

    // hapus
    if (change.type === "removed") {

      delete produkData[id];

      const oldCard =
        document.querySelector(
          `.stok-card[data-id="${id}"]`
        );

      if (oldCard) {
        oldCard.remove();
      }

    }

  });

  // render pertama sekali
  if (firstLoad) {

    renderAll();

    firstLoad = false;

  }

});

onSnapshot(collection(db, "stok_draft"), (snap) => {

  snap.docChanges().forEach((change) => {

    const id = change.doc.id;
    const data = change.doc.data();

    if (
      change.type === "added" ||
      change.type === "modified"
    ) {

      draftData[id] = data;

      updateCard(id);

    }

    if (change.type === "removed") {

      delete draftData[id];

    }

  });

});

// =========================
// RENDER
// =========================
function renderAll() {
  container.innerHTML = "";

  const sortedIds = Object.keys(produkData)
.sort((a, b) => {

  return (
    (produkData[a].order || 0)
    -
    (produkData[b].order || 0)
  );

});

  sortedIds.forEach(id => {
    const p = produkData[id];
    const d = draftData[id] ?? {};
    const h = hitung(p, d);

    if (!p.nama.toLowerCase().includes(searchKeyword)) return;

    const low = (p.stokMinimal ?? 0) > 0 && h.total < p.stokMinimal;
    if (filterMode && !low) return;

    renderCard(id, p);
  });

}

// =========================
// HITUNG
// =========================
function hitung(p, d = {}) {
  const outlet = d.stokOutlet ?? p.stokOutlet ?? 0;
  const koma   = d.stokKoma ?? p.stokKoma ?? 0;
  const gudang = d.stokGudang ?? p.stokGudang ?? 0;

  const total = outlet + koma + gudang;
  const request = Math.max(0, (p.stokMinimal ?? 0) - total);

  return {
    outlet, koma, gudang,
    total,
    request,
    totalNilai: total * (p.harga ?? 0)
  };
}

// =========================
// CARD
// =========================
function renderCard(id, p) {

  const h = hitung(p, draftData[id]);

  const format = (n) =>
    Number.isInteger(n)
      ? n
      : n.toLocaleString("id-ID", {
          minimumFractionDigits: 1
        });

  const oldCard =
    document.querySelector(`.stok-card[data-id="${id}"]`);

  const isActive =
    oldCard?.classList.contains("active");

  const card = document.createElement("div");

  card.className = "stok-card";

  if (isActive) {
    card.classList.add("active");
  }

  card.dataset.id = id;

  card.innerHTML = `
  <div class="stok-header" onclick="toggleCard(this)">

    <div class="stok-top">
      <h3>${p.nama}</h3>

      <div class="${
        (p.stokMinimal && h.total < p.stokMinimal)
          ? 'stok-warning'
          : ''
      }">
        ${format(h.total)}
      </div>
    </div>

    <div class="stok-mid">
      <div>${p.gramasi ?? "-"}</div>
      <div>${p.satuan ?? "-"}</div>
    </div>

    <div class="stok-price-row">
      <div>
        Rp ${(p.harga ?? 0)
          .toLocaleString("id-ID")}
      </div>

      <div>
        Rp ${Math.round(h.totalNilai)
          .toLocaleString("id-ID")}
      </div>
    </div>

  </div>

  <div class="stok-body" onclick="event.stopPropagation()">

    ${row(
      "Outlet",
      id,
      "stokOutlet",
      h.outlet,
      1
    )}

    ${row(
      "Koma",
      id,
      "stokKoma",
      format(h.koma),
      0.1
    )}

    ${row(
      "Gudang",
      id,
      "stokGudang",
      h.gudang,
      1
    )}

    <hr/>

    <div class="stok-summary">
      <span>Minimal</span>
      <strong>${p.stokMinimal ?? 0}</strong>
    </div>

    <div class="stok-summary">
      <span>Request</span>
      <strong>${format(h.request)}</strong>
    </div>

    <div class="stok-summary">
      <span>Nilai</span>

      <strong>
        Rp ${Math.round(h.totalNilai)
          .toLocaleString("id-ID")}
      </strong>
    </div>

    <button
      onclick="updateStok('${id}')"
      class="stok-save"
    >
      🔥 Update
    </button>

  </div>
  `;

  // replace card lama
  if (oldCard) {

    oldCard.replaceWith(card);

  } else {

    container.appendChild(card);

  }
}

// =========================
// UPDATE 1 CARD
// =========================
function updateCard(id) {

  const p = produkData[id];

  if (!p) return;

  const d = draftData[id] ?? {};
  const h = hitung(p, d);

  // search filter
  if (
    !p.nama
      .toLowerCase()
      .includes(searchKeyword)
  ) {
    return;
  }

  // stok minimal filter
  const low =
    (p.stokMinimal ?? 0) > 0 &&
    h.total < p.stokMinimal;

  if (filterMode && !low) {
    return;
  }

  renderCard(id, p);

}



function row(label, id, field, val, step) {
  return `
  <div class="stok-summary">
    <span>${label}</span>
    <div class="qty-control">
      <button onclick="change('${id}','${field}',-${step})">-</button>
      <input value="${val}" readonly>
      <button onclick="change('${id}','${field}',${step})">+</button>
    </div>
  </div>`;
}

// =========================
// UPDATE
// =========================
window.change = (id, field, delta) => {

  const p = produkData[id];

  if (!draftData[id]) {
    draftData[id] = {
      stokOutlet: p.stokOutlet ?? 0,
      stokKoma: p.stokKoma ?? 0,
      stokGudang: p.stokGudang ?? 0
    };
  }

  let next =
    (draftData[id][field] ?? 0) + delta;

  // koma 0.1
  if (field === "stokKoma") {
    next = Math.round(next * 10) / 10;
  }

  // minimal 0
  if (next < 0) {
    next = 0;
  }

  // simpan draft
  draftData[id][field] = next;

  // update 1 card saja
  updateCard(id);

  // aktifkan ulang
  requestAnimationFrame(() => {

    const card = document.querySelector(
      `.stok-card[data-id="${id}"]`
    );

    if (card) {
      card.classList.add("active");
    }

  });

};



window.updateStok = async (id) => {

  const p = produkData[id];
  const d = draftData[id] ?? {};

  // 🔥 toast langsung muncul
  showToast("⏳ Menyimpan...");

  try {

    await setDoc(doc(db, "produk", id), {
      ...p,
      ...d
    });

    await setDoc(doc(db, "stok_draft", id), d);

    showToast("🔥 Berhasil update");

    document.querySelectorAll(".stok-card").forEach(card => {
      card.classList.remove("active");
    });

  } catch (err) {

    console.error(err);
    showToast("❌ Gagal update");

  }
};

// =========================
// UI
// =========================
window.toggleCard = (el) => {

  const card = el.parentElement;

  // tutup card lain
  document.querySelectorAll(".stok-card").forEach(c => {
    if (c !== card) {
      c.classList.remove("active");
    }
  });

  // toggle
  card.classList.toggle("active");

  // kalau dibuka
  if (card.classList.contains("active")) {

    setTimeout(() => {

      // tinggi topbar + jarak bawahnya
      const offset = 85;

      // posisi REAL card di layar
      const rect =
        card.getBoundingClientRect();

      // hitung target scroll
      const targetY =
        window.scrollY
        + rect.top
        - offset;

      window.scrollTo({
        top: targetY,
        behavior: "smooth"
      });

    }, 250);

  }

};

window.toggleFilter = () => {
  filterMode = !filterMode;
  document.querySelector(".filter-icon").classList.toggle("active");
  renderAll();
};

window.handleSearch = (val) => {
  searchKeyword = val.toLowerCase();
  renderAll();
};

// =========================
// TOAST
// =========================
function showToast(msg) {
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}
