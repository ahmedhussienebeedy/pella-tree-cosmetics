import { useEffect, useState, useMemo, useCallback } from "react";
import { database } from "../../firebase";
import { ref, query, orderByChild, limitToFirst, onValue } from "firebase/database";
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

  // Load cart from localStorage
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
      setCart(
        cart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => setCart(cart.filter((p) => p.id !== id));

  const decreaseQuantity = (id) => {
    const existing = cart.find((p) => p.id === id);
    if (!existing) return;
    if (existing.quantity === 1) {
      removeFromCart(id);
    } else {
      setCart(
        cart.map((p) =>
          p.id === id ? { ...p, quantity: p.quantity - 1 } : p
        )
      );
    }
  };

  const increaseQty = (id) => {
    const existing = cart.find((p) => p.id === id);
    if (!existing) return;
    setCart(
      cart.map((p) =>
        p.id === id ? { ...p, quantity: p.quantity + 1 } : p
      )
    );
  };

  const totalPrice = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

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
const ProductCard = React.memo(function ProductCard({ p, onAdd, eager }) {
  return (
    <div className="bg-white/80 rounded-2xl shadow p-4 relative">
      <img
        src={p.image || "/placeholder.png"}
        loading={eager ? "eager" : "lazy"}
        fetchpriority={eager ? "high" : "auto"}
        onError={(e) => (e.target.src = "/placeholder.png")}
        className="w-full h-40 object-cover rounded-xl mb-2"
        alt={p.name}
      />
      <h3 className="font-bold text-purple-700">{p.name}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <p className="font-bold text-pink-600 text-lg">EGP {p.price}</p>
        <button
          onClick={() => onAdd(p)}
          className="bg-purple-600 text-white px-3 py-1 rounded-full flex items-center gap-1 hover:scale-105 transition"
        >
          <FaShoppingCart /> أضف
        </button>
      </div>
    </div>
  );
});

/* ---------- Skeleton ---------- */
function SkeletonCard() {
  return (
    <div className="bg-white/60 rounded-2xl p-4 animate-pulse">
      <div className="h-40 bg-gray-300 rounded-xl mb-3" />
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-300 rounded w-full mb-2" />
      <div className="h-4 bg-gray-300 rounded w-1/3" />
    </div>
  );
}

/* ---------- Cart Sidebar ---------- */
function CartSidebar() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    increaseQty,
    decreaseQuantity,
    totalPrice,
    goToCart,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-0 right-0 h-full w-80 bg-white z-50 p-4 flex flex-col shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">سلة المشتريات</h2>
              <button onClick={() => setIsCartOpen(false)}>
                <FaTimes />
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center mt-8">السلة فاضية</p>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center mb-4"
                  >
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-gray-500">EGP {item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="px-2 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="px-2 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="mt-4 border-t pt-4 flex flex-col gap-2">
                <p className="font-bold text-lg">الإجمالي: EGP {totalPrice}</p>
                <button
                  onClick={goToCart}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
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

/* ---------- Main Products Component ---------- */
export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  return (
    <CartProvider>
      <ProductsContent
        products={products}
        setProducts={setProducts}
        search={search}
        setSearch={setSearch}
        loading={loading}
        setLoading={setLoading}
      />
      <CartSidebar />
    </CartProvider>
  );
}

/* ---------- ProductsContent ---------- */
function ProductsContent({ products, setProducts, search, setSearch, loading, setLoading }) {
  const { addToCart, setIsCartOpen } = useCart();

  // Load cached products first
  useEffect(() => {
    const saved = localStorage.getItem("products");
    if (saved) {
      setProducts(JSON.parse(saved));
      setLoading(false);
    }
  }, [setProducts, setLoading]);

  // Fetch products from Firebase
  useEffect(() => {
    const productsQuery = query(ref(database, "products"), orderByChild("name"), limitToFirst(20));

    const unsubscribe = onValue(
      productsQuery,
      (snapshot) => {
        setLoading(false);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formatted = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          setProducts(formatted);
          localStorage.setItem("products", JSON.stringify(formatted));
        } else {
          setProducts([]);
        }
      },
      (error) => {
        console.error("Firebase error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [setProducts, setLoading]);

  const handleAdd = useCallback(
    (product) => {
      addToCart(product);
      setIsCartOpen(true);
    },
    [addToCart, setIsCartOpen]
  );

  const filtered = useMemo(() => {
    if (!search) return products;
    return products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);

  return (
    <div
      dir="rtl"
      className="p-6 min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300"
    >
      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="ابحث عن منتج..."
        className="bg-white/80 p-3 rounded-full w-full max-w-sm mb-6 mt-16"
      />

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((p, index) => (
              <ProductCard key={p.id} p={p} onAdd={handleAdd} eager={index < 8} />
            ))}
      </div>
    </div>
  );
}
