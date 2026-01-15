import { useEffect, useState } from "react";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

export default function Analytics() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // جلب المنتجات
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

  // جلب الطلبات
  useEffect(() => {
    const ordersRef = ref(database, "ordersAll");
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const formatted = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setOrders(formatted);
    });
    return () => unsubscribe();
  }, []);

  // تحليلات المنتجات
  const totalProducts = products.length;
  const avgPrice =
    totalProducts > 0
      ? (
          products.reduce((sum, p) => sum + (p.price || 0), 0) / totalProducts
        ).toFixed(2)
      : 0;
  const maxPrice = Math.max(...products.map((p) => p.price || 0), 0);
  const chartData = products.map((p) => ({ name: p.name, price: p.price }));
  const pieDataProducts = [
    { name: "أقل من 100", value: products.filter((p) => p.price < 100).length },
    {
      name: "100 - 300",
      value: products.filter((p) => p.price >= 100 && p.price <= 300).length,
    },
    { name: "أكثر من 300", value: products.filter((p) => p.price > 300).length },
  ];

  const COLORS = ["#22c55e", "#3b82f6", "#ef4444"];

  // تحليلات الطلبات
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const avgOrder = totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;
  const statusData = [
    { name: "جديد", value: orders.filter((o) => o.status === "جديد").length },
    {
      name: "قيد التجهيز",
      value: orders.filter((o) => o.status === "قيد التجهيز").length,
    },
    { name: "تم الشحن", value: orders.filter((o) => o.status === "تم الشحن").length },
    {
      name: "تم التسليم",
      value: orders.filter((o) => o.status === "تم التسليم").length,
    },
  ];

  return (
    <div dir="rtl" className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">لوحة التحليلات</h2>

      {/* Cards المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <p className="text-gray-500">عدد المنتجات</p>
          <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <p className="text-gray-500">متوسط السعر</p>
          <p className="text-3xl font-bold text-green-600">{avgPrice} ج</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <p className="text-gray-500">أعلى سعر</p>
          <p className="text-3xl font-bold text-red-600">{maxPrice} ج</p>
        </motion.div>
      </div>

      {/* Cards الطلبات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <p className="text-gray-500">عدد الطلبات</p>
          <p className="text-3xl font-bold text-blue-600">{totalOrders}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <p className="text-gray-500">إجمالي المبيعات</p>
          <p className="text-3xl font-bold text-green-600">{totalSales} ج</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <p className="text-gray-500">متوسط قيمة الطلب</p>
          <p className="text-3xl font-bold text-red-600">{avgOrder} ج</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bar Chart المنتجات */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl p-6">
          <p className="font-semibold text-gray-700 mb-3">أسعار المنتجات</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="price" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart الطلبات حسب الحالة */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl p-6">
          <p className="font-semibold text-gray-700 mb-3 text-center">توزيع الطلبات حسب الحالة</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Line Chart الأسعار */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-2">
          <p className="font-semibold text-gray-700 mb-3">تطور أسعار المنتجات</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
