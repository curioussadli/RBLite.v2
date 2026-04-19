import {
  db,
  collection,
  onSnapshot,
  doc,
  updateDoc
} from "./firebase.js";

const container = document.getElementById("menuAdminList");

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

  // 🔥 SORT BY ORDER
  menuData.sort((a, b) => a.order - b.order);

  // 🔥 RENDER
  menuData.forEach((item) => {

    const div = document.createElement("div");
    div.classList.add("menu-admin-item");
    div.dataset.id = item.id;

    div.innerHTML = `
      <span class="drag-handle">☰</span>
      <img src="${item.img}" width="50">
      <span>${item.name}</span>
    `;

    container.appendChild(div);
  });

  initDrag();
});

function initDrag() {

  new Sortable(container, {
    animation: 150,
    handle: ".drag-handle",

    onEnd: async () => {

      const items = container.querySelectorAll(".menu-admin-item");

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