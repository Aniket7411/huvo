import { React, useEffect, useState } from "react";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";
import Superadminheader from "../../../components/superadminheader";
import { FaWallet } from "react-icons/fa6";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { BsFillWalletFill } from "react-icons/bs";
import "../superadmin.css";
import ColumnChart from "../../../components/columnchartsa/columnchart";
import SemiCircleProgressBar from "react-progressbar-semicircle";
import { HttpClient } from "../../../server/client/http";
import "./dashboard.css";
import Loader from "../../../components/loader";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getDashboardData = async () => {
      setLoading(true);
      try {
        const response = await HttpClient.get("/dashboard");
        setDashboardData(response);
      } catch (error) {
        console.error(error.response);
      } finally {
        setLoading(false);
      }
    };
    getDashboardData();
  }, []);

  const generateToken = async () => {
    try {
      const response = await HttpClient.post("order/generateShipToken");
      toast.success(response?.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="bg-[#E7EFFA] h-full">
        <SuperAdminNav />
      </div>

      <div className="flex flex-col w-full">
        <Superadminheader />

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="ml-2 sticky top-0 z-10 bg-white">
              <div className="mx-2">
                <p className="mx-3 font-poppins font-medium text-[#46484D]">
                  Overview
                </p>
              </div>
              <hr className="mx-4" />
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-6">
              <button
                onClick={generateToken}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:ring-2 focus:ring-green-400 transition-all"
              >
                Generate Token for Shipdelight
              </button>

              {/* <Link to="/seller_payouts_details">
                <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 transition-all">
                  Sellers Payout
                </button>
              </Link> */}

              {/* <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <li className="bg-white rounded-lg shadow p-4">

                  <p className="font-poppins font-medium">Total Sales</p>
                </li>
                <li className="bg-white rounded-lg shadow p-4">
                  <p className="font-poppins font-medium">Customers</p>
                  <div className="py-4 text-[#011F4B] font-medium text-2xl">
                    {dashboardData?.customerCount}
                  </div>
                </li>
                <li className="bg-white rounded-lg shadow p-4">
                  <p className="font-poppins font-medium">Orders</p>
                  <div className="py-4 text-[#011F4B] font-medium text-2xl">
                    {dashboardData?.currentMonth?.orders}
                  </div>
                </li>
                <li className="bg-white rounded-lg shadow p-4">
                  <p className="font-poppins font-medium">Average Orders Per Day</p>
                  <div className="py-4 text-[#011F4B] font-medium text-2xl">
                    {dashboardData?.currentMonth?.avgOrdersPerDay}
                  </div>
                </li>
              </ul> */}

              {/* <div className="flex flex-wrap gap-4">
                <div className="w-52 h-48 bg-white rounded shadow-lg p-4">
                  <div className="flex justify-between items-center">
                    <FaWallet className="text-[#03C3EC] w-8 h-8" />
                  </div>
                  <p className="font-sans font-normal text-sm text-[#22303E]/70">
                    Total Revenue
                  </p>
                  <div className="text-2xl font-medium text-[#22303E]/90">
                    {dashboardData?.totalRevenue}
                    <MdOutlineCurrencyRupee className="inline" />
                  </div>
                </div>

                <div className="w-52 h-48 bg-white rounded shadow-lg p-4">
                  <p className="font-sans font-normal text-sm text-[#22303E]/70">
                    Profit
                  </p>
                  <ColumnChart />
                </div>

                <div className="w-52 h-48 bg-white rounded shadow-lg p-4">
                  <p className="font-sans font-normal text-sm text-[#22303E]/70">
                    Expenses
                  </p>
                  <SemiCircleProgressBar
                    percentage={33}
                    showPercentValue
                    diameter={140}
                    stroke="#696CFF"
                  />
                </div>

                <div className="w-52 h-48 bg-white rounded shadow-lg p-4">
                  <BsFillWalletFill className="text-[#6563FF] w-8 h-8" />
                  <p className="font-sans font-normal text-sm text-[#22303E]/70">
                    Sales Previous Month
                  </p>
                  <div className="text-2xl font-medium text-[#22303E]/90">
                    {dashboardData?.previousMonth?.totalSales}
                    <MdOutlineCurrencyRupee className="inline" />
                  </div>
                  <p className="font-sans font-normal text-sm text-[#22303E]/70">
                    Order Per Day: {dashboardData?.previousMonth?.avgOrdersPerDay}
                  </p>
                </div>
              </div> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
