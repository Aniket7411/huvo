import React, { createContext, useState } from "react";
import { toast } from "react-toastify";

// Create the Cart context
export const CartContext = createContext();

// CartProvider component to manage cart state and provide functions
export const CartProvider = ({ children }) => {
  // State to store cart items
  const [cart, setCart] = useState([]);
  console.log("cartcartca",cart)

  /**
   * Add a product to the cart
   * @param {Object} product - Product to be added to the cart
   */
  const addToCartContext = (product) => {
    setCart((prevCart) => {
      // Check if the product already exists in the cart
      const isProductInCart = prevCart.some((item) => item.productId === product.productId);

      // If the product is not in the cart, add it
      if (!isProductInCart) {
        return [...prevCart, product];
       
      }

      // Otherwise, return the cart unchanged
      return prevCart;
    });
  };

  const updateCartItem = (productId, addRemove) => {
    console.log("Updating productId", productId, "Action:", addRemove);
  
    setCart((prevCart) =>
      
      prevCart.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity:
                addRemove === "increament"
                  ? item.quantity + 1
                  : item.quantity > 1
                  ? item.quantity - 1
                  : item.quantity, // Prevent quantity from going below 1
            }
          : item
      )
    );
  };
  

  const removeFromCartContext = (productId) => {

    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
    
  };

  // Context value containing the cart state and functions
  const contextValue = { cart, addToCartContext,updateCartItem, removeFromCartContext };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
