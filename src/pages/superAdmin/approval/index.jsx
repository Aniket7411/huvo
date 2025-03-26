
import SuperAdminNav from '../../../components/superadminNavbar/superadminnav';
import Superadminheader from '../../../components/superadminheader';
import { PiArrowArcLeft } from "react-icons/pi"
import { CiSearch } from "react-icons/ci";
import { React, useState, useEffect } from "react";
import { HttpClient } from "../../../server/client/http";
import Loader from "../../../components/loader";
import { useNavigate } from 'react-router-dom';

export default function Approval() {

  const [documnet, setDocument] = useState("");
  const [approvalList, setApprovalList] = useState([]);
  const [orders, setOrders] = useState([
    {
      approvalId: "A001",
      vendorName: "Vendor One",
      status: "Pending",
      details: "View",
    },
    {
      approvalId: "A002",
      vendorName: "Vendor Two",
      status: "Approved",
      details: "View",
    },
    {
      approvalId: "A003",
      vendorName: "Vendor Three",
      status: "Rejected",
      details: "View",
    },
  ]);

  const [isLoading, setisLoading] = useState(false);


  const navigate = useNavigate();

  // const getDocuments = async () => {
  //   setisLoading(true);

  //   try {
  //     const response = await HttpClient.post("/verify/documents");
  //     console.log("Full Response:", response);
  //     setDocument(response);

  //     if (response) {
  //       setisLoading(false);
  //     }
  //   } catch (error) {
  //     console.error(error.response);
  //   }

  // };

  const getApprovalList = async () => {
    setisLoading(true);

    try {
      const response = await HttpClient.get("/approval/requests");
      console.log("approvalrequests", response);
      setApprovalList(response);
      console.log("response", response)

    } catch (error) {
      console.error(error.response);
    }

  };

  // const handleNavigate = (approvalId) => {
  //   navigate(`/admin/approval/slip/${approvalId}`);
  // };


  useEffect(() => {
    getApprovalList();
  }, []);

  // useEffect(() => {
  //   getDocuments();
  // }, [])

  return (
    <div className='flex'>
      <div className='bg-[#E7EFFA] h-screen' >
        <SuperAdminNav />
      </div>
      <div className="w-full">

        <Superadminheader />
        <div className='mx-2'>
          <div className='flex items-center justify-between'>
            <ul>
              <li className='font-pooppins font-medium text-[#46484D]'>
                Approval
              </li>
            </ul>
            <ul className='flex items-center gap-10'>
              <li>
                <select className="p-1 border  rounded-lg" >
                  <option value="" disabled selected hidden>Sort By</option>
                  <option value="">Approved</option>
                  <option value="">Not Approved</option>

                </select>
              </li>
              <li>
                <div className="border  flex items-center justify-between p-1 bg-[#FFFFFF] rounded-lg top-[-12px]">
                  <button className="mr-5"
                  //  onClick={handleClick}
                  >
                    <CiSearch className=" text-[#000000]" />
                  </button>
                  <input
                    placeholder="search"
                    className="border-0 w-full gap-10 outline-none"
                  ></input>
                </div></li>
            </ul>
          </div>
        </div>
        <hr className='mx-2 mt-2'></hr>
        <div className='p-2'>
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-4 text-left font-poppins text-[14px] text-[#6C757D]">
                  Approval Id
                </th>
                <th className="border border-gray-300 p-4 text-left font-poppins text-[14px] text-[#6C757D]">
                  Vendor Name
                </th>
                <th className="border border-gray-300 p-4 text-left font-poppins text-[14px] text-[#6C757D]">
                  Status
                </th>
                <th className="border border-gray-300 p-4 text-left font-poppins text-[14px] text-[#6C757D]">
                  View Details
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={index} className="border-b">
                    <td className="border border-gray-300 p-4">{order.approvalId}</td>
                    <td className="border border-gray-300 p-4">{order.vendorName}</td>
                    <td className="border border-gray-300 p-4">{order.status}</td>
                    <td className="border border-gray-300 p-4 text-blue-500 cursor-pointer">
                      {order.details}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>

      </div>
    </div>


  )
}
