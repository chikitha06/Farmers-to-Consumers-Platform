import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    // item: { product, seller, sellerName, name, image, price, qty }
    setCartItems((prev) => {
      const exists = prev.find(
        (x) => x.product === item.product && x.seller === item.seller
      );
      if (exists) {
        return prev.map((x) =>
          x.product === item.product && x.seller === item.seller
            ? { ...x, qty: x.qty + item.qty }
            : x
        );
      }
      return [...prev, item];
    });
  };

  const updateQty = (productId, sellerId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId, sellerId);
      return;
    }
    setCartItems((prev) =>
      prev.map((x) =>
        x.product === productId && x.seller === sellerId ? { ...x, qty } : x
      )
    );
  };

  const removeFromCart = (productId, sellerId) => {
    setCartItems((prev) =>
      prev.filter((x) => !(x.product === productId && x.seller === sellerId))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQty, removeFromCart, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);