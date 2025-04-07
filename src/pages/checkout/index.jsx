import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { FiEdit } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { getUserData, setUserData } from "../../server/user";
import IndiaTime from "../../components/getIndiaTime";
import CheckoutWithoutLogin from "../checkoutwithoutlogin";
import { CiDeliveryTruck } from "react-icons/ci";
import { CartContext } from "../../usecontext1/cartcontext";

const loginStatus = localStorage.getItem("accessToken")

console.log("accessTokenaccessTokenaccessToken", loginStatus)

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
  const { addToCartContext, cart, removeFromCartContext, updateCartItem } = useContext(CartContext)

  console.log(cart)




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
    getUserData()?.address?.filter((item) => item?.isDefault === true).length !==
      0
      ? {
        ...getUserData()?.address?.filter(
          (item) => item.isDefault === true
        )[0],
      }
      : null
  );
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(
    getUserData()?.address?.findIndex((item) => item.isDefault === true)
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

    try {
      const response = await HttpClient.get("/cart");
      const cartItems = Object.values(response.data);
      setCartProducts(cartItems)
      console.log("cartcartcartcartcartcartcartcart", cartProducts)



    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const removeProductFromCart = async (productIdName) => {
    try {
      const { message } = await HttpClient.put("/cart/remove", {
        productIdName,
      });
      toast.success(message);
      fetchCartProducts();
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
        quantity: data.quantity,
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
      console.log(productIdName)
      const { product } = await HttpClient.get(
        `/product/${cartProducts[productIdName].productId}`
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

  const calculateTotalAmount = () => {
    let totalMRP = 0;
    let totalDiscount = 0;
    cartProducts &&
      Object.keys(cartProducts).length &&
      Object.keys(cartProducts).forEach((item) => {
        const itemTotal =
          (cartProducts[item]?.quantity || 1) *
          (cartProducts[item]?.price || 1);
        totalMRP += itemTotal;
        totalDiscount +=
          (cartProducts[item]?.discount / 100) * cartProducts[item]?.price;
      });
    setTotalMRP(Math.round(totalMRP));
    setTotalDiscount(Math.round(totalDiscount));
    setTotalAmount(Math.round(totalMRP - totalDiscount - couponDiscount));
  };

  const addAddress = async (data) => {
    try {
      setShippingAddress(data);
      let address = userDetails?.address ? userDetails.address : [];
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
      let address = userDetails?.address ? userDetails.address : [];
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
      let address = userDetails?.address ? userDetails.address : [];
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
        totalProduct: Object.keys(cartProducts).length,
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

  const getAllCoupons = async () => {
    try {
      const { coupons } = await HttpClient.get("/coupon/list");
      setAllCoupon(coupons);
    } catch (error) {

      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const getCouponDetails = async (data) => {
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
  };

  const onlinePayment = async () => {
    toast.error("This Payment method is not available!");
  };

  useEffect(() => {
    fetchCartProducts();
    getAllCoupons();
  }, []);

  useEffect(() => {
    calculateTotalAmount();
  }, [couponDiscount, cartProducts]);

  useEffect(() => {
    addressReset(formData);
  }, [addressReset, formData]);

  useEffect(() => {
    reset({
      size: selectedSize,
      quantity: selectedQuantity,
    });
  }, [reset, selectedSize, selectedQuantity]);

  return (
    <>
<h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Your Shopping Cart
        </h1>
<CheckoutWithoutLogin />





      <div>
        <section className="px-10 py-7 font-[Quicksand]">
          {Object?.keys(cartProducts)?.length ? (
            <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
              <TabList className="flex justify-between mt-4 sm:justify-center">
                <Tab className="font-medium text-[#474747] focus:text-[#011F4B] active:text-[#011F4B] focus:outline-none  font-[Poppins]">
                  Delivering Address
                </Tab>
                <span className="hidden sm:block mx-5">-------------</span>
                <Tab className="font-medium text-[#474747] focus:text-[#011F4B] active:text-[#011F4B] focus:outline-none font-[Poppins]">
                  More Addresses
                </Tab>
               
              </TabList>
              <TabPanels className="mt-8">
                <TabPanel>
                  <div className="">
                    <div className="">
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
                            <p> </p>
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
                              MODIFY   ADDRESS
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

                  </div>
                </TabPanel>


                <TabPanel>
  <section className="font-[Poppins] px-4 py-6">
    <div className="mx-auto">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-[#282727] font-semibold text-2xl">Select Delivery Address</h2>
        <button
          className="text-[#011F4B] font-medium text-sm border border-dashed border-[#011F4B] rounded-md px-4 py-2 hover:bg-[#011F4B] hover:text-white transition-all duration-300"
          onClick={() => {
            setIsOpenAddress(true);
            setFormData({});
          }}
        >
          + Add New Address
        </button>
      </div>

      {/* Default Address */}
      {userDetails.address.some((item) => item.isDefault) && (
        <>
          <h3 className="text-[#282727] font-semibold text-lg mb-2">Default Address</h3>
          <div className="grid gap-4">
            {userDetails.address
              .filter((item) => item.isDefault)
              .map((item, i) => (
                <label
                  key={i}
                  htmlFor={`defaultAddres${i}`}
                  className="flex gap-4 items-start cursor-pointer border border-gray-200 bg-white shadow-sm rounded-xl p-5 hover:shadow-lg transition"
                >
                  <input
                    type="radio"
                    id={`defaultAddres${i}`}
                    name="shippingAddress"
                    className="h-5 w-5 mt-1 text-[#011F4B]"
                    defaultChecked={
                      item?.address &&
                      shippingAddress &&
                      JSON.stringify(item).toLowerCase().includes(
                        JSON.stringify(shippingAddress).toLowerCase()
                      )
                    }
                    onChange={() => setShippingAddress(item)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-[#333]">{item?.name}</p>
                    <p className="text-gray-600 mt-1">
                      {item?.address}, {item?.town}, {item?.city}, {item?.state}, {item?.postalCode}
                    </p>
                    <p className="text-gray-600 mt-1">Mobile: {item?.mobileNumber}</p>
                    <div className="flex gap-3 mt-4">
                      <button
                        className="text-sm text-gray-600 border border-gray-400 rounded-md px-4 py-1 hover:bg-gray-100"
                        onClick={() =>
                          removeAddress(userDetails.address.findIndex((data) => data.isDefault))
                        }
                      >
                        Remove
                      </button>
                      <button
                        className="text-sm text-[#011F4B] border border-[#011F4B] rounded-md px-4 py-1 hover:bg-[#011F4B] hover:text-white"
                        onClick={() => {
                          setFormData(item);
                          setSelectedAddressIndex(
                            userDetails.address.findIndex((data) => data.isDefault)
                          );
                          setIsOpenAddress(true);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </label>
              ))}
          </div>
        </>
      )}

      {/* Other Addresses */}
      {userDetails.address.some((item) => !item.isDefault) && (
        <>
          <h3 className="text-[#282727] font-semibold text-lg mb-2 mt-6">Other Addresses</h3>
          <div className="grid gap-4">
            {userDetails.address
              .filter((item) => !item.isDefault)
              .map((item, i) => (
                <label
                  key={i}
                  htmlFor={`otherAddres${i}`}
                  className="flex gap-4 items-start cursor-pointer border border-gray-200 bg-white shadow-sm rounded-xl p-5 hover:shadow-lg transition"
                >
                  <input
                    type="radio"
                    id={`otherAddres${i}`}
                    name="shippingAddress"
                    className="h-5 w-5 mt-1 text-[#011F4B]"
                    defaultChecked={
                      item?.address &&
                      shippingAddress &&
                      JSON.stringify(item).toLowerCase().includes(
                        JSON.stringify(shippingAddress).toLowerCase()
                      )
                    }
                    onChange={() => setShippingAddress(item)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-[#333]">{item?.name}</p>
                    <p className="text-gray-600 mt-1">
                      {item?.address}, {item?.town}, {item?.city}, {item?.state}, {item?.postalCode}
                    </p>
                    <p className="text-gray-600 mt-1">Mobile: {item?.mobileNumber}</p>
                    <div className="flex gap-3 mt-4">
                      <button
                        className="text-sm text-gray-600 border border-gray-400 rounded-md px-4 py-1 hover:bg-gray-100"
                        onClick={() => removeAddress(i)}
                      >
                        Remove
                      </button>
                      <button
                        className="text-sm text-[#011F4B] border border-[#011F4B] rounded-md px-4 py-1 hover:bg-[#011F4B] hover:text-white"
                        onClick={() => {
                          setFormData(userDetails.address[i]);
                          setSelectedAddressIndex(i);
                          setIsOpenAddress(true);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </label>
              ))}
          </div>
        </>
      )}
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
                src="../assets/empty-cart.png"
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
                                <div className="flex items-start gap-5 my-2 border-b border-solid pb-3">
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




    </>
  );
}
