import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HttpClient } from "../server/client/http";

export const CartContext = createContext();


const tokenIfLoggedIn = localStorage.getItem("accessToken")


export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage initially
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [wishList, setWishList] = useState([]);
  const [cartList, setCartList] = useState([]);

  console.log("cartcartca", cart);

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCartContext = (product, selectedSize, selectedQuantity) => {
    console.log("product color code:", product?.colors[0]?.colorCode);

    setCart((prevCart) => {
      const isProductInCart = prevCart.some(
        (item) =>
          item.productId === product.productId &&
          item.size === selectedSize &&
          item.color === product?.colors[0]?.colorCode
      );

      if (!isProductInCart) {
        toast.success("Product added to cart");

        const newCartItem = {
          ...product,
          size: selectedSize,
          quantity: selectedQuantity,
          color: product?.colors[0]?.colorCode,
        };

        return [...prevCart, newCartItem];
      }

      return prevCart;
    });
  };
  const updateCartItem = (productId, addRemove) => {
    console.log("Updating product:", productId, "| Action:", addRemove);

    setCart((prevCart) =>
      prevCart.map((item) => {
        console.log("Checking item:", item.productId);

        if (item.productId !== productId) return item;

        let newQuantity = item.quantity;

        if (addRemove === "increment") {
          newQuantity += 1;
        } else if (addRemove === "decrement" && newQuantity > 1) {
          newQuantity -= 1;
        }

        console.log("Updated Quantity for", productId, ":", newQuantity);

        return { ...item, quantity: newQuantity };
      })
    );
  };


  const removeFromCartContext = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.productId !== productId);
      toast.info("Product removed from cart");
      return updatedCart;
    });
  };

  const getCartData = async () => {
    try {
      const response = await HttpClient.get("/cart");
      console.log("aniketdd", response);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getWishList = async () => {
    try {
      const response = await HttpClient.get("/wishlist");
      console.log("aniket", response.data);
      setWishList(response.data); // Fixing the bug: response should be used
    } catch (error) {
      console.log("Error fetching wishlist:", error);
    }
  };


  const addToCart = async () => {



   // console.log("cartcart", cart)

    const dataForCart = cart.map((item) => (
      {
        productId: item?.productId,
        color: item?.colors?.[0]?.colorCode || "Default Color", // Handle missing color
        size: item?.size,
        price: item?.price,
      }
    ))

    console.log("dataForCart", dataForCart)

    if (tokenIfLoggedIn !== null) {
      try {
        const response = await HttpClient.post( )
        console.log(response)
      } catch (error) {

      }
    }
    
   
  }

  useEffect(() => {
    addToCart()
     if(tokenIfLoggedIn){
      getCartData();
      getWishList();
     }
  }, []);

  const contextValue = {
    cart,
    addToCartContext,
    updateCartItem,
    removeFromCartContext,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export default CartProvider;
