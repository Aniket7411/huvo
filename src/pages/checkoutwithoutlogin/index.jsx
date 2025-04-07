import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../usecontext1/cartcontext";
import { PiCurrencyInr } from "react-icons/pi";
import { CiDeliveryTruck, CiDiscount1, CiTrash } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FaArrowRight, FaMinus, FaPlus } from "react-icons/fa";
import Modal from "react-modal";

const CheckoutWithoutLogin = () => {
  const { updateCartItem, removeCartItem } = useContext(CartContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const formatted = storedCart.map((item) => ({
      _id: item.productId, // Required for key
      name: item.name || "Product", // Add fallback
      bannerImage: item.bannerImage,
      brand: item.brand?.name,
      logo: item.brand?.logo,
      color: item.color,
      quantity: item.quantity,
      size: item.size,
      shippingFee: item.shippingFee,
      price: item.price,
      discount: item.discount,
      productId: item.productId,
    }));
    setCartItems(formatted);
  }, []);

  const handleQuantityChange = (productId, action) => {
    const updated = cartItems.map((item) => {
      if (item.productId === productId) {
        let newQty = item.quantity;
        if (action === "increment") newQty += 1;
        else if (action === "decrement" && item.quantity > 1) newQty -= 1;
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleRemove = (productId) => {
    const updated = cartItems.filter(item => item.productId !== productId);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + ((item.price - item.discount) * item.quantity);
    }, 0);
  };

  return (
    <div className="bg-gray-50 py-3 px-4 sm:px-6 lg:px-8">
    

        {cartItems.length === 0 ? (
          <div className="text-center flex flex-col items-center justify-center py-2">
            <h2 className="text-xl font-medium text-gray-700">Hey, it feels so light!
            </h2>
            <img
                className="h-[200px] my-1"
                src="../assets/empty-cart.png"
                alt="wishlistEmpty"
              />
               <p className="mb-3">
                There is nothing in your bag. Let's add some items.
              </p>
            <Link
              to="/"
              className="mt-4 inline-block px-3 py-2 bg-[#011F4B] text-white rounded-lg hover:bg-[#011F4B] transition-colors"
            >
              Continue Shopping
            </Link>

            
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Section */}
            <div className="lg:w-2/3">
              {/* Desktop View */}
              <div className="hidden md:block">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="grid grid-cols-12 bg-gray-100 p-4 font-medium text-gray-700">
                    <div className="col-span-5">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-3 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>

                  {cartItems.map((item) => {
                    const finalPrice = item.price - item.discount;
                    return (
                      <div key={item._id} className="grid grid-cols-12 items-center p-4 border-b border-gray-200">
                        <div className="col-span-5 flex items-center gap-4">
                          <img
                            src={item.bannerImage || "https://via.placeholder.com/300"}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.brand}</p>
                          </div>
                        </div>

                        <div className="col-span-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <PiCurrencyInr className="text-green-600" />
                            <span className="font-medium">{finalPrice}</span>
                          </div>
                          {item.discount > 0 && (
                            <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                              <PiCurrencyInr />
                              <span className="line-through">{item.price}</span>
                              <CiDiscount1 className="text-green-500" />
                            </div>
                          )}
                        </div>

                        <div className="col-span-3 flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleQuantityChange(item.productId, "decrement")}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus className="text-sm" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, "increment")}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <FaPlus className="text-sm" />
                          </button>
                        </div>

                        <div className="col-span-2 flex items-center justify-end gap-4">
                          <div className="font-medium">
                            <PiCurrencyInr className="inline mr-1" />
                            {(finalPrice * item.quantity).toFixed(2)}
                          </div>
                          <button
                            onClick={() => handleRemove(item.productId)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <CiTrash className="text-lg" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {cartItems.map((item) => {
                  const finalPrice = item.price - item.discount;
                  return (
                    <div key={item._id} className="bg-white rounded-lg shadow-sm p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.bannerImage || "https://via.placeholder.com/300"}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{item.brand}</p>

                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1">
                              <PiCurrencyInr className="text-green-600" />
                              <span className="font-medium">{finalPrice}</span>
                              {item.discount > 0 && (
                                <>
                                  <span className="mx-1 text-gray-400">|</span>
                                  <PiCurrencyInr className="text-gray-500" />
                                  <span className="line-through text-gray-500 text-sm">{item.price}</span>
                                </>
                              )}
                            </div>

                            <button
                              onClick={() => handleRemove(item.productId)}
                              className="text-red-500"
                            >
                              <CiTrash className="text-lg" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                              <button
                                onClick={() => handleQuantityChange(item.productId, "decrement")}
                                disabled={item.quantity <= 1}
                                className="disabled:opacity-50"
                              >
                                <FaMinus className="text-xs" />
                              </button>
                              <span className="w-6 text-center">{item.quantity}</span>
                              <button onClick={() => handleQuantityChange(item.productId, "increment")}>
                                <FaPlus className="text-xs" />
                              </button>
                            </div>

                            <div className="font-medium">
                              <PiCurrencyInr className="inline mr-1" />
                              {(finalPrice * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      <PiCurrencyInr className="inline mr-1" />
                      {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      <PiCurrencyInr className="inline mr-1" />
                      {(calculateTotal() * 0.18).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>
                      <PiCurrencyInr className="inline mr-1" />
                      {(calculateTotal() * 1.18).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CiDeliveryTruck className="text-lg" />
                    <span>Free delivery on orders over ₹500</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CiDiscount1 className="text-lg" />
                    <span>Apply promo code at checkout</span>
                  </div>
                </div>

                <button className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Proceed to Checkout
                </button>

                <Link
                  to="/"
                  className="mt-4 inline-block w-full text-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default CheckoutWithoutLogin;
