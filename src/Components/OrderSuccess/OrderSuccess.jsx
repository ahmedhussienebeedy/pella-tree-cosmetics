import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // تأكيد مسح السلة
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartCleared"));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
        <h1 className="text-4xl font-bold text-green-600">✅ تم تأكيد الطلب!</h1>

        <p className="text-lg text-gray-700">
          شكراً لتسوقك معنا، تم تسجيل طلبك بنجاح.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-green-600 text-white py-2 px-6 rounded-xl font-bold hover:bg-green-700 transition"
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  );
}
