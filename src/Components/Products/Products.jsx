import { useEffect, useState } from "react";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // <--- استدعاء useNavigate

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const { cart, addToCart, decreaseQuantity, totalPrice } = useCart();
  const [showCartPopup, setShowCartPopup] = useState(false);
  const navigate = useNavigate(); // <--- هنا

  useEffect(() => {
    const productsRef = ref(database, "products");
    const unsubscribe = onValue(productsRef, snapshot => {
      const data = snapshot.val();
      const formatted = data
        ? Object.keys(data).map(key => ({ id: key, ...data[key] }))
        : [];
      setProducts(formatted);
    });
    return () => unsubscribe();
  }, []);

  const filtered = search
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : products;

  const handleAddToCart = (product) => {
    addToCart(product);
    setShowCartPopup(true);
  };

  const handleIncrease = (product) => addToCart(product);
  const handleDecrease = (productId) => decreaseQuantity(productId);

  const bubbles = [
    { size: 80, top: "10%", left: "5%", delay: 0 },
    { size: 100, top: "20%", left: "80%", delay: 2 },
    { size: 60, top: "50%", left: "30%", delay: 1 },
    { size: 90, top: "70%", left: "60%", delay: 3 },
    { size: 50, top: "80%", left: "15%", delay: 0.5 },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-purple-400 via-pink-300 to-yellow-200 overflow-hidden p-6">

      {/* Background bubbles */}
      <div className="absolute top-0 left-0 w-full h-full">
        {bubbles.map((b, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-30"
            style={{ width: `${b.size}px`, height: `${b.size}px`, top: b.top, left: b.left }}
            animate={{ y: [0, -50, 0] }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "loop", delay: b.delay }}
          />
        ))}
      </div>

      {/* Search */}
      <div className="relative z-10 mt-20">
        <input
          type="text"
          placeholder="ابحث عن المنتجات..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-full w-full max-w-sm mb-8 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.length > 0 ? (
            filtered.map(p => (
              <motion.div
                key={p.id}
                className="bg-white rounded-2xl shadow-lg p-4 flex flex-col relative hover:scale-105 transition-transform duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-44 object-cover rounded-xl mb-3"
                />
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{p.description}</p>
                <p className="mt-2 font-bold text-blue-600">EGP{p.price}</p>

                <button
                  onClick={() => handleAddToCart(p)}
                  className="absolute bottom-3 right-3 bg-blue-600 text-white p-1 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <FaShoppingCart /> اضف الي السلة
                </button>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600 mt-10">لا توجد منتجات.</p>
          )}
        </div>
      </div>

      {/* Cart popup */}
      <AnimatePresence>
        {showCartPopup && (
          <motion.div
            className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 p-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <h3 className="font-bold text-lg mb-2">سلة مشترياتك</h3>
            <div className="max-h-48 overflow-y-auto mb-4 space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-xl shadow-sm">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1 flex flex-col ml-2">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-sm text-gray-600">EGP{item.price * item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecrease(item.id)}
                      className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                    >-</button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleIncrease(item)}
                      className="bg-green-500 text-white px-2 rounded hover:bg-green-600"
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
            <p className="font-semibold mb-4">الإجمالي: EGP {totalPrice}</p>
            <div className="flex gap-2">
              <button
                className="flex-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                onClick={() => {
                  navigate("/cart"); 
                  setShowCartPopup(false);
                }}
              >
                شراء الطلب
              </button>
              <button
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-xl hover:bg-gray-300 transition"
                onClick={() => setShowCartPopup(false)}
              >
                مواصلة التسوق
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
