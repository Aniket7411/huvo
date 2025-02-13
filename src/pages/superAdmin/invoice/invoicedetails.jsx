import { React, useState, useEffect } from "react";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";
import Superadminheader from "../../../components/superadminheader";
import { PiArrowArcLeft } from "react-icons/pi";
import "../superadmin.css";
import { Link } from "react-router-dom";
import { HttpClient } from "../../../server/client/http";
import "react-circular-progressbar/dist/styles.css";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { FaFileExport } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import './invoicedetails.css'

export default function InvoiceDetails() {
  const { id } = useParams();

  const percentage = 60;
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [loading, setloading] = useState(false);
  const [detailsId, setdetaisId] = useState();

  const navigate = useNavigate();

  //console.log("Extracted ID from Params:", id);
  const getInvoiceDetails = async (_id) => {
    // debugger
    if (!_id) {
      console.error("id", _id);
      return;
    }

    try {
      const response = await HttpClient.get(`/invoice/${_id}`);

      console.log("Full Response:", response);
      setInvoiceDetails(response);
console.log(response?.invoice?.seller?.vendorId)

    } catch (error) {
      console.error(error.response);
    }
    //getVendorsDetails();
  };

  useEffect(() => {
    getInvoiceDetails(id);
  }, [id]);

  const handleNavigate = () => {
    navigate(`/admin/invoice`);
  };

  return (
    <div className="flex h-screen">
      <div className="bg-[#E7EFFA] h-full">
        <SuperAdminNav />
      </div>

      <div className="flex flex-col w-full flex-1 overflow-auto">
        <div className="mx-4">
          <div className="flex items-center">
            <div
              className="h-14 w-14  bg-[#E7EFFA] rounded-full flex items-center justify-center"
              onClick={() => handleNavigate()}
            >
              <PiArrowArcLeft className="text-[#000000]" />
            </div>

            <div className="w-full">
              <Superadminheader />
            </div>
          </div>
          <div className=" py-6 font-poppins font-normal text-[14px] leading-[21px] text-[#6C757D]">
            Invoice Details
          </div>
          <div className="">
            <p className=" font-poppins font-medium text-[32px] leading-[21px]">
              Invoice Number
            </p>
          </div>
          <div className="sflex flex-wrap items-center justify-between py-4">
            <ul>
              <li>
                <div className="flex flex-wrap justify-between gap-10 mb-4">
                  <div className="font-poppins font-medium text-[14px] leading-[21px] text-center">
                    1509
                  </div>
                  <div className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                    15-09-2024
                  </div>
                </div>
              </li>
            </ul>
            <ul className="flex gap-2">
              <li>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#E7EFFA] rounded-md text-[#011F4B] font-poppins font-normal text-[14px] leading-[21px]">
                  <FaFileExport />
                  Export
                </button>
                 

              </li>
              <li>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#E7EFFA] rounded-md text-[#011F4B] font-poppins font-normal text-[14px] leading-[21px]">
                  <FaRegEdit />
                  Edit Invoice

                  <FaRegEdit />

                  Edit Invoice
                </button>
              </li>
              <li>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#011F4B] rounded-md text-white font-poppins font-normal text-[14px] leading-[21px]">
                  <BsSend />
                  Send Invoice
                </button>
              </li>
            </ul>
          </div>
        </div>
        <hr className="mx-4"></hr>

        <div className=" py-4 mx-4 font-poppins text-[20px] font-medium leading-[21px] text-[#011F4B]">
          Details
        </div>

        <div className="h-full rounded  shadow-lg mx-4 p-1">
          <div className="mx-4 flex flex-col md:flex-row justify-between p-5 bg-white  font-poppins text-black max-w-5xl mx-auto">
            <div className="flex-1">
              <div className="bg-[#F4D7D7] h-12 w-12 rounded-full flex items-center justify-center text-lg text-gray-800 mb-4">
                FH
              </div>

              <div className="mb-4">
                <p className='flex gap-20 font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span className="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Vendor ID:</span> #V002</p>
                <p className='flex gap-20 font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span className=" font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Vendor ID:</span> #V002</p>
                <p className='flex gap-20 font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span className="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Vendor Name:</span> FashionHub</p>
                <p className='flex gap-20 font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span className="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Address:</span> 456 Fashion Avenue, NY</p>
              </div>
              <div className="mt-4">
                <p className="font-poppins text-[12px] font-semibold leading-[21px] text-left">Bill To</p>
                <p className='font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span class="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Name:</span> John Doe</p>
                <p className='font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span className="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Email:</span> john.doe@example.com</p>
              </div>
            </div>
            <div className="flex-1 mt-6 md:mt-0 md:pl-10 border-t md:border-t-0 md:border-l border-gray-300">
              <div className="mb-4">
                <p className='font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span className="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Invoice Number:</span> INV-000123</p>
                <p className='font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span className="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Issued:</span> 2024-01-20</p>
                <p className='font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span className="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Due Date:</span> 2024-01-30</p>
              </div>

              <div className="mt-4">
                <p className="font-poppins text-[12px] font-semibold leading-[21px] text-left">Order Summary</p>
                <p className='font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span class="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Order ID:</span> #1003</p>
                <p className='font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span className="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Order Date:</span> 2024-07-30</p>
              </div>
            </div>
          </div>
        </div>
        <div className="py-4 mx-4  font-poppins text-[20px] font-medium leading-[21px] text-[#011F4B]">
          Itemized List
        </div>
        <div className="h-full rounded shadow-lg mx-4 p-1">
          <div className="">
            <div className="overflow-x-auto">
              <table className="w-full table-auto mb-6">
                <thead className="border-b border-gray-300">
                  <tr className="text-left text-gray-600">
                    <th className="font-poppins text-[14px] font-normal leading-[21px] text-center  border-r  border-gray-300 text-[#6C757D]">
                      Item
                    </th>
                    <th className="font-poppins text-[14px] font-normal leading-[21px] text-center border-r  border-gray-300 text-[#6C757D]">
                      Description
                    </th>
                    <th className="font-poppins text-[14px] font-normal leading-[21px] text-center border-r  border-gray-300 text-[#6C757D]">
                      Qty
                    </th>
                    <th className="font-poppins text-[14px] font-normal leading-[21px] text-center  border-r  border-gray-300 text-[#6C757D] ">
                      Unit Price
                    </th>
                    <th className="font-poppins text-[14px] font-normal leading-[21px] text-center  text-[#6C757D]">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-gray-800">
                    <td className="font-poppins text-[14px] font-normal leading-[21px] text-center border-r  border-gray-300">
                      T-Shirt
                    </td>
                    <td className="font-poppins text-[14px] font-normal leading-[21px] text-center border-r  border-gray-300">
                      Cotton T-Shirt
                    </td>
                    <td className="font-poppins text-[14px] font-normal leading-[21px] text-center border-r  border-gray-300">
                      2
                    </td>
                    <td className="font-poppins text-[14px] font-normal leading-[21px] text-center border-r  border-gray-300">
                      ₹615.00
                    </td>
                    <td className="font-poppins text-[14px] font-normal leading-[21px] text-center">
                      ₹1230.00
                    </td>
                  </tr>
                  <tr className="text-gray-800">
                    <td className="font-poppins text-[14px] font-normal leading-[21px] text-center border-r  border-gray-300">
                      Jeans
                    </td>
                    <td className="font-poppins text-[14px] font-normal leading-[21px] text-center border-r  border-gray-300">
                      Denim Jeans
                    </td>
                    <td className="font-poppins text-[14px] font-normal leading-[21px] text-center border-r  border-gray-300">
                      1
                    </td>
                    <td className="font-poppins text-[14px] font-normal leading-[21px] text-center border-r  border-gray-300">
                      ₹1220.00
                    </td>
                    <td className="font-poppins text-[14px] font-normal leading-[21px] text-center">
                      ₹1220.00
                    </td>
                  </tr>
                  <tr className="text-gray-800">
                    <td className="font-poppins text-[14px] font-normal leading-[21px] text-center border-r  border-gray-300">
                      Shoes
                    </td>
                    <td className="font-poppins text-[14px] font-normal leading-[21px] text-center border-r  border-gray-300 ">
                      Running Shoes
                    </td>
                    <td className="font-poppins text-[14px] font-normal leading-[21px] text-center border-r  border-gray-300">
                      1
                    </td>
                    <td className="font-poppins text-[14px] font-normal leading-[21px] text-center border-r  border-gray-300">
                      ₹1215.00
                    </td>
                    <td className="font-poppins text-[14px] font-normal leading-[21px] text-center">
                      ₹1215.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mr-20">
              <div className="w-full max-w-xs">
                <div className="flex justify-between py-1 text-gray-800">
                  <span className="font-poppins text-[14px] font-semibold leading-[21px] text-center text-[#000000]">
                    Subtotal:
                  </span>
                  <span className="font-poppins text-[14px] font-semibold leading-[21px] text-center  text-[#000000]">
                    ₹3665.00
                  </span>
                </div>
                <div className="flex justify-between py-1 text-gray-800">
                  <span className="font-poppins text-[14px] font-normal leading-[21px] text-right text-[#000000]">
                    Tax:
                  </span>
                  <span className="font-poppins text-[14px] font-semibold leading-[21px] text-center  text-[#000000]">
                    ₹150.00
                  </span>
                </div>
                <div className="flex justify-between py-1 text-gray-800">
                  <span className="font-poppins text-[14px] font-normal leading-[21px] text-right text-[#000000]">
                    Shipping:
                  </span>
                  <span className="font-poppins text-[14px] font-semibold leading-[21px] text-center  text-[#000000] ">
                    ₹10.00
                  </span>
                </div>
                <div className="flex justify-between py-1 text-gray-800">
                  <span className="font-poppins text-[14px] font-normal leading-[21px] text-right text-[#000000]">
                    Discounts:
                  </span>
                  <span className="font-poppins text-[14px] font-semibold leading-[21px] text-center  text-[#000000]">
                    -₹5.00
                  </span>
                </div>
                <div className="border-t mt-2 py-2 flex justify-between font-semibold text-gray-900">
                  <span className="font-poppins text-[14px] font-semibold leading-[21px] text-center  text-[#000000]">
                    Total Amount:
                  </span>
                  <span className="font-poppins text-[14px] font-semibold leading-[21px] text-center  text-[#000000]">
                    ₹3820.00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4 mx-4  font-poppins text-[20px] font-medium leading-[21px] text-[#011F4B] ">
          Payment Information
        </div>
        <div>
          <div className="h-full rounded  shadow-lg mx-4 p-1 bg-[#FDFDFD]">
            <div className="flex gap-20 items-center bg-white p-4  w-full">
              <div className="flex flex-col space-y-2">
                <span className="font-poppins text-sm font-normal leading-[21px] text-left text-gray-600 titleSpan">
                  Payment Method:
                </span>
                <span className="font-poppins text-sm font-normal leading-[21px] text-left text-gray-600 titleSpan">
                  Transaction ID:
                </span>
              </div>

              <div className="flex flex-col space-y-2">
                <span className="font-poppins text-sm font-medium leading-[21px] text-black">
                  Credit Card
                </span>
                <span className="font-poppins text-sm font-medium leading-[21px] text-black">
                  TXN-789456123
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
