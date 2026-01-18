import { useState } from "react";
import { database } from "../../firebase";
import { ref as dbRef, push } from "firebase/database";
import { motion } from "framer-motion";

export default function DashAdd({ onNewProduct }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState(""); // رابط الصورة الآن من URL مباشر
  const [price, setPrice] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageURL) return alert("من فضلك ضع رابط صورة صحيح");
    if (Number(price) <= 0) return alert("من فضلك أدخل سعر صحيح");

    try {
      setUploading(true);

      // إضافة المنتج في Database مباشرة برابط الصورة
      const newProductRef = await push(dbRef(database, "products"), {
        name,
        description,
        price: Number(price),
        image: imageURL,
      });

      const newProduct = {
        id: newProductRef.key,
        name,
        description,
        price: Number(price),
        image: imageURL,
      };

      if (onNewProduct) onNewProduct(newProduct);

      // إعادة ضبط الفورم
      setName("");
      setDescription("");
      setImageURL("");
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

        <input
          type="text"
          placeholder="ضع رابط الصورة هنا"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          className="border p-3 rounded-xl text-right focus:ring-2 focus:ring-green-400 outline-none"
          required
        />

        {imageURL && (
          <img
            src={imageURL}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl mb-2 border-2 border-green-500"
          />
        )}

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
          {uploading ? "جاري الإضافة..." : "إضافة المنتج"}
        </motion.button>
      </motion.form>
    </div>
  );
}
