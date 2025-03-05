import React, { createContext, useState } from "react";

// Create the Cart context
export const CartContext = createContext();

// CartProvider component to manage cart state and provide functions
export const CartProvider = ({ children }) => {
  // State to store cart items
  const [cart, setCart] = useState([]);

  /**
   * Add a product to the cart
   * @param {Object} product - Product to be added to the cart
   */
  const addToCartContext = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  /**
   * Remove a product from the cart
   * @param {string} productId - The ID of the product to remove
   */
  const removeFromCartContext = (productId) => {

    console.log("remove productId", productId)
    setCart((prevCart) => prevCart.filter(() => productId));
  };

  // Context value containing the cart state and functions
  const contextValue = { cart, addToCartContext, removeFromCartContext };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
