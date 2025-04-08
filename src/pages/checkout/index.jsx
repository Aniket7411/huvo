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
import { FiEdit } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { getUserData, setUserData } from "../../server/user";
import IndiaTime from "../../components/getIndiaTime";

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

  const fetchCartProducts = async () => {
    console.log("cartData")

    if(localStorage.getItem('accessToken')){
      try {
      
        const response = await HttpClient.get("/cart");
        console.log(response)
        const {data} = response
        console.log("aniket cart data",data)
        setCartProducts(data);
        console.log("this", cartProducts)
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message);
      }
    }


    setCartProducts(
      {
        
          "zS1UpiGztHS#0000FF":{
            bannerImage: "http://res.cloudinary.com/dgcghqfqv/image/upload/v1743419723/Cloudinary-React/ecqssuhcgu9syj4whykg.jpg",
  color: "#0000FF",
  name: "Jeans for girl",
  price: 2000,
  productId: "zS1UpiGztH",
  quantity: 1,
  size: "S",

          }
        
      }
    );

   
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
      const { product } = await HttpClient.get(
        `/product/${cartProducts[productIdName].productId}`
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
          (cartProducts[item]?.discount?cartProducts[item]?.discount:0 / 100) * cartProducts[item]?.price;
      });
    setTotalMRP(Math.round(totalMRP));
    setTotalDiscount(Math.round(totalDiscount));
    setTotalAmount(Math.round(totalMRP - totalDiscount - couponDiscount));
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
  //console.log("card product", products)
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
   if(localStorage.getItem('accessToken')){
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
    if(localStorage.getItem('accessToken')){
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
      <section className="px-10 py-7 font-[Quicksand]">
        {Object.keys(cartProducts).length ? (
          <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <TabList className="flex justify-between mt-4 sm:justify-center">
              <Tab className="font-medium text-[#474747] focus:text-[#011F4B] active:text-[#011F4B] focus:outline-none  font-[Poppins]">
                BAG
              </Tab>
              <span className="hidden sm:block mx-5">-------------</span>
              <Tab className="font-medium text-[#474747] focus:text-[#011F4B] active:text-[#011F4B] focus:outline-none font-[Poppins]">
                ADDRESS
              </Tab>
              <span className="hidden sm:block mx-5">-------------</span>
              <Tab className="font-medium text-[#474747] focus:text-[#011F4B] active:text-[#011F4B] focus:outline-none font-[Poppins]">
                PAYMENT
              </Tab>
            </TabList>
            <TabPanels className="mt-8">
              <TabPanel>
                <div className="md:flex gap-6">
                  <div className="md:w-8/12">
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
                    <div className="border-2 border-[#D6CBCB] p-3 rounded-md my-6 font-[Poppins]">
                      <details>
                        <summary className="text-[#011F4B] font-medium text-lg cursor-pointer inline-flex items-center gap-2 justify-center">
                          <span>
                            <BiSolidOffer className="fill-[#011F4B] inline-block" />
                          </span>
                          AVAILABLE OFFERS
                        </summary>
                        <p className="text-[#535353] font-normal mt-2">
                          7% Discount with Shopping Cart
                        </p>
                      </details>
                    </div>
                    {/* <div className="flex justify-between mb-2 flex-wrap sm:flex-nowrap gap-1 ">
                          <p className="text-[#535353] font-medium sm:text-lg">
                            1/1 Item Selected
                          </p>
                          <p className="text-[#535353] font-medium sm:text-lg">
                            Remove | Whislist
                          </p>
                        </div> */}
                    {Object.keys(cartProducts).map((key, i) => {
                      return (
                        <div
                          className="border-2 border-[#D6CBCB] p-3 rounded-md my-6 font-[Poppins] relative"
                          key={i}
                        >
                          <button
                            className="flex items-center justify-center absolute top-3 right-3 h-6 w-6 border border-solid border-[#d4d5d9] rounded-full bg-white font-bold text-xl"
                            onClick={() => removeProductFromCart(key)}
                          >
                            <RxCross2 className="text-sm" />
                          </button>
                          <div className="flex gap-4">
                            <div>
                              <img
                                className="w-28 h-42 rounded-xl"
                                src={cartProducts[key].bannerImage}
                                alt={cartProducts[key].name}
                              />
                            </div>
                            <div>
                              <p className="text-[#535353] font-medium text-lg ">
                                {cartProducts[key].name}
                                {cartProducts[key].discount ? (
                                  <span className="text-sm text-[#011F4B]">
                                    ({cartProducts[key].discount}% off)
                                  </span>
                                ) : (
                                  ""
                                )}
                              </p>
                              {cartProducts[key].description && (
                                <p className="text-[#4D4D4D] font-medium mb-2">
                                  {cartProducts[key].description}
                                </p>
                              )}
                              <div className="flex items-center gap-4">
                              <h3>Product Name : Plazo</h3>
                              <p className="rounded-md px-1 " style={{
                                outline:"1px solid gray"
                              }}> <strong>Color :</strong>  {cartProducts[key].color}</p>
                              </div>

                              <div className="flex gap-2 mb-2 items-center">
                                  <p className="text-[#4D4D4D] font-medium">
                                    Size : {cartProducts[key].size}
                                  </p>
                      
                     
                                {cartProducts[key].quantity && (
                                  <p className="text-[#4D4D4D] text-md font-medium">
                                    Quantity: {cartProducts[key].quantity}
                                  </p>
                                )}
                                <button
                                  onClick={() => openDialogForProduct(key)}
                                >
                                  {/* <FiEdit /> */}
                                </button>
                              </div>
                              <p className="flex items-center font-medium mb-2">
                                <span></span>
                                <PiCurrencyInr />
                                <span>
                                  {cartProducts[key].price -
                                    Math.floor(
                                      (cartProducts[key].discount / 100) *
                                      cartProducts[key].price
                                    )}
                                </span>
                                {cartProducts[key].discount ? (
                                  <span className="ml-2 line-through text-xs flex items-center">
                                    <PiCurrencyInr /> {cartProducts[key].price}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </p>
                              <p className="text-[#4D4D4D] font-medium mb-2">
                                7 days return available
                              </p>
                              <p className="text-[#4D4D4D] font-medium mb-2">
                                Delivery within 7 days after placing order
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div className="border-2 border-[#D6CBCB] p-3 rounded-md my-6">
                      <Link to="/wishlist">
                        <div className="flex justify-between items-center font-[Poppins]">
                          <div className="text-[#353535] font-normal text-lg flex items-center gap-1">
                            <BsBookmarkPlus className="fill-[#011F4B] inline" />
                            Add More From Wishlist
                          </div>
                          <FaChevronRight className="fill-[#011F4B] inline" />
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="md:w-4/12">
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
                            {totalMRP}
                          </p>
                        </div>
                        <div className="flex justify-between mb-2">
                          <p>Disount on MRP</p>
                          <p className="flex items-center text-[#2ABF12]">
                            - <PiCurrencyInr />
                            {totalDiscount}
                          </p>
                        </div>
                        <div className="flex justify-between mb-2">
                          <p>Coupon Discount</p>
                          <p className="flex items-center">
                            - <PiCurrencyInr />
                            {couponDiscount}
                          </p>
                        </div>
                        {/* <div className="flex justify-between mb-2">
                          <p>Platform Fee</p>
                          <p className="flex items-center">
                            + <PiCurrencyInr />{
                             10
                            }
                          </p>
                        </div> */}
                        <div className="flex justify-between mb-2">
                          <p>Shipping Fee</p>
                          <p className="flex items-center">
                            {" "}
                            + <PiCurrencyInr />100
                          </p>
                        </div>
                        <div className="border-[1px] border-dashed border-black border-bottom-1 my-4"></div>
                        <div className="flex justify-between mb-2">
                          <p>Total amount</p>
                          <p className="flex items-center">
                            <PiCurrencyInr />
                            {totalAmount+100}
                          </p>
                        </div>
                      </div>
                      <button
                        className="font-[Quicksand] bg-[#011F4B] text-white rounded-md py-3 px-8 m-auto block"
                        onClick={() => setSelectedIndex(1)}
                        disabled={
                          Object.keys(cartProducts).length ? false : true
                        }
                      >
                        PLACE ORDER
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
                                  className="flex gap-2 items-start cursor-pointer border-2 border-[#D6CBCB] font-white shadow-[#0000001F]-500 py-5 px-12 rounded-md shadow-lg mb-4"
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
                          {totalMRP}
                        </p>
                      </div>
                      <div className="flex justify-between mb-2">
                        <p>Disount on MRP</p>
                        <p className="flex items-center text-[#2ABF12]">
                          -<PiCurrencyInr />
                          {totalDiscount}
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
                          {totalAmount+100}
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
              <TabPanel>
                <section className="font-[Poppins]">
                  <div className="flex gap-6">
                    <div className="w-8/12">
                      <div className="border-2 border-[#D6CBCB] p-3 rounded-md my-6">
                        <details>
                          <summary className="text-[#011F4B] font-medium text-lg cursor-pointer inline-flex items-center gap-2 justify-center">
                            <span>
                              <BiSolidOffer className="fill-[#011F4B] inline-block" />
                            </span>
                            BANK OFFERS
                          </summary>
                          <p className="text-[#535353] font-normal mt-2">
                            7% Discount with Shopping Cart
                          </p>
                        </details>
                      </div>
                      <div className="border-2 border-[#D6CBCB] p-3 rounded-md my-6">
                        <div className="flex gap-2 items-start">
                          <input
                            type="radio"
                            name="paymentMode"
                            id="cashOnDelivery"
                            value={"cashOnDelivery"}
                            className="h-5 w-5 cursor-pointer"
                            onClick={(e) => setPaymentType(e.target.value)}
                          />
                          <label
                            htmlFor="cashOnDelivery"
                            className="font-semibold cursor-pointer"
                          >
                            Cash On Delivery (Cash / UPI )
                          </label>
                        </div>
                        <div className="flex gap-2 items-start mt-3">
                          <input
                            type="radio"
                            name="paymentMode"
                            id="onlinePayment"
                            value={"onlinePayment"}
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
                    <div className="w-4/12 border-l-2 border-[#D6CBCB] px-5 font-[Poppins]">
                      <p className="text-[#353535] font-medium text-lg mb-2">
                        Price details
                      </p>
                      <div className="flex justify-between mb-2">
                        <p>Total MRP</p>
                        <p className="flex items-center">
                          <PiCurrencyInr />
                          {totalMRP}
                        </p>
                      </div>
                      <div className="flex justify-between mb-2">
                        <p>Disount on MRP</p>
                        <p className="flex items-center text-[#2ABF12]">
                          -<PiCurrencyInr />
                          {totalDiscount}
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
                          {totalAmount+100}
                        </p>
                      </div>
                      <button
                        className={
                          "font-[Quicksand] text-white bg-[#011F4B] font-medium text-lg rounded-md py-3 px-5 my-2 w-full" +
                          (!paymentType ? " opacity-80" : "")
                        }
                        onClick={() =>
                          paymentType === "cashOnDelivery"
                            ? orderPlace()
                            : onlinePayment()
                        }
                        disabled={paymentType ? false : true}
                      >
                        PLACE ORDER
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
      {/* <section>
          <p className="font-[Quicksand] font-medium mb-4 text-center text-[#011F4B] text-3xl sm:text-4xl">
            YOU MAY BE LIKE
          </p>
          <div className="px-[13%] py-5">
            <div className="grid sm:grid-cols-3 xl:grid-cols-5 gap-4">
              <div className="w-full lg:w-fit border-2 font-[Poppins]">
                <div>
                  <img className="w-full" src="assets/similar-lady.png" alt="" />
                </div>
                <div className="py-[5px] px-3">
                  <p>Nayam By Lakshita</p>
                  <p className="text-[#4C4C4C]">Embroidered Kurti</p>
                  <p className="">
                    Rs.1097Rs. 1995{" "}
                    <span className="text-[#011F4B]">(45% OFF) </span>
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-fit border-2 font-[Poppins]">
                <div>
                  <img className="w-full" src="assets/similar-lady.png" alt="" />
                </div>
                <div className="py-[5px] px-3">
                  <p>Nayam By Lakshita</p>
                  <p className="text-[#4C4C4C]">Embroidered Kurti</p>
                  <p className="">
                    Rs.1097Rs. 1995{" "}
                    <span className="text-[#011F4B]">(45% OFF) </span>
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-fit border-2 font-[Poppins]">
                <div>
                  <img className="w-full" src="assets/similar-lady.png" alt="" />
                </div>
                <div className="py-[5px] px-3">
                  <p>Nayam By Lakshita</p>
                  <p className="text-[#4C4C4C]">Embroidered Kurti</p>
                  <p className="">
                    Rs.1097Rs. 1995{" "}
                    <span className="text-[#011F4B]">(45% OFF) </span>
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-fit border-2 font-[Poppins]">
                <div>
                  <img className="w-full" src="assets/similar-lady.png" alt="" />
                </div>
                <div className="py-[5px] px-3">
                  <p>Nayam By Lakshita</p>
                  <p className="text-[#4C4C4C]">Embroidered Kurti</p>
                  <p className="">
                    Rs.1097Rs. 1995{" "}
                    <span className="text-[#011F4B]">(45% OFF) </span>
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-fit border-2 font-[Poppins]">
                <div>
                  <img className="w-full" src="assets/similar-lady.png" alt="" />
                </div>
                <div className="py-[5px] px-3">
                  <p>Nayam By Lakshita</p>
                  <p className="text-[#4C4C4C]">Embroidered Kurti</p>
                  <p className="">
                    Rs.1097Rs. 1995{" "}
                    <span className="text-[#011F4B]">(45% OFF) </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section> */}
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
    </>
  );
}