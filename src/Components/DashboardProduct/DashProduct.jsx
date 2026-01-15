import { useEffect, useState, useMemo } from "react";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const productsRef = ref(database, "products");
    const unsubscribe = onValue(productsRef, snapshot => {
      const data = snapshot.val();
      const formatted = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setProducts(formatted);
    });
    return () => unsubscribe();
  }, []);

  const handleNewProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]); // يضيف المنتج الجديد للأعلى
  };

  const filtered = useMemo(() => {
    return search
      ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      : products;
  }, [products, search]);

  return (
    <div className="p-6">
      <input
        type="text"
        placeholder="ابحث عن المنتجات..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-3 rounded-full mb-6 w-full max-w-md"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(p => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow p-4 flex flex-col"
          >
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded mb-2"/>
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-gray-500">{p.description}</p>
            <p className="font-bold mt-1">EGP {p.price}</p>
            <button
              onClick={() => addToCart(p)}
              className="bg-blue-600 text-white p-2 mt-2 rounded hover:bg-blue-700"
            >
              أضف للسلة
            </button>
          </motion.div>
        ))}
      </div>

      {/* لو عايز تعمل دمج مع DashAdd في نفس الصفحة */}
      {/* <DashAdd onNewProduct={handleNewProduct} /> */}
    </div>
  );
}
