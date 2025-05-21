import React, { useEffect, useState } from 'react';
import { FiFilter, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { HttpClient } from '../../server/client/http';
import { toast } from 'react-toastify';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import Loader from '../../components/loader';
import { MdOutlineArrowOutward } from 'react-icons/md';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

const SellerPayoutDetail = () => {
    const [isLoading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        const last15Days = new Date(today);
        last15Days.setDate(today.getDate() - 15);
        return last15Days.toISOString().split('T')[0];
    });

    const [endDate, setEndDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [vendorList, setVendorList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [calculatedData, setCalculatedData] = useState(null);
    const [selectedSeller, setSelectedSeller] = useState(null);

    const getVendorsList = async () => {
        setLoading(true);
        try {
            const response = await HttpClient.get("/dashboard/vendors/");
            setVendorList(response.vendors);
            setLoading(false);
        } catch (error) {
            console.error(error.response);
            setLoading(false);
        }
    };

    useEffect(() => {
        getVendorsList();
    }, []);

    const getPayout = async (sellerId, sellerName) => {
        setLoading(true);
        try {
            const response = await HttpClient.post("/order/create-payout", {
                sellerId: sellerId,
                from: startDate,
                to: endDate,
                type: "calculate"
            });

            setCalculatedData({
                amount: response?.amount, // Adjust based on your API response structure
                sellerId: sellerId,
                sellerName: sellerName,
                startDate: startDate,
                endDate: endDate,
                adminData: response?.adminData
            });

            console.log("responseresponse", calculatedData)
            setSelectedSeller(sellerId);
            setIsModalOpen(true);
            toast.success("Payout calculated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to calculate payout");
        } finally {
            setLoading(false);
        }
    };

    const handleMakePayment = async () => {
        setLoading(true);
        try {
            const response = await HttpClient.post("/order/create-payout", {
                sellerId: selectedSeller,
                from: startDate,
                to: endDate,
                type: "finalPay"
            });
            toast.success(response.message);
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Seller Payouts</h1>

            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="text-xl font-semibold text-gray-700">Filter Payouts</h2>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                                <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>

                        <div className="relative flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                                <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payouts Table */}
            {vendorList.length ? (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr className="">
                            <th className="min-w-[150px] p-4 pl-4 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D]">
                                Seller Name
                            </th>
                            <th className="min-w-[150px] p-4 pl-4 font-poppins font-normal text-[14px] leading-[18px] text-[#6C757D]">
                                Id
                            </th>
                            <th className="min-w-[150px] p-4 pl-4 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D]">
                                E-mail
                            </th>
                            <th className="p-4 pl-4 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D]">
                                Total Products
                            </th>
                            <th className="p-4 pl-4 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D]">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendorList.map((item, key) => (
                            <tr key={key}>
                                <td className="p-4 pl-4">
                                    <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                                        {item?.firstName} {item?.lastName}
                                    </h5>
                                </td>
                                <td className="p-4 pl-4">
                                    <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                                        <button className="flex items-center gap-2 text-blue-500 hover:underline">
                                            {item?.vendorId}
                                        </button>
                                    </h5>
                                </td>
                                <td className="p-4 pl-4">
                                    <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                                        {item?.email}
                                    </h5>
                                </td>
                                {/* {`/sellers_products/${item?.vendorId}`} */}
                                <td className="p-4 pl-4">
                                    <Link to={`/sellers_products`} className="effect-link">
                                        <h5 className="font-poppins font-normal  text-[14px] leading-[21px] text-center text-blue-500 hover:underline">
                                            {item?.totalProduct}
                                        </h5>
                                    </Link>

                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                                    {isLoading && selectedSeller === item?.vendorId ? (
                                        // Show loader when loading
                                        <div className="flex items-center space-x-2">
                                            <svg
                                                className="w-5 h-5 text-blue-600 animate-spin"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8H4zm2 5.291l6.707-6.707 1.414 1.414L7.414 18H12a8 8 0 01-8-8v5.291z"
                                                ></path>
                                            </svg>
                                            <span>Calculating...</span>
                                        </div>
                                    ) : (
                                        // Show button when not loading
                                        <button
                                            onClick={() => getPayout(item?.vendorId, `${item?.firstName} ${item?.lastName}`)}
                                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                            disabled={isLoading}
                                        >
                                            Calculate
                                        </button>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="h-[62vh] flex items-center justify-center">
                    {isLoading === true ? <Loader /> : "No Products Available"}
                </div>
            )}



            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Payout Calculation"
                className="fixed inset-0 flex items-center justify-center z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
            >
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative z-50 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Payout Details</h2>

                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Seller:</span>
                            <span className="font-medium">{calculatedData?.sellerName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Seller ID:</span>
                            <span className="font-medium">{calculatedData?.sellerId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">From Date:</span>
                            <span className="font-medium">{calculatedData?.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">To Date:</span>
                            <span className="font-medium">{calculatedData?.endDate}</span>
                        </div>

                        {calculatedData?.adminData?.length > 0 && (
                            <table className="min-w-full divide-y divide-gray-200 border">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User Paid
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Seller Received
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Platform Received
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Shipping Fee
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {calculatedData?.adminData?.map((data, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.userPaid}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.sellerRecieved}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.platformRecieved}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.shippingFee}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-600 font-semibold">Amount:</span>
                            <span className="font-bold text-lg">₹{calculatedData?.amount || '0.00'}</span>
                        </div>
                    </div>





                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleMakePayment}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300"
                        >
                            {isLoading ? 'Processing...' : 'Make Payment'}
                        </button>
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default SellerPayoutDetail;