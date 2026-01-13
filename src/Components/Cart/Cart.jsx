// src/Components/Cart/CartPage.jsx
import { useCart } from "../context/CartContext";
import { database } from "../../firebase";
import { ref, push } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useState } from "react";

export default function CartPage() {
  const { cart, totalPrice, setCart } = useCart();
  const navigate = useNavigate();
  const auth = getAuth();

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    country: "",
    city: "",
  });

  // تحديث كمية المنتج
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return; // لا تسمح بالكمية أقل من 1
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  // حذف المنتج من الكارت
  const handleDelete = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return alert("Cart is empty!");
    if (!userInfo.name || !userInfo.phone || !userInfo.country || !userInfo.city) {
      return alert("Please fill all your details!");
    }

    const orderData = {
      userId: auth.currentUser.uid,
      user: userInfo.name,
      phone: userInfo.phone,
      country: userInfo.country,
      city: userInfo.city,
      items: cart.map((p) => ({
        id: p.id,
        name: p.name,
        quantity: p.quantity,
        price: p.price,
      })),
      total: totalPrice,
      date: new Date().toISOString(),
    };

    const ordersRef = ref(database, `orders/${auth.currentUser.uid}`);
    push(ordersRef, orderData)
      .then(() => {
        alert("Order placed successfully!");

        let msg = `Hello, I want to place this order:\n\n`;
        orderData.items.forEach((p) => {
          msg += `${p.name} x${p.quantity} - $${p.price * p.quantity}\n`;
        });
        msg += `\nTotal: $${orderData.total}`;
        msg += `\n\nName: ${orderData.user}`;
        msg += `\nPhone: ${orderData.phone}`;
        msg += `\nCountry: ${orderData.country}`;
        msg += `\nCity: ${orderData.city}`;

        const waNumber = "201095593274";
        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, "_blank");

        setCart([]);
        navigate("/products");
      })
      .catch((err) => {
        console.error("Error placing order:", err);
        alert("Failed to place order.");
      });
  };

  return (
    <div className="p-6 h-screen mt-14">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((p) => (
            <div key={p.id} className="flex justify-between items-center bg-white p-4 rounded shadow">
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                <p>Quantity: 
                  <input
                    type="number"
                    value={p.quantity}
                    min={1}
                    onChange={(e) => handleUpdateQuantity(p.id, parseInt(e.target.value))}
                    className="border ml-2 p-1 w-16 text-center rounded"
                  />
                </p>
                <p>Price: ${p.price * p.quantity}</p>
              </div>
              <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded" />
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 ml-4"
              >
                Delete
              </button>
            </div>
          ))}

          <div className="mt-4 space-y-2">
            <input
              type="text"
              placeholder="Your Name"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={userInfo.phone}
              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Country"
              value={userInfo.country}
              onChange={(e) => setUserInfo({ ...userInfo, country: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="City"
              value={userInfo.city}
              onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Total:</span>
            <span>${totalPrice}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Place Order & Send to WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
