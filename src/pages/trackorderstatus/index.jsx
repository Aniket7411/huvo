import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { format } from "date-fns";

const OrderTracking = () => {
    const location = useLocation();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Extract `orderId` from query params
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("orderId") || "cq48xu5ymtMYwNPKjC1Nc"; // Default orderId for testing

    useEffect(() => {
        if (!orderId) {
            setError("Order ID is missing in the query parameters.");
            return;
        }

        const fetchOrderDetails = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await HttpClient.post("/order/trackOrder", {
                    orderId,
                });

                setOrderData(response.data);
            } catch (err) {
                setError("Failed to fetch order details. Please try again later.");
                setOrderData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const getStatusColor = (statusCode) => {
        switch (statusCode) {
            case "DELIVERED":
                return "bg-green-100 text-green-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            case "IN_TRANSIT":
                return "bg-blue-100 text-blue-800";
            case "OUT_FOR_DELIVERY":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), "PPpp");
        } catch {
            return dateString;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className=" mx-auto">
                <div className="text-center mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        Track Your Order
                    </h1>
                    <p className="text-gray-600">
                        Check the status and details of your order
                    </p>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="h-16 w-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent mb-4"></div>
                        <p className="text-gray-600">Fetching order details...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-2 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-red-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {orderData && !loading && (
                    <div className="space-y-3">
                        {/* Order Summary Card */}
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Order Summary
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Airway Bill No</p>
                                        <p className="font-medium">
                                            {orderData?.airwaybilno || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Order No</p>
                                        <p className="font-medium">{orderData?.orderno || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Order Type</p>
                                        <p className="font-medium">{orderData?.ordertype || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Expected Delivery</p>
                                        <p className="font-medium">
                                            {formatDate(orderData?.exp_delivery)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Current Status</p>
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                orderData?.latest_status_code
                                            )}`}
                                        >
                                            {orderData?.latest_status || "N/A"}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status Code</p>
                                        <p className="font-medium">
                                            {orderData?.latest_status_code || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tracking History */}
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Tracking History
                                </h2>
                                {orderData?.tracking_history?.length > 0 ? (
                                    <div className="space-y-6">
                                        {orderData.tracking_history.map((item, index) => (
                                            <div
                                                key={item?._id || index}
                                                className={`relative pl-6 pb-6 ${index !== orderData.tracking_history.length - 1
                                                    ? "border-l-2 border-gray-200"
                                                    : ""
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute w-4 h-4 rounded-full -left-2 top-1 ${index === 0
                                                        ? "bg-blue-500"
                                                        : "bg-gray-300"
                                                        }`}
                                                ></div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-medium text-gray-800">
                                                            {item?.status || "N/A"}
                                                        </h3>
                                                        <span
                                                            className={`text-xs px-2 py-1 rounded ${getStatusColor(
                                                                item?.status_code
                                                            )}`}
                                                        >
                                                            {item?.status_code || "N/A"}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {formatDate(item?.createdAt)}
                                                    </p>
                                                    {item?.lsp_status && (
                                                        <p className="text-sm">
                                                            <span className="text-gray-500">LSP Status:</span>{" "}
                                                            {item.lsp_status}
                                                        </p>
                                                    )}
                                                    {item?.remarks && (
                                                        <div className="bg-gray-50 p-3 rounded">
                                                            <p className="text-sm text-gray-700">
                                                                <strong>Remark</strong> {item.remarks}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <p className="mt-2 text-gray-600">
                                            No tracking history available
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;