// src/Components/Dashboard/DashProducts.jsx
import { useEffect, useState } from "react";
import { database } from "../../firebase";
import { ref, onValue, remove, update } from "firebase/database";
import { motion } from "framer-motion";

export default function DashProducts() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

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

  // 🗑️ Delete
  const handleDelete = async (id) => {
    await remove(ref(database, `products/${id}`));
  };

  // ✏️ Update (FIXED)
  const handleUpdate = async () => {
    if (!editProduct?.id) return;

    try {
      const { id, ...updatedData } = editProduct;

      await update(ref(database, `products/${id}`), {
        ...updatedData,
        price: Number(updatedData.price),
      });

      setEditProduct(null);
      alert("✅ Product updated");
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📝 قائمة المنتجات</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow p-4 flex flex-col"
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-40 object-cover rounded mb-2"
            />

            <h3 className="font-bold">{p.name}</h3>
            <p className="text-gray-500">{p.description}</p>
            <p className="font-bold mt-1">EGP {p.price}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setEditProduct(p)}
                className="flex-1 bg-blue-500 text-white py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(p.id)}
                className="flex-1 bg-red-500 text-white py-1 rounded"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ✏️ Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">✏️ Edit Product</h3>

            <input
              className="w-full border p-2 mb-2"
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
              placeholder="Name"
            />

            <input
              type="number"
              className="w-full border p-2 mb-2"
              value={editProduct.price}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  price: Number(e.target.value),
                })
              }
              placeholder="Price"
            />

            <input
              className="w-full border p-2 mb-2"
              value={editProduct.image}
              onChange={(e) =>
                setEditProduct({ ...editProduct, image: e.target.value })
              }
              placeholder="Image URL"
            />

            <textarea
              className="w-full border p-2 mb-4"
              value={editProduct.description}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  description: e.target.value,
                })
              }
              placeholder="Description"
            />

            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-green-500 text-white py-2 rounded"
              >
                Update
              </button>

              <button
                onClick={() => setEditProduct(null)}
                className="flex-1 bg-gray-400 text-white py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
