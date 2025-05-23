import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductContext } from "../../usecontext1/cartcontext";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanels,
  TabPanel,
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { BiSolidOffer, BiSolidCoupon } from "react-icons/bi";
import { PiCurrencyInr } from "react-icons/pi";
import { BsBookmarkPlus } from "react-icons/bs";
import { FaChevronRight, FaMinus, FaPlus, FaTruck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { HttpClient } from "../../server/client/http";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { getUserData, setUserData } from "../../server/user";
import IndiaTime from "../../components/getIndiaTime";
import Loader from "../../components/loader";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";
import { FormItemPrefixContext } from "antd/es/form/context";

export default function CheckOut() {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userDetails, setUserDetails] = useState(getUserData());
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [stock, setStock] = useState(0);
  const [cartProducts, setCartProducts] = useState({});
  const [productSize, setProductSize] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAddress, setIsOpenAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  // const { products, addProduct } = useContext(ProductContext);
  const [cgst, setCgst] = useState()
  const [sgst, setSgst] = useState()
  const [totalAmount, setTotalAmount] = useState()


  const [isOpenCoupon, setIsOpenCoupon] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentType, setPaymentType] = useState(null);
  const [totalCartData, setTotalCartData] = useState({})
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      size: selectedSize,
      quantity: selectedQuantity,
    },
  });
  const [totalMRP, setTotalMRP] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [shippingAddress, setShippingAddress] = useState(
    getUserData()?.address?.filter((item) => item?.isDefault === true).length !==
      0
      ? {
        ...getUserData()?.address.filter(
          (item) => item?.isDefault === true
        )[0],
      }
      : null
  );
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(
    getUserData()?.address?.findIndex((item) => item?.isDefault === true)
  );
  const [formData, setFormData] = useState({});
  const {
    register: addressRegister,
    handleSubmit: addressHandleSubmit,
    formState: { errors: addressErrors },
    reset: addressReset,
  } = useForm();
  const [couponCode, setCouponCode] = useState("");
  const [allCoupon, setAllCoupon] = useState([]);
  const {
    register: couponRegister,
    handleSubmit: couponHandleSubmit,
    reset: couponReset,
  } = useForm({
    defaultValues: {
      couponCode,
    },
  });

  const fetchCartProducts = async () => {
    setIsLoading(true)
    try {
      const response = await HttpClient.get("/cart");

      console.log("tp", response.data)
      console.log(Object.keys(response.data))
      setTotalCartData(response.data)

      const { data } = response
      setCartProducts(data);
      setSgst(response?.cgst)
      setCgst(response?.sgst)
      setTotalAmount(response?.totalAmount)


      setIsLoading(false)
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
      setIsLoading(false)

    }

  };

  const removeProductFromCart = async (productIdName) => {
    try {
      const { message } = await HttpClient.put("/cart/remove", {
        productIdName,
      });
      toast.success(message);
      await fetchCartProducts();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const updateProductFromCart = async (data) => {
    try {
      const { message } = await HttpClient.put("/cart/update", {
        productIdName: selectedProduct,
        size: selectedSize,
        quantity: data?.quantity,
      });
      setIsOpen(false);
      toast.success(message);
      fetchCartProducts();
      reset({});
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const openDialogForProduct = async (productIdName) => {

    try {
      const { product } = await HttpClient.get(
        `/product/${cartProducts[productIdName]?.productId}`
      );
      setProductSize(product?.sizes);
      setStock(
        product?.sizes.filter(
          (item) => item.size === cartProducts[productIdName]?.size
        )[0]?.stock
      );
      setSelectedProduct(productIdName);
      setSelectedQuantity(cartProducts[productIdName]?.quantity.toString());
      setSelectedSize(cartProducts[productIdName]?.size);
      setIsOpen(true);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };



  const addAddress = async (data) => {
    try {
      setShippingAddress(data);
      let address = userDetails?.address ? userDetails?.address : [];
      if (data.isDefault) {
        address.forEach((address) => (address.isDefault = false));
      }
      address.push(data);
      setUserDetails((prev) => ({ ...prev, address }));
      const { userData } = await HttpClient.put("/users/update", userDetails);
      setFormData({});
      toast.success("Address added");
      setUserData(userData);
      setIsOpenAddress(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const updateAddress = async (data) => {
    try {
      setShippingAddress(data);
      let address = userDetails?.address ? userDetails?.address : [];
      if (data.isDefault) {
        address.forEach((address) => (address.isDefault = false));
      }
      address[selectedAddressIndex] = data;
      setUserDetails((prev) => ({ ...prev, address }));
      const { userData } = await HttpClient.put("/users/update", userDetails);
      addressReset();
      toast.success("Address Updated");
      setUserData(userData);
      setIsOpenAddress(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const removeAddress = async (index) => {
    try {
      let address = userDetails?.address ? userDetails?.address : [];
      if (address[index].isDefault) {
        address.forEach((address) => (address.isDefault = false));
      }
      address.splice(index, 1);
      setUserDetails((prev) => ({ ...prev, address }));
      const { userData } = await HttpClient.put("/users/update", userDetails);
      toast.success("Address Removed");
      setUserData(userData);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const increaseQuantity = (key) => {
    setTotalCartData((prevCart) => {
      // Clone the previous cart state
      const updatedCart = { ...prevCart };

      // Validate the key and ensure the quantity is a valid number
      if (updatedCart[key] && typeof updatedCart[key].quantity === "number") {
        updatedCart[key].quantity += 1; // Increment quantity by 1
        console.log(`Quantity for ${key} incremented to:`, updatedCart[key].quantity);
      }

      // Return the updated cart
      return updatedCart;
    });
  };


  const decreaseQuantity = (key) => {
    setTotalCartData((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[key] && updatedCart[key].quantity > 1) { // Ensure quantity does not go below 1
        updatedCart[key].quantity -= 1; // Decrement quantity
      }
      return updatedCart;
    });
  };




  //console.log("card product", products)
  const orderPlace = async () => {

    console.log("kkk", totalCost * 18 / 100 + totalCost)
    console.log("kkk", Math.round(totalCost + (totalCost * 18) / 100))




    try {
      const response = await HttpClient.post("/order", {
        totalAmount: Math.round(totalCost + (totalCost * 18) / 100),
        totalProduct: Object.keys(totalCartData)?.length,
        products: totalCartData,
        paymentType,
        shippingDetails: shippingAddress,
        couponCode,
        totalSgst: (totalCost * 18) / 100,
        totalCgst: (totalCost * 18) / 100,
      });

      console.log(response)

      if (response?.success)
        toast.success("Redirecting to Payment");
      console.log(response)
      window.location.href = response?.payment_url;
      fetchProfileData();
      console.log("Cart>>>>>>>: ", cartProducts)
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const fetchProfileData = async () => {
    try {
      const { userData } = await HttpClient.get("/users/me");
      setUserDetails(userData);
      setUserData(userData);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const getAllCoupons = async () => {
    if (localStorage.getItem('accessToken')) {
      try {
        const { coupons } = await HttpClient.get("/coupon/list");
        setAllCoupon(coupons);
      } catch (error) {

        console.error(error);
        toast.error(error?.response?.data?.message);
      }
    }
    return;
  };

  const getCouponDetails = async (data) => {
    if (localStorage.getItem('accessToken')) {
      try {
        setCouponCode(data?.couponCode);
        const response = await HttpClient.get("/coupon", {
          couponCode: data.couponCode,
          totalAmount: totalMRP - totalDiscount,
        });
        couponReset();
        if (response?.discountPrice) {
          setCouponDiscount(response?.discountPrice);
          setIsOpenCoupon(false);
        }
        response?.message
          ? toast.error(response?.message)
          : toast.success("Coupon Applied!");
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
      }
    }

    return

  };

  const onlinePayment = async () => {
    toast.error("This Payment method is not available!");
  };


  useEffect(() => {
    if (localStorage?.getItem("accessToken")) {
      fetchCartProducts();
      getAllCoupons();
    }
  }, []);





  useEffect(() => {
    addressReset(formData);
  }, [addressReset, formData]);

  useEffect(() => {
    reset({
      size: selectedSize,
      quantity: selectedQuantity,
    });
  }, [reset, selectedSize, selectedQuantity]);




  console.log("calculateTotal", totalCartData)

  const totalCost = Object.keys(totalCartData)
    .map(key => totalCartData[key].price * totalCartData[key].quantity - totalCartData[key].cgst - totalCartData[key].sgst)
    .reduce((sum, cost) => sum + cost, 0);



  console.log("cartProducts", cartProducts)

  function calculateTotalSum(items) {
    return Object.values(items).reduce(
      (total, item) => total + (item.actualPrice * item.quantity),
      0
    );
  }

  function calculateTotalDiscount(items) {
    return Object.values(items).reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
  }

  const totalSum = calculateTotalSum(cartProducts);
  const totalprice = calculateTotalDiscount(cartProducts);

  console.log("totalprice", totalprice)

  const totalDiscountOfProducts = totalSum - totalprice

  console.log("totalDiscountOfProducts", totalDiscountOfProducts)

  return (

    <>
      {
        isLoading ? <div className="h-screen flex justify-center items-center">
          <Loader />
        </div> : <div>
          <section className="px-5 py-2 font-[Quicksand]">
            {Object.keys(cartProducts).length ? (
              <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <TabList className="flex justify-between mt-2 sm:justify-center">
                  <Tab className="font-medium text-[#474747] focus:text-[#011F4B] active:text-[#011F4B] focus:outline-none font-[Poppins] hover:text-[#011F4B] transition-colors duration-300 px-4 py-2">
                    BAG
                  </Tab>
                  <span className="hidden sm:block mx-5 text-gray-400">-------------</span>
                  <Tab className="font-medium text-[#474747] focus:text-[#011F4B] active:text-[#011F4B] focus:outline-none font-[Poppins] hover:text-[#011F4B] transition-colors duration-300 px-4 py-2">
                    ADDRESS
                  </Tab>
                  <span className="hidden sm:block mx-5 text-gray-400">-------------</span>
                  <Tab className="font-medium text-[#474747] focus:text-[#011F4B] active:text-[#011F4B] focus:outline-none font-[Poppins] hover:text-[#011F4B] transition-colors duration-300 px-4 py-2">
                    PAYMENT
                  </Tab>
                </TabList>

                <TabPanels className="mt-8">
                  <TabPanel>
                    <div className="md:flex gap-6">
                      <div className="md:w-8/12">




                        {Object.keys(totalCartData).map((key, i) => (
                          <div
                            className="border border-gray-200 p-3 sm:p-4 rounded-lg mb-2 font-[Poppins] relative bg-white shadow-sm hover:shadow-md transition-all duration-200"
                            key={i}
                          >
                            {/* Remove Button (Top-right) */}
                            {/* <button
                              className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 sm:p-1.5 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition-colors duration-200"
                              onClick={() => removeProductFromCart(key)}
                              aria-label="Remove item"
                            >
                              <RxCross2 className="w-3 h-3" />
                            </button> */}

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                              {/* Product Image (Responsive sizing) */}
                              <div className="flex-shrink-0 w-full sm:w-24 h-24 md:w-32 md:h-32">
                                <img
                                  className="w-full h-full rounded-lg object-cover border border-gray-100"
                                  src={cartProducts[key]?.bannerImage || "https://via.placeholder.com/150"}
                                  alt={cartProducts[key]?.name || "Product Image"}
                                  loading="lazy"
                                />
                              </div>

                              {/* Product Details (Flexible width) */}
                              <div className="flex-grow">
                                <Link
                                  to={`/product-details/${cartProducts[key]?.productId}`}
                                  className="hover:underline"
                                >
                                  <h2 className="font-semibold text-gray-900 text-base sm:text-lg md:text-xl mb-1 line-clamp-2">
                                    {cartProducts[key]?.name || "N/A"}
                                  </h2>
                                </Link>

                                {cartProducts[key]?.description && (
                                  <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
                                    {cartProducts[key].description}
                                  </p>
                                )}

                                {/* Size & Color Chips (Wrap on small screens) */}
                                <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                    Size: {cartProducts[key]?.size || "N/A"}
                                  </span>
                                  <span
                                    className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1"
                                    style={{ color: cartProducts[key]?.color?.toLowerCase() === 'white' ? '#333' : cartProducts[key]?.color }}
                                  >
                                    Color: <span className="w-3 h-3 rounded-full inline-block border border-gray-200" style={{ backgroundColor: cartProducts[key]?.color }} />
                                  </span>
                                </div>

                                {/* Price Section (Stacked on mobile) */}
                              



                                <div className="mb-2">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                    <span className="text-xl font-bold text-gray-900">
                                      ₹{(cartProducts[key]?.price * cartProducts[key]?.quantity  || 0).toLocaleString()}

                                    </span>

                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-gray-500 line-through">
                                                                              ₹{Math.abs((cartProducts[key]?.actualPrice) * cartProducts[key]?.quantity || 0).toLocaleString()}

                                      </span>

                                      <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                        Save ₹{((cartProducts[key]?.actualPrice - cartProducts[key]?.price) * cartProducts[key]?.quantity || 0).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Quantity Controls & Remove Button (Flex direction changes on mobile) */}
                                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 sm:gap-4">
                                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden w-fit">
                                    <button
                                      onClick={() =>
                                        setCartProducts((prevCart) => {
                                          const updatedCart = { ...prevCart };
                                          updatedCart[key].quantity = Math.max(1, updatedCart[key].quantity - 1);
                                          return updatedCart;
                                        })
                                      }
                                      className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                                      aria-label="Decrease quantity"
                                    >
                                      -
                                    </button>
                                    <span className="px-3 py-1 text-center min-w-[2rem] text-gray-800">
                                      {cartProducts[key]?.quantity || 0}
                                    </span>
                                    <button
                                      onClick={() =>
                                        setCartProducts((prevCart) => {
                                          const updatedCart = { ...prevCart };
                                          updatedCart[key].quantity += 1;
                                          return updatedCart;
                                        })
                                      }
                                      className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                                      aria-label="Increase quantity"
                                    >
                                      +
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => removeProductFromCart(key)}
                                    className="flex items-center gap-1.5 text-xs sm:text-sm text-red-500 hover:text-red-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 w-fit"
                                  >
                                    <FiTrash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span>Remove</span>
                                  </button>
                                </div>

                                {/* Return Policy (Consistent across screens) */}
                                <div className="mt-1 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                                  <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    7-day returns • Free shipping
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}



                        <div className="border-2 border-[#D6CBCB] p-3 rounded-md my-3">
                          <Link to="/wishlist">
                            <div className="flex justify-between items-center font-[Poppins]">
                              <div className="text-[#353535] font-normal text-md flex items-center gap-1">
                                <BsBookmarkPlus className="fill-[#011F4B] inline" />
                                Add More From Wishlist
                              </div>
                              <FaChevronRight className="fill-[#011F4B] inline" />
                            </div>
                          </Link>
                        </div>

                        <div className="bg-[#011F4B] text-white rounded-md p-3 flex flex-wrap gap-2 sm:gap-1 sm:flex-nowrap justify-between items-center font-[Poppins]">
                          <div className="">
                            {shippingAddress ? (
                              <>
                                <p>
                                  Deliver to: {shippingAddress?.name},{" "}
                                  {shippingAddress?.mobileNumber}
                                </p>
                                <p>
                                  {shippingAddress?.address},{" "}
                                  {shippingAddress?.town}, {shippingAddress?.city}
                                </p>
                                <p>
                                  {shippingAddress?.state},{" "}
                                  {shippingAddress?.postalCode}
                                </p>
                              </>
                            ) : (
                              <p>Check delivery time & services</p>
                            )}
                          </div>
                          <div>
                            {shippingAddress ? (
                              <button
                                className="px-3 py-2 text-white font-medium sm:text-sm border-2 border-white border-[#011F4B] rounded-md font-[Poppins]"
                                onClick={() => {
                                  setFormData(shippingAddress);
                                  setIsOpenAddress(true);
                                }}
                              >
                                CHANGE ADDRESS
                              </button>
                            ) : (
                              <button
                                className="px-3 py-2 text-white font-medium sm:text-sm border-2 border-white border-[#011F4B] rounded-md font-[Poppins]"
                                onClick={() => setIsOpenAddress(true)}
                              >
                                ADD ADDRESS
                              </button>
                            )}
                          </div>
                        </div>




                      </div>
                      <div className="md:w-4/12">
                        <div className="border-2 border-gray-300 p-5 rounded-lg font-[Poppins] bg-white shadow-md">
                          <div>
                            <p className="text-gray-800 font-semibold text-xl mt-2 mb-2">Price Details</p>

                            <div className="flex justify-between text-gray-700 mb-3">
                              <p>Total MRP</p>
                              <p className="flex items-center font-medium">
                                <PiCurrencyInr className="mr-1" />
                                {totalSum}
                              </p>
                            </div>

                            <div className="flex justify-between text-gray-700 ">
                              {/* <p>SGST</p>
                              <p className="flex items-center text-green-600 font-medium">
                                + <PiCurrencyInr className="mr-1" />
                                {(totalCost * 9) / 100}
                              </p> */}

                              <p>DISCOUNT</p>
                              <p className="flex items-center text-green-600 font-medium">
                                - <PiCurrencyInr className="mr-1" />
                                {totalDiscountOfProducts}
                              </p>
                            </div>


                            <div className="border-t border-dashed border-gray-400 my-6"></div>

                            <div className="flex justify-between text-gray-800 font-semibold text-lg mb-4">
                              <p>Total Amount </p>
                              <p className="flex items-center">
                                <PiCurrencyInr className="mr-1" />


                                {Math.round(totalCost + (totalCost * 18) / 100)}
                              </p>
                            </div>
                          </div>

                          <button
                            className={`font-[Quicksand] bg-blue-900 text-white rounded-md py-3 px-8 w-full
      ${Object.keys(cartProducts).length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#011F4B] transition-colors"}`}
                            onClick={() => setSelectedIndex(1)}
                            disabled={Object.keys(cartProducts).length === 0}
                          >
                            CONTINUE
                          </button>
                        </div>

                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <section className="font-[Poppins]">
                      <div className="md:flex gap-6">
                        <div className="md:w-8/12">
                          <div className="flex justify-between items-center mb-5 flex-wrap sm:flex-nowrap">
                            <p className="text-[#282727] font-medium text-lg">
                              SELECT DELIVERY ADDRESS{" "}
                            </p>
                            <button
                              className="text-[#011F4B] font-medium text-lg border-2 border-dotted border-[#011F4B] rounded-md px-3 py-1"
                              onClick={() => {
                                setIsOpenAddress(true);
                                setFormData({});
                              }}
                            >
                              +ADD NEW ADDRESS
                            </button>
                          </div>
                          {userDetails?.address.filter(
                            (item) => item.isDefault === true
                          ).length
                            ? userDetails?.address
                              .filter((item) => item.isDefault === true)
                              .map((item, i) => {
                                return (
                                  <div key={i}>
                                    <p className="font-normal text-[#282727] mb-2">
                                      DEFAULT ADDRESS
                                    </p>
                                    <label
                                      htmlFor={`defaultAddres${i}`}
                                      className="flex gap-2 items-start cursor-pointer border-2 border-[#D6CBCB] font-white shadow-[#0000001F]-500 py-5 px-4 rounded-md shadow-lg mb-4"
                                    >
                                      <input
                                        type="radio"
                                        defaultChecked={
                                          item?.address &&
                                          shippingAddress &&
                                          JSON.stringify(item)
                                            .toLowerCase()
                                            .includes(
                                              JSON.stringify(
                                                shippingAddress
                                              ).toLowerCase()
                                            )
                                        }
                                        id={`defaultAddres${i}`}
                                        name="shippingAddress"
                                        className="h-5 w-5"
                                        value={item}
                                        onChange={() => setShippingAddress(item)}
                                      />
                                      <div>
                                        <div className="flex items-center gap-2 mb-2">
                                          <p>{item.name}</p>
                                        </div>
                                        <p className="text-[#353535] font-normal mb-3">
                                          {item.address}, {item.town}, {item.city}
                                          , {item.state}, {item.postalCode}
                                        </p>
                                        <p className="text-[#353535] font-normal mb-3">
                                          Mobile No.- {item.mobileNumber}
                                        </p>
                                        <div className="flex gap-2">
                                          <button
                                            className="text-[#4D4D4D] font-medium text-xs border-2 border-[#4D4D4D] rounded-md px-3 py-1"
                                            type="button"
                                            onClick={() =>
                                              removeAddress(
                                                userDetails?.address.findIndex(
                                                  (data) =>
                                                    data.isDefault === true
                                                )
                                              )
                                            }
                                          >
                                            REMOVE
                                          </button>
                                          <button
                                            className="text-[#011F4B] font-medium text-xs border-2 border-[#011F4B] rounded-md px-6 py-1"
                                            onClick={() => {
                                              setFormData(userDetails?.address[i]);
                                              setSelectedAddressIndex(
                                                userDetails?.address.findIndex(
                                                  (data) =>
                                                    data.isDefault === true
                                                )
                                              );
                                              setIsOpenAddress(true);
                                            }}
                                          >
                                            EDIT
                                          </button>
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                );
                              })
                            : ""}

                          {userDetails?.address.filter(
                            (item) => item.isDefault === false
                          ).length ? (
                            <div>
                              <p className="font-normal text-[#282727] mb-2">
                                OTHER ADDRESS
                              </p>
                              {userDetails?.address
                                .filter((item) => item.isDefault === false)
                                .map((item, i) => {
                                  return (
                                    <label
                                      key={i}
                                      htmlFor={`otherAddres${i}`}
                                      // className={`flex gap-2 items-start cursor-pointer border-2 border-[#D6CBCB] font-white shadow-[#0000001F]-500 py-5 px-12 rounded-md shadow-lg mb-4` + (item.isDefault === true ? ' hidden' : '') }
                                      className="flex gap-2 items-start cursor-pointer border-2 border-[#D6CBCB] font-white shadow-[#0000001F]-500 py-5 px-4 rounded-md shadow-lg mb-4"
                                    >
                                      <input
                                        type="radio"
                                        id={`otherAddres${i}`}
                                        name="shippingAddress"
                                        value={item}
                                        defaultChecked={
                                          item?.address &&
                                          shippingAddress &&
                                          JSON.stringify(item)
                                            .toLowerCase()
                                            .includes(
                                              JSON.stringify(
                                                shippingAddress
                                              ).toLowerCase()
                                            )
                                        }
                                        className="h-5 w-5"
                                        onChange={() => setShippingAddress(item)}
                                      />
                                      <div>
                                        <div className="flex items-center gap-2 mb-2">
                                          <p>{item.name}</p>
                                          {/* <p className="border-[1px] border-[#011F4B] rounded-[20px] py-1 px-3">
                                          HOME
                                        </p> */}
                                        </div>
                                        <p className="text-[#353535] font-normal mb-3">
                                          {item.address}, {item.town}, {item.city},{" "}
                                          {item.state}, {item.postalCode}
                                        </p>
                                        <p className="text-[#353535] font-normal mb-3">
                                          Mobile No.- {item.mobileNumber}
                                        </p>
                                        <div className="flex gap-2">
                                          <button
                                            className="text-[#4D4D4D] font-medium text-xs border-2 border-[#4D4D4D] rounded-md px-3 py-1"
                                            type="button"
                                            onClick={() => removeAddress(i)}
                                          >
                                            REMOVE
                                          </button>
                                          <button
                                            className="text-[#011F4B] font-medium text-xs border-2 border-[#011F4B] rounded-md px-6 py-1"
                                            onClick={() => {
                                              setFormData(userDetails?.address[i]);
                                              setSelectedAddressIndex(i);
                                              setIsOpenAddress(true);
                                            }}
                                          >
                                            EDIT
                                          </button>
                                        </div>
                                      </div>
                                    </label>
                                  );
                                })}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="mt-3 md:mt-0 md:w-4/12 border-l-2 border-gray-300 px-6 font-[Poppins]">
                          <p className="text-gray-800 font-semibold text-xl mb-2">Price Details</p>

                          <div className="flex justify-between text-gray-700 mb-3">
                            <p>Total MRP</p>
                            <p className="flex items-center font-medium">
                              <PiCurrencyInr className="mr-1" />
                              {totalSum}
                            </p>
                          </div>

                          <div className="flex justify-between text-gray-700 mb-3">


                            <p>DISCOUNT</p>
                            <p className="flex items-center text-green-600 font-medium">
                              - <PiCurrencyInr className="mr-1" />
                              {totalDiscountOfProducts}
                            </p>
                          </div>



                          <div className="border-dashed border-t border-gray-400 my-6"></div>

                          <div className="flex justify-between text-gray-800 font-semibold text-lg mb-4">
                            <p>Total Amount </p>
                            <p className="flex items-center">
                              <PiCurrencyInr className="mr-1" />

                              {Math.round(totalCost + (totalCost * 18) / 100)}

                            </p>
                          </div>

                          <button
                            className={`font-[Quicksand] text-white bg-blue-900 font-medium text-lg rounded-lg py-3 px-6 w-full 
      ${shippingAddress === null ? "opacity-50 cursor-not-allowed" : "hover:bg-[#011F4B] transition-colors"}`}
                            onClick={() => setSelectedIndex(2)}
                            disabled={shippingAddress === null}
                          >
                            Continue
                          </button>
                        </div>

                      </div>
                    </section>
                  </TabPanel>


                  <TabPanel>
                    <section className="font-[Poppins] p-4">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Offers and Payment Mode */}
                        <div className="md:w-8/12">
                          {/* Bank Offers */}
                          {/* <div className="border-2 border-[#D6CBCB] p-3 rounded-md my-2">
                            <details>
                              <summary className="text-[#011F4B] font-medium text-lg cursor-pointer flex items-center gap-2">
                                <BiSolidOffer className="fill-[#011F4B]" />
                                BANK OFFERS
                              </summary>
                              <p className="text-[#535353] font-normal mt-2">
                                7% Discount with Shopping Cart
                              </p>
                            </details>
                          </div> */}

                          {/* Payment Modes */}
                          <div className="border-2 border-[#D6CBCB] p-3 rounded-md my-3">
                            <div className="flex gap-2 items-start">
                              <input
                                type="radio"
                                name="paymentMode"
                                id="cashOnDelivery"
                                value="cashOnDelivery"
                                className="h-5 w-5 cursor-pointer"
                                onClick={(e) => setPaymentType(e.target.value)}
                              />
                              <label
                                htmlFor="cashOnDelivery"
                                className="font-semibold cursor-pointer"
                              >
                                Cash On Delivery (Cash / UPI)
                              </label>
                            </div>
                            <div className="flex gap-2 items-start mt-3">
                              <input
                                type="radio"
                                name="paymentMode"
                                id="onlinePayment"
                                value="onlinePayment"
                                className="h-5 w-5 cursor-pointer"
                                onClick={(e) => setPaymentType(e.target.value)}
                              />
                              <label
                                htmlFor="onlinePayment"
                                className="font-semibold cursor-pointer"
                              >
                                Online Payment
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Price Details */}
                        <div className="w-full md:w-4/12 border-t md:border-t-0 md:border-l-2 border-gray-300 px-6 py-4 bg-white rounded-lg shadow-lg">
                          <p className="text-gray-800 font-semibold text-xl mb-2">Price Details</p>

                          <div className="flex justify-between mb-3 text-gray-700">
                            <p>Total MRP</p>
                            <p className="flex items-center font-medium">
                              <PiCurrencyInr className="mr-1" />
                              {totalSum}
                            </p>
                          </div>

                          <div className="flex justify-between mb-3 text-gray-700">



                            <p>DISCOUNT</p>
                            <p className="flex items-center text-green-600 font-medium">
                              - <PiCurrencyInr className="mr-1" />
                              {totalDiscountOfProducts}
                            </p>
                          </div>


                          <div className="border-t border-dashed border-gray-400 my-6"></div>

                          <div className="flex justify-between text-gray-800 font-semibold text-lg mb-4">
                            <p>Total Amount </p>
                            <p className="flex items-center">
                              <PiCurrencyInr className="mr-1" />
                              {Math.round(totalCost + (totalCost * 18) / 100)}
                            </p>
                          </div>

                          <button
                            className={`font-[Quicksand] text-white bg-blue-900 font-medium text-lg rounded-md py-3 px-6 w-full ${!paymentType
                              ? "opacity-70 cursor-not-allowed"
                              : "hover:bg-[#011F4B] transition-colors"
                              }`}
                            onClick={orderPlace}
                            disabled={!paymentType}
                          >
                            PLACE ORDER
                          </button>
                        </div>
                      </div>
                    </section>

                  </TabPanel>
                  <TabPanel>
                    <div className="md:flex gap-6">
                      <div className="md:w-8/12">


                        {Object.entries(totalCartData).map(([key, item]) => (
                          <div
                            key={key}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-gray-100 rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-all duration-300 bg-white"
                          >
                            {/* Image with badge */}
                            <div className="relative">
                              <img
                                src={item.bannerImage || "https://via.placeholder.com/300"}
                                alt={item.name}
                                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg shadow-inner"
                              />
                              {item.discount > 0 && (
                                <span className="absolute -top-2 -right-2 flex items-center bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  <PiCurrencyInr /> {item.actualPrice - item.price} OFF
                                </span>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col gap-2 flex-grow">
                              <Link to={`/product-details/${item?.productId}`} >
                                <h2 className="font-semibold text-gray-800 text-lg sm:text-xl">{item.name}</h2>
                              </Link>

                              <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="text-gray-700 bg-gray-100 px-3 py-1 rounded-lg shadow-sm">
                                  Size: <span className="font-medium">{item.size || "N/A"}</span>
                                </span>
                                <span className="text-gray-700 bg-gray-100 px-3 py-1 rounded-lg shadow-sm flex items-center gap-2">
                                  Color:
                                  <span
                                    className="w-4 h-4 rounded-full border border-gray-300 shadow"
                                    style={{ backgroundColor: item.color }}
                                  ></span>
                                  <span className="capitalize font-medium" style={{ color: item.color.toLowerCase() === 'white' ? '#333' : item.color }}>
                                    {item.color || "N/A"}
                                  </span>
                                </span>
                              </div>


                              <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => decreaseQuantity(key)}
                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors">
                                    -
                                  </button>
                                  <span className="px-3 py-1 text-center min-w-[2rem]">{item.quantity}</span>
                                  <button
                                    onClick={() => increaseQuantity(key)}
                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                                  >
                                    +
                                  </button>

                                </div>

                                <button
                                  onClick={() => removeProductFromCart(key)}

                                  className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1">
                                  <FiTrash2 className="w-4 h-4" />
                                  Remove
                                </button>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-sm mt-1">
                                <p className="text-red-500 font-medium flex items-center">
                                  <PiCurrencyInr className="mr-0.5" />
                                  <span className="line-through">{(item.actualPrice * item.quantity)}</span>
                                </p>

                                <p className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full text-xs">
                                  You save ₹{((item.actualPrice - item.price) * item.quantity).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {/* Total - Mobile */}
                            <div className="w-full sm:hidden flex justify-between items-center pt-2 border-t border-gray-100">
                              <span className="font-semibold">Total:</span>
                              <span className="font-bold text-lg text-gray-800">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>

                            {/* Total - Desktop */}
                            <div className="text-right font-bold text-gray-800 hidden sm:block min-w-[100px]">
                              ₹{(item.price * item.quantity) - ((item.cgst + item.sgst) * (item.quantity))}
                            </div>
                          </div>
                        ))}

                        <div className="bg-[#011F4B] text-white rounded-md p-3 flex flex-wrap gap-2 sm:gap-1 sm:flex-nowrap justify-between items-center font-[Poppins]">
                          <div className="">
                            {shippingAddress ? (
                              <>
                                <p>
                                  Deliver to: {shippingAddress?.name},{" "}
                                  {shippingAddress?.mobileNumber}
                                </p>
                                <p>
                                  {shippingAddress?.address},{" "}
                                  {shippingAddress?.town}, {shippingAddress?.city}
                                </p>
                                <p>
                                  {shippingAddress?.state},{" "}
                                  {shippingAddress?.postalCode}
                                </p>
                              </>
                            ) : (
                              <p>Check delivery time & services</p>
                            )}
                          </div>
                          <div>
                            {shippingAddress ? (
                              <button
                                className="px-3 py-2 text-white font-medium sm:text-sm border-2 border-white border-[#011F4B] rounded-md font-[Poppins]"
                                onClick={() => {
                                  setFormData(shippingAddress);
                                  setIsOpenAddress(true);
                                }}
                              >
                                CHANGE ADDRESS
                              </button>
                            ) : (
                              <button
                                className="px-3 py-2 text-white font-medium sm:text-sm border-2 border-white border-[#011F4B] rounded-md font-[Poppins]"
                                onClick={() => setIsOpenAddress(true)}
                              >
                                ADD ADDRESS
                              </button>
                            )}
                          </div>
                        </div>



                        <div className="border-2 border-[#D6CBCB] p-3 rounded-md my-3">
                          <Link to="/wishlist">
                            <div className="flex justify-between items-center font-[Poppins]">
                              <div className="text-[#353535] font-normal text-md flex items-center gap-1">
                                <BsBookmarkPlus className="fill-[#011F4B] inline" />
                                Add More From Wishlist
                              </div>
                              <FaChevronRight className="fill-[#011F4B] inline" />
                            </div>
                          </Link>
                        </div>
                      </div>
                      <div className="md:w-4/12">
                        <div className="border-2 border-gray-300 p-5 rounded-lg font-[Poppins] bg-white shadow-md">
                          <div>
                            <p className="text-gray-800 font-semibold text-xl mt-2 mb-2">Price Details</p>

                            <div className="flex justify-between text-gray-700 mb-3">
                              <p>Total MRP</p>
                              <p className="flex items-center font-medium">
                                <PiCurrencyInr className="mr-1" />
                                {totalCost}
                              </p>
                            </div>





                            <div className="border-t border-dashed border-gray-400 my-6"></div>

                            <div className="flex justify-between text-gray-800 font-semibold text-lg mb-4">
                              <p>Total Amount (Incl GST)</p>
                              <p className="flex items-center">
                                <PiCurrencyInr className="mr-1" />


                                {Math.round(totalCost + (totalCost * 18) / 100)}
                              </p>
                            </div>
                          </div>

                          <button
                            className={`font-[Quicksand] bg-blue-900 text-white rounded-md py-3 px-8 w-full
      ${Object.keys(cartProducts).length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#011F4B] transition-colors"}`}
                            onClick={() => setSelectedIndex(1)}
                            disabled={Object.keys(cartProducts).length === 0}
                          >
                            CONTINUE
                          </button>
                        </div>

                      </div>
                    </div>
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            ) : (
              <div className="flex justify-center items-center flex-col">
                <h2 className="text-xl font-semibold mb-2">
                  Hey, it feels so light!
                </h2>
                <p className="mb-3">
                  There is nothing in your bag. Let's add some items.
                </p>
                <img
                  className="h-[200px] my-3"
                  src="/assets/emptycart.png"
                  alt="wishlistEmpty"
                />
                <Link
                  to="/wishlist"

                >
                  <button
                    onClick={() => window.location.href = '/wishlist'}
                    className="py-2 px-6 text-lg font-semibold text-blue-600 border border-blue-600 rounded-lg shadow-md hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out"
                  >
                    ADD ITEMS FROM WISHLIST
                  </button>

                </Link>

              </div>
            )}
          </section>

          <Transition appear show={isOpen}>
            <Dialog
              as="div"
              className="relative z-10 focus:outline-none cart"
              onClose={() => {
                setIsOpen(false);
                reset({});
              }}
            >
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 bg-[rgba(0,0,0,.6)]">
                  <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 transform-[scale(95%)]"
                    enterTo="opacity-100 transform-[scale(100%)]"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 transform-[scale(100%)]"
                    leaveTo="opacity-0 transform-[scale(95%)]"
                  >
                    <DialogPanel className="w-full max-w-md rounded-xl bg-white text-black p-6">
                      <form onSubmit={handleSubmit(updateProductFromCart)}>
                        <div className="mt-2 text-sm/6">
                          <div className="py-6 font-[Poppins] relative border-b">
                            <button
                              className="flex items-center justify-center absolute top-2 right-3 h-6 w-6 rounded-full bg-white font-bold text-xl"
                              onClick={() => {
                                setIsOpen(false);
                                reset({});
                              }}
                              type="button"
                            >
                              <RxCross2 className="text-md" />
                            </button>
                            <div className="flex gap-4 flex-wrap sm:flex-nowrap">
                              <div>
                                <img
                                  className="w-14 h-18"
                                  src={cartProducts[selectedProduct]?.bannerImage}
                                  alt={cartProducts[selectedProduct]?.name}
                                />
                              </div>
                              <div>
                                <p className="text-[#535353] font-medium text-lg mb-2">
                                  {cartProducts[selectedProduct]?.name}
                                </p>
                                <p className="text-[#4D4D4D] font-medium mb-2">
                                  {cartProducts[selectedProduct]?.description}
                                </p>
                                <p className="flex items-center font-medium mb-2">
                                  <span></span>
                                  <PiCurrencyInr />
                                  <span>
                                    {cartProducts[selectedProduct]?.price}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="my-3">
                            <h4 className="text-base font-semibold">Select Size</h4>
                            <div className="flex gap-2 flex-wrap size mt-3">
                              {productSize.map((data, i) => {
                                return (
                                  <span key={i}>
                                    <input
                                      type="radio"
                                      id={"size" + data.size}
                                      {...register("size")}
                                      value={data.size}
                                      className="hidden"
                                      onChange={(e) => {
                                        setSelectedSize(e.target.value);
                                        setStock(
                                          productSize.filter(
                                            (item) => item.size === e.target.value
                                          )[0]?.stock
                                        );
                                      }}
                                    />
                                    <label
                                      htmlFor={"size" + data.size}
                                      className="flex justify-center items-center py-0 px-[3%] cursor-pointer rounded-full w-10 h-10 border border-solid border-black text-sm"
                                    >
                                      {data.size}
                                    </label>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-base font-semibold">
                              Select Quantity
                            </h4>
                            <div className="flex gap-2 flex-wrap size mt-3">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                                .filter((data) => data <= stock)
                                .map((data, i) => (
                                  <span key={i}>
                                    <input
                                      type="radio"
                                      id={"quantity" + data}
                                      {...register("quantity")}
                                      value={data}
                                      className="hidden"
                                    />
                                    <label
                                      htmlFor={"quantity" + data}
                                      className="flex justify-center items-center py-0 px-[3%] cursor-pointer rounded-full w-10 h-10 border border-solid border-black text-sm"
                                    >
                                      {data}
                                    </label>
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#011F4B] py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                          >
                            Done
                          </button>
                        </div>
                      </form>
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>
          </Transition>
          <Transition appear show={isOpenAddress}>
            <Dialog
              as="div"
              className="relative z-10 focus:outline-none cart"
              onClose={() => {
                setIsOpenAddress(false);
                setFormData({});
              }}
            >
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 bg-[rgba(0,0,0,.6)]">
                  <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 transform-[scale(95%)]"
                    enterTo="opacity-100 transform-[scale(100%)]"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 transform-[scale(100%)]"
                    leaveTo="opacity-0 transform-[scale(95%)]"
                  >
                    <DialogPanel className="w-full max-w-md rounded-xl bg-white text-black p-6 h-[80vh] overflow-scroll m-auto">
                      <div className="mt-2 text-sm/6">
                        <div className="pb-3 font-[Poppins] relative border-b">
                          <button
                            className="flex items-center justify-center absolute top-1 right-3 h-6 w-6 rounded-full bg-white font-bold text-xl"
                            onClick={() => {
                              setIsOpenAddress(false);
                              setFormData({});
                            }}
                            type="button"
                          >
                            <RxCross2 className="text-md" />
                          </button>
                          <p className="text-[#535353] font-medium text-lg text-center">
                            {Object.keys(formData).length
                              ? "Edit Address"
                              : "Add New Address"}
                          </p>
                        </div>
                        <form
                          onSubmit={addressHandleSubmit(
                            Object.keys(formData).length
                              ? updateAddress
                              : addAddress
                          )}
                        >
                          <div className="my-3">
                            <h4 className="text-[#535353] font-medium text-base">
                              Contact Details
                            </h4>
                            <div>
                              <div>
                                <input
                                  type="text"
                                  placeholder="Name*"
                                  className="w-full my-2 p-3 outline-none border-[1px] border-solid border-[#CBCBCB] rounded"
                                  {...addressRegister("name", {
                                    required: "*Name is required.",
                                  })}
                                />
                                {addressErrors?.name && (
                                  <p className="errorMsg text-[#E40606]">
                                    {addressErrors?.name?.message}
                                  </p>
                                )}
                              </div>
                              <div>
                                <input
                                  type="number"
                                  placeholder="Mobile No*"
                                  className="w-full my-2 p-3 outline-none border-[1px] border-solid border-[#CBCBCB] rounded"
                                  {...addressRegister("mobileNumber", {
                                    required: "*Mobile Number is required.",
                                    minLength: {
                                      value: 10,
                                      message: "Mobile Number should be 10 digit",
                                    },
                                    maxLength: {
                                      value: 10,
                                      message: "Mobile Number should be 10 digit",
                                    },
                                    pattern: {
                                      value: /^[0-9]{10}$/,
                                      message: "Invalid Mobile Number",
                                    },
                                  })}
                                />
                                {addressErrors?.mobileNumber && (
                                  <p className="errorMsg text-[#E40606]">
                                    {addressErrors?.mobileNumber?.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="my-3">
                            <h4 className="text-[#535353] font-medium text-base">
                              Address
                            </h4>
                            <div>
                              <div>
                                <input
                                  type="number"
                                  placeholder="Pincode*"
                                  className="w-full my-2 p-3 outline-none border-[1px] border-solid border-[#CBCBCB] rounded"
                                  {...addressRegister("postalCode", {
                                    required: "*Pincode is required.",
                                  })}
                                />
                                {addressErrors?.postalCode && (
                                  <p className="errorMsg text-[#E40606]">
                                    {addressErrors?.postalCode?.message}
                                  </p>
                                )}
                              </div>
                              <div>
                                <input
                                  type="text"
                                  placeholder="Address*"
                                  className="w-full my-2 p-3 outline-none border-[1px] border-solid border-[#CBCBCB] rounded"
                                  {...addressRegister("address", {
                                    required: "*Address is required.",
                                  })}
                                />
                                {addressErrors?.address && (
                                  <p className="errorMsg text-[#E40606]">
                                    {addressErrors?.address?.message}
                                  </p>
                                )}
                              </div>
                              <div>
                                <input
                                  type="text"
                                  placeholder="Locality / Town*"
                                  className="w-full my-2 p-3 outline-none border-[1px] border-solid border-[#CBCBCB] rounded"
                                  {...addressRegister("town", {
                                    required: "*Locality / Town is required.",
                                  })}
                                />
                                {addressErrors?.town && (
                                  <p className="errorMsg text-[#E40606]">
                                    {addressErrors?.town?.message}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-3">
                                <div>
                                  <input
                                    type="text"
                                    placeholder="City / District*"
                                    className="w-full my-2 p-3 outline-none border-[1px] border-solid border-[#CBCBCB] rounded"
                                    {...addressRegister("city", {
                                      required: "*City / District is required.",
                                    })}
                                  />
                                  {addressErrors?.city && (
                                    <p className="errorMsg text-[#E40606]">
                                      {addressErrors?.city?.message}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    placeholder="State*"
                                    className="w-full my-2 p-3 outline-none border-[1px] border-solid border-[#CBCBCB] rounded"
                                    {...addressRegister("state", {
                                      required: "*State is required.",
                                    })}
                                  />
                                  {addressErrors?.state && (
                                    <p className="errorMsg text-[#E40606]">
                                      {addressErrors?.state?.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="checkbox"
                                  id="isDefault"
                                  className="my-2 p-3 outline-none border-[1px] border-solid border-[#CBCBCB] rounded"
                                  {...addressRegister("isDefault")}
                                />
                                <label
                                  htmlFor="isDefault"
                                  className="text-[#535353]"
                                >
                                  Make this my default address
                                </label>
                              </div>
                              <div className="mt-4">
                                <button
                                  type="submit"
                                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#011F4B] py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                >
                                  {Object.keys(formData).length
                                    ? "Update Address"
                                    : "Add Address"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>
          </Transition>
          <Transition appear show={isOpenCoupon}>
            <Dialog
              as="div"
              className="relative z-10 focus:outline-none cart"
              onClose={() => {
                setIsOpenCoupon(false);
                setFormData({});
              }}
            >
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 bg-[rgba(0,0,0,.6)]">
                  <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 transform-[scale(95%)]"
                    enterTo="opacity-100 transform-[scale(100%)]"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 transform-[scale(100%)]"
                    leaveTo="opacity-0 transform-[scale(95%)]"
                  >
                    <DialogPanel className="w-full max-w-md rounded-xl bg-white text-black p-6 h-[80vh] overflow-scroll m-auto">
                      <div className="mt-2 text-sm/6">
                        <div className="pb-3 font-[Poppins] relative border-b">
                          <button
                            className="flex items-center justify-center absolute top-1 right-3 h-6 w-6 rounded-full bg-white font-bold text-xl"
                            onClick={() => {
                              setIsOpenCoupon(false);
                              setFormData({});
                            }}
                            type="button"
                          >
                            <RxCross2 className="text-md" />
                          </button>
                          <p className="text-[#535353] font-medium text-lg text-center">
                            APPLY COUPON
                          </p>
                        </div>
                        <form onSubmit={couponHandleSubmit(getCouponDetails)}>
                          <div className="my-3 relative">
                            <input
                              type="text"
                              placeholder="Enter coupon code"
                              className="w-full my-2 p-3 outline-none border-[1px] border-solid border-[#CBCBCB] rounded"
                              {...couponRegister("couponCode")}
                            />
                            <button
                              type="submit"
                              className="absolute right-[5%] top-5 z-10 text-[#011F4B] font-semibold"
                            >
                              Apply
                            </button>
                          </div>
                        </form>
                        <div className="my-3">
                          <h4 className="text-white font-medium text-base bg-[#535766] p-3 mb-3">
                            UNLOCK COUPONS
                          </h4>
                          {allCoupon.length
                            ? allCoupon.map((item, i) => {
                              return (
                                <div key={i}>
                                  <div className="flex items-start gap-5 my-5 border-b border-solid pb-3">
                                    <div className="w-full">
                                      <div className="flex gap-5 justify-between">
                                        <div className="text-base px-3 py-2 border-2 border-dashed">
                                          {item.couponCode}
                                        </div>
                                        <button
                                          // className="text-base px-3 py-2 bg-[#14CDA8]"
                                          className={`text-base px-3 py-2 ${item.couponCode === couponCode
                                            ? "bg-[#14CDA8]"
                                            : "bg-[#011F4B] text-white"
                                            }`}
                                          onClick={() =>
                                            getCouponDetails({
                                              couponCode: item.couponCode,
                                            })
                                          }
                                          disabled={
                                            item.couponCode === couponCode
                                          }
                                        >
                                          {item.couponCode === couponCode
                                            ? "Applied"
                                            : "Apply"}
                                        </button>
                                      </div>
                                      <h5 className="my-3 text-base">
                                        save ₹
                                        {item.discountType === "percentage"
                                          ? Math.round(
                                            (totalMRP - totalDiscount) *
                                            (item.discount / 100)
                                          )
                                          : item.discount}
                                      </h5>
                                      <h5 className="my-3 text-base">
                                        Expire on :
                                        <IndiaTime data={item.expirationTime} />
                                      </h5>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                            : ""}
                        </div>
                      </div>
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      }
    </>

  );
}