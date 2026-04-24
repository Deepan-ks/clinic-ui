// ── CART HOOK ───────────────────────────────────────────────────

import { useState, useCallback } from "react";

export function useCart() {
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((service) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === service.serviceId);
      if (exists) {
        return prev.map((item) =>
          item.id === service.serviceId
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: service.serviceId,
          name: service.serviceName,
          price: service.price,
          qty: 1,
        },
      ];
    });
  }, []);

  const setQty = useCallback((id, qty) => {
    setCart((prev) => {
      if (qty < 1) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) =>
        item.id === id ? { ...item, qty } : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return {
    cart,
    setCart,
    addToCart,
    setQty,
    clearCart,
    subtotal,
    totalItems,
  };
}