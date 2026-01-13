// src/Components/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage for guest users (optional)
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const existing = cart.find((p) => p.id === product.id);
    if (existing) {
      setCart(
        cart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((p) => p.id !== productId));
  };

  const decreaseQuantity = (productId) => {
    const existing = cart.find((p) => p.id === productId);
    if (existing.quantity === 1) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
        )
      );
    }
  };

  const totalPrice = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        totalPrice,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
