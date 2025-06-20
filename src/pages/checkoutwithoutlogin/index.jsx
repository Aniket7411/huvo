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
import { FaChevronRight } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { HttpClient } from "../../server/client/http";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { getUserData, setUserData } from "../../server/user";
import IndiaTime from "../../components/getIndiaTime";
import Loader from "../../components/loader";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";


const cartInLocal = localStorage.getItem("cart")

const parsedCartData = cartInLocal ? JSON.parse(cartInLocal) : {};


export default function CheckOutWithoutLogin() {
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



  const [isOpenCoupon, setIsOpenCoupon] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentType, setPaymentType] = useState(null);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      size: selectedSize,
      quantity: selectedQuantity,
    },
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalMRP, setTotalMRP] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [shippingAddress, setShippingAddress] = useState(
    getUserData()?.address.filter((item) => item.isDefault === true).length !==
      0
      ? {
        ...getUserData()?.address.filter(
          (item) => item.isDefault === true
        )[0],
      }
      : null
  );
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(
    getUserData()?.address.findIndex((item) => item.isDefault === true)
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


  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const fetchCartProducts = async () => {


    const localCartItems = JSON.parse(localStorage?.getItem("cart"))
    console.log("localCartItems", localCartItems)
    setCartProducts(localCartItems)

  }

  const removeProductFromCart = async (productIdName) => {
    setCartProducts((prevCart) => {
      const updatedCart = { ...prevCart };

      if (updatedCart[productIdName]) {
        delete updatedCart[productIdName]; // Remove the product by key
        toast.info("Product removed from cart");

        // Save the updated cart in local storage
        localStorage.setItem(
          "cart",
          JSON.stringify(Object.keys(updatedCart).length === 0 ? {} : updatedCart)
        );
      } else {
        toast.error("Product not found in cart");
      }

      console.log(`Removed product with key: ${productIdName}`);
      return updatedCart; // Return the updated cart state
    });
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
      // fetchCartProducts();
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
        product?.sizes?.filter(
          (item) => item?.size === cartProducts[productIdName]?.size
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
      if (data?.isDefault) {
        address?.forEach((address) => (address.isDefault = false));
      }
      address?.push(data);
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



  const orderPlace = async () => {

    try {
      const { message } = await HttpClient.post("/order", {
        totalAmount,
        totalProduct: Object.keys(cartProducts)?.length,
        products: cartProducts,
        paymentType,
        shippingDetails: shippingAddress,
        couponCode,
      });
      toast.success(message || "Order Place Successfully!");
      navigate("/");
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



  const totalCost = Object.values(cartProducts).reduce((total, product) => total + product.price * product.quantity, 0);
  const allDiscount = Object.values(cartProducts).reduce((total, product) => total + product.discount * product.quantity, 0);


  console.log("costcost", totalCost)
  console.log("costcost", allDiscount)







  const onlinePayment = async () => {
    toast.error("This Payment method is not available!");
  };

  useEffect(() => {
    fetchCartProducts();
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


  console.log("cartProducts", cartProducts)


  const handleClick = () => {
    setShowModal(true);
    toast.info("Redirecting to login...");
    let count = 3;

    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);

      if (count === 0) {
        clearInterval(interval);
        setShowModal(false);
        navigate("/login");
      }
    }, 1000);
  };


  console.log(cartProducts)

  return (


    <>
      {
        Object.keys(cartProducts).length === 0 ? <div className="flex justify-center p-4 items-center h-auto flex-col">
          <h2 className="text-xl font-semibold mb-2">
            Hey, it feels so light!
          </h2>
          <p className="mb-2 text-center">
            There is nothing in your bag. Let's add some items.
          </p>
          <img
            className="h-[200px] my-1"
            src="/assets/emptycart.png"
            alt="wishlistEmpty"
          />
          <Link
            to="/"
            className="lg:py-3 py-2 px-4 lg:px-12 text-lg font-semibold text-[#3466e8] border border-solid border-[#3466e8] rounded"
          >
            Visit our products
          </Link>
        </div> : <div>
          <section className="px-10 py-7 font-[Quicksand]">
            {Object.keys(cartProducts).length ? (
              <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <TabList className="flex justify-between mt-2 sm:justify-center">
                  <Tab className="font-medium text-[#474747] focus:text-[#011F4B] active:text-[#011F4B] focus:outline-none  font-[Poppins]">
                    BAG
                  </Tab>
                  <span className="hidden sm:block mx-5">-------------</span>
                  <p
                    onClick={handleClick}
                    className="font-medium cursor-pointer text-[#474747] focus:text-[#011F4B] active:text-[#011F4B] focus:outline-none font-[Poppins]"
                  >
                    ADDRESS
                  </p>

                  {/* Modal */}
                  {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                        <p className="text-xl font-semibold">Redirecting in {countdown}...</p>
                      </div>
                    </div>
                  )}

                </TabList>
                <TabPanels className="">
                  <TabPanel>
                    <div className="md:flex gap-6">
                      <div className="md:w-8/12">


                        {Object.keys(cartProducts).map((key, i) => (
                          <div
                            className="border border-gray-200 p-3 sm:p-4 rounded-lg mb-2 font-[Poppins] relative bg-white shadow-sm hover:shadow-md transition-all duration-200"
                            key={i}
                          >
                            {/* Remove Button (Top-right) */}
                            <button
                              className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 sm:p-1.5 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition-colors duration-200"
                              onClick={() => removeProductFromCart(key)}
                              aria-label="Remove item"
                            >
                              <RxCross2 className="w-3 h-3" />
                            </button>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                              {/* Product Image (Responsive sizing) */}
                              <div className="flex-shrink-0 w-full sm:w-24 h-24 md:w-32 md:h-32">
                                <img
                                  className="w-full h-full rounded-lg object-cover border border-gray-100 object-cover border border-gray-100"
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
                                <div className="mb-3">
                                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                    <span className="text-lg font-bold text-gray-900">
                                      ₹{(cartProducts[key]?.price * cartProducts[key]?.quantity) || 0}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      ₹{cartProducts[key]?.actualPrice * cartProducts[key]?.quantity || 0}
                                    </span>
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                      Save ₹{((cartProducts[key]?.actualPrice - cartProducts[key]?.price) * cartProducts[key]?.quantity).toLocaleString() || 0}
                                    </span>
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
                                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
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

                      </div>
                      {/* <div className="md:w-4/12">
                        <div className="border-2 border-[#D6CBCB] p-3 rounded-md font-[Poppins]">
                          <p className="flex items-center text-[#535353] font-medium text-xl gap-2 mb-2">
                            <BiSolidCoupon className="fill-[#011F4B]" />
                            COUPONS
                          </p>
                          <div className="flex justify-between mb-3">
                            <p className="text-[#353535] font-normal text-lg">
                              Apply coupons
                            </p>
                            <button
                              className="text-[#011F4B] border-2 border-[#011F4B] font-medium px-3 "
                              onClick={() => setIsOpenCoupon(true)}
                            >
                              APPLY
                            </button>
                          </div>
                          <div className="border-[1px] border-dashed border-black border-bottom-1 my-4"></div>
                          <div>
                            <p className="text-[#353535] font-medium text-lg mb-2">
                              Price details
                            </p>
                            <div className="flex justify-between mb-2">
                              <p>Total MRP</p>
                              <p className="flex items-center">
                                <PiCurrencyInr />
                                {totalCost}
                              </p>
                            </div>
                            <div className="flex justify-between mb-2">
                              <p>Disount on MRP</p>
                              <p className="flex items-center text-[#2ABF12]">
                                - <PiCurrencyInr />
                                {allDiscount}
                              </p>
                            </div>
                            <div className="flex justify-between mb-2">
                              <p>Coupon Discount</p>
                              <p className="flex items-center">
                                - <PiCurrencyInr />
                                {couponDiscount}
                              </p>
                            </div>

                            <div className="flex justify-between mb-2">
                              <p>Shipping Fee</p>
                              <p className="flex items-center">
                                {" "}
                                + <PiCurrencyInr />100
                              </p>
                            </div>

                          </div>
                          <button
                            className="font-[Quicksand] bg-[#011F4B] text-white rounded-md py-3 px-8 m-auto block"

                            onClick={() => {
                              toast.info("Please login first")
                            }}
                            disabled={
                              Object.keys(cartProducts).length ? false : true
                            }
                          >
                            PLACE ORDER
                          </button>
                        </div>
                      </div> */}
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <section className="font-[Poppins]">
                      <div className="md:flex gap-6">
                        <div className="md:w-8/12">
                          <div className="flex justify-between items-center mb-5 mt-2 flex-wrap sm:flex-nowrap">
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
                                      className="flex gap-2 items-start cursor-pointer border-2 border-[#D6CBCB] font-white shadow-[#0000001F]-500 py-5 px-12 rounded-md shadow-lg mb-4"
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
                        <div className="mt-3 md:mt-0 md:w-4/12 border-l-2 border-[#D6CBCB] px-5 font-[Poppins]">
                          <p className="text-[#353535] font-medium text-lg mb-2">
                            Price details
                          </p>
                          <div className="flex justify-between mb-2">
                            <p>Total MRP</p>
                            <p className="flex items-center">
                              <PiCurrencyInr />
                              {totalCost}
                            </p>
                          </div>
                          <div className="flex justify-between mb-2">
                            <p>Disount on MRP</p>
                            <p className="flex items-center text-[#2ABF12]">
                              -<PiCurrencyInr />
                              {allDiscount}
                            </p>
                          </div>
                          <div className="flex justify-between mb-2">
                            <p>Coupon Discount</p>
                            <p className="flex items-center">
                              -<PiCurrencyInr />
                              {couponDiscount}
                            </p>
                          </div>
                          {/* <div className="flex justify-between mb-2">
                    <p>Platform Fee</p>
                    <p className="flex items-center">
                      +<PiCurrencyInr />0
                    </p>
                  </div> */}
                          <div className="flex justify-between mb-2">
                            <p>Shipping Fee</p>
                            <p className="flex items-center">
                              {" "}
                              + <PiCurrencyInr /> 100
                            </p>
                          </div>
                          <div className="border-[1px] border-dashed border-black border-bottom-1 my-4"></div>
                          <div className="flex justify-between mb-2">
                            <p>Total amount</p>
                            <p className="flex items-center">
                              <PiCurrencyInr />
                              {totalCost - allDiscount + 100}
                            </p>
                          </div>
                          <button
                            className="font-[Quicksand] text-white bg-[#011F4B] font-medium text-lg rounded-md py-3 px-5 my-2 w-full"
                            onClick={() => setSelectedIndex(2)}
                            disabled={shippingAddress === null ? true : false}
                          >
                            CONTINUE
                          </button>
                        </div>
                      </div>
                    </section>
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
                  src="../public/assets/empty-cart.png"
                  alt="wishlistEmpty"
                />
                <Link
                  to="/wishlist"
                  className="py-3 px-12 text-lg font-semibold text-[#3466e8] border border-solid border-[#3466e8] rounded"
                >
                  ADD ITEMS FROM WISHLIST
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

                        <div className="my-3">
                          <h4 className="text-white font-medium text-base bg-[#535766] p-3 mb-3">
                            UNLOCK COUPONS
                          </h4>

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