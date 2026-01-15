// src/Components/Cart/CartPage.jsx
import { useCart } from "../context/CartContext";
import { database } from "../../firebase";
import { ref, push, get, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const countriesData = {
  مصر: [
    "القاهرة", "الجيزة", "الإسكندرية", "السويس", "بورسعيد",
    "الاسماعيلية", "المنصورة", "الزقازيق", "الشرقية", "المنيا",
    "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان", "الفيوم",
    "بني سويف", "الدقهلية", "الغربية", "كفر الشيخ", "المنوفية",
    "الإسماعيلية", "مرسى مطروح", "الوادي الجديد", "شمال سيناء",
    "جنوب سيناء"
  ],
  السعودية: [
    "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام",
    "الخبر", "الهفوف", "بريدة", "تبوك", "خميس مشيط",
    "الأحساء", "حائل", "جازان", "نجران", "عرعر",
    "جازان", "الطائف", "الجبيل", "الظهران", "بيشة"
  ],
  الإمارات: [
    "دبي", "أبوظبي", "الشارقة", "العين", "رأس الخيمة",
    "الفجيرة", "أم القيوين", "عجمان"
  ]
};

export default function CartPage() {
  const { cart, totalPrice, setCart } = useCart();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    country: "",
    city: "",
    customCity: "",
    address: "",
  });

  const updateQty = (id, type) => {
    const updated = cart.map(p => {
      if (p.id === id) {
        let q = p.quantity || 1;
        if (type === "plus") q++;
        if (type === "minus") q = Math.max(1, q - 1);
        return { ...p, quantity: q };
      }
      return p;
    });
    setCart(updated);
  };

  const deleteItem = (id) => {
    setCart(cart.filter(p => p.id !== id));
  };

  const handlePlaceOrder = async () => {
    const finalCity = userInfo.customCity || userInfo.city;

    if (!userInfo.name || !userInfo.phone || !userInfo.country || !finalCity || !userInfo.address) {
      return alert("من فضلك أكمل كل البيانات!");
    }

    const normalizedCart = cart.map(p => ({
      id: p.id,
      name: p.name || p.title || p.productName,
      price: p.price || p.cost || p.newPrice || 0,
      quantity: p.quantity || 1
    }));

    const now = new Date();
    const invoiceId = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-` +
                      `${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}-` +
                      `${Math.floor(Math.random()*900+100)}`;

    const counterRef = ref(database, "ordersCounter");
    const snapshot = await get(counterRef);
    const lastNumber = snapshot.val() || 0;
    const newNumber = lastNumber + 1;

    const orderData = {
      orderNumber: newNumber,
      invoiceId,
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

    const allOrdersRef = ref(database, `ordersAll`);
    await push(allOrdersRef, orderData);
    await set(counterRef, newNumber);

    setCart([]);
    navigate("/order-success");
  };

  return (
    <div className="p-4 md:p-6 min-h-screen mt-14 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">🛒 سلة المشتريات</h1>

      {/* بيانات العميل */}
      <div className="bg-white rounded-2xl shadow-xl p-5 mb-6 space-y-3">
        <input type="text" placeholder="الاسم بالكامل" value={userInfo.name} onChange={(e)=>setUserInfo({...userInfo, name:e.target.value})} className="border p-2 rounded-lg w-full" />
        <input type="text" placeholder="رقم الهاتف" value={userInfo.phone} onChange={(e)=>setUserInfo({...userInfo, phone:e.target.value})} className="border p-2 rounded-lg w-full" />

        <select value={userInfo.country} onChange={(e)=>setUserInfo({...userInfo, country:e.target.value, city:"", customCity:""})} className="border p-2 rounded-lg w-full">
          <option value="">اختر الدولة</option>
          {Object.keys(countriesData).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {userInfo.country && (
          <select value={userInfo.city} onChange={(e)=>setUserInfo({...userInfo, city:e.target.value})} className="border p-2 rounded-lg w-full">
            <option value="">اختر المدينة</option>
            {countriesData[userInfo.country].map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        )}

        <input type="text" placeholder="أو اكتب اسم المدينة يدويًا (اختياري)" value={userInfo.customCity} onChange={(e)=>setUserInfo({...userInfo, customCity:e.target.value})} className="border p-2 rounded-lg w-full" />
        <textarea placeholder="العنوان بالتفصيل" value={userInfo.address} onChange={(e)=>setUserInfo({...userInfo, address:e.target.value})} rows={3} className="border p-2 rounded-lg w-full" />
      </div>

      {/* عرض المنتجات */}
      <div className="bg-white rounded-2xl shadow-xl p-5 mb-6 space-y-4">
        {cart.length === 0 ? <p className="text-center text-gray-500">السلة فارغة</p> :
          cart.map(p => (
            <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3">
              <div className="flex-1">
                <h3 className="font-bold">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.price} جنيه</p>
              </div>

              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <button onClick={()=>updateQty(p.id,"minus")} className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold hover:bg-red-200">−</button>
                <span className="font-bold">{p.quantity || 1}</span>
                <button onClick={()=>updateQty(p.id,"plus")} className="w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold hover:bg-green-200">+</button>
              </div>

              <div className="text-right mt-2 sm:mt-0">
                <p className="font-bold">{((p.price)*(p.quantity||1)).toFixed(2)} ج</p>
                <button onClick={()=>deleteItem(p.id)} className="text-red-500 text-sm hover:underline">حذف</button>
              </div>
            </div>
          ))
        }
      </div>

      {/* الإجمالي */}
      <div className="bg-white rounded-xl shadow p-4 mb-4 flex justify-between font-bold text-lg">
        <span>الإجمالي:</span>
        <span>{totalPrice.toFixed(2)} جنيه</span>
      </div>

      {/* زر تأكيد الطلب */}
      <button onClick={handlePlaceOrder} className="w-full bg-green-600 text-white py-4 rounded-2xl text-lg font-bold hover:bg-green-700 transition">
        تأكيد الطلب
      </button>
    </div>
  );
}
