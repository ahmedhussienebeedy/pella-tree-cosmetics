import { useEffect, useState } from "react";
import { database, storage } from "../../firebase";
import { ref, onValue, remove, update } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion, AnimatePresence } from "framer-motion";

export default function DashProducts() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", imageURL: "", imageFile: null });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const productsRef = ref(database, "products");
    const unsubscribe = onValue(productsRef, snapshot => {
      const data = snapshot.val();
      const formatted = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setProducts(formatted);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;
    remove(ref(database, `products/${id}`));
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description, price: p.price, imageURL: p.image, imageFile: null });
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
        image: finalImageURL
      });

      cancelEdit();
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to update product. Check console.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {products.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-lg p-4 flex flex-col relative hover:scale-105 transition-transform duration-300"
            >
              {editingId === p.id ? (
                <div className="flex flex-col gap-2 w-full">
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border p-2 rounded" placeholder="Product Name" />
                  <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="border p-2 rounded" placeholder="Description" />
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="border p-2 rounded" placeholder="Price" />
                  <input type="file" onChange={e => setForm({...form, imageFile: e.target.files[0]})} className="border p-2 rounded" />
                  <input type="text" value={form.imageURL} onChange={e => setForm({...form, imageURL: e.target.value})} placeholder="Or enter image URL" className="border p-2 rounded" />

                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleUpdate(p.id)} disabled={uploading} className={`bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex-1 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                      {uploading ? "Updating..." : "Update"}
                    </button>
                    <button onClick={cancelEdit} className="bg-gray-300 p-2 rounded hover:bg-gray-400 flex-1">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded-xl mb-3" />
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{p.description}</p>
                  <p className="mt-2 font-bold text-blue-600">EGP{p.price}</p>

                  <div className="flex gap-2 mt-3">
                    <button onClick={() => startEdit(p)} className="flex-1 bg-yellow-500 text-white py-2 rounded-xl hover:bg-yellow-600 transition">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="flex-1 bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition">Delete</button>
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
