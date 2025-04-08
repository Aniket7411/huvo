import React, { useState, useEffect, createContext } from "react";
import { CiSearch } from "react-icons/ci";
import {
  IoIosArrowRoundForward,
  IoIosNotificationsOutline,
} from "react-icons/io";
import { compareAsc, format } from "date-fns";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoReorderThree } from "react-icons/io5";
import Modal from "react-modal";
import { IoCloseCircleOutline } from "react-icons/io5";
import "./superadminheader.css";
import { BsPerson, BsReceipt, BsWallet2 } from "react-icons/bs";
import { FiTruck } from "react-icons/fi";
import { MdSignalCellularAlt } from "react-icons/md";
import { getUserData } from "../../server/user";
import { RxCross2 } from "react-icons/rx";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";

import { LogOut, setUserData } from "../../server/user";
import { FaRegUserCircle } from "react-icons/fa";



export default function Superadminheader() {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === "/admin") {
      return "Overview";
    } else if (location.pathname.includes("vendors")) {
      return "Vendors";
    }
  };

  const [notificationCount, setNotificationCount] = useState()
  const [modalIsOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState([]);
  const [isSubmenu, SetisSubmenu] = useState(false);
  const [sidenav, setSidenav] = useState(false);
  const [date, setDate] = useState('')
  const [adminName, setAdminName] = useState('')
      const navigate = useNavigate();
  

  // const nameofadmin = localStorage.getItem('userData')

  //  if (nameofadmin) {

  //   const userData = JSON.parse(nameofadmin);


  //   if (userData.firstName) {
  //    setAdminName(userData.firstName)
  //   } else {
  //     console.error("First name not found in the user data.");

  //   }
  // } else {
  //   console.error("User data not found in localStorage.");
  //   return null;
  // }




  const openSubmenu = () => {
    SetisSubmenu(true);
    document.body.style.overflow = "hidden";
  };
  let subtitle;
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }
  const formattedDate = (dateString) => {

    const date = new Date(dateString);
    const formattedDate = format(date, 'MMMM dd, yyyy');


    console.log("formattedDate", formattedDate)
    return format(date, 'MMMM dd, yyyy');

  };
  const getNotifications = async () => {
    try {

      const response = await HttpClient.get("/notification")
      console.log(response)
      const data = response
      setNotification(data);
      setNotificationCount(data.length)
      const createdDate = data?.map((notification) => notification.createdAt)

      setDate(createdDate)


      console.log(data)
      console.log(data.length)
      console.log(createdDate)
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  }
  useEffect(() => {
    getNotifications();
  }, []);

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
      <header className="text-white px-3 py-3 w-[100%] ">
        <div className=" flex justify-between items-center ">
          <ul>
            {/* <li className="flex-grow">
              <div className=" flex items-center justify-between rounded-full top-[-12px] bg-[#E7EFFA]  p-4 h-14 searchBtn">
                <button
                  className="mr-5"
                //  onClick={handleClick}
                >
                  <CiSearch className="text-[#000000]" />
                </button>
                <input
                  placeholder="search"
                  className="border-0 w-full gap-10 outline-none  bg-[#E7EFFA]"
                ></input>
              </div>
            </li> */}
          </ul>
          <ul className="flex items-center">
            <li>
              <div className="flex items-center px-8 py-5">
                <div className="relative">
                  <IoIosNotificationsOutline className="h-8 w-8 text-[#000000]" onClick={openModal} />

                  <div className="absolute top-[-10px] right-[-4px]">
                    <div className="rounded-full p-[3px] h-5 w-5 bg-[#011F4B] flex items-center justify-center text-white">
                      {notificationCount}
                    </div>
                  </div>
                </div>
              </div>
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
                <div className="flex justify-end">
                  <button onClick={closeModal}>
                    <IoCloseCircleOutline className="h-6 w-6" />
                  </button>
                </div>
                {notification?.length > 0 ? (
                  <div>
                    {notification?.map((item, index) =>
                    (
                      <p key={index}>`{item.productName} {item.message} {formattedDate(item.createdAt)}`</p>

                    ))}



                  </div>
                ) : (
                  <div>No Notifications Available</div>
                )}
              </Modal>
            </div>
            <li className="hidden md:block">
              <div className="flex items-center px-3 py-3 ">
                <div className="mr-4 flex items-center justify-center border border-white w-10 h-10 rounded-full bg-[#ffffff]">
                <FaRegUserCircle className="text-[blue]" size={25} />
                </div>

                <p className="text-[#011F4B] font-[Poppins] font-bold">

                  {getUserData()?.firstName.toUpperCase()}{" "}
                  {getUserData()?.lastName.toUpperCase()}
                </p>

                <button type="button" className="bg-[#011F4B] rounded-md px-2 ml-2 py-1 text-[#fff]" onClick={clickToLogout}>Logout</button>
              </div>
            </li>
            <li className="responsive-div">
              <div className="flex items-center px-4 py-5">
                {/* <div className=""> */}
                {/* <IoIosNotificationsOutline className="h-8 w-8 text-[#000000]" /> */}
                <RxHamburgerMenu
                  className="h-8 w-8 text-[#000000]"
                  onClick={() => setSidenav(!sidenav)}
                />
                {/* </div> */}
              </div>
            </li>
          </ul>
        </div>
      </header>
      {sidenav && (
        <>
          <div className="absolute bg-white top-0 left-0 border shadow-md h-[100vh]">
            <div className="">
              <div className="flex justify-between items-center px-8 py-3">
                <Link to="/">
                  {/* <img src="/assets/cart.png" alt="Cart" width="60px" height="60px" /> */}
                  <img src="/assets/newlogo.jpeg" className="w-[30px]" alt="logo" />
                  </Link>
                <div onClick={() => setSidenav(false)}>
                  <RxCross2 h-14 w-14 />
                </div>
              </div>
              <div className="flex items-center px-8 py-5">
                <p className="font-[Poppins] font-bold  text-[#000000] ">
                  Huvo
                </p>
              </div>
           

              <hr className=" bg-gray-500 mx-10 my-4"></hr>
            </div>
            <div className="px-1 sidebarSubDiv overflow-y-auto">
              <ul className="px-5 font-[Poppins] text-[#000000] font-normal hover:text-#FFFFFF">
                <li>
                  <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full  transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
                    <Link to="/admin" className="flex items-center gap-2">
                      <button className="flex justify-center text-lg items-center gap-4 p-2">
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
                  <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
                    <Link
                      to="/admin/vendors"
                      className="flex items-center gap-2"
                    >
                      <button className="flex justify-center items-center gap-4  p-2">
                        <div className="p-2 iconDiv">
                          <BsReceipt size={21} className="icon" />
                        </div>
                        Vendors/Seller
                      </button>
                      <IoIosArrowRoundForward className="opacity-60" />
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
                    <Link
                      to="/admin/products"
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
                      to="/admin/buyers"
                      className="flex items-center gap-2 "
                    >
                      <button className="flex justify-center items-center gap-4 p-2">
                        <div className="p-2 iconDiv">
                          <BsWallet2 size={21} className="icon" />
                        </div>
                        Users/Buyers
                      </button>
                      <IoIosArrowRoundForward className="opacity-60" />
                    </Link>
                  </div>
                </li>

                <li>
                  <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
                    <Link
                      to="/admin/invoice"
                      className="flex items-center gap-2"
                    >
                      <button className="flex justify-center items-center gap-4 p-2">
                        <div className="p-2 iconDiv">
                          <BsReceipt size={21} className="icon" />
                        </div>
                        Invoice
                      </button>
                      <IoIosArrowRoundForward className="opacity-60" />
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
                    <Link
                      to="/admin/profile"
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
        </>
      )}
    </>
    // <div className=''>
    //    <header className="bg-[#a0aec0] text-white px-3 py-3 w-full shadow-bottom">
    //     <div className="flex items-center justify-between">

    //         <ul>
    //         <div className="flex lg:hidden justify-between items-center">
    //           <IoReorderThree
    //             onClick={() => openSubmenu()}
    //             className="text-3xl cursor-pointer"
    //           />
    //         </div>
    //         <li className="text-[#011F4B]  px-1 py-3 font-[Poppins] font-medium text-2xl leading-9 ">
    //           {/* {getPageTitle()} */}
    //         </li>
    //         </ul>
    //         <div className="">
    //         <ul className="flex items-center gap-5">
    //         <li className="flex-grow">
    //           <div className=" flex items-center justify-between p-1 bg-[#FFFFFF] rounded-lg top-[-12px]">
    //             <button className="mr-5"
    //             //  onClick={handleClick}
    //              >
    //               <CiSearch className=" text-[#000000]" />
    //             </button>
    //             <input
    //               placeholder="search"
    //               className="border-0 w-full gap-10 outline-none"
    //             ></input>
    //           </div>
    //         </li>

    //         <li >

    //             <div className="relative">

    //               <IoIosNotificationsOutline className="h-8 w-8 text-[#000000]"
    //               onClick={openModal} />

    //               <div className="absolute top-[-10px] right-[-4px]">
    //                 <div className="rounded-full p-[3px] h-5 w-5 bg-[#011F4B] flex items-center justify-center text-white">
    //                   {/* {notificationCount} */}
    //                 </div>
    //               </div>
    //             </div>

    //         </li>
    //         <div>
    //         <Modal
    //     isOpen={modalIsOpen}
    //     ariaHideApp={false}
    //     onAfterOpen={afterOpenModal}
    //     onRequestClose={closeModal}
    //     // style={customStyles}
    //     contentLabel="Example Modal"
    //     className="custom-modal-content"
    //     overlayClassName="custom-modal-overlay"
    //   >
    //     <h2 ref={(_subtitle) => (subtitle = _subtitle)}></h2>
    //     <div className="flex justify-end">
    //       <button onClick={closeModal}>
    //         <IoCloseCircleOutline className="h-6 w-6" />
    //         </button>
    //       </div>
    //     {notification.length > 0 ? (
    //     <div>
    //       {/* {notification.map((item,index)=>
    //         (
    //           <p key={index}>`{item.productName} {item.message} {formattedDate(item.createdAt)}`</p>

    //         ))} */}

    //     </div>
    //   ):(
    //     <div>No Notifications Available</div>
    //   )}
    //   </Modal>
    //         </div>

    //       </ul>
    //     </div>
    //     </div>
    //   </header>
    // </div>
    //     <div className="">
    //         <div className="flex justify-between items-center w-full">
    //         <div>
    //             <ul>
    //                 <li>
    //                 <div className=" flex items-center justify-between p-1 rounded-full top-[-12px] bg-[#E7EFFA]  p-4 w-80 h-14">
    //                 <button className="mr-5"
    //                 //  onClick={handleClick}
    //                  >
    //                  <CiSearch className=" text-[#000000]" />
    //                 </button>
    //              <input
    //                    placeholder="search"
    //                    className="border-0 w-full gap-10 outline-none  bg-[#E7EFFA]"
    //                  ></input>
    //                </div>
    //                 </li>
    //             </ul>

    //         </div>
    //         <div className="">
    //         <ul className="flex gap-4">
    //             <li>
    //           fhgf
    //             </li>
    //             <li> sdfs</li>
    //         </ul>
    //         </div>
    // </div>
    //     </div>
  );
}
