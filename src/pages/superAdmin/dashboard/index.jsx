import { React, useEffect, useState } from "react";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";
import Superadminheader from "../../../components/superadminheader";
import { FaWallet, FaShippingFast, FaTags } from "react-icons/fa";
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
        toast.error("Failed to load dashboard data");
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
      toast.error("Failed to generate token");
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="bg-[#E7EFFA] h-full w-64 flex-shrink-0">
        <SuperAdminNav />
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full overflow-hidden">
        <Superadminheader />

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader />
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="sticky top-0 z-10 bg-white shadow-sm">
              <div className="px-6 py-4 border-b">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-600">Overview and quick actions</p>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto p-6">
              {/* Quick Actions Section */}
              <div className="mb-8 flex flex-wrap gap-4">
                <button
                  onClick={generateToken}
                  className="flex items-center px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition-all"
                >
                  <FaShippingFast className="mr-2" />
                  Generate Shipdelight Token
                </button>
                
                <Link to="/add_coupons">
                  <button className="flex items-center px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition-all">
                    <FaTags className="mr-2" />
                    Add Coupons
                  </button>
                </Link>
              </div>
{/* 
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">₹24,780</p>
                    </div>
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                      <MdOutlineCurrencyRupee size={20} />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Wallet Balance</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">₹12,450</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <BsFillWalletFill size={20} />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">↑ 5% from last week</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                  <h3 className="font-medium text-gray-800 mb-4">Monthly Sales</h3>
                  <ColumnChart />
                </div>
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                  <h3 className="font-medium text-gray-800 mb-4">Performance</h3>
                  <div className="flex justify-center">
                    <SemiCircleProgressBar 
                      percentage={75} 
                      stroke="#4f46e5" 
                      strokeWidth={10}
                      diameter={200}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                <h3 className="font-medium text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-start pb-4 border-b border-gray-100">
                    <div className="p-2 bg-blue-100 rounded-full mr-3">
                      <FaWallet className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">New transaction</p>
                      <p className="text-sm text-gray-600">Order #1234 completed</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}