import { useEffect, useState } from "react";
import { database, storage } from "../../firebase";
import { ref, onValue, remove, update } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion, AnimatePresence } from "framer-motion";

export default function DashProducts() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageURL: "",
    imageFile: null,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const productsRef = ref(database, "products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const formatted = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setProducts(formatted);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("هل أنت متأكد من حذف المنتج؟")) return;
    remove(ref(database, `products/${id}`));
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      imageURL: p.image,
      imageFile: null,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", description: "", price: "", imageURL: "", imageFile: null });
  };

  const handleUpdate = async (id) => {
    try {
      setUploading(true);
      let finalImageURL = form.imageURL;

      if (form.imageFile) {
        const imgRef = storageRef(storage, `products/${Date.now()}_${form.imageFile.name}`);
        await uploadBytes(imgRef, form.imageFile);
        finalImageURL = await getDownloadURL(imgRef);
      }

      await update(ref(database, `products/${id}`), {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        image: finalImageURL,
      });

      cancelEdit();
    } catch (err) {
      console.error("Error updating product:", err);
      alert("حصل خطأ أثناء التحديث ❌");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div dir="rtl" className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        لوحة إدارة المنتجات
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {products.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl shadow-xl p-4 flex flex-col relative"
            >
              {editingId === p.id ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-2"
                >
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border p-2 rounded-lg text-right"
                    placeholder="اسم المنتج"
                  />
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="border p-2 rounded-lg text-right"
                    placeholder="وصف المنتج"
                  />
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="border p-2 rounded-lg text-right"
                    placeholder="السعر"
                  />
                  <input
                    type="file"
                    onChange={(e) =>
                      setForm({ ...form, imageFile: e.target.files[0] })
                    }
                    className="border p-2 rounded-lg"
                  />
                  <input
                    type="text"
                    value={form.imageURL}
                    onChange={(e) =>
                      setForm({ ...form, imageURL: e.target.value })
                    }
                    placeholder="أو ضع رابط الصورة"
                    className="border p-2 rounded-lg text-right"
                  />

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleUpdate(p.id)}
                      disabled={uploading}
                      className={`bg-blue-600 text-white p-2 rounded-xl flex-1 hover:bg-blue-700 transition ${
                        uploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {uploading ? "جاري التحديث..." : "حفظ التعديلات"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-300 p-2 rounded-xl hover:bg-gray-400 flex-1"
                    >
                      إلغاء
                    </button>
                  </div>
                </motion.div>
              ) : (
                <>
                  <motion.img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded-2xl mb-3"
                    whileHover={{ scale: 1.05 }}
                  />
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {p.description}
                  </p>
                  <p className="mt-2 font-bold text-blue-600">
                    {p.price} جنيه
                  </p>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => startEdit(p)}
                      className="flex-1 bg-yellow-500 text-white py-2 rounded-xl hover:bg-yellow-600 transition"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
                    >
                      حذف
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
