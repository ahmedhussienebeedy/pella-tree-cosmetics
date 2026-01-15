// src/Components/Cart/OrderSuccess.jsx
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <FaCheckCircle className="text-green-500 text-7xl mb-4" />
      <h2 className="text-2xl font-bold mb-2">تم إرسال الطلب بنجاح</h2>
      <p className="mb-6 text-gray-600">سيتم التواصل معك قريبًا</p>
      <button onClick={() => navigate("/products")} className="bg-blue-600 text-white px-6 py-3 rounded-xl">
        الذهاب للمنتجات
      </button>
    </div>
  );
}
