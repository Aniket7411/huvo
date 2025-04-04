import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";
import Superadminheader from "../../../components/superadminheader";
import { CiSearch } from "react-icons/ci";
import { HttpClient } from "../../../server/client/http";
import Loader from "../../../components/loader";

export default function Approval() {
  const [approvalList, setApprovalList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const getApprovalList = async () => {
    setIsLoading(true);
    try {
      const response = await HttpClient.get("/users/seller/unverified");

      const formattedList = response.data.map((seller) => ({
        sellerId: seller._id,
        firstName: seller.firstName,
        lastName: seller.lastName,
        isActive: seller.isActive,
        verificationStatus: seller.verificationStatus,
        username: seller.username,
        email: seller.email,
        isActive: seller.isActive,

      }));

      setApprovalList(formattedList);
      console.log(formattedList)
    } catch (error) {
      console.error("Error fetching approvals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getApprovalList();
  }, []);

  return (
    <div className="flex">
      <div className="bg-[#E7EFFA] h-screen">
        <SuperAdminNav />
      </div>
      <div className="w-full">
        <Superadminheader />

        <div className="mx-4 mt-4">
          <div className="flex items-center justify-between">
            <h1 className="font-poppins text-xl text-[#46484D]">Approval Requests</h1>

            <div className="flex items-center gap-2">
              <select className="p-2 border rounded-lg text-sm">
                <option value="" disabled selected hidden>
                  Sort By
                </option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>

              <div className="border flex items-center bg-white px-3 py-1 rounded-lg">
                <CiSearch className="text-black" />
                <input
                  placeholder="Search"
                  className="ml-2 outline-none text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="mx-4 my-4" />

        <div className="px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader />
            </div>
          ) : (
            <table className="w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-center">
                  <th className="border border-gray-300 p-2 font-poppins text-sm text-[#6C757D]">
                    Approval ID
                  </th>
                  <th className="border border-gray-300 p-2 font-poppins text-sm text-[#6C757D]">
                    Seller Name
                  </th>
                  <th className="border border-gray-300 p-2 font-poppins text-sm text-[#6C757D]">
                    Email
                  </th>
                 
                  <th className="border border-gray-300 p-2 font-poppins text-sm text-[#6C757D]">
                    Verification Status
                  </th>
                  <th className="border border-gray-300 p-2 font-poppins text-sm text-[#6C757D]">
                    Active Status
                  </th>
                  <th className="border border-gray-300 p-2 font-poppins text-sm text-[#6C757D]">
                    View Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {approvalList.length > 0 ? (
                  approvalList.map((order, index) => (
                    <tr key={index} className="text-center hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">
                        {order.sellerId}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {order.firstName} {order.lastName}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {order.email}
                      </td>
                   
                      <td
                        className={`border border-gray-300 p-2 capitalize font-medium ${order.verificationStatus === true ? "text-green-600" : "text-red-600"
                          }`}
                      >
                        {order.verificationStatus === true ? "Verified" : "Unverified"}
                      </td>

                      <td
                        className={`border border-gray-300 p-2 capitalize font-medium ${order.isActive === true ? "text-green-600" : "text-red-600"
                          }`}
                      >
                        {order.isActive === true ? "Verified" : "Unverified"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Link
                          to={`/admin/approval/${order.sellerId}`}
                          className="text-blue-500 hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-gray-500">
                      No approval requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
