import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



import { MdOutlineCancelScheduleSend, MdSignalCellularAlt } from "react-icons/md";
import { FiTruck } from "react-icons/fi";
import { BsWallet2 } from "react-icons/bs";
import { BsReceipt } from "react-icons/bs";
import { BsPerson } from "react-icons/bs";
import { IoIosArrowRoundForward, IoIosLogOut } from "react-icons/io";
import { getUserData } from "../../server/user";
import { LogOut } from "../../server/user";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";

function Sidenavbar() {


  const navigate = useNavigate();


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
    < >

      <div className="flex items-center flex-col text-center py-5">

        <Link to="/">
          <img src="/assets/favicon.svg" alt="logo" className="w-[25px] mb-4 h-[25px]" />
        </Link>

        <p className="text-[#011F4B] font-[Poppins] font-bold">
          {getUserData()?.storeDetails?.storeName?.toUpperCase()}{" "}

        </p>
      </div>

      <div className="px-1">
        <ul className="px-5 font-[Poppins] text-[#000000] font-normal hover:text-#FFFFFF">

          <li>
            <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full  transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
              <Link to="/seller" className="flex items-center gap-2">
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
            <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
              <Link to="/seller/orders" className="flex items-center gap-2">
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
              <Link to="/seller/products" className="flex items-center gap-2">
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
              <Link to="/seller/users" className="flex items-center gap-2 ">
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
              <Link to="/seller/category" className="flex items-center gap-2">
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
            <div className="hover:bg-[#011F4B] border-[#011F4B] text-sm rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
              <Link
                to="/cancelled_orders"
                className="flex items-center gap-2"
              >
                <button className="flex justify-center items-center gap-2 p-2">
                  <div className="p-2 iconDiv">
                  <MdOutlineCancelScheduleSend   size={21} className="icon" />
                  </div>
                  Cancelled Orders
                </button>
                <IoIosArrowRoundForward className="opacity-60" />
              </Link>
            </div>
          </li>

          <li>
            <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
              <Link to="/seller/brands" className="flex items-center gap-2">
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
          {/* <li>
            <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
              <Link to="/seller/invoice" className="flex items-center gap-2">
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
          </li> */}
          <li>
            <div className="hover:bg-[#011F4B]  border-[#011F4B] rounded-md  hover:rounded-full transition-all duration-300 hover:text-[#FFFFFF] hoverOnDiv">
              <Link to="/seller/profile" className="flex items-center gap-2 ">
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
    </>
  );
}

export default Sidenavbar;
