import { db, collection, onSnapshot } from "./firebase.js";

console.log("🔥 MENU JS LOADED");

// =============================
// 🛒 CART SYSTEM (GLOBAL)
// =============================
let cart = [];

const saved = localStorage.getItem("cart");

if (saved) {
  cart = JSON.parse(saved);
}

// =============================
// 💾 SIMPAN CART
// =============================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// =============================
// ➕ ADD TO CART
// =============================
function addToCart(id, name, price) {

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id,
      name,
      price,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
}

// =============================
// 💰 UPDATE CART UI
// =============================
function updateCartUI() {

  const cartCount =
    document.getElementById("cartCount");

  const cartTotal =
    document.getElementById("cartBottomTotal");

  if (!cartCount || !cartTotal) return;

  let totalItem = 0;
  let totalHarga = 0;

  cart.forEach(item => {

    totalItem += item.qty;

    totalHarga +=
      item.qty * item.price;

  });

  cartCount.textContent =
    `${totalItem} item`;

  cartTotal.textContent =
    "Rp " +
    totalHarga.toLocaleString("id-ID");

}

// =============================
// 🔥 SMOOTH SCROLL
// =============================
function smoothScrollToTop(duration = 800) {

  const start =
    window.scrollY;

  const startTime =
    performance.now();

  function scroll() {

    const now =
      performance.now();

    const time =
      Math.min(
        1,
        (now - startTime) / duration
      );

    const ease =
      1 - Math.pow(1 - time, 3);

    window.scrollTo(
      0,
      start * (1 - ease)
    );

    if (time < 1) {
      requestAnimationFrame(scroll);
    }

  }

  requestAnimationFrame(scroll);

}

// =============================
// 🚀 LOAD MENU FIREBASE
// =============================
document.addEventListener(
  "DOMContentLoaded",
  () => {

    const foodContainer =
      document.getElementById("foodList");

    const drinkContainer =
      document.getElementById("drinkList");

    const otherContainer =
      document.getElementById("otherList");

    if (
      !foodContainer &&
      !drinkContainer &&
      !otherContainer
    ) {
      console.error(
        "Container menu tidak ditemukan"
      );
      return;
    }

    onSnapshot(
      collection(db, "menu"),
      (snapshot) => {

        const docs = [];

        snapshot.forEach((docSnap) => {

          docs.push({

            id: docSnap.id,
            ...docSnap.data()

          });

        });

        // =============================
        // 🔥 SORT
        // =============================
        docs.sort(
          (a, b) =>
            (a.order || 0) -
            (b.order || 0)
        );

        // =============================
        // 🔥 FILTER
        // =============================
        const foods =
          docs.filter(item =>
            item.category === "food"
          );

        const drinks =
          docs.filter(item =>
            item.category === "drink"
          );

        const others =
          docs.filter(item =>
            item.category !== "food" &&
            item.category !== "drink"
          );

        // =============================
        // 🔥 RESET UI
        // =============================
        if (foodContainer) {
          foodContainer.innerHTML = "";
        }

        if (drinkContainer) {
          drinkContainer.innerHTML = "";
        }

        if (otherContainer) {
          otherContainer.innerHTML = "";
        }

        // =============================
        // 🔥 RENDER
        // =============================
        function render(
          list,
          container
        ) {

          list.forEach((data) => {

            const card =
              document.createElement("div");

            card.classList.add(
              "menu-card"
            );

            card.innerHTML = `

              <div class="menu-img">
                <img src="${data.img}">
              </div>

              <div class="menu-info">
                <h3>${data.name}</h3>

                <p>
                  Rp ${Number(data.price)
                    .toLocaleString("id-ID")}
                </p>
              </div>

              <button class="btn-add">
                + Tambah
              </button>

            `;

            const btn =
              card.querySelector(".btn-add");

            btn.addEventListener(
              "click",
              () => {

                addToCart(
                  data.id,
                  data.name,
                  data.price
                );

                if (
                  window.scrollY > 200
                ) {
                  smoothScrollToTop(600);
                }

              }
            );

            container.appendChild(card);

          });

        }

        // =============================
        // 🔥 LOAD SECTION
        // =============================
        if (foodContainer) {
          render(foods, foodContainer);
        }

        if (drinkContainer) {
          render(drinks, drinkContainer);
        }

        if (otherContainer) {
          render(others, otherContainer);
        }

        updateCartUI();

      }
    );

    // =============================
    // 🛒 CLICK CART
    // =============================
    const cartBar =
      document.getElementById(
        "cartBottomBar"
      );

    if (cartBar) {

      cartBar.addEventListener(
        "click",
        () => {

          window.location.href =
            "pesanan.html";

        }
      );

    }

  }
);
