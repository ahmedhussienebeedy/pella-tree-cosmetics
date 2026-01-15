import { createHashRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Products from "./Components/Products/Products";
import About from "./Components/About/About";
import Login from "./Components/Login/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import DashAdd from "./Components/DashAddProduct/DashAdd";
import Orders from "./Components/Orders/Orders"; // خليه من Dashboard folder
import Cart from "./Components/Cart/Cart";
import OrderSuccess from "./Components/OrderSuccess/OrderSuccess"; // نفس folder ال Cart

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "about", element: <About /> },
      { path: "cart", element: <Cart /> },
      { path: "order-success", element: <OrderSuccess /> }, 
    ],
  },
  { path: "login", element: <Login /> },
  {
    path: "dashboard/*",
    element: <Dashboard />,
    children: [
      { path: "add-product", element: <DashAdd /> },
      { path: "orders", element: <Orders /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
