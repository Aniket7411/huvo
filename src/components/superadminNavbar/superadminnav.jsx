import React from 'react'
import { Link, Navigate, useNavigate } from "react-router-dom";
import { GrUserAdmin } from "react-icons/gr";


import { MdApproval, MdSignalCellularAlt } from "react-icons/md";
import { FiTruck } from "react-icons/fi";
import { BsWallet2 } from "react-icons/bs";
import { BsReceipt } from "react-icons/bs";
import { BsPerson } from "react-icons/bs";
import { IoIosArrowRoundForward, IoIosLogOut } from "react-icons/io";
import './superadminNav.css'
import { getUserData } from "../../server/user";
import { LogOut } from '../../server/user';
import { HttpClient } from '../../server/client/http';
import { toast } from 'react-toastify';
import { RiAdvertisementFill } from 'react-icons/ri';


function SuperAdminNav() {

  const navigate = useNavigate();


  const clickToLogout = async () => {
    console.log("logout")
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
    <div className="sidebar"  >
      <div className=''>
        <div className="px-8 py-3">

          {/* <img src="/assets/cart.png" alt="Cart" width="60px" height="60px" /> */}
          <Link to="/">

            <img src="/assets/newlogo.jpeg" alt="Logo" className="w-[100px] h-[20px] mb-5" />
          </Link>
        </div>

        <hr className=' bg-gray-500 mx-10'></hr>
      </div>
      <div className="px-1 sidebarSubDiv overflow-y-auto">
        <ul className="px-5 font-[Poppins] text-[#000000] font-normal hover:text-#FFFFFF">
          <li>
            <div className="hover:bg-[#011F4B]  rounded-md  hover:rounded-full  transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
              <Link to="/admin" className="flex items-center gap-2">
                <button className="flex justify-center items-center gap-4 p-2">
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
            <div className="hover:bg-[#011F4B] text-sm  rounded-md  hover:rounded-full  transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
              <Link to="/manage_admin" className="flex items-center gap-2">
                <button className="flex justify-center items-center gap-4 p-2">
                  <div className="p-2 iconDiv">
                    <GrUserAdmin size={21} className="icon" />
                  </div>
                  Manage admins
                </button>
                <IoIosArrowRoundForward className="opacity-60" />
              </Link>
            </div>
          </li>



          <li>
            <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full  transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
              <Link to="/advertisement" className="flex items-center gap-2">
                <button className="flex justify-center items-center gap-4 p-2">
                  <div className="p-2 iconDiv">
                    <RiAdvertisementFill size={21} className="icon" />
                  </div>
                  Advertisment
                </button>
                <IoIosArrowRoundForward className="opacity-60" />
              </Link>
            </div>
          </li>
          <li>
            <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
              <Link to="/admin/vendors" className="flex items-center gap-2">
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
              <Link to="/admin/products" className="flex items-center gap-2">
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
          {/* <li>
            <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
              <Link to="/admin/buyers" className="flex items-center gap-2 ">
                <button className="flex justify-center items-center gap-4 p-2">
                  <div className="p-2 iconDiv">
                    <BsWallet2 size={21} className="icon" />
                  </div>
                  Users/Buyers
                </button>
                <IoIosArrowRoundForward className="opacity-60" />
              </Link>
            </div>
          </li> */}

          {/* <li>
            <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
              <Link to="/seller_payouts" className="flex items-center gap-2 ">
                <button className="flex justify-center items-center gap-4 p-2">
                  <div className="p-2 iconDiv">
                    <BsWallet2 size={21} className="icon" />
                  </div>
                  Seller Payout
                </button>
                <IoIosArrowRoundForward className="opacity-60" />
              </Link>
            </div>
          </li> */}


          <li>
            <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
              <Link to="/admin/invoice" className="flex items-center gap-2">
                <button
                  className="flex justify-center items-center gap-4 p-2"
                >
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
              <Link to="/admin/profile" className="flex items-center gap-2 ">
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
          <li>
            <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
              <Link to="/admin/approval" className="flex items-center gap-2 ">
                <button className="flex justify-center items-center gap-4    p-2">
                  <div className="p-2 iconDiv">
                    <MdApproval  size={21} className="icon" />
                  </div>
                  Approvals
                </button>
                <IoIosArrowRoundForward className="opacity-60" />
              </Link>
            </div>
          </li>
          <li>
            <div
              className="group relative flex items-center justify-between p-2  rounded-md transition-all duration-300 hover:bg-[#011F4B] hover:rounded-full hover:text-white"
            >
              <button
                onClick={clickToLogout}
                className="flex items-center gap-4"
              >
                <div
                  className="p-2 bg-[#011F4B1A] group-hover:bg-[#FFFFFF1A] rounded-full transition-colors duration-300"
                >
                  <IoIosLogOut
                    size={21}
                    className="text-[#011F4B] group-hover:text-white"
                  />
                </div>
                <span className="font-medium text-[#011F4B] group-hover:text-white">
                  Logout
                </span>
              </button>
              <IoIosArrowRoundForward
                size={24}
                className="text-[#011F4B] opacity-60 group-hover:opacity-100 group-hover:text-white transition-opacity duration-300"
              />
            </div>
          </li>



        </ul>
      </div>
    </div>
  )
}
export default SuperAdminNav