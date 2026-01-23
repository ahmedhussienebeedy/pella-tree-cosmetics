import { useEffect, useState, useMemo, useCallback } from "react";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { fixImageUrl } from "../../utils/fixImageUrl";
import React from "react";

/* ---------- Product Card ---------- */
const ProductCard = React.memo(function ProductCard({ p, onAdd, eager }) {
  return (
    <div className="bg-white/80 rounded-2xl shadow p-4 relative">
      <img
        src={fixImageUrl(p.image)}
        loading={eager ? "eager" : "lazy"}
        fetchpriority={eager ? "high" : "auto"}
        className="w-full h-40 object-cover rounded-xl mb-2"
        alt={p.name}
      />

      <h3 className="font-bold text-purple-700">{p.name}</h3>

      <p className="text-sm text-gray-600 line-clamp-2">
        {p.description}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <p className="font-bold text-pink-600 text-lg">
          EGP {p.price}
        </p>

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

/* ---------- Products ---------- */
export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  /* 🔥 تحميل سريع + كاش */
  useEffect(() => {
    const productsRef = ref(database, "products");

    const unsubscribe = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formatted = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setProducts(formatted);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* منع re-render */
  const handleAdd = useCallback(
    (product) => {
      addToCart(product);
    },
    [addToCart]
  );

  /* فلترة */
  const filtered = useMemo(() => {
    if (!search) return products;
    return products.filter((p) =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    );
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
          ? Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : filtered.map((p, index) => (
              <ProductCard
                key={p.id}
                p={p}
                onAdd={handleAdd}
                eager={index < 4} // أول صف يظهر فورًا
              />
            ))}
      </div>
    </div>
  );
}
