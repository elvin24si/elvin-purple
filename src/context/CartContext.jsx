// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("member_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("member_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          qty: 1,
          pointsToUse: product.allowCashPayment === false ? (product.pointsPrice || 0) : 0,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQty = (productId, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  };

  const updatePointsToUse = (productId, points) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, pointsToUse: Math.max(0, points) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Math for totals
  const totalPointsUsed = cart.reduce((sum, item) => {
    return sum + (item.pointsToUse || 0) * item.qty;
  }, 0);

  const totalCash = cart.reduce((sum, item) => {
    if (item.allowCashPayment === false) return sum;
    const discount = (item.pointsToUse || 0) * 1000;
    const cashPerItem = Math.max(0, item.price - discount);
    return sum + cashPerItem * item.qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        updatePointsToUse,
        clearCart,
        cartCount,
        totalPointsUsed,
        totalCash,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
