import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [openCart, setOpenCart] = useState(false);

  const { cart, addToCart, decreaseQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  // تحميل المنتجات من Firebase
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

  const filtered = useMemo(() => {
    return search
      ? products.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
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
        className="bg-white/70 border p-3 rounded-full w-full max-w-sm mb-6 mt-16"
      />

      {/* شبكة المنتجات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <motion.div
            key={p.id}
            className="bg-white/70 rounded-3xl shadow-2xl p-4 flex flex-col relative"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={p.image}
              className="w-full h-44 object-cover rounded-2xl mb-3"
            />
            <h3 className="font-bold text-lg text-purple-700">{p.name}</h3>
            <p className="text-gray-600 text-sm">{p.description}</p>
            <p className="mt-2 font-bold text-pink-600 text-lg ms-auto">
              EGP {p.price}
            </p>

            {/* زرار إضافة للسلة */}
            <button
              onClick={() => {
                addToCart(p);
                setOpenCart(true);
              }}
              className="absolute bottom-3 right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full flex items-center gap-1"
            >
              <FaShoppingCart /> أضف
            </button>
          </motion.div>
        ))}
      </div>

      {/* Sidebar Cart */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: openCart ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 120 }}
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 p-4 flex flex-col"
      >
        <h2 className="text-xl font-bold text-purple-700 mb-4 text-center">
          🛒 سلة الشراء
        </h2>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">السلة فارغة</p>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl"
              >
                <img
                  src={item.image}
                  className="w-12 h-12 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">EGP {item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="bg-red-500 text-white w-6 h-6 rounded-full"
                  >-</button>

                  <span className="font-bold">{item.quantity}</span>

                  <button
                    onClick={() => addToCart(item)}
                    className="bg-green-500 text-white w-6 h-6 rounded-full"
                  >+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-4">
          <p className="font-bold text-lg text-center">
            الإجمالي: EGP {totalPrice}
          </p>

          {/* زرار الانتقال لصفحة Cart */}
          <button
            onClick={() => {
              setOpenCart(false); // غلق الـ sidebar
              navigate("/cart");   // توجيه لصفحة Cart
            }}
            className="mt-3 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-xl font-bold"
          >
            Go To Cart / Place Order
          </button>

          <button
            onClick={() => setOpenCart(false)}
            className="mt-2 w-full border py-2 rounded-xl"
          >
            إغلاق
          </button>
        </div>
      </motion.div>
    </div>
  );
}
