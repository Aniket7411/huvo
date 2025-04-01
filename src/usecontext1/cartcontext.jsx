import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HttpClient } from "../server/client/http";

// Create the Cart context
export const CartContext = createContext();

// CartProvider component to manage cart state and provide functions
export const CartProvider = ({ children }) => {
  // State to store cart items
  const [cart, setCart] = useState([]);
  const [wishList, setWishList] = useState([])
  const [cartList,setCartList] = useState([])

  console.log("cartcartca", cart)




  /**
   * Add a product to the cart
   * @param {Object} product - Product to be added to the cart
   */
  const addToCartContext = (product, selectedSize) => {


    console.log("productpddroduct", product?.colors[0]?.colorCode)
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


  
    const getCartData = async () => {
  
      try {
        const response = await HttpClient.get('/cart');
  
        console.log("aniketdd",response)

  
      } catch (err) {
        toast.error(err.message);
      }
    }



  const getWishList = async () => {
    try {
      const response = await HttpClient.get("/wishlist"); // Await the response
      console.log("aniket", response.data);
      setWishList(wishList)
    } catch (error) {
      console.log("Error fetching wishlist:", error);
    }
  };
  
  useEffect(() => {
    getCartData();  // Assuming this function updates the cart data in the UI

    getWishList();
  }, []); // Empty dependency array ensures it runs only once on mount
  

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
