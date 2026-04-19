let isNavigating = false;

document.querySelectorAll(".laporan-item").forEach(item => {

  item.addEventListener("click", () => {

    // 🚫 cegah klik spam
    if (isNavigating) return;
    isNavigating = true;

    const link = item.getAttribute("data-link");

    // =============================
    // 🎯 ANIMASI KLIK (PRESS)
    // =============================
    item.style.transform = "scale(0.92)";
    item.style.opacity = "0.7";

    // =============================
    // 🎬 FADE OUT HALAMAN
    // =============================
    document.body.style.transition = "opacity 0.25s ease";
    document.body.style.opacity = "0.4";

    // =============================
    // 🚀 PINDAH HALAMAN
    // =============================
    setTimeout(() => {

      if (link) {
        window.location.href = link;
      } else {
        // fallback kalau belum ada fitur
        alert("Fitur belum tersedia");

        // reset animasi
        document.body.style.opacity = "1";
        item.style.transform = "";
        item.style.opacity = "";
        isNavigating = false;
      }

    }, 180);

  });

});




window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    window.location.reload();
  }
});
