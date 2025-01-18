import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const response = await axios.get('http://localhost:8080/cart/get-cart-products');
      setCart(response.data);
    };

    fetchCart();
  }, []);

  const addToCart = async (product) => {
    const response = await axios.post('http://localhost:8080/cart/add-to-cart', product);
    setCart(response.data);
  };

  const removeFromCart = async (productId) => {
    const response = await axios.delete(`http://localhost:8080/cart/remove-product-from-cart/${productId}`);
    setCart(response.data);
  };

  const clearCart = async () => {
    const response = await axios.delete('http://localhost:8080/cart/remove-all-from-cart');
    setCart(response.data);
  };

  const incrementQuantity = async (productId) => {
    const response = await axios.post(`http://localhost:8080/cart/increment-quantity/${productId}`);
    setCart(response.data);
  };

  const decrementQuantity = async (productId) => {
    const response = await axios.post(`http://localhost:8080/cart/decrement-quantity/${productId}`);
    setCart(response.data);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, incrementQuantity, decrementQuantity }}>
      {children}
    </CartContext.Provider>
  );
};