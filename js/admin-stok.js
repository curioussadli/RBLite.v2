import {
  db,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "./firebase.js";

const container =
  document.getElementById("stokAdminList");

const editModal =
  document.getElementById("editModal");

const editNama =
  document.getElementById("editNama");

const editHarga =
  document.getElementById("editHarga");

const editGramasi =
  document.getElementById("editGramasi");

const editSatuan =
  document.getElementById("editSatuan");

const editMinimal =
  document.getElementById("editMinimal");

const editOutlet =
  document.getElementById("editOutlet");

const editKoma =
  document.getElementById("editKoma");

const editGudang =
  document.getElementById("editGudang");

const cancelEdit =
  document.getElementById("cancelEdit");

const saveEdit =
  document.getElementById("saveEdit");

let currentEditId = null;

let produkData = [];

// =========================
// LOAD
// =========================
onSnapshot(collection(db, "produk"), (snapshot) => {

  container.innerHTML = "";
  produkData = [];

  snapshot.forEach((docSnap) => {

    produkData.push({
      id: docSnap.id,
      ...docSnap.data()
    });

  });

  // SORT
  produkData.sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  // RENDER
  produkData.forEach((item) => {

    const div = document.createElement("div");

    div.classList.add("stok-admin-item");

    div.dataset.id = item.id;

    div.innerHTML = `
      <span class="drag-handle">
        ☰
      </span>

      <div class="stok-admin-info">

        <div class="stok-admin-name">
          ${item.nama || "-"}
        </div>

        <div class="stok-admin-meta">
          ${item.gramasi || "-"}
          •
          ${item.satuan || "-"}
        </div>

        <div class="stok-admin-price">
          Rp ${Number(item.harga || 0)
            .toLocaleString("id-ID")}
        </div>

      </div>

      <div class="stok-admin-actions">

        <button class="edit-btn">
          Edit
        </button>

        <button class="delete-btn">
          Hapus
        </button>

      </div>
    `;

    // =========================
    // DELETE
    // =========================
    div.querySelector(".delete-btn")
    .addEventListener("click", async () => {

      const ok = confirm(
        `Hapus ${item.nama}?`
      );

      if (!ok) return;

      await deleteDoc(
        doc(db, "produk", item.id)
      );

      console.log("✅ Produk dihapus");

    });

    // =========================
    // EDIT
    // =========================
    div.querySelector(".edit-btn")
    .addEventListener("click", () => {

      currentEditId = item.id;

      editNama.value =
        item.nama || "";

      editHarga.value =
        item.harga || 0;

      editGramasi.value =
        item.gramasi || "";

      editSatuan.value =
        item.satuan || "";

      editMinimal.value =
        item.stokMinimal || 0;

      editOutlet.value =
        item.stokOutlet || 0;

      editKoma.value =
        item.stokKoma || 0;

      editGudang.value =
        item.stokGudang || 0;

      editModal.classList.add("show");

    });

    container.appendChild(div);

  });

  initDrag();

});

// =========================
// SAVE EDIT
// =========================
saveEdit.addEventListener("click", async () => {

  if (!currentEditId) return;

  await updateDoc(
    doc(db, "produk", currentEditId),
    {
      nama: editNama.value.trim(),

      harga: Number(editHarga.value),

      gramasi: editGramasi.value.trim(),

      satuan: editSatuan.value.trim(),

      stokMinimal: Number(editMinimal.value),

      stokOutlet: Number(editOutlet.value),

      stokKoma: Number(editKoma.value),

      stokGudang: Number(editGudang.value)
    }
  );

  editModal.classList.remove("show");

  console.log("✅ Produk berhasil diupdate");

});

// =========================
// CANCEL
// =========================
cancelEdit.addEventListener("click", () => {

  editModal.classList.remove("show");

});

// =========================
// SORTABLE
// =========================
function initDrag() {

  new Sortable(container, {

    animation: 150,

    handle: ".drag-handle",

    filter: ".edit-btn, .delete-btn",

    preventOnFilter: false,

    onEnd: async () => {

      const items =
        container.querySelectorAll(
          ".stok-admin-item"
        );

      for (let i = 0; i < items.length; i++) {

        const id =
          items[i].dataset.id;

        await updateDoc(
          doc(db, "produk", id),
          {
            order: i + 1
          }
        );

      }

      console.log("✅ Urutan produk diupdate");

    }
  });
}
