import { useEffect, useState } from "react";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Analytics() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productsRef = ref(database, "products");
    const unsubscribe = onValue(productsRef, snapshot => {
      const data = snapshot.val();
      const formatted = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setProducts(formatted);
    });
    return () => unsubscribe();
  }, []);

  const totalProducts = products.length;
  const avgPrice = totalProducts > 0 ? (products.reduce((sum, p) => sum + (p.price || 0), 0) / totalProducts).toFixed(2) : 0;
  const chartData = products.map(p => ({ name: p.name, price: p.price }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-6 flex-1">
          <p className="text-gray-500">Total Products</p>
          <p className="text-3xl font-bold">{totalProducts}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex-1">
          <p className="text-gray-500">Average Price</p>
          <p className="text-3xl font-bold">${avgPrice}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-700 font-semibold mb-2">Product Prices</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="price" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
