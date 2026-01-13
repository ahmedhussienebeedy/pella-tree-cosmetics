import * as React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HeroUIProvider } from "@heroui/react";
import { CartProvider } from "./Components/context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <HeroUIProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </HeroUIProvider>
);
