import { useEffect, useState, useMemo } from "react";
import { database } from "../../firebase";
import { ref, query, orderByChild, limitToFirst, onValue, get } from "firebase/database";
import { FaShoppingCart, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";

/* ---------- Cart Context ---------- */
const CartContext = React.createContext();
export const useCart = () => React.useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const existing = cart.find((p) => p.id === product.id);

    if (existing) {
      setCart(cart.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    setIsCartOpen(true);
  };

  const removeFromCart = (id) => setCart(cart.filter((p) => p.id !== id));

  const decreaseQuantity = (id) => {
    const existing = cart.find((p) => p.id === id);
    if (!existing) return;

    if (existing.quantity === 1) removeFromCart(id);
    else setCart(cart.map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p)));
  };

  const increaseQty = (id) => {
    setCart(cart.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p)));
  };

  const totalPrice = useMemo(() => cart.reduce((s, p) => s + p.price * p.quantity, 0), [cart]);

  const goToCart = () => {
    setIsCartOpen(false);
    navigate("/cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQuantity,
        increaseQty,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        goToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ---------- Product Card ---------- */
const ProductCard = React.memo(function ProductCard({ p, onAdd, onImageClick, eager }) {
  return (
    <div className="bg-white/80 rounded-2xl shadow p-4">
      <img
        src={p.image}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="w-full h-40 object-cover rounded-xl mb-2 cursor-pointer"
        onClick={() => onImageClick(p)}
      />

      <h3 className="font-bold text-purple-700">{p.name}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>

      <div className="mt-3 flex justify-between">
        <p className="font-bold text-pink-600">EGP {p.price}</p>

        <button onClick={() => onAdd(p)} className="bg-purple-600 text-white px-3 py-1 rounded-full flex gap-1">
          <FaShoppingCart /> أضف
        </button>
      </div>
    </div>
  );
});

/* ---------- Cart Sidebar ---------- */
function CartSidebar() {
  const { cart, isCartOpen, setIsCartOpen, increaseQty, decreaseQuantity, totalPrice, goToCart } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/40 z-40" />

          <motion.div className="fixed top-0 right-0 h-full w-80 bg-white z-50 p-4" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}>
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">السلة</h2>
              <FaTimes onClick={() => setIsCartOpen(false)} />
            </div>

            {cart.map((item) => (
              <div key={item.id} className="flex justify-between mb-3">
                <div>
                  <p>{item.name}</p>
                  <p className="text-sm">
                    {item.quantity} × {item.price}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item.id)}>+</button>
                </div>
              </div>
            ))}

            {cart.length > 0 && (
              <div className="border-t pt-4">
                <p className="font-bold mb-2">الإجمالي: {totalPrice} ج</p>

                <button onClick={goToCart} className="w-full bg-green-600 text-white py-2 rounded">
                  إتمام الطلب
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------- Product Overlay ---------- */
function ProductOverlay({ product, onClose }) {
  const { addToCart } = useCart();
  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4" onClick={onClose}>
        <motion.div onClick={(e) => e.stopPropagation()} className="bg-white p-4 rounded-2xl w-full max-w-md">
          <FaTimes className="ml-auto mb-2 cursor-pointer" onClick={onClose} />

          <img src={product.image} className="w-full h-60 object-cover rounded mb-3" />

          <h2 className="font-bold text-xl">{product.name}</h2>
          <p className="text-gray-600 my-2">{product.description}</p>
          <p className="font-bold text-pink-600 mb-3">EGP {product.price}</p>

          <button
            onClick={() => {
              addToCart(product);
              onClose();
              alert("✅ تم إضافة المنتج للسلة");
            }}
            className="w-full bg-purple-600 text-white py-2 rounded-xl"
          >
            أضف للسلة
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------- Main ---------- */
export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <CartProvider>
      <ProductsContent products={products} setProducts={setProducts} search={search} setSearch={setSearch} setSelectedProduct={setSelectedProduct} />
      <CartSidebar />
      <ProductOverlay product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </CartProvider>
  );
}

/* ---------- ProductsContent ---------- */
function ProductsContent({ products, setProducts, search, setSearch, setSelectedProduct }) {
  const { addToCart } = useCart();

  useEffect(() => {
    const cached = localStorage.getItem("products");
    if (cached) setProducts(JSON.parse(cached));
  }, []);

  useEffect(() => {
    const q = query(ref(database, "products"), orderByChild("name"), limitToFirst(20));

    get(q).then((snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const list = Object.keys(data).map((k) => ({ id: k, ...data[k] }));
        setProducts(list);
        localStorage.setItem("products", JSON.stringify(list));
      }
    });

    const unsub = onValue(q, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const list = Object.keys(data).map((k) => ({ id: k, ...data[k] }));
        setProducts(list);
        localStorage.setItem("products", JSON.stringify(list));
      }
    });

    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return products;
    return products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);

  return (
    <div dir="rtl" className="p-6 bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300 min-h-screen">
      <input value={search} onChange={(e) => setSearch(e.target.value)} className="bg-white p-3 rounded-full w-full mb-6 mt-16" placeholder="ابحث..." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map((p, i) => (
          <ProductCard key={p.id} p={p} eager={i < 6} onAdd={addToCart} onImageClick={setSelectedProduct} />
        ))}
      </div>
    </div>
  );
}
