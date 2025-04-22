import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HttpClient } from "../server/client/http";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const tokenIfLoggedIn = localStorage.getItem("accessToken");

  // Cart and Wishlist states
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : {};
  });

  const [wishList, setWishList] = useState([]);


  if (localStorage.getItem("accessToken") === null || localStorage.getItem("accessToken") === undefined) {
    localStorage.setItem("cart", JSON.stringify(cart))
  }



  console.log("tokenIfLoggedIntokenIfLoggedIn",tokenIfLoggedIn)



  const fetchServerData = async () => {
    if (!tokenIfLoggedIn) return;

    try {
      const cartResponse = await HttpClient.get("/cart");
      setCart(cartResponse.data);

    } catch (error) {
    }
  };

  useEffect(() => {
    fetchServerData();
  }, [tokenIfLoggedIn]);

  // Add item to cart
  const addToCartContext = (product, selectedSize, selectedQuantity) => {
    const productKey = `${product.productId}${selectedSize}${product.colors?.[0]?.colorCode || ""}`;

    setCart((prevCart) => {
      if (prevCart[productKey]) {
        toast.info("Product already in cart");
        return prevCart;
      }

      toast.success("Product added to cart");
      return {
        ...prevCart,
        [productKey]: {
          ...product,
          size: selectedSize,
          quantity: selectedQuantity,
          color: product.colors?.[0]?.colorCode || "Default Color",
          name: product.name,
          bannerImage: product.bannerImage,
          price: product.price,
        },
      };
    });
  };

  // Update item quantity in cart
  const updateCartItem = (productKey, action) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };

      if (updatedCart[productKey]) {
        if (action === "increment") {
          updatedCart[productKey].quantity += 1;
        } else if (action === "decrement" && updatedCart[productKey].quantity > 1) {
          updatedCart[productKey].quantity -= 1;
        }
      }

      return updatedCart;
    });
  };

  // Remove item from cart
  const removeFromCartContext = (productKey) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      delete updatedCart[productKey];
      toast.info("Product removed from cart");
      return updatedCart;
    });
  };

  const contextValue = {
    cart,
    wishList,
    addToCartContext,
    updateCartItem,
    removeFromCartContext,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export default CartProvider;
