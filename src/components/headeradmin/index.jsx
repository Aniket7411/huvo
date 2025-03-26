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
  const handleClick = () => {


  }

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {

    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const getNotifications = async () => {
    try {

      const response = await HttpClient.get("/notification")
      console.log(response)
      const data = response
      setNotification(data);
      setNotificationCount(data?.length)
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
      <header className="bg-[#E7EFFA] text-white px-3 py-3 mb-5 w-[100%] shadow-bottom">
        <div className="flex items-center justify-between">

          <ul>
            <div className="flex lg:hidden justify-between items-center">
              <IoReorderThree
                onClick={() => openSubmenu()}
                className="text-3xl cursor-pointer"
              />
            </div>
            <li className="text-[#011F4B]  px-1 py-3 font-[Poppins] font-medium text-2xl leading-9 ">
              {getPageTitle()}
            </li>
          </ul>
          <div className="">
            <ul className="flex items-center gap-5">
              {/* <li className="flex-grow">
              <div className=" flex items-center justify-between p-1 bg-[#FFFFFF] rounded-lg top-[-12px]">
                <button className="mr-5"
                 onClick={handleClick}
                 >
                  <CiSearch className="text-[#000000]" />
                </button>
                <input
                  placeholder="search" 
                  className="border-0 text-[red] w-full gap-10 outline-none"
                ></input>
              </div>
            </li> */}


              <li >

                <div className="relative">

                  <IoIosNotificationsOutline className="h-10 w-10 text-[#000000]"
                    onClick={openModal} />


                  <div className="absolute top-[-10px] right-[-4px]">
                    <div className="rounded-full p-[4px] h-7 w-7 bg-[#011F4B] flex items-center justify-center text-white">
                      {notificationCount}
                    </div>
                  </div>
                </div>

              </li>

              <li>

                <button onClick={clickToLogout} type="button" className="bg-[#011F4B] text-[#fff] rounded-md px-2 py-1">Logout</button>
              </li>
              <div>
                <Modal
                  isOpen={modalIsOpen}
                  ariaHideApp={false}
                  onAfterOpen={afterOpenModal}
                  onRequestClose={closeModal}
                  // style={customStyles}
                  contentLabel="Example Modal"
                  className="custom-modal-content"
                  overlayClassName="custom-modal-overlay"
                >
                  <h2 ref={(_subtitle) => (subtitle = _subtitle)}></h2>
                  <div className="flex justify-end ]">
                    <button onClick={closeModal}>
                      <IoCloseCircleOutline className="h-6 w-6" />
                    </button>
                  </div>
                  {notification?.length > 0 ? (
                    <div>
                      {notification?.map((item, index) => (
                        <div
                          key={index}
                          className="border border-gray-300 rounded-lg shadow-sm bg-gray-50 p-4 my-4 overflow-auto hover:shadow-md transition-shadow"
                        >
                          {/* Product Name */}
                          <p className="text-lg font-semibold text-gray-800 mb-2">
                            Product Name: <span className="text-blue-600">{item.productName || "N/A"}</span>
                          </p>

                          {/* Order Details */}
                          <p className="text-base font-medium text-gray-700 mb-2">
                            Order Details: <span className="text-green-600">{item.message || "N/A"}</span>
                          </p>

                          {/* Ordered Date */}
                          <p className="text-base font-medium text-gray-700">
                            Ordered Date: <span className="text-gray-500">{formattedDate(item.createdAt) || "N/A"}</span>
                          </p>
                        </div>
                      ))}





                    </div>
                  ) : (
                    <div>No Notifications Available</div>
                  )}
                </Modal>
              </div>
              {/* <li className=" flex items-center">
              <Link to="">
                <div className="relative">
                  <BsCart2 className="h-7 w-7 text-[#000000]" />
                  <div className="absolute top-[-12px] right-[-6px]">
                    <div className="rounded-full p-[3px] h-5 w-5 bg-[#011F4B] flex items-center justify-center text-white">
                      2
                    </div>
                  </div>
                </div>
              </Link>
            </li> */}

            </ul>
          </div>
        </div>
      </header>
      {isSubmenu && (
        <section>
          <div className="block lg:hidden z-10 fixed sm:w-[50%] w-[100%] p-5 top-0 h-full left-0 bg-[#a0aec0]">
            {/* <div className="flex justify-between items-center">
              <div className="mb-5"> 
                <p className="text-2xl my-2">Logo</p>
              </div>
              <button className="text-black " onClick={() => closeSubmenu()}>
                <RxCross2 />
              </button>
            </div> */}
            <div>
              <div className="flex flex-grow w-auto justify-between">

                <img src="/assets/newlogo.png" alt="Logo" className="w-[100px] h-[100px]" />

                <button className="lg:text-black" onClick={() => closeSubmenu()}>
                  <RxCross2 />
                </button>
              </div>
              <div className="flex items-center px-8 py-5">
                <div className="mr-4 flex items-center justify-center border border-white w-10 h-10 rounded-full bg-[#FFFFFF]">
                  <img
                    src="/assets/winter.png"
                    alt="Cart"
                    className="rounded-full w-full h-full object-cover"
                  />
                </div>

                <p className="text-[#011F4B] font-[Poppins] font-bold">
                  {getUserData()?.firstName.toLowerCase()}{" "}

                </p>
              </div>

              <div className="px-1">
                <ul className="px-5 font-[Poppins] text-[#000000] font-normal hover:text-#FFFFFF">
                  <li>
                    <div className="hover:bg-[#011F4B]border-[#011F4B] rounded-md  hover:rounded-full  transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
                      <Link to="/seller">
                        <button className="flex justify-center items-center gap-4   p-2">
                          <div className="p-2 iconDiv">
                            <MdSignalCellularAlt size={21} className="icon" />
                          </div>
                          Dashboard
                        </button>
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
                            <BsReceipt size={21} className="icon" />
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
                            <FiTruck size={21} className="icon" />
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
                  <li className="mx-2 block md:hidden mt-2 w-[50%]">
                    <Link
                      to="/"
                      className="bg-[#011F4B] border border-[#011F4B] rounded-md px-2 py-1 flex justify-center items-center gap-2 text-white"
                    >
                      {/* <IoAddCircleOutline /> */}
                      Website
                    </Link>
                    <button className="sm:text-black mt-6" onClick={() => closeSubmenu()}>
                      <RxCross2 />
                    </button>
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
