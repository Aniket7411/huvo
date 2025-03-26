import React, { useState, useEffect } from "react";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";
import Superadminheader from "../../../components/superadminheader";
import { PiArrowArcLeft } from "react-icons/pi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HttpClient } from "../../../server/client/http";
import { FaFileExport, FaRegEdit } from "react-icons/fa";
import { BsSend } from "react-icons/bs";

export default function InvoiceDetails() {
  const { id } = useParams();
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getInvoiceDetails = async (_id) => {
    if (!_id) return;
    try {
      const response = await HttpClient.get(`/invoice/${_id}`);
      setInvoiceDetails(response);
    } catch (error) {
      console.error(error.response);
    }
  };

  useEffect(() => {
    getInvoiceDetails(id);
  }, [id]);

  const handleNavigate = () => {
    navigate(`/admin/invoice`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden md:block bg-blue-100 h-full">
        <SuperAdminNav />
      </div>
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="mx-4">
          <div className="flex items-center mb-4">
            <div
              className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer"
              onClick={handleNavigate}
            >
              <PiArrowArcLeft className="text-black text-xl" />
            </div>
            <div className="flex-grow">
              <Superadminheader />
            </div>
          </div>

          <div className="text-gray-600 text-sm py-2">Invoice Details</div>
          <h2 className="text-lg font-semibold mb-4">Invoice Number</h2>

          <div className="flex flex-wrap items-center justify-between py-4">
            <ul>
              <li className="flex flex-col gap-2">
                <span className="text-center text-base font-medium">1509</span>
                <span className="text-center text-gray-600 text-sm">15-09-2024</span>
              </li>
            </ul>
            <ul className="flex gap-4">
              <li>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-md text-blue-900 font-medium">
                  <FaFileExport /> Export
                </button>
              </li>
              <li>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-md text-blue-900 font-medium">
                  <FaRegEdit /> Edit Invoice
                </button>
              </li>
              <li>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-900 rounded-md text-white font-medium">
                  <BsSend /> Send Invoice
                </button>
              </li>
            </ul>
          </div>
        </div>

        <hr className="mx-4" />

        <div className="py-4 mx-4 text-lg font-medium text-blue-900">Details</div>

        <div className="bg-white rounded shadow p-6 mx-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1 mb-6 md:mb-0">
              <div className="bg-red-100 h-12 w-12 rounded-full flex items-center justify-center text-lg mb-4">
                FH
              </div>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">Vendor ID:</span> #V002
                </p>
                <p>
                  <span className="text-gray-600">Vendor Name:</span> FashionHub
                </p>
                <p>
                  <span className="text-gray-600">Address:</span> 456 Fashion Avenue, NY
                </p>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold">Bill To</p>
                <p>
                  <span className="text-gray-600">Name:</span> John Doe
                </p>
                <p>
                  <span className="text-gray-600">Email:</span> john.doe@example.com
                </p>
              </div>
            </div>

            <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-300 md:pl-6">
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">Invoice Number:</span> INV-000123
                </p>
                <p>
                  <span className="text-gray-600">Issued:</span> 2024-01-20
                </p>
                <p>
                  <span className="text-gray-600">Due Date:</span> 2024-01-30
                </p>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold">Order Summary</p>
                <p>
                  <span className="text-gray-600">Order ID:</span> #1003
                </p>
                <p>
                  <span className="text-gray-600">Order Date:</span> 2024-07-30
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4 mx-4 text-lg font-medium text-blue-900">Itemized List</div>

        <div className="bg-white rounded shadow p-6 mx-4">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="border-b">
                <tr className="text-left text-gray-600">
                  <th className="py-2">Item</th>
                  <th className="py-2">Description</th>
                  <th className="py-2">Quantity</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Item 1</td>
                  <td className="py-2">Description 1</td>
                  <td className="py-2">2</td>
                  <td className="py-2">$50</td>
                  <td className="py-2">$100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}