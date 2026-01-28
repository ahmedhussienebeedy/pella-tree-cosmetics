import { useEffect, useState } from "react";
import { database } from "../../firebase";
import { ref, onValue, update } from "firebase/database";
import { motion } from "framer-motion";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersRef = ref(database, "ordersAll");

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const formatted = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];

      // ترتيب تنازلي مضمون
      formatted.sort((a, b) => Number(b.orderNumber) - Number(a.orderNumber));

      setOrders(formatted);
    });

    return () => unsubscribe();
  }, []);

  const changeStatus = (id, status) => {
    if (!window.confirm("تأكيد تغيير حالة الطلب؟")) return;
    update(ref(database, `ordersAll/${id}`), { status });
  };

  const statusColor = (status) => {
    switch (status) {
      case "جديد":
        return "bg-yellow-100 text-yellow-700";
      case "قيد التجهيز":
        return "bg-orange-100 text-orange-700";
      case "تم الشحن":
        return "bg-blue-100 text-blue-700";
      case "تم التسليم":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div dir="rtl" className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center">لوحة الطلبات</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">لا يوجد طلبات حتى الآن</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl shadow-xl p-5 flex flex-col"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">طلب رقم #{order.orderNumber}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${statusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-2">
                {new Date(order.date).toLocaleString("ar-EG")}
              </p>

              <div className="text-sm space-y-1 text-gray-700">
                <p><b>الاسم:</b> {order.user}</p>
                <p><b>الهاتف:</b> {order.phone}</p>
                <p><b>الدولة:</b> {order.country}</p>
                <p><b>المدينة:</b> {order.city}</p>
                <p><b>العنوان:</b> {order.address}</p>
              </div>

              <div className="border-t mt-3 pt-3">
                <h4 className="font-semibold mb-2">المنتجات</h4>
                <ul className="space-y-1 max-h-32 overflow-y-auto text-sm">
                  {order.items?.map((p, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{p.name} × {p.quantity}</span>
                      <span>{(p.price * p.quantity).toFixed(2)} ج</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t mt-3 pt-3 flex justify-between items-center">
                <span className="font-bold">الإجمالي</span>
                <span className="font-bold text-green-600">
                  {order.total.toFixed(2)} ج
                </span>
              </div>

              <select
                value={order.status}
                onChange={(e) => changeStatus(order.id, e.target.value)}
                className="mt-3 border p-2 rounded-lg text-sm"
              >
                <option value="جديد">جديد</option>
                <option value="قيد التجهيز">قيد التجهيز</option>
                <option value="تم الشحن">تم الشحن</option>
                <option value="تم التسليم">تم التسليم</option>
              </select>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
