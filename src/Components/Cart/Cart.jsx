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

  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    country: "",
    city: "",
    address: "",
  });

  const fetchCities = async (country) => {
    setLoadingCities(true);
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country }),
        }
      );
      const data = await res.json();
      setCities(data.data || []);
    } catch (err) {
      console.error(err);
      setCities([]);
    }
    setLoadingCities(false);
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  const handleDelete = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return alert("السلة فارغة!");

    if (
      !userInfo.name ||
      !userInfo.phone ||
      !userInfo.country ||
      !userInfo.city ||
      !userInfo.address
    ) {
      return alert("من فضلك أكمل كل البيانات!");
    }

    const orderData = {
      userId: auth.currentUser.uid,
      user: userInfo.name,
      phone: userInfo.phone,
      country: userInfo.country,
      city: userInfo.city,
      address: userInfo.address,
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
    push(ordersRef, orderData).then(() => {
      alert("تم إرسال الطلب بنجاح ✅");

      let msg = `مرحباً، أريد تأكيد هذا الطلب:\n\n`;
      orderData.items.forEach((p) => {
        msg += `${p.name} × ${p.quantity} - ${p.price * p.quantity} جنيه\n`;
      });
      msg += `\nالإجمالي: ${orderData.total} جنيه`;
      msg += `\n\nالاسم: ${orderData.user}`;
      msg += `\nالهاتف: ${orderData.phone}`;
      msg += `\nالدولة: ${orderData.country}`;
      msg += `\nالمدينة: ${orderData.city}`;
      msg += `\nالعنوان: ${orderData.address}`;

      const waNumber = "201095593274";
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, "_blank");

      setCart([]);
      navigate("/products");
    });
  };

  return (
    <div className="p-6 min-h-screen mt-14 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-center">سلة المشتريات</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">السلة فارغة حالياً.</p>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {cart.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
            >
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="mt-1">
                  الكمية:
                  <input
                    type="number"
                    value={p.quantity}
                    min={1}
                    onChange={(e) =>
                      handleUpdateQuantity(p.id, parseInt(e.target.value))
                    }
                    className="border ml-2 p-1 w-16 text-center rounded"
                  />
                </p>
                <p className="mt-1">
                  السعر: {p.price * p.quantity} جنيه مصري
                </p>
              </div>

              <img
                src={p.image}
                alt={p.name}
                className="w-20 h-20 object-cover rounded-lg"
              />

              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          ))}

          {/* بيانات المستخدم */}
          <div className="bg-white p-5 rounded-xl shadow space-y-3">

            <input
              type="text"
              placeholder="الاسم بالكامل"
              value={userInfo.name}
              onChange={(e) =>
                setUserInfo({ ...userInfo, name: e.target.value })
              }
              className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              type="text"
              placeholder="رقم الهاتف"
              value={userInfo.phone}
              onChange={(e) =>
                setUserInfo({ ...userInfo, phone: e.target.value })
              }
              className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none"
            />

            <select
              value={userInfo.country}
              onChange={(e) => {
                const c = e.target.value;
                setUserInfo({ ...userInfo, country: c, city: "" });
                fetchCities(c);
              }}
              className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">اختر الدولة</option>
              <option value="Egypt">Egypt</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
            </select>

            <select
              value={userInfo.city}
              onChange={(e) =>
                setUserInfo({ ...userInfo, city: e.target.value })
              }
              className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none"
              disabled={!userInfo.country}
            >
              <option value="">
                {loadingCities ? "جاري تحميل المدن..." : "اختر المدينة"}
              </option>
              {cities.map((city, i) => (
                <option key={i} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <textarea
              placeholder="العنوان بالتفصيل (شارع، عمارة، دور، شقة...)"
              value={userInfo.address}
              onChange={(e) =>
                setUserInfo({ ...userInfo, address: e.target.value })
              }
              rows={3}
              className="border p-3 rounded-lg w-full resize-none 
                         focus:outline-none focus:ring-2 focus:ring-green-500
                         placeholder-gray-400 shadow-sm"
            />
          </div>

          <div className="flex justify-between font-bold text-lg mt-4">
            <span>الإجمالي:</span>
            <span>{totalPrice} جنيه مصري</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 w-full text-lg font-semibold shadow"
          >
            تأكيد الطلب
          </button>
        </div>
      )}
    </div>
  );
}
