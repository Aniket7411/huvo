import React, { useState, useEffect, createContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoReorderThree } from "react-icons/io5";
import { compareAsc, format } from "date-fns";
import { LogOut } from "../../server/user";
import {
  IoIosArrowRoundForward,
  IoIosNotificationsOutline,
} from "react-icons/io";
import { BsCart2, BsPerson, BsReceipt, BsWallet2 } from "react-icons/bs";
import { toast } from "react-toastify";
import { CiSearch } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { FiTruck } from "react-icons/fi";
import { MdSignalCellularAlt } from "react-icons/md";
import { getUserData } from "../../server/user";
import Modal from 'react-modal';
import "./headeradmin.css"
import { IoCloseCircleOutline } from "react-icons/io5";
import { HttpClient } from "../../server/client/http";




function AdminHeader() {

  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === "/seller") {
      return "Dashboard";
    } else if (location.pathname.includes("products")) {
      return "Products";
    } else if (location.pathname.includes("orders")) {
      return "Orders";
    } else if (location.pathname.includes("users")) {
      return "Users";
    } else if (location.pathname.includes("invoice")) {
      return "Invoice";
    } else if (location.pathname.includes("profile")) {
      return "Profile";
    } else if (location.pathname.includes("category")) {
      return "Category";
    } else if (location.pathname.includes("brands")) {
      return "Brands";
    }
  };
  const [notificationCount, setNotificationCount] = useState()
  const [isSubmenu, SetisSubmenu] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState([])
  const [date, setDate] = useState('')
  const [message, setMessage] = useState('')
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();


  let subtitle;

  const closeSubmenu = () => {
    SetisSubmenu(false);
    document.body.style.overflow = "scroll";
  };

  const openSubmenu = () => {
    SetisSubmenu(true);
    document.body.style.overflow = "hidden";
  };


  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {

    subtitle.style.color = '#f00';
  }

  async function closeModal() {
    setIsOpen(false);
    try {

      const response = await HttpClient.put("/notification");
      console.log(response)
      const data = response
      setNotification(data);

      setNotificationCount(data.filter(item => item.isRead === false).length)
      const createdDate = data?.map((notification) => notification.createdAt)

      setDate(createdDate)


    
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  }

  const getNotifications = async () => {
    try {

      const response = await HttpClient.get("/notification")
      console.log(response)
      const data = response
      setNotification(data);

      setNotificationCount(data.filter(item => item.isRead === false).length)
      const createdDate = data?.map((notification) => notification.createdAt)

      setDate(createdDate)


      console.log(data)
      console.log(data?.length)
      console.log(createdDate)
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  }
  useEffect(() => {
    getNotifications();
  }, []);

  useEffect(() => {
    getNotifications();
  }, []);
  const formattedDate = (dateString) => {

    const date = new Date(dateString);
    const formattedDate = format(date, 'MMMM dd, yyyy');



    return format(date, 'MMMM dd, yyyy');

  };
  const fetchProfileData = async () => {
    try {
      const { userData } = await HttpClient.get("/users/me");
      setUserDetails(userData);
      console.log(userDetails)
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };


  const clickToLogout = async () => {
    try {
      const { message } = await HttpClient.post("/users/logout");
      toast.success(message);
      navigate("/login");
      LogOut();
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      <header className="bg-[#E7EFFA] text-white px-3 py-3 shadow-bottom">
        <div className="flex items-center justify-between">

          <div className="flex  justify-between items-center">
            <IoReorderThree
              onClick={() => openSubmenu()}
              className="text-3xl lg:hidden  text-blue-700 cursor-pointer"
            />
            <p className="text-[#011F4B]  px-1 py-3 font-[Poppins] font-medium text-2xl leading-9 ">
              {getPageTitle()}
            </p>
          </div>

          <div className="flex justify-between w-[100%] ">
            <p>{" "}</p>
            <div>
              <ul className="flex items-center gap-5">



                <div className="relative">
                  <IoIosNotificationsOutline className="h-10 w-10 text-[#000000]"
                    onClick={openModal} />
                  <div className="absolute top-[-10px] right-[-4px]">
                    <div className="rounded-full p-[4px] h-7 w-7 bg-[#011F4B] flex items-center justify-center text-white">
                      {notificationCount}
                    </div>
                  </div>
                </div>


                <li>

                  <button onClick={clickToLogout} type="button" className="bg-[#011F4B] text-[#fff] rounded-md px-2 py-1">Logout</button>
                </li>

                <div>
                  <Modal
                    isOpen={modalIsOpen}
                    ariaHideApp={false}
                    onRequestClose={closeModal}
                    style={{
                      overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1000,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '1rem'
                      },
                      content: {
                        position: 'relative',
                        top: 'auto',
                        left: 'auto',
                        right: 'auto',
                        bottom: 'auto',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '1.5rem',
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }
                    }}
                    contentLabel="Notifications Modal"
                  >
                    {/* Header with close button */}
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-800">Order Notifications</h2>
                      <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        style={{ transition: 'color 0.2s ease' }}
                      >
                        <IoCloseCircleOutline className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Notification content */}
                    {notification?.length > 0 ? (
                      <div
                        className="space-y-3 overflow-y-auto"
                      >
                        {notification.map((item, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg bg-white p-4 hover:shadow-md transition-all"

                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                              <p className="font-medium text-gray-800">
                                Product:
                                {Array.isArray(item.productName) ? (
                                  <span className="text-blue-600 font-medium ml-1">
                                    {item.productName.map((name, idx) => (
                                      <span key={idx}>
                                        {name}
                                        {idx < item.productName.length - 1 && ", "}
                                      </span>
                                    ))}
                                  </span>
                                ) : (
                                  <span className="text-blue-600 font-medium ml-1">
                                    {item.productName || "N/A"}
                                  </span>
                                )}
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-gray-800">
                                Order ID: <span className="text-gray-600 font-normal">{item.OrderId || "N/A"}</span>
                              </p>
                            </div>

                            <p className="text-sm sm:text-base font-medium text-gray-700 mb-1">
                              Status: <span className="text-green-600">{item.message || "N/A"}</span>
                            </p>

                            <p className="text-xs sm:text-sm text-gray-500">
                              Date: {formattedDate(item.createdAt) || "N/A"}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="text-gray-400 mb-2">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <p className="text-gray-500 text-lg">No notifications available</p>
                      </div>
                    )}

                    {/* Footer (optional) */}
                    <div className="mt-4 pt-3 border-t border-gray-100 text-right">
                      <button
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none"
                        style={{ transition: 'background-color 0.2s ease' }}
                      >
                        Close
                      </button>
                    </div>
                  </Modal>
                </div>

              </ul>
            </div>


          </div>
        </div>
      </header>
      {isSubmenu && (
        <section>
          <div className="block lg:hidden z-10 fixed w-[70%]  p-2 top-0 h-full left-0 bg-[#fff]">

            <div>

              <div className="flex items-center justify-between px-3 py-5">


                <p className="text-[#011F4B] font-[Poppins] font-bold">
                  {getUserData()?.firstName.toUpperCase()}{" "}

                </p>
                <button className="lg:text-black" onClick={() => closeSubmenu()}>
                  <RxCross2 />
                </button>
              </div>

              <div className="px-1">
                <ul className="px-3 font-[Poppins] text-[#000000] font-normal hover:text-#FFFFFF">



                  <li>
                    <div className="hover:bg-[#011F4B]border-[#011F4B] rounded-md  hover:rounded-full  transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">

                      <Link
                        to="/"
                        className="flex items-center gap-2"
                      >
                        <button className="flex justify-center items-center gap-4  p-2">
                          <div className="p-2 iconDiv">
                            <MdSignalCellularAlt size={21} className="icon" />
                          </div>
                          Home
                        </button>
                        <IoIosArrowRoundForward className="opacity-60" />
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="hover:bg-[#011F4B]border-[#011F4B] rounded-md  hover:rounded-full  transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">

                      <Link
                        to="/seller"
                        className="flex items-center gap-2"
                      >
                        <button className="flex justify-center items-center gap-4  p-2">
                          <div className="p-2 iconDiv">
                            <MdSignalCellularAlt size={21} className="icon" />
                          </div>
                          Dashboard
                        </button>
                        <IoIosArrowRoundForward className="opacity-60" />
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="hover:bg-[#011F4B] border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
                      <Link
                        to="/seller/orders"
                        className="flex items-center gap-2"
                      >
                        <button className="flex justify-center items-center gap-4  p-2">
                          <div className="p-2 iconDiv">
                            <FiTruck size={21} className="icon" />
                          </div>
                          Orders
                        </button>
                        <IoIosArrowRoundForward className="opacity-60" />
                      </Link>
                    </div>
                  </li>



                  <li>
                    <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
                      <Link
                        to="/seller/products"
                        className="flex items-center gap-2"
                      >
                        <button className="flex justify-center items-center gap-4  p-2">
                          <div className="p-2 iconDiv">
                            < BsReceipt size={21} className="icon" />
                          </div>
                          Products
                        </button>
                        <IoIosArrowRoundForward className="opacity-60" />
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
                      <Link
                        to="/seller/users"
                        className="flex items-center gap-2 "
                      >
                        <button className="flex justify-center items-center gap-4 p-2">
                          <div className="p-2 iconDiv">
                            <BsWallet2 size={21} className="icon" />
                          </div>
                          Users
                        </button>
                        <IoIosArrowRoundForward className="opacity-60" />
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
                      <Link
                        to="/seller/category"
                        className="flex items-center gap-2"
                      >
                        <button className="flex justify-center items-center gap-4 p-2">
                          <div className="p-2 iconDiv">
                            <BsReceipt size={21} className="icon" />
                          </div>
                          Category
                        </button>
                        <IoIosArrowRoundForward className="opacity-60" />
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
                      <Link
                        to="/seller/brands"
                        className="flex items-center gap-2"
                      >
                        <button className="flex justify-center items-center gap-4 p-2">
                          <div className="p-2 iconDiv">
                            <BsReceipt size={21} className="icon" />
                          </div>
                          Brands
                        </button>
                        <IoIosArrowRoundForward className="opacity-60" />
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
                      <Link
                        to="/seller/profile"
                        className="flex items-center gap-2 "
                      >
                        <button className="flex justify-center items-center gap-4    p-2">
                          <div className="p-2 iconDiv">
                            <BsPerson size={21} className="icon" />
                          </div>
                          Profile
                        </button>
                        <IoIosArrowRoundForward className="opacity-60" />
                      </Link>
                    </div>
                  </li>

                </ul>

              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default AdminHeader;
