const URUTAN_PRODUK = [
  "Roti Balok","Cokelat Cream","Vanilla Cream","Tiramisu Cream","Greentea Cream",
  "Strawberry Cream","Choco Crunchy","Keju Cheddar","Cookies Crumb","Caramel Crumb",
  "Red Velvet Crumb","Matcha Crumb","Peanuts Crumb","Chocolate Powder","Milo Powder",
  "Vanilla Latte Powder","Cappuccino Powder","Taro Powder","Red Velvet Powder",
  "Greentea Powder","Blackcurrant Powder","Lemon Tea Powder","Kertas Cokelat",
  "Kresek Roti","Tisu Garpu","Kresek 1 Cup","Kresek 2 Cup","Sedotan Es",
  "Kertas Struk","Air Galon","Gas LPG","Cup Ice","Minyak Crunchy","Minyak Kelapa"
];

import {
  db, collection, doc, onSnapshot, setDoc
} from "./firebase.js";

const container = document.getElementById("stokContainer");

// =========================
// STATE
// =========================
let produkData = {};
let draftData = {};
let activeCardId = null;
let searchKeyword = "";
let filterMode = false;

// =========================
// LOAD DATA
// =========================
onSnapshot(collection(db, "produk"), (snap) => {
  produkData = {};
  snap.forEach(d => produkData[d.id] = d.data());
  renderAll();
});

onSnapshot(collection(db, "stok_draft"), (snap) => {
  draftData = {};
  snap.forEach(d => draftData[d.id] = d.data());
  renderAll();
});

// =========================
// RENDER
// =========================
function renderAll() {
  container.innerHTML = "";

  const sortedIds = Object.keys(produkData).sort((a, b) => {
    const A = URUTAN_PRODUK.indexOf(produkData[a].nama);
    const B = URUTAN_PRODUK.indexOf(produkData[b].nama);
    return (A === -1 ? 999 : A) - (B === -1 ? 999 : B);
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

  if (activeCardId) {
    const el = document.querySelector(`.stok-card[data-id="${activeCardId}"]`);
    if (el) el.classList.add("active");
  }
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
    Number.isInteger(n) ? n : n.toLocaleString("id-ID", { minimumFractionDigits: 1 });

  const card = document.createElement("div");
  card.className = "stok-card";
  card.dataset.id = id;

  card.innerHTML = `
  <div class="stok-header" onclick="toggleCard(this)">
    <div class="stok-top">
      <h3>${p.nama}</h3>
      <div class="${(p.stokMinimal && h.total < p.stokMinimal) ? 'stok-warning' : ''}">
        ${format(h.total)}
      </div>
    </div>

    <div class="stok-mid">
      <div>${p.gramasi ?? "-"}</div>
      <div>${p.satuan ?? "-"}</div>
    </div>

    <div class="stok-price-row">
      <div>Rp ${(p.harga ?? 0).toLocaleString("id-ID")}</div>
      <div>Rp ${Math.round(h.totalNilai).toLocaleString("id-ID")}</div>
    </div>
  </div>

  <div class="stok-body" onclick="event.stopPropagation()">
    ${row("Outlet", id, "stokOutlet", h.outlet, 1)}
    ${row("Koma", id, "stokKoma", format(h.koma), 0.1)}
    ${row("Gudang", id, "stokGudang", h.gudang, 1)}

    <hr/>

    <div class="stok-summary"><span>Minimal</span><strong>${p.stokMinimal ?? 0}</strong></div>
    <div class="stok-summary"><span>Request</span><strong>${format(h.request)}</strong></div>
    <div class="stok-summary"><span>Nilai</span><strong>Rp ${Math.round(h.totalNilai).toLocaleString("id-ID")}</strong></div>

    <button onclick="updateStok('${id}')" class="stok-save">🔥 Update</button>
  </div>
  `;

  container.appendChild(card);
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

  let next = (draftData[id][field] ?? 0) + delta;
  if (field === "stokKoma") next = Math.round(next * 10) / 10;
  if (next < 0) next = 0;

  draftData[id][field] = next;
  activeCardId = id;
  renderAll();
};

window.updateStok = async (id) => {
  const p = produkData[id];
  const d = draftData[id];

  await setDoc(doc(db, "produk", id), { ...p, ...d });
  await setDoc(doc(db, "stok_draft", id), d);

  showToast("🔥 Berhasil update");
  activeCardId = null;
};

// =========================
// UI
// =========================
window.toggleCard = (el) => {
  const card = el.parentElement;

  if (card.classList.contains("active")) {
    card.classList.remove("active");
    activeCardId = null;
  } else {
    document.querySelectorAll(".stok-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    activeCardId = card.dataset.id;
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


// =========================
// KEYBOARD FINAL
// =========================
const input = document.getElementById("searchInput");
const clearIcon = document.querySelector(".clear-icon");
const keyboard = document.getElementById("keyboard");

input.addEventListener("click", () => {
  keyboard.style.display = "block";
  input.focus();
});

// close keyboard kalau klik luar
document.addEventListener("click", (e) => {
  if (!keyboard.contains(e.target) && e.target !== input) {
    keyboard.style.display = "none";
  }
});

// =========================
// CAPS
// =========================
let isCaps = false;

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("caps")) return;

  isCaps = !isCaps;
  e.target.classList.toggle("active");

  document.querySelectorAll(".custom-keyboard button").forEach(btn => {
    const key = btn.textContent;

    // 🔥 update disini
    if (["Cap","Del","SPACE",",","."].includes(key)) return;

    btn.textContent = isCaps
      ? key.toUpperCase()
      : key.toLowerCase();
  });
});

// =========================
// INPUT
// =========================
keyboard.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  const key = e.target.textContent;

  if (key === "Del") {
    input.value = input.value.slice(0, -1);
  } else if (key === "SPACE") {
    input.value += " ";
  } else if (key === "Cap") {
    return;
  } else {
    input.value += key;
  }

  handleSearch(input.value);
  clearIcon.classList.toggle("show", input.value.length > 0);

  // cursor tetap nyala di belakang
  setCursorToEnd(input);
});

// =========================
// CLEAR
// =========================
window.clearSearch = () => {
  input.value = "";
  handleSearch("");
  clearIcon.classList.remove("show");
  input.focus();
};

// =========================
// CURSOR FIX
// =========================
function setCursorToEnd(el) {
  el.focus();
  const length = el.value.length;
  el.setSelectionRange(length, length);
}

// biar klik input langsung aktif + cursor hidup
input.addEventListener("click", () => {
  keyboard.style.display = "block";
  setCursorToEnd(input);
});



input.addEventListener("focus", () => {
  input.blur();       // matiin keyboard asli
  input.focus();      // hidupin lagi buat cursor
});
