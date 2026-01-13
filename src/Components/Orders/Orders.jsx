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
    const ordersRef = ref(database, `orders/${auth.currentUser.uid}`);
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const formatted = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setOrders(formatted);
    });

    return () => unsubscribe();
  }, [auth.currentUser.uid]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              className="bg-white rounded-2xl shadow-lg p-5 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg text-gray-700">{order.user}</h3>
                <span className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</span>
              </div>

              <p className="text-gray-600 mb-1"><span className="font-semibold">Phone:</span> {order.phone}</p>
              <p className="text-gray-600 mb-1"><span className="font-semibold">Country:</span> {order.country}</p>
              <p className="text-gray-600 mb-2"><span className="font-semibold">City:</span> {order.city}</p>

              <div className="border-t border-gray-200 pt-2 mb-2">
                <h4 className="font-semibold text-gray-700 mb-1">Items:</h4>
                <ul className="space-y-1 max-h-32 overflow-y-auto">
                  {order.items.map((p) => (
                    <li key={p.id} className="text-gray-600 flex justify-between">
                      <span>{p.name} x{p.quantity}</span>
                      <span>EGP{p.price * p.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-2 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold text-gray-800">Total:</span>
                <span className="font-bold text-green-600">EGP{order.total}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
