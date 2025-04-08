import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
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
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import { LogOut, setUserData, getUserData } from "../../server/user";
import IndiaTime from "../../components/getIndiaTime";
import { CiStar } from "react-icons/ci";
import { PiCurrencyInr } from "react-icons/pi";
import { Switch } from "antd"

import Modal from "react-modal";
import uploadImageOnCloudinary from "../../server/client/imageUpload";
import LoadSpinner from "../../components/LoadSpinner";
import Loader from "../../components/loader";

Modal.setAppElement('#root'); // Assuming your root element's ID is 'root'





export default function Profile() {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [panInfo, setPanInfo] = useState();
  const [gstInfo, setGstInfo] = useState();
  const [verStatGst, setVerStatGst] = useState(false);
  const [verStatPan, setVerStatPan] = useState(false);
  const [pan, setPan] = useState('');
  const [panUrl, setPanUrl] = useState(null)
  const [gst, setGst] = useState('');
  const [gstUrl, setGstUrl] = useState(null);
  const [documentUploading, setDocumentUploading] = useState(false)

  const [userDetails, setUserDetails] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [allInvoice, setAllInvoice] = useState([]);
  const [userInvoice, setUserInvoice] = useState([])
  const [loading, setLoading] = useState(false);

  const [allCoupon, setAllCoupon] = useState([]);
  const [isOpenAddress, setIsOpenAddress] = useState(false);
  const [isOpenOrderDetails, setIsOpenOrderDetails] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(
    getUserData()?.address?.findIndex((item) => item?.isDefault === true)
  );
  const [formData, setFormData] = useState({});
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: userDetails,
  });
  const {
    register: addressRegister,
    handleSubmit: addressHandleSubmit,
    formState: { errors: addressErrors },
    reset: addressReset,
  } = useForm({
    defaultValues: formData,
  });
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)

  const [cancelReason, setCancelReason] = useState("")
  const [cancelOrderId, setcancelOrderId] = useState("")
  const [cancelProductId, setCancelProductId] = useState("")


  const [returnReason, setReturnReason] = useState("");  // State to store the return reason
  const [returnOrderId, setReturnOrderId] = useState(""); // State to store the order ID for canclereturn
  const [returnProductId, setReturnProductId] = useState("");


  const userType = localStorage.getItem("role")


  const logout = async () => {
    try {
      const { message } = await HttpClient.post("/users/logout");
      toast.success(message);
      navigate("/login");
      LogOut();
    } catch (error) {
      console.error(error);
    }
  };


  const handleApproval = async () => {

    console.log(gst, gstUrl, pan)

    const verficationDetails = {
      gst,
      pan,
      gstDoc: gstUrl,
      panDoc: panUrl
    }

    try {
      //debugger;
      setDocumentUploading(true)
      const response = await HttpClient.post(`/approval/submit`, verficationDetails);
      toast.success(response?.message);
      setDocumentUploading(false)


    }
    catch (error) {
      setLoading(false);
      // console.error(error);
      toast.error(error?.response?.data?.message)
      setDocumentUploading(false)

    }
  }

  const handleRegistration = async () => {
    try {

      const response = await HttpClient.post(`/subscribe/register`);
      toast.success(response?.status);
    }
    catch (error) {
      console.error(error);
    }
  }


  // const handlePanVerification = async () => {
  //   try {

  //     const response = await HttpClient.post('/verify/pan', { pan });


  //     if (response?.success && response?.verified) {

  //       setPanInfo(response?.panInfo?.data);

  //       setVerStatPan(true);
  //       toast.success(response?.panInfo?.responseMessage || "PAN verification successful.");
  //     }

  //   } catch (error) {

  //     const errorStatus = error?.response?.status;

  //     if (errorStatus === 406) {

  //       const errorMessage = error?.response?.data?.message?.message || "PAN verification failed: Not Acceptable.";
  //       console.error("Error during PAN verification:", errorMessage);
  //       toast.error(errorMessage);
  //       setVerStatPan(false);
  //     } else {

  //       const generalErrorMessage = error?.response?.data?.message || "An unexpected error occurred.";
  //       console.error("Error during PAN verification:", error);
  //       toast.error(generalErrorMessage);
  //     }
  //   }
  // };



  // const handleGstVerification = async () => {
  //   try {
  //     const { response } = await HttpClient.post('/verify/gst',
  //       { gstin: gst }
  //     );
  //     const { msg, success } = response.data;

  //     if (success) {
  //       setVerStatGst(true);
  //     } else {
  //       setVerStatGst(false);
  //     }

  //     setGstInfo(msg)

  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const onSubmit = async (data) => {
    try {
      const response = await HttpClient.put(`/users/update`, data);
      setUserData(response?.userData);
      setUserDetails(response?.userData);
      toast.success(response?.message || "Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const fetchProfileData = async () => {
    try {
      const { userData } = await HttpClient.get("/users/me");
      setUserDetails(userData);
      console.log("userData", userData)
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const fetchAllOrders = async () => {
    try {
      const { data } = await HttpClient.get("/order");
      setAllOrders(data);

      console.log("datadata", data)
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Coupon Code Copied!");
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  const getPanImageUrl = async (e) => {
    const uploadedPanUrl = await uploadImageOnCloudinary(e)
    setPanUrl(uploadedPanUrl)
    console.log("panUrlpanUrlpanUrl", panUrl)

  }

  const getGstUrl = async (e) => {
    const uploadedGstUrl = await uploadImageOnCloudinary(e)
    setGstUrl(uploadedGstUrl)
    console.log(gstUrl)
  }


  const addAddress = async (data) => {
    try {
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
  const fetchAllInvoices = async () => {
    // debugger

    try {
      const response = await HttpClient.get("/invoice/");

      setAllInvoice(response.allInvoices);
      console.log("allInvoices", response.allInvoices)
      // console.log(allInvoice)

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };
  useEffect(() => {

    fetchAllInvoices();

  }, [])




  useEffect(() => {
    addressReset(formData);
  }, [addressReset, formData]);

  useEffect(() => {
    fetchProfileData();
    fetchAllOrders();
    getAllCoupons();
  }, []);

  useEffect(() => {
    if (userDetails) {
      Object.keys(userDetails).forEach((key) => {
        setValue(key, userDetails[key]);
      });
    }
  }, [userDetails, setValue]);



  const returnOrder = () => {
    // console.log("return order")
  }

  const setSelectedReason = (e) => {
    setCancelReason(e.target.value)
  }

  const cancelTheOrder = async () => {
    // console.log(`orderId: ${cancelOrderId}`);
    let orderId = cancelOrderId
    // console.log(`cancelReason: ${cancelReason}`);
    // console.log(`cancelProductId: ${cancelProductId}`);

    if (cancelReason !== "") {
      try {
        const response = await HttpClient.post(`/order/cancel/${cancelOrderId}`, {
          cancellationReason: cancelReason, // Reason for cancellation
          productId: cancelProductId,       // Product ID
        });
        console.log(response)
        if (response?.cancelStatus === "approved") {
          toast("Order successfully cancelled!");

        }
        else {
          toast("Failed to cancel the order. Please try again.");
        }

      } catch (error) {
        console.error("Error cancelling the order:", error);
        alert("An error occurred while trying to cancel the order.");
      }
    }
  }

  const handleCancel = () => {
    cancelTheOrder()
    setShowCancelModal(false)
    setcancelOrderId("")
    setCancelReason("")
  }
  const selectReason = (event) => {
    setCancelReason(event.target.value)
  }

  const getOrderId = (orderId, productId) => {
    setcancelOrderId(orderId); // Set the orderId directly as the cancelOrderId
    setCancelProductId(productId)
  };

  const getReturnOrderId = (orderId) => {
    setReturnOrderId(orderId)
    console.log(orderId);
  };

  const getReturnProductId = (productId) => {
    setReturnProductId(productId)
  }


  const onCloseCancelModal = () => {
    setShowCancelModal(false)
  }

  const selectReurnReason = (e) => {
    setReturnReason(e.target.value)
  }

  const confirmReturn = async () => {
    try {
      const response = await HttpClient.post(`/return/create`, {
        productId: returnProductId,
        orderId: returnOrderId,
        reason: returnReason,
        comment: comment,

      });

      toast.success(response?.status);

    }
    catch (error) {
      console.error(error);
    }

  }
  const handleCommentChange = (e) => {
    setComment(e.target.value); // Save the comment in state
  }
  const userData = getUserData();
  const isSeller = userData?.role === "SELLER";
  const verificationStatus = isSeller ? userData?.verificationStatus : null;

  //fetching invoices
  const handleNavigate = (invoice) => {
    navigate(`/seller/invoice/${invoice._id}`, { state: { invoice } });
    console.log();
  };
  //fetchall invoices for the user customer
  const fetchUserInvoices = async (orderId) => {
    // debugger

    try {
      const response = await HttpClient.get(`/invoice/user/${orderId}`);
      console.log("API Response:", response)

      setUserInvoice(response.Invoice);
      console.log(response.Invoice)
      navigate(`/profile/invoice/${orderId}`);
      // console.log(allInvoice)

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };
  useEffect(() => {

    // fetchUserInvoices();

  }, [userInvoice])




  return (
    <>
      {isSeller && (
        <div

          className={`flex  mt-[40px] flex-col items-center  mx-2 ${verificationStatus
            ? "bg-green-100 border border-green-500 text-green-800"
            : "bg-red-100 border border-red-500 text-red-800"
            } p-3 rounded-lg`}
        >
          {verificationStatus ? (
            <p className="text-green-600 font-bold text-lg">
              Your business is verified.
            </p>
          ) : (
            <div className="text-center">
              <p className="text-red-600 font-bold text-lg">
                Your business is not verified yet. Upload Document in
                Verification Details and Complete Business Details
              </p>
              {/* <button 
             // onClick={}
              className="bg-[#C8102E] text-white font-bold py-1 px-4 rounded-full hover:opacity-90 mt-4">
                Verify Now
              </button> */}
            </div>
          )}
        </div>
      )}

      <section className="px-2 font-[Quicksand]">
        <TabGroup className="mt-6">
          <div className="sm:flex gap-6" >
            <div className="w-full sm:w-1/5">
              {/* <div className="bg-[#EFEFEF] border border-solid border-[#D6D6D6] p-5 mb-8">
                <p className="text-[#2F2F2F] font-bold text-lg">
                  {userData.firstName} {userData.lastName}
                </p>
                <p className="text-[#717171] font-normal">{userData.email}</p>
              </div> */}
              <div>
                <TabList className="flex sm:flex-col md:mb-4 mt-[50px] md:mt-[0px] flex-wrap">
                  {/* <Tab.List className="grid grid-cols-3 sm:flex sm:flex-col mb-6 "> */}
                  <Tab className="outline-none border rounded-sm  border-solid border-[#D6D6D6] text-[#626262] font-bold m-1 p-3 text-justify">
                    Profile
                  </Tab>
                  <Tab className="outline-none border rounded-sm  border-solid border-[#D6D6D6] text-[#626262] font-bold m-1 p-3 text-justify">
                    Orders
                  </Tab>
                  <Tab className="outline-none border rounded-sm  border-solid border-[#D6D6D6] text-[#626262] font-bold m-1 p-3 text-justify">
                    Coupons
                  </Tab>

                  <Tab className="outline-none border rounded-sm border-solid border-[#D6D6D6] text-[#626262] font-bold m-1 p-3 text-justify">
                    Addresses
                  </Tab>

                  {userType === "USER" ? "" : <Tab className="outline-none rounded-sm  border border-solid border-[#D6D6D6] text-[#626262] font-bold m-1 p-3 text-justify">
                    Business Details
                  </Tab>}

                  {userType === "USER" ? "" : <Tab className="outline-none rounded-sm  border border-solid border-[#D6D6D6] text-[#626262] font-bold m-1 p-3 text-justify">
                    Verfication Details
                  </Tab>}

                  {userType === "USER" ? "" : <Tab className="outline-none border border-solid border-[#D6D6D6] text-[#626262] font-bold m-1 p-3 sm:text-justify col-span-2 text-center">
                    Registration
                  </Tab>}


                  {userType === "USER" ? "" : <Tab className="outline-none border border-solid border-[#D6D6D6] text-[#626262] font-bold m-1 p-3 sm:text-justify col-span-2 text-center">
                    Subscription Plan
                  </Tab>}





                  {isSeller &&
                    <Tab className="outline-none border border-solid border-[#D6D6D6] text-[#626262] font-bold m-1 p-3 sm:text-justify col-span-2 text-center">
                      Invoices
                    </Tab>
                  }

                </TabList>
              </div>
            </div>
            <TabPanels className="w-full sm:w-4/5">
              <TabPanel className="bg-[#F2F2F2] h-full">

                <div className="py-5">
                  <div className="px-5 md:px-12 border-b border-solid border-[#D6D6D6]">
                    <p className="text-[#2F2F2F] font-semibold text-lg mb-2">
                      General information
                    </p>
                  </div>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-3 md:px-12 my-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                      <div>
                        <label className="block text-[#626262] font-medium mb-2 ml-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px] "
                          {...register("firstName", {
                            // required: "*First Name is required.",
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-[#626262] font-medium mb-2 ml-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px]"
                          {...register("lastName", {
                            // required: "*Last Name is required.",
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-[#626262] font-medium mb-2 ml-2">
                          E-Mail
                        </label>
                        <input
                          type="email"
                          disabled={userDetails?.email}
                          {...register("email", {
                            // required: "*E-Mail is required.",
                          })}
                          className="w-full border-[#CBCBCB] border-solid border rounded-[12px] text-[#717171] font-normal p-3 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#626262] font-medium mb-2 ml-2">
                          Mobile Number
                        </label>
                        <input
                          type="text"
                          disabled={userDetails?.mobileNumber}
                          className="w-full p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px] "
                          {...register("mobileNumber", {
                            // required: "*Mobile Number is required.",
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-[#626262] font-medium mb-2 ml-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          className="w-full p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px] "
                          {...register("dob", {
                            // required: "*DOB is required.",
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-[#626262] font-medium mb-2 ml-2">
                          Gender
                        </label>
                        <div className="flex items-center gap-5">
                          <div>
                            <input
                              type="radio"
                              id="male"
                              name="gender"
                              value="male"
                              {...register("gender")}
                              className="ml-2 p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px] accent-[#FF0000]"
                            />
                            <label
                              className="text-[#626262] font-medium ml-2"
                              htmlFor="male"
                            >
                              Male
                            </label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              id="female"
                              {...register("gender")}
                              className="ml-2 p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px] accent-[#FF0000]"
                            />
                            <label
                              className="text-[#626262] font-medium ml-2"
                              htmlFor="female"
                            >
                              Female
                            </label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id="other"
                              name="gender"
                              value="other"
                              {...register("gender")}
                              className="ml-2 p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px] accent-[#FF0000]"
                            />
                            <label
                              className="ml-2 text-[#626262] font-medium"
                              htmlFor="other"
                            >
                              Other
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="bg-[#011F4B] text-[#FFFFFF] font-bold rounded-md px-8 py-3 mx-auto block my-12"
                      type="submit"
                    >
                      SAVE
                    </button>
                  </form>
                </div>
              </TabPanel>
              <TabPanel className="bg-[#F2F2F2] p-2 h-full">
                <div className="px-5 md:px-12 border-b border-solid overflow border-[#D6D6D6]">
                  <p className="text-[#2F2F2F] font-medium text-lg mb-2">
                    ORDERS & RETURNS
                  </p>
                </div>
                <div className="px-5 h-auto overflow-auto  md:px-12 my-4">
                  {allOrders
                    .filter(
                      (order) =>
                        order.orderStatus[order.orderStatus.length - 1]
                          .status === "Pending" ||
                        order.orderStatus[order.orderStatus.length - 1]
                          .status === "Confirmed"
                    )
                    .reverse()
                    .map((order, i) => {
                      return (

                        <div className="p-5 mb-10 bg-white" orderId={order?.orderId} key={i}>
                          <div className="flex justify-between">
                            <p className="text-[#474747] font-medium text-lg mb-2">
                              Order Date {" : "}
                              <IndiaTime
                                data={order?.orderStatus[order?.orderStatus?.length - 1].date}
                              />
                            </p>
                          </div>
                          <div className="flex gap-2 flex-wrap justify-between">
                            <div className="flex flex-wrap">
                              <img
                                className="aspect-square object-contain rounded w-[150px]"
                                src={order.product.bannerImage}
                                alt={order.product.name}
                              />
                              <div className="p-1">
                                <button
                                  className="cursor-pointer capitalize text-[#595555] font-semibold"
                                  onClick={() => {
                                    setOrderDetails(order);
                                    setIsOpenOrderDetails(true);
                                  }}
                                >
                                  {order.product.name}
                                </button>


                                <p className="text-[#8A8A8A] font-medium">
                                  Size : <span>{order.product.size}</span>
                                </p>
                                <p className="text-[#8A8A8A] font-medium flex flex-wrap items-center gap-2">
                                  Price : <br />
                                  <span className="flex items-center text-[#EF939D]">
                                    <PiCurrencyInr />
                                    {order.product.discountedPrice}
                                  </span>
                                  <span className="line-through text-xs flex items-center">
                                    <PiCurrencyInr /> {order.product.price}
                                  </span>
                                </p>
                                <p className="text-[#8A8A8A] font-medium">
                                  Quantity : <span>{order.product.quantity}</span>
                                </p>
                                <p className="text-[#878787] font-medium">Rate us</p>
                                <div className="text-[#FFD233] flex gap-2 ">
                                  <CiStar /> <CiStar /> <CiStar /> <CiStar /> <CiStar />
                                </div>
                              </div>
                            </div>
                            <Modal
                              ariaHideApp={false} // This disables the screen reader hiding
                              isOpen={showCancelModal}
                              className="modal-content bg-white outline rounded-lg p-6 w-11/12 sm:w-96 mx-auto mt-10"
                              style={{
                                overlay: {
                                  backgroundColor: 'transparent', // This removes any background overlay
                                },
                              }}
                            >
                              <h2 className="text-xl font-semibold mb-4">Cancel Order</h2>
                              <p className="mb-3">Please select a reason for cancelling your order:</p>
                              <select
                                onChange={selectReason}
                                className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">-- Select Reason --</option>
                                <option value="Ordered by mistake">Ordered by mistake</option>
                                <option value="Better price available">Better price available</option>
                                <option value="Need to change the order">Need to change the order</option>
                                <option value="Found a different product">Found a different product</option>
                                <option value="Other">Other</option>
                              </select>
                              <div className="flex justify-end gap-2">
                                <button
                                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                  onClick={onCloseCancelModal}
                                >
                                  Close
                                </button>
                                <button
                                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                  onClick={handleCancel}
                                >
                                  Confirm
                                </button>
                              </div>
                            </Modal>



                            <div >
                              <button
                                value={order.orderId}
                                onClick



                                ={() => {
                                  setShowCancelModal(true); // Open the cancel modal
                                  getOrderId(order.orderId, order.product.productId);; // Pass orderId directly to the function
                                }}
                                className="font-[Quicksand] sm:w-auto p-2 text-[#FF0000] bg-[#F2F2F2] hover:bg-red-50 rounded-md border-[1px] border-solid border-red-600 font-medium transition duration-200 ease-in-out"
                              >
                                CANCEL ORDER
                              </button>
                              <div>
                                <button
                                  value={order.orderId}
                                  onClick={() => {
                                    console.log("Order ID:", order.Id); // 
                                    fetchUserInvoices(order.orderId); // Call the function with the order ID
                                  }}

                                >
                                  Show Invoice
                                </button>
                              </div>
                            </div>


                          </div>

                          <div className="w-full bg-[#959595] my-4 h-[1px] text-[#959595]"></div>

                          <div className="hidden sm:block">
                            <ol className="flex items-center w-full mb-5 p-2">
                              {[
                                "Pending",
                                "Confirmed",
                                "Shipped",
                                "Out for delivery",
                                "Delivered",
                              ].map((item, i) => {
                                const found = order.orderStatus.find(
                                  (val) => val.status === item
                                );
                                return (
                                  <li
                                    className={`w-full${i === 0 ? "" : " text-center"} ${i === 4 ? " text-end" : ""}`}
                                    key={i}
                                  >
                                    <p>{item}</p>
                                    <p
                                      className={`mt-3 flex w-full items-center text-blue-600 dark:text-blue-500 ${i !== 4
                                        ? `after:content-[''] after:w-full after:h-1 ${found ? "after:bg-[#011F4B]" : "after:bg-[#F2F2F2]"}`
                                        : ""} ${i !== 0
                                          ? `before:content-[''] before:w-full before:h-1 ${found ? "before:bg-[#011F4B]" : "before:bg-[#F2F2F2]"}`
                                          : ""}`}
                                    >
                                      <span
                                        className={`flex items-center justify-center w-7 h-7 rounded-full lg:w-10 lg:h-10 shrink-0 ${found
                                          ? "bg-[#011F4B]"
                                          : "bg-[#F2F2F2]"}`}
                                      ></span>
                                    </p>
                                  </li>
                                );
                              })}
                            </ol>
                          </div>

                          <div className="block sm:hidden my-2">
                            <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700">
                              <li className="mb-10 ms-6">
                                <span className="absolute flex items-center justify-center w-8 h-8 bg-[#011F4B] rounded-full -start-4 "></span>
                                <h3 className="font-medium leading-tight">Ordered</h3>
                              </li>
                              <li className="mb-10 ms-6">
                                <span className="absolute flex items-center justify-center w-8 h-8 bg-[#F2F2F2] rounded-full -start-4 "></span>
                                <h3 className="font-medium leading-tight">Shipped</h3>
                              </li>
                              <li className="mb-10 ms-6">
                                <span className="absolute flex items-center justify-center w-8 h-8 bg-[#F2F2F2] rounded-full -start-4   "></span>
                                <h3 className="font-medium leading-tight">Out for delivery</h3>
                              </li>
                              <li className="ms-6">
                                <span className="absolute flex items-center justify-center w-8 h-8 bg-[#F2F2F2] rounded-full -start-4   "></span>
                                <h3 className="font-medium leading-tight">Delivered</h3>
                              </li>
                            </ol>
                          </div>
                        </div>

                      );
                    })}
                </div>

                {allOrders.map((order, i,) => {
                  return (
                    (order.orderStatus[order.orderStatus.length - 1].status ===
                      "Delivered" ||
                      order.orderStatus[order.orderStatus.length - 1].status ===
                      "Returned") &&
                    order.product.some(product => product.isReturnable) && (
                      <div className="px-10 py-5 bg-white mb-3" orderId={order.orderId} key={i}>
                        <div className="mb-3">
                          <p className="text-[#39AC25] font-medium ">
                            {
                              order.orderStatus[order.orderStatus.length - 1]
                                .status
                            }
                          </p>
                          <p className="text-[#8A8A8A] font-medium text-sm mb-3">
                            On
                            <IndiaTime
                              data={
                                order.orderStatus[order.orderStatus.length - 1]
                                  .date
                              }
                            />

                          </p>

                          <div className="bg-[#F2F2F2] rounded-md py-2 px-5 flex justify-between flex-wrap">
                            <div className="flex flex-wrap">
                              <button
                                className="cursor-pointer"
                                onClick={() => {
                                  setOrderDetails(order);
                                  setIsOpenOrderDetails(true);
                                }}
                              >
                                <img
                                  className="rounded object-contain h-[100px] mr-2"
                                  src={order.product.bannerImage}
                                  alt={order.product.name}
                                />
                              </button>
                              <div>
                                <button
                                  className="cursor-pointer capitalize text-[#595555] font-semibold"
                                  onClick={() => {
                                    setOrderDetails(order);
                                    setIsOpenOrderDetails(true);
                                  }}
                                >
                                  {order.product.name}
                                </button>
                                <p className="text-[#8A8A8A] font-medium">
                                  Size : <span>{order.product.size}</span>
                                </p>
                                <p className="text-[#8A8A8A] font-medium flex items-center gap-2">
                                  Price :
                                  <span className="flex items-center text-[#EF939D]">
                                    <PiCurrencyInr />
                                    {order.product.discountedPrice}
                                  </span>
                                  <span className="line-through text-xs flex items-center">
                                    <PiCurrencyInr /> {order.product.price}
                                  </span>
                                </p>
                                <p className="text-[#8A8A8A] font-medium">
                                  Quantity : <span>{order.product.quantity}</span>
                                </p>
                              </div>
                            </div>

                            <Modal
                              isOpen={showReturnModal} // Change to show the return modal
                              className="modal-content bg-white outline rounded-lg p-6 w-11/12 sm:w-96 mx-auto mt-10"
                              style={{
                                overlay: {
                                  backgroundColor: 'transparent', // This removes any background overlay
                                },
                              }}
                            >
                              <h2 className="text-xl font-semibold mb-4">Return Order</h2>
                              <p className="mb-3">Please select a reason for returning your order:</p>

                              {/* Dropdown to select the return reason */}
                              <select
                                onChange={selectReurnReason} // Capture the selected reason for return
                                className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">-- Select Reason --</option>
                                <option value="Defective">Defective</option>
                                <option value="Item not as Described">Item not as Described</option>
                                <option value="Wrong Item Delivered">Wrong Item Delivered</option>
                                <option value="Changed My Mind">
                                  Changed My Mind
                                </option>
                                <option value="Other">Other</option>
                              </select>
                              <div>
                                <textarea
                                  placeholder="Please provide additional details about your return (optional)..."
                                  rows="4"
                                  onChange={handleCommentChange}
                                  className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                              </div>

                              <div className="flex justify-end gap-2">
                                <button
                                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600" onClick={() => {
                                    setShowReturnModal(false); // Close the modal
                                  }}
                                >
                                  Close
                                </button>
                                <button
                                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={confirmReturn}
                                >
                                  Confirm
                                </button>
                              </div>
                            </Modal>


                            <div className="sm:mt-2">
                              <button
                                value={order.orderId}  // Assuming order.orderId is available from your data
                                onClick={() => {
                                  setShowReturnModal(true);
                                  getReturnOrderId(order.orderId)
                                  getReturnProductId(order?.product?.productId)
                                }}
                                className="font-[Quicksand] sm:w-auto p-2 text-[#FF0000] bg-[#F2F2F2] hover:bg-red-50 rounded-md border-[1px] border-solid border-red-600 font-medium transition duration-200 ease-in-out"
                              >
                                RETURN ORDER
                              </button>

                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  );
                })}
              </TabPanel>
              <TabPanel className="bg-[#F2F2F2] h-full">
                <h4 className="text-white font-medium text-base bg-[#011F4B] p-5 mb-3">
                  All COUPONS
                </h4>
                <div className="p-5 grid md:grid-cols-2 gap-5">
                  {allCoupon.length
                    ? allCoupon.map((item, i) => (
                      <div key={i}>
                        <div className="flex items-start gap-5 p-3 border border-solid rounded pb-3 bg-white">
                          <div className="w-full">
                            <div className="flex gap-5 justify-between">
                              <div className="text-base px-3 py-2 border-2 border-dashed">
                                {item.couponCode}
                              </div>
                              <button
                                className="text-base px-3 py-2 bg-[#14CDA8]"
                                // className={`text-base px-3 py-2 ${
                                //   item.couponCode === couponCode
                                //     ? "bg-[#14CDA8]"
                                //     : "bg-[#011F4B] text-white"
                                // }`}
                                onClick={() =>
                                  copyToClipboard(item.couponCode)
                                }
                              >
                                COPY CODE
                              </button>
                            </div>
                            {/* <h5 className="my-3 text-base">
                                      save ₹
                                      {item.discountType === "percentage"
                                        ? Math.round(
                                            (totalMRP - totalDiscount) *
                                              (item.discount / 100)
                                          )
                                        : item.discount}
                                    </h5> */}
                            <h5 className="my-3 text-base">
                              Expire on :
                              <IndiaTime data={item.expirationTime} />
                            </h5>
                          </div>
                        </div>
                      </div>
                    ))
                    : ""}
                </div>
              </TabPanel>
              <TabPanel className="bg-[#F2F2F2] h-full">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-5 flex-wrap sm:flex-nowrap">
                    <p className="text-[#282727] font-medium text-lg">
                      Saved Addresses
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
                            <div className="cursor-pointer py-5 px-12 mb-4 bg-white">
                              <div className="flex items-center gap-2 mb-2">
                                <p>{item.name}</p>
                              </div>
                              <p className="text-[#353535] font-normal">
                                {item.address},
                              </p>
                              <p className="text-[#353535] font-normal">
                                {item.town},
                              </p>
                              <p className="text-[#353535] font-normal">
                                {item.city}-{item.postalCode}
                              </p>
                              <p className="text-[#353535] font-normal mb-3">
                                {item.state},
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
                                    setFormData(item);
                                    setSelectedAddressIndex(i);
                                    setIsOpenAddress(true);
                                  }}
                                >
                                  EDIT
                                </button>
                              </div>
                            </div>
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
                            <div
                              key={i}
                              className="cursor-pointer py-5 px-12 mb-4 bg-white"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <p>{item.name}</p>
                              </div>
                              <p className="text-[#353535] font-normal">
                                {item.address},
                              </p>
                              <p className="text-[#353535] font-normal">
                                {item.town},
                              </p>
                              <p className="text-[#353535] font-normal">
                                {item.city}-{item.postalCode}
                              </p>
                              <p className="text-[#353535] font-normal mb-3">
                                {item.state},
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
                                    setFormData(item);
                                    setSelectedAddressIndex(i);
                                    setIsOpenAddress(true);
                                  }}
                                >
                                  EDIT
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </TabPanel>
              <TabPanel className="bg-[#F2F2F2] h-full">
                <div className="p-5">
                  <div className="px-5 border-b border-solid border-[#D6D6D6]">
                    <p className="text-[#2F2F2F] font-semibold text-lg mb-2">
                      Business Verification Form
                    </p>
                  </div>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="px-5 md:px-5 my-4"
                  >
                    <div className="mb-5" >Business Information
                      <hr></hr>
                    </div>
                    <div className=" grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">

                      <div>

                        <p
                          className="text-black text-sm md:text-base font-medium bg-gray-100 p-2 mb-2 rounded-md border border-gray-300 shadow-sm"
                        >
                          <span className="font-semibold">User Name:</span> Aniket7422 {}
                          <span className="text-gray-600 block md:inline">
                            (Your buyer can search you using this)
                          </span>
                        </p>

                        <label className="text-[#626262] font-medium mb-2 ml-2">
                          Store Name
                        </label>
                        <input
                          type="text"
                          placeholder="Store Name"
                          className="w-full p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px] "
                          {...register("businessName", {
                            // required: "*First Name is required.",
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-[#626262] font-medium mb-2 ml-2">
                          Business Description
                        </label>
                        <input
                          type="text"
                          placeholder="Business description"
                          className="w-full p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px]"
                          {...register("businessDescription", {
                            // required: "*Last Name is required.",
                          })}
                        />
                      </div>
                      <div className="mb-5 mt-5">Contact Information
                        <hr></hr>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[#626262] font-medium mb-2 ml-2">
                            Business Address
                          </label>
                          <input
                            type="text"
                            placeholder="Business address"
                            className="border border-gray-300 rounded-lg p-3 w-full"
                            {...register("businessAddress", {
                              // required: "*Last Name is required.",
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-[#626262] font-medium mb-2 ml-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            placeholder="Enter your email"
                            className="border border-gray-300 rounded-lg p-3 w-full"
                            {...register("emailAddress", {
                              // required: "*Last Name is required.",
                            })}
                          />
                        </div>
                      </div>
                      <label className="block text-[#626262] font-medium mb-2 ml-2">
                        Mobile Number
                      </label>
                      <div className="grid grid-cols-3 gap-4 mb-4">

                        <select className="border border-gray-300 rounded-lg p-3 w-full">
                          <option>+91</option>

                        </select>
                        <input
                          type="text"
                          placeholder="Enter your mobile number"
                          className="border border-gray-300 rounded-lg p-3 w-full col-span-2"
                          {...register("mobileNumber", {
                            // required: "*Last Name is required.",
                          })}
                        />
                      </div>
                      <label className="block text-[#626262] font-medium mb-2 ml-2">
                        Mobile Number of Incharge
                      </label>
                      <div className="grid grid-cols-3 gap-4 mb-4">

                        <select className="border border-gray-300 rounded-lg p-3 w-full">
                          <option>+91</option>

                        </select>
                        <input
                          type="text"
                          placeholder="Enter alternative/Incharge number"
                          className="border border-gray-300 rounded-lg p-3 w-full col-span-2"
                          {...register("contactNumberIncharge", {
                            // required: "*Last Name is required.",
                          })}
                        />
                      </div>


                      {/* <div className="grid grid-cols-3 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Enter here"
                          className="border border-gray-300 rounded-lg p-3 w-full"
                        />
                        <input
                          type="text"
                          placeholder="Enter here"
                          className="border border-gray-300 rounded-lg p-3 w-full col-span-2"
                        />
                      </div> */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[#626262] font-medium mb-2 ml-2">
                            Street
                          </label>
                          <input
                            type="text"
                            placeholder="Type here"
                            className="border border-gray-300 rounded-lg p-3 w-full"
                            {...register("streetNumber", {
                              // required: "*Last Name is required.",
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-[#626262] font-medium mb-2 ml-2">
                            State
                          </label>
                          <input
                            type="text"
                            placeholder="State"
                            className="border border-gray-300 rounded-lg p-3 w-full"
                            {...register("state", {
                              // required: "*Last Name is required.",
                            })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[#626262] font-medium mb-2 ml-2">
                            City
                          </label>
                          <input
                            type="text"
                            placeholder="City/Town"
                            className="border border-gray-300 rounded-lg p-3 w-full"
                            {...register("city", {
                              // required: "*Last Name is required.",
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-[#626262] font-medium mb-2 ml-2">
                            Zip Code
                          </label>
                          <input
                            type="number"
                            placeholder="Enter your zipCode/PinCode"
                            className="border border-gray-300 rounded-lg p-3 w-full"
                            {...register("zipCode", {
                              // required: "*Last Name is required.",
                            })}
                          />
                        </div>
                      </div>
                      <div className="py-5">Tax And Legal Information
                        <hr></hr>
                      </div>


                      <div className="flex flex-col gap-3 mt-6">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-gray-600 text-sm">
                            I confirm that the information provided is accurate and up-to-date.
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-gray-600 text-sm">
                            I agree to the <a href="#" className="text-blue-600 underline">Terms & Conditions</a> and <a href="#" className="text-blue-600 underline">Privacy Policy</a>.
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-gray-600 text-sm">
                            I agree to receive marketing and promotional emails from VendorKart. (Optional)
                          </span>
                        </label>
                      </div>



                    </div>
                    <button
                      className="bg-[#011F4B] text-[#FFFFFF] font-bold rounded-md px-8 py-3 mx-auto block my-12"
                      type="submit"
                    >
                      SAVE
                    </button>
                  </form>
                </div>
              </TabPanel>



              <TabPanel className="bg-[#F2F2F2] h-full">

                {
                  documentUploading ? <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-50">
                  <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
                    <p className="text-lg font-semibold mb-4 text-gray-700">Uploading Documents...</p>
                    <Loader />
                  </div>
                </div>
                 : <div className=" grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className=" py-5 px-4">
                      <label className="block text-[#626262] font-medium mb-2 ml-2">
                        PAN
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your Pan "
                        className="border border-gray-300 rounded-lg p-3 w-full"
                        value={pan}
                        onChange={(e) => setPan(e.target.value.toUpperCase())}


                      />

                      <label className="block text-[#626262] font-medium mb-2 ">
                        Upload PAN Image
                      </label>
                      <input
                        type="file"
                        accept=".jpg, .jpeg, .png, .gif, .pdf, .doc, .docx"
                        className="block text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"

                        onChange={(e) => getPanImageUrl(e,)}
                      />


                      {/* 

    <button className="bg-[#011F4B] text-[#FFFFFF] font-bold rounded-md px-4 py-1 mx-auto  my-3 ml-auto"
      onClick={handlePanVerification}

    >Verify Pan </button> */}

                    </div>
                    {panInfo && (
                      <div className='mx-2 mt-2' >

                        <p className="font-poppins font-medium text-[20px] leading-[21px] py-4 mx-2">
                          PAN Information
                        </p>
                        <div className='flex gap-10 mx-2 py-4 '>
                          <div className='flex flex-col space-y-6 pr-2 w-1/3'>
                            <div className='flex flex-col space-y-2 '>
                              <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>PAN Number</h1>
                              <p className='font-poppins font-normal text-[16px] leading-[21px]'>{panInfo?.pan
                              }</p>
                            </div>
                            <div className='flex flex-col space-y-2 '>
                              <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>First Name</h1>
                              <p className='font-poppins font-normal text-[16px] leading-[21px]'>
                                {panInfo?.firstName
                                }
                              </p>
                            </div>
                            <div className='flex flex-col  space-y-2'>
                              <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Last Name</h1>
                              <p className='font-poppins font-normal text-[16px] leading-[21px]'> {panInfo?.lastName}</p>
                            </div>
                            <div className='flex flex-col  space-y-2'>
                              <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Gender</h1>
                              <p className='font-poppins font-normal text-[16px] leading-[21px]'> {panInfo?.gender}</p>
                            </div>
                            <div className='flex flex-col  space-y-2'>
                              <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Dob</h1>
                              <p className='font-poppins font-normal text-[16px] leading-[21px]'>{panInfo?.
                                dob}</p>
                            </div>
                          </div>


                          <div className='flex flex-col space-y-6 w-2/3'>


                            <div className='flex flex-col space-y-2'>
                              <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Aadhar Number</h1>
                              <p className='font-poppins font-normal text-[16px] leading-[21px]'>{panInfo?.
                                maskedAadhaarNumber
                              }</p>
                            </div>

                            <div className='flex flex-col space-y-2'>
                              <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Address</h1>
                              <p className='font-poppins font-normal text-[16px] leading-[21px]'>{panInfo?.
                                address
                              }
                              </p>
                            </div>
                            <div className='flex flex-col space-y-2'>
                              <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Aadhar Link Status</h1>
                              <p className={`font-poppins font-normal text-[16px] leading-[21px] ${panInfo?.aadhaarLinked ? 'text-green-600' : 'text-red-600'
                                }`}>{panInfo?.aadhaarLinked ? "Already Linked" : "Aadhaar Not Linked"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className=" py-5 px-4">
                      <label className="block text-[#626262] font-medium mb-2 ml-2">
                        GSTN
                      </label>
                      <input
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value) && value.length <= 15) {
                            setGst(value);
                          }
                        }}
                        value={gst}
                        type="text"
                        maxLength={15}
                        placeholder="Enter your GST Number"
                        className="border border-gray-300 rounded-lg p-3 w-full"
                      />


                      <label className="block text-[#626262] font-medium mb-2 mt-2">
                        Upload GST Image
                      </label>

                      <input
                        type="file"
                        accept=".jpg, .jpeg, .png, .gif, .pdf, .doc, .docx"
                        className="block  text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"

                        onChange={(e) => getGstUrl(e,)}
                      />
                      {/* <button className="bg-[#011F4B] text-[#FFFFFF] font-bold rounded-md px-4 py-1 mx-auto  my-6 ml-auto"
      onClick={handleGstVerification}

    >Verify Gstn</button> */}
                    </div>
                    {gstInfo && (
                      <div className='mx-2 mt-2' >

                        <p className="font-poppins font-medium text-[20px] leading-[21px] py-4 mx-2">
                          Gstn Information
                        </p>
                        <div className='flex gap-10 mx-2 py-4 '>
                          <div className='flex flex-col space-y-6 pr-2 w-1/3'>
                            <div className='flex flex-col space-y-2 '>
                              <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>GST Number</h1>
                              <p className='font-poppins font-normal text-[16px] leading-[21px]'>{gstInfo?.gstin}</p>
                            </div>
                            <div className='flex flex-col space-y-2 '>
                              <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>GSTN Status</h1>
                              <p className='font-poppins font-normal text-[16px] leading-[21px]'>
                                {gstInfo?.gstinStatus}
                              </p>
                            </div>
                            <div className='flex flex-col  space-y-2'>
                              <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Center Jurisdiction</h1>
                              <p className='font-poppins font-normal text-[16px] leading-[21px]'>{gstInfo?.centreJurisdiction}
                              </p>
                            </div>
                            <div className='flex flex-col  space-y-2 w-2/3'>
                              <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Center Jurisdiction Code</h1>
                              <p className='font-poppins font-normal text-[16px] leading-[21px]'>{gstInfo?.centreJurisdictionCode}</p>
                            </div>
                            <div className='flex flex-col  space-y-2'>
                              <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Legal Name Of Business</h1>
                              <p className='font-poppins font-normal text-[16px] leading-[21px]'>
                                {gstInfo?.legalNameOfBusiness
                                }
                              </p>
                            </div>
                          </div>


                          <div className='flex flex-col space-y-6 '>

                            <div className='flex flex-col space-y-2 w-2/3'>
                              <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>State Jurisdiction</h1>
                              <p className='font-poppins font-normal text-[16px] leading-[21px]'>
                                {gstInfo?.stateJurisdiction

                                }
                              </p>
                            </div>
                            <div className='flex flex-col space-y-2'>
                              <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>State Jurisdiction Code</h1>
                              <p className='font-poppins font-normal text-[16px] leading-[21px]'>
                                {gstInfo?.stateJurisdictionCode

                                }
                              </p>
                            </div>
                            <div className='flex flex-col space-y-2'>
                              <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Tax Payer Type</h1>
                              <p className='font-poppins font-normal text-[16px] leading-[21px]'>  {gstInfo?.taxpayerType


                              }</p>
                            </div>
                            <div className='flex flex-col space-y-2'>
                              <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Reference Id</h1>
                              <p className='font-poppins font-normal text-[16px] leading-[21px]'>
                                {gstInfo?.
                                  referenceId
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>)}

                    <div>
                      {
                        loading === false ?
                          <button className="bg-[#011F4B] text-sm text-[#FFFFFF] font-bold rounded-md px-3 py-2 mx-auto block"
                            onClick={handleApproval}

                          >Submit Docs</button>
                          :
                          <LoadSpinner />
                      }
                    </div>
                  </div>
                }


              </TabPanel>




              <TabPanel className=" h-full">
                <div className="font-inter text-[24px] font-medium leading-[29.05px] text-left">
                  One Time Platform Fees For Registration
                </div>
                <hr className="bg-gray-500 mx-1 my-4"></hr>
                <div className="font-inter text-[14px] font-normal leading-[16.94px] text-left mx-2">Get verified to start selling your products. This one-time fee ensures your business is authenticated, giving you access to our platform and customers.</div>
                <div className="flex gap-10 py-5 mx-2">
                  <div className="border-r-2 border-[#D9D9D9]">
                    <div className="w-72 h-72 bg-blue-50 rounded-lg shadow-md mx-5"></div>
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div className="font-inter text-[14px] font-semibold leading-[16.94px]">Amount</div>
                      <div className="font-inter text-[16px] font-semibold leading-[19.36px]">999 </div>
                    </div>
                    <hr className="bg-gray-500 mx-1 my-4"></hr>
                    <p className="font-inter text-[14px] font-semibold leading-[20px] tracking-[0.01em] text-left">Payment Options:</p>
                    <div class="flex items-center gap-4 p-4">

                      <div class="flex flex-col gap-4">
                        <div className="flex items-center space-x-4">
                          <input type="radio" name="payment" className="w-6 h-6 border-gray-300 text-black focus:ring-2 focus:ring-gray-400" />
                          <label
                            htmlFor="radio"
                            className="font-normal font-[Poppins] text-[000000] leading-5"
                          >
                            Credit/Debit Card
                          </label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <input type="radio" name="payment" className="w-6 h-6 border-gray-300 text-black focus:ring-2 focus:ring-gray-400" />
                          <label
                            htmlFor="radio"
                            className="font-normal font-[Poppins] text-[000000] leading-5"
                          >
                            Upi
                          </label>
                        </div>

                      </div>


                    </div>
                    <hr className="bg-gray-500 mx-1 my-4"></hr>
                    <button className="bg-[#011F4B] text-[#FFFFFF] font-bold rounded-md px-4 py-1 mx-auto  my-6 ml-auto"
                      onClick={() => alert("This feature will be available soon")}
                    //  onClick={handleRegistration}

                    >PayNow</button>

                  </div>
                </div>
              </TabPanel>
              <TabPanel className="h-full p-4 bg-gray-50">
  <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Subscription</h1>

  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
    {["Free", "Silver", "Gold", "Platinum"].map((plan) => (
      <div
        key={plan}
        className="shadow-lg border border-gray-200 rounded-lg bg-white w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4"
      >
        <Switch
          onClick={() => alert("Feature will be available soon")}
          className="m-2"
        />
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700">{plan}</h2>
          <img
            src="https://s3-alpha-sig.figma.com/img/e0f6/ba85/9941adab5aa94e793b68a430fa3c454c?Expires=1729468800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YKERHzcIqP3i559PB8Q-f-3uqF5h94VrwYcSJs4rENPcTn9Gz4K6kcQMFIfVrYAUS4wYmRseXdeJGMtLTI9aZDDByj0THBXJNknZU4mSQYlMei5-5FpD-x5RpFegLD-ofhUGb2Q~ROvyrCzD2mh6el1nGSvajITdEGxUacMzEkUksjkyu3qYJBGG8KhNJtovNKdwLSf7z9Mo7W-mEYfC-yHEKJV5895Dsv1PJBTF2rMmnqWdaSGdZpHMh7JdibavI1xnClJtEqoLBUJEmLiqoxxnFnolSycfsU61lMY4rlq1~lJHUjME1XROAG2pNASjJqTJ7IzM~4bz6nP1i0smUQ__"
            alt={`${plan} plan`}
            className="w-12 h-12 my-4"
          />
          <hr className="border-t border-gray-300 w-4/5 my-2" />
          <p className="text-center text-sm text-gray-600">
            Pay fee in easy (interest-free) installments. Choose from monthly or
            quarterly payment options.
          </p>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            type="button"
          >
            {plan}
          </button>
        </div>
      </div>
    ))}
  </div>
</TabPanel>

              <TabPanel className=" bg-[#F2F2F2]  h-full">
                <h1 className="text-xl text-center font-semibold sm:pt-10 lg:pt-2">Past Order details and Invoices</h1>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="">Invoice Number</th>
                        <th className="">Total Products</th>
                        <th className="">Total Amount</th>
                        <th className="">Customer Name</th>
                        <th className="">View Details</th>
                        <th>

                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allInvoice.map((invoice) => (
                        <tr key={invoice._id} className="">
                          <td className="px-4 py-2">{invoice.invoiceNumber}</td>
                          <td className="px-4 py-2">{invoice.orderSummary.totalProducts}</td>
                          <td className="px-4 py-2">${invoice.orderSummary.totalPrice}</td>
                          <td className="px-4 py-2">{invoice.customer.name}</td>
                          <td className="px-4 py-2 "> <button className="text-blue-700 hover:underline" onClick={() => handleNavigate(invoice)}>
                            View Details
                          </button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </TabPanel>
            </TabPanels>

          </div>
        </TabGroup>
      </section >
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
      <Transition appear show={isOpenOrderDetails}>
        <Dialog
          as="div"
          className="relative z-10 focus:outline-none cart"
          onClose={() => {
            setIsOpenOrderDetails(false);
            setOrderDetails(null);
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
                          setIsOpenOrderDetails(false);
                          setOrderDetails(null);
                        }}
                        type="button"
                      >
                        <RxCross2 className="text-md" />
                      </button>
                      <p className="text-[#535353] font-medium text-lg text-center">
                        Order Details
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
    </>
  );
}
