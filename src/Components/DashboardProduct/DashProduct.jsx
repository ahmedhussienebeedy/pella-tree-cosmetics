// src/Components/Dashboard/DashProducts.jsx
import { useEffect, useState } from "react";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database"; // مهم جداً!
import { motion } from "framer-motion";

export default function DashProducts({ onNewProduct }) {
  const [products, setProducts] = useState([]);

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
          </motion.div>
        ))}
      </div>
    </div>
  );
}
