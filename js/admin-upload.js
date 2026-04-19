import { db, collection, addDoc } from "./firebase.js";

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const categoryInput = document.getElementById("category");
const btnSave = document.getElementById("btnSave");

const CLOUD_NAME = "dpwdduls3";
const UPLOAD_PRESET = "menu_upload";

btnSave.addEventListener("click", async () => {

  const name = nameInput.value;
  const price = parseInt(priceInput.value);
  const file = imageInput.files[0];
  const category = categoryInput.value;

  if (!name || !price || !file) {
    alert("Lengkapi data!");
    return;
  }

  try {

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error("Upload gagal");
    }

    await addDoc(collection(db, "menu"), {
      name,
      price,
      img: data.secure_url,
      order: Date.now(), // 🔥 otomatis paling bawah
      category
    });

    alert("Upload berhasil!");

    nameInput.value = "";
    priceInput.value = "";
    imageInput.value = "";

  } catch (err) {
    alert("Error: " + err.message);
  }

});


