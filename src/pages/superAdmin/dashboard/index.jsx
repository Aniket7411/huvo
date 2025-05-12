import { React, useEffect, useState } from "react";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";
import Superadminheader from "../../../components/superadminheader";
import { FaChartLine } from "react-icons/fa";
import { FaWallet } from "react-icons/fa6";
import SalesDonutChart from "../../../components/salesDonutChart/salesDonutChart";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { BsFillWalletFill } from "react-icons/bs";
import "../superadmin.css";
import ColumnChart from "../../../components/columnchartsa/columnchart";
import SemiCircleProgressBar from "react-progressbar-semicircle";
import WeeklyChart from "../../../components/weeklychart/weeklychart";
import WeeklyLineChart from "../../../components/weeklylinechart/weeklylinechart";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HttpClient } from "../../../server/client/http";
import './dashboard.css';
import Loader from "../../../components/loader";
import { toast } from "react-toastify";

export default function Dashboard() {
  const percentage = 60;
  const [dashboardData, setDashboardData] = useState();
  const [loading, setloading] = useState(false);
  console.log("running");
  const getDashboardData = async () => {
    // setloading(true);

    try {
      const response = await HttpClient.get("/dashboard");
      setloading(true)
      console.log("Full Response:", response);
      setDashboardData(response);
      if (response) {
        setloading(false)

      }
    } catch (error) {
      console.error(error.response);
      setloading(false)

    }
  };
  console.log("running");
  useEffect(() => {
    getDashboardData();
  }, []);


  const generateToken = async () => {
    try {
      const response = HttpClient.post("order/generateShipToken")
      toast.success(response?.message)
      console.log(response)

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="flex h-[100vh]">
      <div className="bg-[#E7EFFA] h-[100vh]">
        <SuperAdminNav />
      </div>

      <div className="flex flex-col w-full">
        <Superadminheader />


        {
          loading ? <Loader /> : <>

            <div className="ml-2 sticky top-0 z-10 bg-white ">
              <div className="mx-2">
                <p className="mx-3 font-poppins font-medium text-[#46484D]">
                  Overview
                </p>
              </div>
              <hr className="mx-4" />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto">
              {/* Stats Section */}
              <div className="p-8 mx-5">
                <button
                  onClick={generateToken}
                  className="px-3 py-1 mb-3 text-sm font-medium text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all"
                >
                  Generate Token for Shipdelight
                </button>
                <ul className="flex gap-6 justify-between flex-wrap">
                  <li>
                    <div className="flex gap-5 items-center">
                      <p className="font-poppins font-medium">Total Sales</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="py-4 text-[#011F4B] font-medium text-2xl">
                        {dashboardData?.currentMonth?.totalSales}
                        <div className="w-[50px] rounded-[10px] bg-[#CEFFB3]">
                          <div className="font-inter text-[12px] font-normal leading-[14.52px] text-center text-[#359700] text-center">
                            {dashboardData?.growth?.salesGrowth}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex gap-5 items-center">
                      <p className="font-poppins font-medium">Customers</p>
                    </div>
                    <div className="py-4 text-[#011F4B] font-medium text-2xl">
                      {dashboardData?.customerCount}
                    </div>
                  </li>
                  <li>
                    <div className="flex gap-5 items-center">
                      <p className="font-poppins font-medium">Orders</p>
                    </div>
                    <div className="text-left flex flex-col gap-2">
                      <div className="py-4 text-[#011F4B] font-medium text-2xl">
                        {dashboardData?.currentMonth?.orders}
                        <div className="w-[50px] rounded-[10px] bg-[#CEFFB3]">

                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex gap-5 items-center">
                      <p className="font-poppins font-medium">
                        Average Orders Perday
                      </p>
                    </div>
                    <div className="py-4 text-[#011F4B] font-medium text-2xl">
                      {dashboardData?.currentMonth?.avgOrdersPerDay}
                    </div>
                  </li>
                </ul>
              </div>



              <div className="flex flex-wrap py-10 mx-5 gap-2">
                <div className="w-52 h-48 rounded overflow-hidden shadow-lg mx-4 p-4 bCards">
                  <div className="flex justify-between items-center p-2">
                    <div className="w-10 h-10 bg-[#03C3EC]/30 rounded-lg flex items-center justify-center ">
                      <FaWallet className="p-1 w-8 h-8 text-[#03C3EC]" />
                    </div>

                  </div>
                  <div className="py-2 font-sans font-normal text-[15px] leading-[22px] text-[#22303E]/70 mx-2">
                    Total Revenue
                  </div>
                  <div className="flex  items-center font-sans font-medium text-[24px] leading-[38px] text-[#22303E]/90 mx-2">
                    {dashboardData?.totalRevenue}
                    <span>
                      <MdOutlineCurrencyRupee className="rupeeIcon" />
                    </span>
                  </div>
                  <div className=""></div>
                </div>
                <div className="w-52 h-48 rounded overflow-hidden shadow-lg mx-4 p-4 bCards">
                  <div className="mb-4">
                    <div className="  font-sans font-normal text-[15px] leading-[22px] text-[#22303E]/70 mx-2">
                      Profit
                    </div>


                    <ColumnChart
                      className="pb-10 
          "
                    />
                  </div>
                </div>
                <div className="w-52 h-48 rounded overflow-hidden shadow-lg mx-4 p-4 bCards">
                  <div className="  font-sans font-normal text-[15px] leading-[22px] text-[#22303E]/70 mx-2">
                    Expenses
                  </div>
                  <div className="flex align-center justify-center">
                    <SemiCircleProgressBar
                      percentage={33}
                      showPercentValue
                      diameter={140}
                      stroke="#696CFF"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <p className="content-center  font-sans font-medium text-[14px]  text-[#22303E]/70 ">
                      this is the text{" "}
                    </p>
                  </div>
                </div>
                <div className="w-52 h-48 rounded overflow-hidden shadow-lg mx-4 p-4 bCards">
                  <div className="flex justify-between items-center p-2">
                    <div className="w-10 h-10 bg-[#A2A1FF]/40 rounded-lg flex items-center justify-center ">
                      <BsFillWalletFill className="p-1 w-8 h-8 text-[#6563FF]" />
                    </div>

                  </div>
                  <div className="py-2 font-sans font-normal text-[15px] leading-[22px] text-[#22303E]/70 mx-2">
                    Sales Previous Month
                  </div>
                  <div className="flex  items-center font-sans font-medium text-[24px] leading-[38px] text-[#22303E]/90 mx-2">
                    {dashboardData?.previousMonth?.totalSales}
                    <span>
                      <MdOutlineCurrencyRupee className="rupeeIcon" />
                    </span>
                  </div>
                  <div className="flex   items-center ">
                    <div className="py-2 font-sans font-normal text-[15px] leading-[22px] text-[#22303E]/70 mx-2">Order Per day
                    </div>
                    <span className="font-sans font-medium text-[24px] leading-[38px] text-[#22303E]/90 mx-2">
                      {dashboardData?.previousMonth?.avgOrdersPerDay}
                    </span>

                  </div>

                </div>
              </div>

              <div className="flex flex-wrap py-5 mx-5 ">
                <div className="w-1/3 h-60 rounded overflow-hidden shadow-lg mx-4 p-1 visiorsActivity">
                  <div className="flex justify-between mx-2 py-2">
                    <div className="font-poppins font-medium text-[16px]  text-[#000000]   leading-[21px] mx-2">
                      New Visitors
                    </div>
                    <div className="font-poppins font-light text-[12px]text-[#000000] leading-[21px] mx-2">
                      Last Week
                    </div>
                  </div>
                  <div className="flex py-8 mx-2">
                    <div className="mx-2 py-10 self-end">
                      <h1 className="font-poppins font-light text-2xl leading-[21px] text-[#000000]">
                        15%
                      </h1>
                    </div>
                    <div className="">
                      <WeeklyChart />
                    </div>
                  </div>
                </div>
                <div className="w-1/3 h-60 rounded overflow-hidden shadow-lg mx-4 p-1 visiorsActivity">
                  <div className="flex justify-between mx-2 py-2">
                    <div className="font-poppins font-medium text-[16px]  text-[#000000]   leading-[21px] mx-2">
                      Activity
                    </div>
                    <div className="font-poppins font-light text-[12px]text-[#000000] leading-[21px] mx-2">
                      Last Week
                    </div>
                  </div>
                  <div className="flex py-8 mx-2">
                    <div className="mx-2 py-10 self-end">
                      <h1 className="font-poppins font-light text-2xl leading-[21px] text-[#000000]">
                        28%
                      </h1>
                    </div>
                    <div className="">
                      <WeeklyLineChart stroke="#000000" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex py-5 mx-5">
                <div className=" h-80 rounded overflow-hidden shadow-lg mx-4 p-1 salesStatsDiv">
                  <div className="flex justify-between items-center py-4 px-4 ">
                    <div className="font-public-sans font-medium text-lg leading-[28px] text-[#22303E]/80">
                      Sales Stats
                    </div>
                    <div className="text-[#22303E]/40 ">
                      <BsThreeDotsVertical />
                    </div>
                  </div>
                  <div className="py-6">
                    <CircularProgressbar
                      className="w-40 h-40"
                      value={percentage}
                      text={`${percentage}%`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        }

      </div>
    </div>
  );
}
