import { useEffect, useState, useMemo } from "react";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const { cart, addToCart, decreaseQuantity, totalPrice } = useCart();

  // تحميل المنتجات من الـ database
  useEffect(() => {
    const productsRef = ref(database, "products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const formatted = data
        ? Object.keys(data).map(key => ({ id: key, ...data[key] }))
        : [];
      setProducts(formatted);
    });
    return () => unsubscribe();
  }, []);

  // لتحديث الصفحة فورًا عند إضافة منتج جديد من DashAdd
  const handleNewProduct = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  const filtered = useMemo(() => {
    if (!products) return [];
    return search
      ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      : products;
  }, [products, search]);

  return (
    <div dir="rtl" className="p-6 bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300 min-h-screen">

      {/* بحث */}
      <input
        type="text"
        placeholder="ابحث عن المنتجات..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-white/70 backdrop-blur-md border p-3 rounded-full w-full max-w-sm mb-6 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />

      {/* شبكة المنتجات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/40 animate-pulse rounded-3xl h-64"></div>
          ))
        ) : filtered.length > 0 ? (
          filtered.map(p => (
            <motion.div
              key={p.id}
              className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-4 flex flex-col relative"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-44 object-cover rounded-2xl mb-3"
              />
              <h3 className="font-bold text-lg text-purple-700">{p.name}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{p.description}</p>
              <p className="mt-2 font-bold text-pink-600 text-lg ms-auto">EGP {p.price}</p>
              <button
                onClick={() => addToCart(p)}
                className="absolute bottom-3 right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full shadow-lg hover:scale-110 transition flex items-center gap-1"
              >
                <FaShoppingCart /> أضف
              </button>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-white text-xl mt-10 drop-shadow">
            لا توجد منتجات
          </p>
        )}
      </div>
    </div>
  );
}
