// src/Components/Dashboard/Orders.jsx
import { useEffect, useState } from "react";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import { motion } from "framer-motion";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    if (!auth.currentUser) return;

    const ordersRef = ref(database, `orders/${auth.currentUser.uid}`);
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const formatted = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setOrders(formatted.reverse());
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  return (
    <div dir="rtl" className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        الطلبات الواردة
      </h2>

      {orders.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 text-center"
        >
          لا يوجد طلبات حتى الآن
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white rounded-3xl shadow-xl p-5 flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-gray-800">
                  {order.user}
                </h3>
                <span className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString("ar-EG")}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-1 text-gray-600 text-sm">
                <p><span className="font-semibold">الهاتف:</span> {order.phone}</p>
                <p><span className="font-semibold">الدولة:</span> {order.country}</p>
                <p><span className="font-semibold">المدينة:</span> {order.city}</p>
              </div>

              {/* Items */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <h4 className="font-semibold text-gray-700 mb-2">
                  المنتجات:
                </h4>
                <ul className="space-y-1 max-h-32 overflow-y-auto text-sm">
                  {order.items.map((p) => (
                    <li
                      key={p.id}
                      className="flex justify-between text-gray-600"
                    >
                      <span>{p.name} × {p.quantity}</span>
                      <span className="font-semibold">
                        {p.price * p.quantity} ج
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total */}
              <div className="mt-auto pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold text-gray-800">الإجمالي:</span>
                <span className="font-bold text-green-600 text-lg">
                  {order.total} ج
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
