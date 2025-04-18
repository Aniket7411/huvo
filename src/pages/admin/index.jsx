import { Link, useNavigate } from "react-router-dom";
import { getUserData } from "../../server/user";
import SalesChart from "../../components/salesChart/SalesChart";
import SalesDonutChart from "../../components/salesDonutChart/salesDonutChart";
import "./admindashboard.css";
import StocksTable from "../../components/Tables/stocksTable";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/loader";
import { HttpClient } from "../../server/client/http";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import Modal from 'react-modal';
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";


function Admin() {

  const [dashboardData, setDashboardData] = useState([]);
  const [sellerDetails, setSellerDetails] = useState()

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();


  const getdashboardData = async () => {
    setIsLoading(true)
    try {
      const response = await HttpClient.get("/dashboard")

console.log("response",response?.sellerDetails)
setSellerDetails(response?.sellerDetails)

console.log("response",sellerDetails)



      setIsLoading(false)

    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getdashboardData();
  }, []);
  return (

    <>
    {isLoading ? (
      <div className="h-screen flex justify-center items-center">
      <Loader />

      </div>
    ) : (
      <div className="p-6 bg-gray-100 rounded-lg shadow-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-3 text-center">Seller Details</h1>
  
        {/* Personal and Store Details */}
        <div className="flex flex-wrap gap-6">
          {/* Personal Information */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h2>
            <p><span className="font-medium">First Name:</span> {sellerDetails?.firstName}</p>
            <p><span className="font-medium">Last Name:</span> {sellerDetails?.lastName}</p>
            <p><span className="font-medium">Email:</span> {sellerDetails?.email}</p>
            <p><span className="font-medium">Username:</span> {sellerDetails?.username}</p>
            <p><span className="font-medium">Role:</span> {sellerDetails?.role}</p>
            <p><span className="font-medium">Verification Status:</span> {sellerDetails?.verificationStatus ? 'Verified' : 'Not Verified'}</p>
            <p><span className="font-medium">Active Status:</span> {sellerDetails?.isActive ? 'Active' : 'Inactive'}</p>
          </div>
  
          {/* Store Details */}
          {/* <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Store Details</h2>
            <p><span className="font-medium">Registered:</span> {sellerDetails?.registered ? 'Yes' : 'No'}</p>
            <p><span className="font-medium">Products:</span> {sellerDetails?.storeDetails?.products?.length || 0}</p>
          </div> */}
        </div>
  
        {/* Address Section */}
        <div className="mt-2 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Address</h2>
            <ul className="list-disc  text-gray-700">
              {sellerDetails?.storeDetails?.storeAddress}
            </ul>
         
        </div>
  
        {/* Coupons Section */}
        {/* <div className="mt-2 bg-white p-4 rounded-lg shadow-sm flex gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Coupons</h2>
            <p><span className="font-medium">Used:</span> {sellerDetails?.couponUsed?.length}</p>
          </div>
          <div className="flex-1">
            <p><span className="font-medium">Expired:</span> {sellerDetails?.couponExpired?.length}</p>
          </div>
        </div> */}
  
        {/* Account Info Section */}
        <div className="mt-2 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Account Info</h2>
          <p><span className="font-medium">Created At:</span> {new Date(sellerDetails?.createdAt).toLocaleString()}</p>
          <p><span className="font-medium">Updated At:</span> {new Date(sellerDetails?.updatedAt).toLocaleString()}</p>
          <p><span className="font-medium">ID:</span> {sellerDetails?._id}</p>
        </div>
  
        {/* Stocks Table */}
        <div className="mt-8">
          <StocksTable />
        </div>
      </div>
    )}
  </>
  


  );
}

export default Admin;
