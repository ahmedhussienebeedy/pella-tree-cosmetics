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

  const countries = [
    { en: "Egypt", ar: "مصر" },
    { en: "Saudi Arabia", ar: "السعودية" },
    { en: "United Arab Emirates", ar: "الإمارات" },
  ];

  // 🔥 fetch المدن + ترجمة + ترتيب عربي
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

      if (!data.data) {
        setCities([]);
        setLoadingCities(false);
        return;
      }

      const translatedCities = await Promise.all(
        data.data.map(async (city) => {
          try {
            const t = await fetch(
              `https://api.mymemory.translated.net/get?q=${city}&langpair=en|ar`
            );
            const tr = await t.json();
            return tr.responseData.translatedText || city;
          } catch {
            return city;
          }
        })
      );

      const sortedArabicCities = translatedCities.sort((a, b) =>
        a.localeCompare(b, "ar")
      );

      setCities(sortedArabicCities);
    } catch (err) {
      console.error(err);
      setCities([]);
    }

    setLoadingCities(false);
  };

  const handlePlaceOrder = () => {
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
      items: cart,
      total: totalPrice,
      date: new Date().toISOString(),
    };

    const ordersRef = ref(database, `orders/${auth.currentUser.uid}`);
    push(ordersRef, orderData).then(() => {
      setCart([]);
      navigate("/order-success"); // تحويل لصفحة نجاح الطلب
    });
  };

  return (
    <div className="p-6 min-h-screen mt-14 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-center">سلة المشتريات</h1>

      <input
        type="text"
        placeholder="الاسم بالكامل"
        value={userInfo.name}
        onChange={(e) =>
          setUserInfo({ ...userInfo, name: e.target.value })
        }
        className="border p-2 rounded-lg w-full mb-2"
      />

      <input
        type="text"
        placeholder="رقم الهاتف"
        value={userInfo.phone}
        onChange={(e) =>
          setUserInfo({ ...userInfo, phone: e.target.value })
        }
        className="border p-2 rounded-lg w-full mb-2"
      />

      <select
        value={userInfo.country}
        onChange={(e) => {
          const c = e.target.value;
          setUserInfo({ ...userInfo, country: c, city: "" });
          fetchCities(c);
        }}
        className="border p-2 rounded-lg w-full mb-2"
      >
        <option value="">اختر الدولة</option>
        {countries.map((c, i) => (
          <option key={i} value={c.en}>
            {c.ar}
          </option>
        ))}
      </select>

      <select
        value={userInfo.city}
        onChange={(e) =>
          setUserInfo({ ...userInfo, city: e.target.value })
        }
        className="border p-2 rounded-lg w-full mb-2"
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
        placeholder="العنوان بالتفصيل"
        value={userInfo.address}
        onChange={(e) =>
          setUserInfo({ ...userInfo, address: e.target.value })
        }
        rows={3}
        className="border p-2 rounded-lg w-full mb-4"
      />

      <div className="flex justify-between font-bold mb-4">
        <span>الإجمالي:</span>
        <span>{totalPrice} جنيه</span>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="bg-green-600 text-white px-6 py-3 rounded-xl w-full"
      >
        تأكيد الطلب
      </button>
    </div>
  );
}
