import React from 'react'
import { useLocation, useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";

function InvoicePage() {
    const { state } = useLocation();
    const { invoice } = state || {};
    if (!invoice) {
        return <p>No invoice details available.</p>;
    }
    console.log("a")
    const handleDownload = () => {

        const element = document.getElementById("invoice-content");
        const options = {
            margin: 0.5, // Margin in inches
            filename: `Invoice_${invoice.invoiceNumber}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
          };
          html2pdf().set(options).from(element).save();
        };
    console.log("b")
    return (
        //     <div>
        //     <h1>Invoice Details</h1>
        //     <p>Invoice Number: {invoice.invoiceNumber}</p>
        //     <p>Customer Name: {invoice.customer.name}</p>
        //     <p>Total Products: {invoice.orderSummary.totalProducts}</p>
        //     <p>Total Price: ${invoice.orderSummary.totalPrice.toFixed(2)}</p>
        //     <h2>Items:</h2>
        //     <ul>
        //       {invoice.items.map((item) => (
        //         <li key={item._id}>
        //           {item.name} - {item.quantity} x ${item.discountedPrice}
        //         </li>
        //       ))}
        //     </ul>
        //   </div>
        <div className=''>
            <div className=" py-4 mx-4 font-poppins text-[20px] font-medium leading-[21px] text-[#011F4B]">
                Details
            </div>
            <div id='invoice-content'>
                <div className="h-full rounded  shadow-lg mx-4 p-1">
                    <div className="mx-4 flex flex-col md:flex-row justify-between p-5 bg-white  font-poppins text-black max-w-5xl mx-auto">
                        <div className="flex-1">
                            <div className="bg-[#F4D7D7] h-12 w-12 rounded-full flex items-center justify-center text-lg text-gray-800 mb-4">
                                FH
                            </div>

                            <div className="mb-4">
                                <p className='flex gap-20 font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span className="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Vendor ID:</span> {invoice.seller.vendorId}</p>

                                <p className='flex gap-20 font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span className="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Vendor Name:</span>{invoice.seller.vendorName}</p>
                                <p className='flex gap-20 font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span className="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Address:</span>{invoice.seller.address}</p>
                            </div>
                            <div className="mt-4">
                                <p className="font-poppins text-[12px] font-semibold leading-[21px] text-left">Bill To:</p>
                                <p className='font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span class="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Name:</span> {invoice.customer.name}</p>
                                <p className='font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span className="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Email:</span>{invoice.customer.email}</p>
                            </div>
                        </div>
                        <div className="flex-1 mt-6 md:mt-0 md:pl-10 border-t md:border-t-0 md:border-l border-gray-300">
                            <div className="mb-4">
                                <p className='font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span className="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Invoice Number:</span> {invoice.invoiceNumber
                                }</p>
                                <p className='font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span className="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Issued:</span> {invoice.issued
                                }</p>
                             
                            </div>

                            <div className="mt-4">
                                <p className="font-poppins text-[12px] font-semibold leading-[21px] text-left">Order Summary</p>
                                <p className='font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span class="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Order ID:</span>{invoice.orderSummary.orderId}</p>
                                <p className='font-poppins text-[14px] font-normal leading-[21px] text-left text-[#000000]'><span className="font-poppins text-[14px] font-normal leading-[21px] text-left text-[#6B6B6B]">Order Date:</span> {
                                    invoice.orderSummary.orderDate
                                }</p>
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
                                    {invoice.items.map((item) => (
                                        <tr key={item._id} className="text-gray-800">
                                            <td className="font-poppins text-[14px] font-normal leading-[21px] text-center border-r border-gray-300">
                                                {item.name}
                                            </td>
                                           
                                            <td className="font-poppins text-[14px] font-normal leading-[21px] text-center border-r border-gray-300">
                                                {item.quantity}
                                            </td>
                                            <td className="font-poppins text-[14px] font-normal leading-[21px] text-center border-r border-gray-300">
                                                ₹{item.discountedPrice.toFixed(2)}
                                            </td>
                                            <td className="font-poppins text-[14px] font-normal leading-[21px] text-center">
                                                ₹{(item.discountedPrice * item.quantity).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end mr-20">
                            <div className="w-full max-w-xs">
                                {/* <div className="flex justify-between py-1 text-gray-800">
                                    <span className="font-poppins text-[14px] font-semibold leading-[21px] text-center text-[#000000]">
                                        Subtotal:
                                    </span>
                                    <span className="font-poppins text-[14px] font-semibold leading-[21px] text-center  text-[#000000]">
                                        ₹3665.00
                                    </span>
                                </div> */}
                                <div className="flex justify-between py-1 text-gray-800">
                                    <span className="font-poppins text-[14px] font-normal leading-[21px] text-right text-[#000000]">
                                       Platform Fees
                                    </span>
                                    <span className="font-poppins text-[14px] font-semibold leading-[21px] text-center  text-[#000000]">
                                     {invoice.platformFee}
                                    </span>
                                </div>
                                {/* <div className="flex justify-between py-1 text-gray-800">
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
                                </div> */}
                                <div className="border-t mt-2 py-2 flex justify-between font-semibold text-gray-900">
                                    <span className="font-poppins text-[14px] font-semibold leading-[21px] text-center  text-[#000000]">
                                        Total Amount:
                                    </span>
                                    <span className="font-poppins text-[14px] font-semibold leading-[21px] text-center  text-[#000000]">
                                      {invoice.orderSummary.totalPrice}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
            <button
        onClick={handleDownload}
        className="bg-[#011F4B] text-[#FFFFFF] font-bold rounded-md px-8 py-3 mx-auto block my-12"
      >
        Download Invoice
      </button>
            </div>
        </div>
    )
}

export default InvoicePage