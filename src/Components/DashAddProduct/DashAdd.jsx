import { useState } from "react";
import { database, storage } from "../../firebase";
import { ref as dbRef, push } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";

export default function DashAdd({ onNewProduct }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [price, setPrice] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("من فضلك اختر صورة");

    if (Number(price) <= 0) return alert("من فضلك أدخل سعر صحيح");
    if (imageFile.size > 2 * 1024 * 1024)
      return alert("حجم الصورة كبير جداً، اختار صورة أقل من 2MB");

    try {
      setUploading(true);

      console.log("جاري رفع الصورة...");
      const imgRef = storageRef(storage, `products/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(imgRef, imageFile);
      console.log("تم رفع الصورة بنجاح!", snapshot);

      const finalImageURL = await getDownloadURL(imgRef);
      console.log("تم الحصول على رابط الصورة:", finalImageURL);

      // إضافة المنتج في Database
      const newProductRef = await push(dbRef(database, "products"), {
        name,
        description,
        price: Number(price),
        image: finalImageURL,
      });

      const newProduct = {
        id: newProductRef.key,
        name,
        description,
        price: Number(price),
        image: finalImageURL,
      };

      console.log("تم إضافة المنتج في Firebase:", newProduct);

      // تحديث الـ Products state فورًا في المكوّن الأب
      if (onNewProduct) onNewProduct(newProduct);

      // إعادة ضبط الفورم
      setName("");
      setDescription("");
      setImageFile(null);
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

        <label className="text-gray-600 text-sm">رفع صورة من الجهاز</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="border p-2 rounded-xl"
        />

        {/* Preview للصورة */}
        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl mb-2"
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
          {uploading ? "جاري الرفع..." : "إضافة المنتج"}
        </motion.button>
      </motion.form>
    </div>
  );
}
