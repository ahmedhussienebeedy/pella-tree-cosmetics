import { useState } from "react";
import DashProducts from "../DashboardProduct/DashProduct";
import DashAdd from "../DashAddProduct/DashAdd";
import Orders from "../Orders/Orders";
import Analytics from "../Analytics/Analytics";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Navbar */}
      <nav className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab("products")} className={`px-4 py-2 rounded ${activeTab === "products" ? "bg-blue-600 text-white" : "bg-white"}`}>Products</button>
        <button onClick={() => setActiveTab("add")} className={`px-4 py-2 rounded ${activeTab === "add" ? "bg-blue-600 text-white" : "bg-white"}`}>Add Product</button>
        <button onClick={() => setActiveTab("orders")} className={`px-4 py-2 rounded ${activeTab === "orders" ? "bg-blue-600 text-white" : "bg-white"}`}>Orders</button>
        <button onClick={() => setActiveTab("analytics")} className={`px-4 py-2 rounded ${activeTab === "analytics" ? "bg-blue-600 text-white" : "bg-white"}`}>Analytics</button>
      </nav>

      {/* Active Tab */}
      <div>
        {activeTab === "products" && <DashProducts />}
        {activeTab === "add" && <DashAdd />}
        {activeTab === "orders" && <Orders />}
        {activeTab === "analytics" && <Analytics />}
      </div>
    </div>
  );
}
