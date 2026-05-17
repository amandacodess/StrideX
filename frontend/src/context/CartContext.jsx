import { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size = '', variant = '', qty = 1) => {
    setCartItems((prev) => {
      const key = product._id + size + variant;
      const existing = prev.find((i) => i._id + i.size + i.variant === key);
      if (existing) {
        return prev.map((i) =>
          i._id + i.size + i.variant === key
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { ...product, size, variant, quantity: qty }];
    });
  };

  const removeFromCart = (productId, size = '', variant = '') => {
    setCartItems((prev) =>
      prev.filter((i) => !(i._id === productId && i.size === size && i.variant === variant))
    );
  };

  const updateQty = (productId, size, variant, qty) => {
    if (qty <= 0) { removeFromCart(productId, size, variant); return; }
    setCartItems((prev) =>
      prev.map((i) =>
        i._id === productId && i.size === size && i.variant === variant
          ? { ...i, quantity: qty }
          : i
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
