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

  // المنتجات
  useEffect(() => {
    const productsRef = ref(database, "products");
    const unsub = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const formatted = data
        ? Object.keys(data).map((k) => ({ id: k, ...data[k] }))
        : [];
      setProducts(formatted);
    });
    return () => unsub();
  }, []);

  // الطلبات
  useEffect(() => {
    const ordersRef = ref(database, "ordersAll");
    const unsub = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const formatted = data
        ? Object.keys(data).map((k) => ({ id: k, ...data[k] }))
        : [];
      setOrders(formatted);
    });
    return () => unsub();
  }, []);

  // ===== منتجات =====
  const totalProducts = products.length;

  const avgPrice =
    totalProducts > 0
      ? (
          products.reduce((s, p) => s + Number(p.price || 0), 0) / totalProducts
        ).toFixed(2)
      : 0;

  const maxPrice = Math.max(...products.map((p) => Number(p.price || 0)), 0);

  const chartData = products.map((p) => ({
    name: p.name,
    price: Number(p.price || 0),
  }));

  // ترتيب حسب السعر
  const sortedChartData = [...chartData].sort((a, b) => a.price - b.price);

  // ===== طلبات =====
  const totalOrders = orders.length;

  const totalSales = orders
    .reduce((sum, o) => sum + Number(o.total || 0), 0)
    .toFixed(2);

  const avgOrder =
    totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;

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

  const COLORS = ["#22c55e", "#f97316", "#3b82f6", "#16a34a"];

  return (
    <div dir="rtl" className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center">لوحة التحليلات</h2>

      {/* Cards المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[{
          title: "عدد المنتجات",
          value: totalProducts,
          color: "text-blue-600"
        },{
          title: "متوسط السعر",
          value: `${avgPrice} ج`,
          color: "text-green-600"
        },{
          title: "أعلى سعر",
          value: `${maxPrice} ج`,
          color: "text-red-600"
        }].map((c,i)=>(
          <motion.div
            key={i}
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.3 }}
            whileHover={{ scale:1.05 }}
            className="bg-white rounded-2xl shadow-xl p-6 text-center"
          >
            <p className="text-gray-500">{c.title}</p>
            <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Cards الطلبات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[{
          title: "عدد الطلبات",
          value: totalOrders,
          color: "text-blue-600"
        },{
          title: "إجمالي المبيعات",
          value: `${totalSales} ج`,
          color: "text-green-600"
        },{
          title: "متوسط الطلب",
          value: `${avgOrder} ج`,
          color: "text-red-600"
        }].map((c,i)=>(
          <motion.div
            key={i}
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.3 }}
            whileHover={{ scale:1.05 }}
            className="bg-white rounded-2xl shadow-xl p-6 text-center"
          >
            <p className="text-gray-500">{c.title}</p>
            <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bar */}
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className="bg-white rounded-2xl shadow-xl p-6">
          <p className="font-semibold mb-3">أسعار المنتجات</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="price" fill="#6366f1" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie */}
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className="bg-white rounded-2xl shadow-xl p-6">
          <p className="font-semibold mb-3 text-center">حالات الطلبات</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                {statusData.map((e,i)=>(
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Line */}
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-2">
          <p className="font-semibold mb-3">تطور الأسعار</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sortedChartData}>
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
