import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanels,
  TabPanel,
} from "@headlessui/react";
import { BiSolidCoupon } from "react-icons/bi";
import { PiCurrencyInr } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { getUserData } from "../../server/user";
import { HttpClient } from "../../server/client/http";

const cartInLocal = localStorage.getItem("cart");
const parsedCartData = cartInLocal ? JSON.parse(cartInLocal) : {};

export default function CheckOutWithoutLogin() {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userDetails] = useState(getUserData());
  const [cartProducts, setCartProducts] = useState(parsedCartData);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [shippingFee] = useState(100);
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput,setCouponInput]=useState();

  const getCouponList = async () => {
    try {
      const response = await HttpClient.get("/coupon/list/not_login");
      const formattedData = response?.coupons.map((each) => ({
        couponCode: each?.couponCode,
        couponName: each?.couponName,
        couponUsageLimit: each?.couponUsageLimit,
        discount: each?.discount,
        couponId: each?._id,
      }));
      setCoupons(formattedData);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  useEffect(() => {
    getCouponList();
  }, []);

  const applyCoupon = async (couponCode) => {
      console.log(couponCode)
      try {
        const response = await HttpClient.post("/coupon/apply", { couponCode })
  
        console.log(response)
        if (response?.success === true) {
          setAppliedCoupon(response?.couponId)
          setCouponDiscount(parseInt(response?.discount))
          toast.success("Coupon Applied Successfully")
        } else {
          toast.error("Coupon either invalid or used before")
        }
  
      } catch (error) {
        toast.error(error?.message)
      }
    }

  const { reset } = useForm();
  const { register: addressRegister, reset: addressReset } = useForm();

  // Calculate totals
  const totalMRP = Object.values(cartProducts).reduce(
    (total, product) => total + (product.actualPrice || product.price) * product.quantity,
    0
  );

  const totalPrice = Object.values(cartProducts).reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const totalDiscount = Object.values(cartProducts).reduce(
    (total, product) => total + ((product.actualPrice || product.price) - product.price) * product.quantity,
    0
  );

  const grandTotal = totalPrice - couponDiscount + shippingFee;

  const fetchCartProducts = () => {
    const localCartItems = JSON.parse(localStorage?.getItem("cart") || "{}");
    setCartProducts(localCartItems);
  };

  const removeProductFromCart = (productIdName) => {
    setCartProducts((prevCart) => {
      const updatedCart = { ...prevCart };
      delete updatedCart[productIdName];

      localStorage.setItem(
        "cart",
        JSON.stringify(Object.keys(updatedCart).length ? updatedCart : {})
      );

      toast.info("Product removed from cart");
      return updatedCart;
    });
  };

  const updateQuantity = (key, newQuantity) => {
    if (newQuantity < 1) return;

    setCartProducts((prevCart) => {
      const updatedCart = { ...prevCart };
      updatedCart[key].quantity = newQuantity;
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handleRedirect = (message) => {
    toast.info(message);
    setShowModal(true);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowModal(false);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleApplyCoupon = async (coupon,appliedFrom) => {
     if (appliedCoupon && appliedCoupon.couponId === coupon.couponId) {
      toast.info("This coupon is already applied");
      return;
    }
    // Check if coupon is already applied
   if(appliedFrom==='list'){
    

    // Apply the coupon discount
    setCouponDiscount(coupon.discount);
    setAppliedCoupon(coupon);
    toast.success(`Coupon "${coupon.couponCode}" applied successfully!`);
   }
   else {

    try{
      const checkCode=await HttpClient.post('/coupon/apply',{couponCode:coupon});
    console.log(checkCode,"............140")
    if(checkCode.success){
      toast.success(checkCode.message);
      setCouponDiscount(checkCode.discount);
    setAppliedCoupon(coupons.find(item=>item.couponId===checkCode.couponId));
    }

    }catch(err){
      toast.error(err.response.data.message||err.response.message||err.message);
    }
    
   }
  };

  const handleRemoveCoupon = () => {
    setCouponDiscount(0);
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  return (
    <div className="min-h-screen ">
      {Object.keys(cartProducts).length === 0 ? (
        <div className="flex justify-center p-4 items-center h-screen flex-col">
          <h2 className="text-xl font-semibold mb-2">Hey, it feels so light!</h2>
          <p className="mb-4 text-gray-600">There is nothing in your bag. Let's add some items.</p>
          <img
            className="h-48 my-4"
            src="/assets/emptycart.png"
            alt="Empty cart"
          />
          <Link
            to="/"
            className="py-2 px-8 text-lg font-semibold text-[#3466e8] border-2 border-[#3466e8] rounded hover:bg-[#3466e8] hover:text-white transition-colors"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-4">
          <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <TabList className="flex justify-center space-x-8 mb-8">
              <Tab className="px-4 py-2 text-lg font-medium text-gray-600 focus:outline-none focus:text-[#011F4B] border-b-2 border-transparent ui-selected:border-[#011F4B] ui-selected:text-[#011F4B] transition-colors">
                BAG
              </Tab>
              <Tab
                onClick={() => handleRedirect("Please login to add address")}
                className="px-4 py-2 text-lg font-medium text-gray-600 focus:outline-none focus:text-[#011F4B] border-b-2 border-transparent ui-selected:border-[#011F4B] ui-selected:text-[#011F4B] transition-colors cursor-pointer"
              >
                ADDRESS
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Product List */}
                  <div className="md:w-8/12 space-y-4">
                    {Object.keys(cartProducts).map((key) => {
                      const product = cartProducts[key];
                      return (
                        <div key={key} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row gap-4">
                            {/* Product Image */}
                            <div className="w-full sm:w-32 h-32 flex-shrink-0">
                              <img
                                src={product.bannerImage || "https://via.placeholder.com/150"}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg border border-gray-100"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <Link
                                  to={`/product-details/${product.productId}`}
                                  className="text-lg font-semibold hover:underline"
                                >
                                  {product.name}
                                </Link>
                                <button
                                  onClick={() => removeProductFromCart(key)}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <RxCross2 size={18} />
                                </button>
                              </div>

                              {product.description && (
                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                  {product.description}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                  Size: {product.size || "N/A"}
                                </span>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full flex items-center">
                                  Color: <span
                                    className="w-3 h-3 rounded-full ml-1 border border-gray-200"
                                    style={{ backgroundColor: product.color }}
                                  />
                                </span>
                              </div>

                              {/* Price Details */}
                              <div className="mt-3">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-lg font-bold">
                                    ₹{(product.price * product.quantity).toLocaleString()}
                                  </span>
                                  {product.actualPrice && (
                                    <>
                                      <span className="text-sm text-gray-500 line-through">
                                        ₹{(product.actualPrice * product.quantity).toLocaleString()}
                                      </span>
                                      <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                        Save ₹{((product.actualPrice - product.price) * product.quantity).toLocaleString()}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center border border-gray-200 rounded-lg">
                                  <button
                                    onClick={() => updateQuantity(key, product.quantity - 1)}
                                    className="px-3 py-1 bg-gray-50 hover:bg-gray-100"
                                  >
                                    -
                                  </button>
                                  <span className="px-3 py-1 min-w-[2rem] text-center">
                                    {product.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(key, product.quantity + 1)}
                                    className="px-3 py-1 bg-gray-50 hover:bg-gray-100"
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  onClick={() => removeProductFromCart(key)}
                                  className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm"
                                >
                                  <FiTrash2 size={16} />
                                  Remove
                                </button>
                              </div>

                              <div className="mt-3 pt-3 border-t border-gray-100">
                                {product?.isReturnable ? (
                                  <div>
                                    <p className="text-sm text-gray-700">This product is returnable.</p>
                                    {product?.returnableDays !== 0 && (
                                      <p className="text-sm text-gray-500">
                                        Returnable within {product.returnableDays} days after delivery.
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">This product is non-returnable.</p>
                                )}
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-green-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Returns policy applies.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Summary */}
                  <div className="md:w-4/12">
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sticky top-4">
                      <h3 className="flex items-center text-xl font-medium text-gray-700 mb-4">
                        <BiSolidCoupon className="text-[#011F4B] mr-2" />
                        Price Details
                      </h3>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span>Total MRP</span>
                          <span className="flex items-center">
                            <PiCurrencyInr className="mr-1" />
                            {totalMRP.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Discount on MRP</span>
                          <span className="flex items-center text-green-600">
                            - <PiCurrencyInr className="mx-1" />
                            {totalDiscount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Coupon Discount</span>
                          <span className="flex items-center text-green-600">
                            - <PiCurrencyInr className="mx-1" />
                            {couponDiscount.toLocaleString()}
                            {appliedCoupon && (
                              <button 
                                onClick={handleRemoveCoupon}
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                <RxCross2 size={14} />
                              </button>
                            )}
                          </span>
                        </div>
                          <div className="border-t border-gray-200 pt-4 mt-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                              <input
                                onChange={(e)=>setCouponInput(e.target.value)}
                                value={couponInput}
                                type="text"
                                placeholder="Enter coupon code"
                                className="w-full sm:flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                              />
                              <button
                                 onClick={() => handleApplyCoupon(couponInput,"input")}
                                className="text-sm px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                              >
                                Apply
                              </button>
                            </div>
                          </div>

                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <h4 className="font-medium mb-2">Available Coupons</h4>
                          {coupons?.map((coupon) => (
                            <div 
                              key={coupon?.couponId} 
                              className={`hover:bg-gray-50 border mb-2 rounded-lg p-2 flex justify-between items-center ${appliedCoupon?.couponId === coupon.couponId ? 'bg-green-50 border-green-200' : ''}`}
                            >
                              <div>
                                <div className="font-medium text-gray-800">{coupon?.couponCode}</div>
                                <div className="text-sm text-gray-600">{coupon?.couponName}</div>
                              </div>
                              <div className="flex items-center">
                                <span className="text-green-600 mr-2">₹{coupon?.discount}</span>
                                <button
                                  className={`text-sm px-3 py-1 rounded-md transition-colors ${
                                    appliedCoupon?.couponId === coupon.couponId
                                      ? 'bg-gray-200 text-gray-600 cursor-default'
                                      : 'bg-green-600 hover:bg-green-700 text-white'
                                  }`}
                                  onClick={() => handleApplyCoupon(coupon,"list")}
                                  disabled={appliedCoupon?.couponId === coupon.couponId}
                                >
                                  {appliedCoupon?.couponId === coupon.couponId ? 'Applied' : 'Apply'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-dashed border-gray-400 my-4"></div>

                      <div className="flex justify-between font-semibold text-lg mb-6">
                        <span>Total Amount</span>
                        <span className="flex items-center">
                          <PiCurrencyInr className="mr-1" />
                          {grandTotal.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRedirect("Please login to checkout")}
                        className="w-full bg-[#011F4B] hover:bg-[#00308F] text-white py-3 px-6 rounded-md font-medium transition-colors"
                      >
                        PLACE ORDER
                      </button>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>

          {/* Login Redirect Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
                <h3 className="text-xl font-semibold mb-4">Please Login First</h3>
                <p className="mb-4">Redirecting to login in {countdown} seconds...</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-[#011F4B] h-2.5 rounded-full"
                    style={{ width: `${(3 - countdown) * 33.33}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}