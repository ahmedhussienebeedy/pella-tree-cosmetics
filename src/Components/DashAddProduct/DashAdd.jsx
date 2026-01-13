import { useState } from "react";
import { database, storage } from "../../firebase";
import { ref as dbRef, push } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";

export default function DashAdd() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageURLInput, setImageURLInput] = useState("");
  const [price, setPrice] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !imageURLInput)
      return alert("من فضلك اختر صورة أو أدخل رابط صورة");

    try {
      setUploading(true);

      let finalImageURL = imageURLInput;
      if (imageFile) {
        const imgRef = storageRef(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imgRef, imageFile);
        finalImageURL = await getDownloadURL(imgRef);
      }

      await push(dbRef(database, "products"), {
        name,
        description,
        price: Number(price),
        image: finalImageURL,
      });

      setName("");
      setDescription("");
      setImageFile(null);
      setImageURLInput("");
      setPrice("");

      alert("تم إضافة المنتج بنجاح ✅");
    } catch (err) {
      console.error("Error adding product:", err);
      alert("حدث خطأ أثناء إضافة المنتج ❌");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.02 }}
        className="flex flex-col gap-4 p-8 bg-white rounded-3xl shadow-2xl max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          إضافة منتج جديد
        </h2>

        <input
          type="text"
          placeholder="اسم المنتج"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 rounded-xl text-right focus:ring-2 focus:ring-green-400 outline-none"
          required
        />

        <input
          type="text"
          placeholder="وصف المنتج"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-3 rounded-xl text-right focus:ring-2 focus:ring-green-400 outline-none"
          required
        />

        <label className="text-gray-600 text-sm">رفع صورة من الجهاز (اختياري)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="border p-2 rounded-xl"
        />

        <label className="text-gray-600 text-sm">أو ضع رابط الصورة</label>
        <input
          type="text"
          placeholder="https://example.com/image.jpg"
          value={imageURLInput}
          onChange={(e) => setImageURLInput(e.target.value)}
          className="border p-3 rounded-xl text-right focus:ring-2 focus:ring-green-400 outline-none"
        />

        <input
          type="number"
          placeholder="السعر بالجنيه"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-3 rounded-xl text-right focus:ring-2 focus:ring-green-400 outline-none"
          required
        />

        <motion.button
          type="submit"
          disabled={uploading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`bg-green-600 text-white p-3 rounded-xl font-bold shadow-md transition ${
            uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
          }`}
        >
          {uploading ? "جاري الرفع..." : "إضافة المنتج"}
        </motion.button>
      </motion.form>
    </div>
  );
}
