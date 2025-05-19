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
        //debugger;
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
                <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
                    <div className="text-red-500 text-5xl mb-4">!</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Order</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-700">No order data found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Order Tracking</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tracking Information */}
                    <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tracking Information</h2>

                        {shipping && (
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-700 mb-2">Shipping Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Order No</p>
                                        <p className="font-medium">{shipping.orderno || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Airway Bill No</p>
                                        <p className="font-medium">{shipping.airwaybilno || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Order Type</p>
                                        <p className="font-medium">{shipping.ordertype || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Latest Status</p>
                                        <p className="font-medium">{shipping.latest_status || "-"}</p>
                                    </div>
                                    {shipping.exp_delivery && (
                                        <div>
                                            <p className="text-sm text-gray-600">Expected Delivery</p>
                                            <p className="font-medium">
                                                {format(new Date(shipping.exp_delivery), "PPP")}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Status Timeline */}
                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">Status Timeline</h3>
                            {tracking.length > 0 ? (
                                <div className="space-y-4">
                                    {tracking.map((item, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                                                <h3 className="text-lg font-semibold text-gray-800">{item.status}</h3>
                                                <span className="text-sm text-gray-500">
                                                    {item.updated_at ? format(new Date(item.updated_at), "PPP p") : "-"}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 mb-1">
                                                <strong>Status Code:</strong> {item.status_code || "-"}
                                            </div>
                                            <div className="text-sm text-gray-600 mb-1">
                                                <strong>Remarks:</strong> {item.remarks || "-"}
                                            </div>
                                            {item.location && (
                                                <div className="text-sm text-gray-600 mb-1">
                                                    <strong>Location:</strong> {item.location}
                                                </div>
                                            )}
                                            {item.lsp_status && (
                                                <div className="text-sm text-gray-600">
                                                    <strong>LSP Status:</strong> {item.lsp_status}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No tracking history available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
