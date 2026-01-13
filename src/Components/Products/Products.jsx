import { useEffect, useState, useMemo } from "react";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState(null);
  const [search, setSearch] = useState("");
  const { cart, addToCart, decreaseQuantity, totalPrice } = useCart();
  const [showCartPopup, setShowCartPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cached = localStorage.getItem("products");
    if (cached) setProducts(JSON.parse(cached));

    const productsRef = ref(database, "products");
    const unsubscribe = onValue(productsRef, snapshot => {
      const data = snapshot.val();
      const formatted = data
        ? Object.keys(data).map(key => ({ id: key, ...data[key] }))
        : [];
      setProducts(formatted);
      localStorage.setItem("products", JSON.stringify(formatted));
    });

    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    if (!products) return [];
    return search
      ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      : products;
  }, [products, search]);

  const bubbles = [
    { size: 120, top: "10%", left: "10%", delay: 0 },
    { size: 90, top: "25%", left: "75%", delay: 2 },
    { size: 70, top: "60%", left: "30%", delay: 1 },
    { size: 110, top: "75%", left: "60%", delay: 3 },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300 overflow-hidden p-6">
<div className="mt-16">

      {/* Animated bubbles */}
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/30 rounded-full blur-xl"
          style={{ width: b.size, height: b.size, top: b.top, left: b.left }}
          animate={{ y: [0, -40, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, delay: b.delay }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Search */}
        <input
          type="text"
          placeholder="ابحث عن المنتجات..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/70 backdrop-blur-md border border-white/50 p-3 rounded-full w-full max-w-sm mb-10 shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {products === null ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white/40 animate-pulse rounded-3xl h-72 backdrop-blur"></div>
            ))
          ) : filtered.length > 0 ? (
            filtered.map(p => (
              <motion.div
                key={p.id}
                whileHover={{ scale: 1.06, rotate: 0.3 }}
                className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-4 flex flex-col relative transition-all"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-44 object-cover rounded-2xl mb-3 shadow-md"
                />

                <h3 className="font-bold text-lg text-purple-700">{p.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{p.description}</p>

                <p className="mt-2 font-bold text-pink-600 text-lg">
                  EGP {p.price}
                </p>

                <button
                  onClick={() => {
                    addToCart(p);
                    setShowCartPopup(true);
                  }}
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

      {/* Cart popup */}
      <AnimatePresence>
        {showCartPopup && (
          <motion.div
            className="fixed bottom-6 right-6 w-80 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 z-50 p-4"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
          >
            <h3 className="font-bold text-lg mb-3 text-purple-700">سلة مشترياتك</h3>

            <div className="max-h-48 overflow-y-auto space-y-2 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-2 bg-white/60 rounded-xl p-2 shadow">
                  <img src={item.image} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      EGP {item.price * item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => decreaseQuantity(item.id)} className="bg-pink-500 text-white px-2 rounded">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="bg-purple-500 text-white px-2 rounded">+</button>
                  </div>
                </div>
              ))}
            </div>

            <p className="font-semibold mb-4 text-pink-600">
              الإجمالي: EGP {totalPrice}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigate("/cart");
                  setShowCartPopup(false);
                }}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-xl hover:scale-105 transition"
              >
                إتمام الطلب
              </button>

              <button
                onClick={() => setShowCartPopup(false)}
                className="flex-1 bg-white/70 py-2 rounded-xl hover:bg-white transition"
              >
                متابعة
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
</div>
    </div>
  );
}
