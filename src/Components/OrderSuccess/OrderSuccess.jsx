// src/Components/Cart/OrderSuccess.jsx
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md w-full animate-scale">

        <FaCheckCircle className="text-green-600 text-7xl mx-auto mb-5" />

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          تم تأكيد الطلب بنجاح
        </h1>

        <p className="text-gray-500 mb-6">
          سيتم التواصل معك قريباً لتأكيد التفاصيل ❤️
        </p>

        <button
          onClick={() => navigate("/products")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold transition"
        >
          الرجوع للمنتجات
        </button>

      </div>
    </div>
  );
}
