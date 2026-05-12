import {
  db,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "./firebase.js";

const container = document.getElementById("menuAdminList");

const editModal =
  document.getElementById("editModal");

const editName =
  document.getElementById("editName");

const editPrice =
  document.getElementById("editPrice");

const editImg =
  document.getElementById("editImg");

const editCategory =
  document.getElementById("editCategory");

const cancelEdit =
  document.getElementById("cancelEdit");

const saveEdit =
  document.getElementById("saveEdit");

let currentEditId = null;

let menuData = [];

onSnapshot(collection(db, "menu"), (snapshot) => {

  container.innerHTML = "";
  menuData = [];

  snapshot.forEach((docSnap) => {
    menuData.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });

  // SORT BY ORDER
  menuData.sort((a, b) => a.order - b.order);

  // RENDER
  menuData.forEach((item) => {

    const div = document.createElement("div");

    div.classList.add("menu-admin-item");
    div.dataset.id = item.id;

    div.innerHTML = `
      <span class="drag-handle">☰</span>

      <img src="${item.img}">

      <div class="menu-info">
        <div class="menu-name">
          ${item.name}
        </div>

        <div class="menu-price">
          Rp ${Number(item.price).toLocaleString("id-ID")}
        </div>
      </div>

      <div class="menu-actions">

        <button class="edit-btn">
          Edit
        </button>

        <button class="delete-btn">
          Hapus
        </button>

      </div>
    `;

    // ======================
    // DELETE
    // ======================

    div.querySelector(".delete-btn")
    .addEventListener("click", async () => {

      const confirmDelete = confirm(
        `Hapus ${item.name}?`
      );

      if (!confirmDelete) return;

      await deleteDoc(doc(db, "menu", item.id));

      console.log("✅ Menu dihapus");
    });


// ======================
// EDIT
// ======================

div.querySelector(".edit-btn")
.addEventListener("click", () => {

  currentEditId = item.id;

  // isi form modal
  editName.value =
    item.name || "";

  editPrice.value =
    item.price || 0;

  editImg.value =
    item.img || "";

  editCategory.value =
    item.category || "food";

  // tampilkan modal
  editModal.classList.add("show");

});

    container.appendChild(div);
  });


// ======================
// CANCEL EDIT
// ======================

cancelEdit.addEventListener("click", () => {

  editModal.classList.remove("show");

});


// ======================
// SAVE EDIT
// ======================

saveEdit.addEventListener("click", async () => {

  if (!currentEditId) return;

  await updateDoc(
    doc(db, "menu", currentEditId),
    {
      name:
        editName.value.trim(),

      price:
        Number(editPrice.value) || 0,

      img:
        editImg.value.trim(),

      category:
        editCategory.value
    }
  );

  editModal.classList.remove("show");

  currentEditId = null;

  console.log("✅ Menu diupdate");

});





  initDrag();
});

function initDrag() {

  new Sortable(container, {

    animation: 150,

    handle: ".drag-handle",

    filter: ".edit-btn, .delete-btn",

    preventOnFilter: false,

    onEnd: async () => {

      const items = container.querySelectorAll(
        ".menu-admin-item"
      );

      for (let i = 0; i < items.length; i++) {

        const id = items[i].dataset.id;

        await updateDoc(doc(db, "menu", id), {
          order: i + 1
        });
      }

      console.log("✅ Urutan update");
    }
  });
}
