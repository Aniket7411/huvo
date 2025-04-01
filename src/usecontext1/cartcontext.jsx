import React, { createContext, useState } from "react";
import { toast } from "react-toastify";

// Create the Cart context
export const CartContext = createContext();

// CartProvider component to manage cart state and provide functions
export const CartProvider = ({ children }) => {
  // State to store cart items
  const [cart, setCart] = useState([]);

  console.log("cartcartca", cart)




  /**
   * Add a product to the cart
   * @param {Object} product - Product to be added to the cart
   */
  const addToCartContext = (product, selectedSize) => {
 

      console.log("productpddroduct",product?.colors[0]?.colorCode)
    setCart((prevCart) => {
      // Check if the product is already in the cart
      const isProductInCart = prevCart.some((item) => item.productId === product.productId);
  
      if (!isProductInCart) {
        toast.success("Product added to cart",); // Notify only when added
        return [...prevCart, product];
      }
  
      return prevCart; // If already in the cart, return unchanged
    });
  };

  const updateCartItem = (productId, addRemove) => {
    console.log("Updating product", productId, "Action:", addRemove);

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
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.productId !== productId);
      
      // Show a toast notification
      toast.info("Product removed from cart");
  
      return updatedCart;
    });
  };

  // Context value containing the cart state and functions
  const contextValue = { cart, addToCartContext, updateCartItem, removeFromCartContext };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
