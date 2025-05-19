import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { format } from "date-fns";

const OrderTracking = () => {
    const location = useLocation();
    const [orderData, setOrderData] = useState(null);
    const [tracking, setTracking] = useState([]);
    const [shipping, setShipping] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const match = location.pathname.match(/tracking_order\/([^/]+)\/([^/]+)/);
    const orderId = match ? match[1] : null;
    const productId = match ? match[2] : null;

    useEffect(() => {
        const fetchOrderDetails = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await HttpClient.post("/order/trackOrder", {
                    orderId,
                    productId,
                });

                const data = response?.data;

                if (data) {
                    setOrderData(data);
                    setTracking(data?.tracking_history || []);
                    setShipping({
                        airwaybilno: data?.airwaybilno,
                        orderno: data?.orderno,
                        ordertype: data?.ordertype,
                        latest_status: data?.latest_status,
                        exp_delivery: data?.exp_delivery,
                    });
                } else {
                    setError("No data found for this order.");
                }
            } catch (err) {
                setError("Failed to fetch order details. Please try again later.");
                setOrderData(null);
            } finally {
                setLoading(false);
            }
        };

        if (orderId && productId) {
            fetchOrderDetails();
        } else {
            setError("Invalid tracking URL. Order ID or Product ID is missing.");
        }
    }, [orderId, productId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-lg font-medium text-gray-700">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md w-full mx-4">
                    <div className="text-red-500 text-5xl mb-4">!</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Order</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!orderData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md w-full mx-4">
                    <p className="text-lg font-medium text-gray-700">No order data found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className=" mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Order Tracking</h1>
                    {shipping?.orderno && (
                        <div className="mt-2 md:mt-0 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                            Order #: {shipping.orderno}
                        </div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Tracking Section */}
                    <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Shipping Details Card */}
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Airway Bill No</p>
                                    <p className="text-lg font-semibold mt-1">{shipping?.airwaybilno || "-"}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Order Type</p>
                                    <p className="text-lg font-semibold mt-1">{shipping?.ordertype || "-"}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</p>
                                    <p className="text-lg font-semibold mt-1 text-blue-600">{shipping?.latest_status || "-"}</p>
                                </div>
                                {shipping?.exp_delivery && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Delivery</p>
                                        <p className="text-lg font-semibold mt-1">
                                            {format(new Date(shipping.exp_delivery), "PPP")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Status Timeline</h2>
                                <span className="text-sm text-gray-500">{tracking.length} events</span>
                            </div>

                            {tracking.length > 0 ? (
                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

                                    {tracking.map((item, index) => (
                                        <div key={index} className="relative pl-10 pb-6 last:pb-0 group">
                                            {/* Timeline dot */}
                                            <div className={`absolute left-4 top-1 w-3 h-3 rounded-full transform -translate-x-1/2
                                                ${index === 0 ? 'bg-green-500 ring-4 ring-green-200' : 'bg-blue-500'}`}></div>

                                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-200">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-800">{item.status}</h3>
                                                    <span className="text-sm text-gray-500 mt-1 sm:mt-0">
                                                        {item.updated_at ? format(new Date(item.updated_at), "PPP p") : "-"}
                                                    </span>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                                    {item.status_code && (
                                                        <div>
                                                            <span className="font-medium">Status Code:</span> {item.status_code}
                                                        </div>
                                                    )}
                                                    {item.remarks && (
                                                        <div>
                                                            <span className="font-medium">Remarks:</span> {item.remarks}
                                                        </div>
                                                    )}
                                                    {item.location && (
                                                        <div className="sm:col-span-2">
                                                            <span className="font-medium">Location:</span> {item.location}
                                                        </div>
                                                    )}
                                                    {item.lsp_status && (
                                                        <div className="sm:col-span-2">
                                                            <span className="font-medium">LSP Status:</span> {item.lsp_status}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No tracking history available.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Optional Sidebar - You can add order summary or other details here */}
                    {/* {orderData && (
                        <div className="lg:w-80 flex-shrink-0 bg-white rounded-lg shadow-md p-6 h-fit">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order Date</span>
                                    <span className="font-medium">
                                        {orderData.created_at ? format(new Date(orderData.created_at), "PPP") : "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Items</span>
                                    <span className="font-medium">{orderData.items_count || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method</span>
                                    <span className="font-medium">{orderData.payment_method || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Status</span>
                                    <span className={`font-medium ${orderData.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {orderData.payment_status || "-"}
                                    </span>
                                </div>
                                <div className="pt-3 mt-3 border-t">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total Amount</span>
                                        <span>${orderData.total_amount?.toFixed(2) || "0.00"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;