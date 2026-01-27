// src/Components/Cart/CartPage.jsx
import { useCart } from "../context/CartContext";
import { database } from "../../firebase";
import { ref, push, get, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const countriesData = {
  مصر: ["القاهرة","الجيزة","الإسكندرية","السويس","بورسعيد","الاسماعيلية","المنصورة","الزقازيق","الشرقية","المنيا","أسيوط","سوهاج","قنا","الأقصر","أسوان","الفيوم","بني سويف","الدقهلية","الغربية","كفر الشيخ","المنوفية","مرسى مطروح","الوادي الجديد","شمال سيناء","جنوب سيناء"],
  السعودية: ["الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام","الخبر","الهفوف","بريدة","تبوك","خميس مشيط","الأحساء","حائل","جازان","نجران","عرعر","الطائف","الجبيل","الظهران","بيشة"],
  الإمارات: ["دبي","أبوظبي","الشارقة","العين","رأس الخيمة","الفجيرة","أم القيوين","عجمان"]
};

export default function CartPage() {
  const {
    cart,
    totalPrice,
    increaseQty,
    decreaseQuantity,
    removeItem,
    addToCart
  } = useCart();

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    country: "",
    city: "",
    customCity: "",
    address: "",
  });

  /* تحميل السلة من localStorage لو context فاضي */
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart && cart.length === 0) {
      JSON.parse(savedCart).forEach(p => addToCartFromStorage(p));
    }
  }, []);

  const addToCartFromStorage = (product) => {
    const existing = cart.find(p => p.id === product.id);

    if (existing) {
      increaseQty(product.id);
    } else {
      addToCart(product);

      setTimeout(() => {
        const diff = product.quantity - 1;
        for (let i = 0; i < diff; i++) increaseQty(product.id);
      }, 50);
    }
  };

  /* ---------- Place Order ---------- */
  const handlePlaceOrder = async () => {
    const finalCity = userInfo.customCity || userInfo.city;

    if (!userInfo.name || !userInfo.phone || !userInfo.country || !finalCity || !userInfo.address) {
      alert("من فضلك أكمل كل البيانات");
      return;
    }

    if (cart.length === 0) {
      alert("السلة فارغة");
      return;
    }

    const normalizedCart = cart.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: p.quantity,
    }));

    const now = new Date();
    const invoiceId = `${now.getFullYear()}${(now.getMonth()+1)
      .toString().padStart(2,"0")}${now.getDate()
      .toString().padStart(2,"0")}-${now.getTime()}`;

    const orderData = {
      user: userInfo.name,
      phone: userInfo.phone,
      country: userInfo.country,
      city: finalCity,
      address: userInfo.address,
      items: normalizedCart,
      total: totalPrice,
      date: now.toISOString(),
      status: "جديد",
    };

    try {
      const counterRef = ref(database, "ordersCounter");
      const snapshot = await get(counterRef);
      const lastNumber = snapshot.val() || 0;
      const newNumber = lastNumber + 1;

      await push(ref(database, "ordersAll"), {
        ...orderData,
        orderNumber: newNumber,
        invoiceId,
      });

      await set(counterRef, newNumber);

      // ✅ بعد نجاح الحفظ روح صفحة orders
      navigate("/order-success");

    } catch (err) {
      console.error("Order save failed:", err);
      alert("حصل خطأ أثناء حفظ الطلب");
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen mt-14 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">🛒 سلة المشتريات</h1>

      {/* بيانات العميل */}
      <div className="bg-white rounded-2xl shadow-xl p-5 mb-6 space-y-3">
        <input className="border p-2 rounded-lg w-full" placeholder="الاسم بالكامل"
          value={userInfo.name} onChange={(e)=>setUserInfo({...userInfo,name:e.target.value})} />

        <input className="border p-2 rounded-lg w-full" placeholder="رقم الهاتف"
          value={userInfo.phone} onChange={(e)=>setUserInfo({...userInfo,phone:e.target.value})} />

        <select className="border p-2 rounded-lg w-full"
          value={userInfo.country}
          onChange={(e)=>setUserInfo({...userInfo,country:e.target.value,city:"",customCity:""})}>
          <option value="">اختر الدولة</option>
          {Object.keys(countriesData).map(c=>(
            <option key={c}>{c}</option>
          ))}
        </select>

        {userInfo.country && (
          <select className="border p-2 rounded-lg w-full"
            value={userInfo.city}
            onChange={(e)=>setUserInfo({...userInfo,city:e.target.value})}>
            <option value="">اختر المدينة</option>
            {countriesData[userInfo.country].map(city=>(
              <option key={city}>{city}</option>
            ))}
          </select>
        )}

        <input className="border p-2 rounded-lg w-full" placeholder="أو اكتب المدينة يدويًا"
          value={userInfo.customCity}
          onChange={(e)=>setUserInfo({...userInfo,customCity:e.target.value})} />

        <textarea rows={3} className="border p-2 rounded-lg w-full" placeholder="العنوان بالتفصيل"
          value={userInfo.address}
          onChange={(e)=>setUserInfo({...userInfo,address:e.target.value})}/>
      </div>

      {/* المنتجات */}
      <div className="bg-white rounded-2xl shadow-xl p-5 mb-6 space-y-4">
        {cart.length===0 ? (
          <p className="text-center text-gray-500">السلة فارغة</p>
        ) : cart.map(p=>(
          <div key={p.id} className="flex flex-col sm:flex-row justify-between border-b pb-3">
            <div>
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.price} × {p.quantity}</p>
            </div>

            <div className="flex gap-2 mt-2">
              <button onClick={()=>decreaseQuantity(p.id)} className="w-8 h-8 bg-red-100 rounded-full">−</button>
              <span>{p.quantity}</span>
              <button onClick={()=>increaseQty(p.id)} className="w-8 h-8 bg-green-100 rounded-full">+</button>
            </div>

            <div className="text-right mt-2">
              <p className="font-bold">{(p.price*p.quantity).toFixed(2)} ج</p>
              <button onClick={()=>removeItem(p.id)} className="text-red-500 text-sm">حذف</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-4 flex justify-between font-bold">
        <span>الإجمالي:</span>
        <span>{totalPrice.toFixed(2)} جنيه</span>
      </div>

      <button onClick={handlePlaceOrder}
        className="w-full bg-green-600 text-white py-4 rounded-2xl text-lg font-bold">
        تأكيد الطلب
      </button>
    </div>
  );
}
