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
