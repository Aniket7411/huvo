import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { format } from "date-fns";
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiDollarSign } from "react-icons/fi";

const OrderTracking = () => {
    const location = useLocation();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const match = location.pathname.match(/tracking_order\/([^/]+)\/([^/]+)/);
    const orderId = match ? match[1] : null;
    const productId = match ? match[2] : null;

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
                    orderId, productId
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

    const getStatusColor = (status) => {
        switch (status) {
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

    const getStatusIcon = (status) => {
        switch (status) {
            case "DELIVERED":
                return <FiCheckCircle className="text-green-500" />;
            case "CANCELLED":
                return <FiXCircle className="text-red-500" />;
            case "IN_TRANSIT":
                return <FiTruck className="text-blue-500" />;
            case "OUT_FOR_DELIVERY":
                return <FiTruck className="text-purple-500" />;
            default:
                return <FiClock className="text-gray-500" />;
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center -mt-[15px] bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-lg font-medium text-gray-700">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen -mt-[20px] flex items-center justify-center bg-gray-50">
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
                    <p className="text-lg font-medium text-gray-700">No order data found</p>
                </div>
            </div>
        );
    }

    const order = orderData.data?.[0];
    const product = order?.product?.[0];
    const tracking = order?.trackingOrder?.tracking_history?.[0];
    const shipping = order?.postShipping;

    return (
        <div className="min-h-screen -mt-[20px] bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Order Tracking</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Summary Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 col-span-1">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>

                        <div className="flex items-start mb-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden mr-4">
                                {product?.bannerImage && (
                                    <img
                                        src={product.bannerImage}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800">{product?.name}</h3>
                                <p className="text-sm text-gray-600">Size: {product?.size}</p>
                                <p className="text-sm text-gray-600">Color: <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: product?.color }}></span></p>
                                <p className="text-sm text-gray-600">Qty: {product?.quantity}</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Order ID:</span>
                                <span className="font-medium">{orderId}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Product ID:</span>
                                <span className="font-medium">{productId}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Order Date:</span>
                                <span className="font-medium">{formatDate(order?.orderStatus?.[0]?.date)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tracking Information */}
                    <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tracking Information</h2>

                        {shipping && (
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-700 mb-2">Shipping Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Courier</p>
                                        <p className="font-medium">{shipping.courier}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Airway Bill No</p>
                                        <p className="font-medium">{shipping.airwaybilno}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Service Type</p>
                                        <p className="font-medium">{shipping.service_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Routing Code</p>
                                        <p className="font-medium">{shipping.routing_code}</p>
                                    </div>
                                </div>
                                {shipping.dispatch_label && (
                                    <a
                                        href={shipping.dispatch_label}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                                    >
                                        Download Shipping Label
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Status Timeline */}
                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">Status Timeline</h3>
                            <div className="space-y-4">
                                {order?.orderStatus?.map((statusItem, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="mr-3 mt-1">
                                            {getStatusIcon(statusItem.status)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(statusItem.status)}`}>
                                                    {statusItem.status.replace(/_/g, ' ')}
                                                </span>
                                                <span className="text-xs text-gray-500">{formatDate(statusItem.date)}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {statusItem.status === "placed" && "Your order has been placed"}
                                                {statusItem.status === "confirmed" && "Seller has confirmed your order"}
                                                {statusItem.status === "shipped" && "Your order has been shipped"}
                                                {statusItem.status === "delivered" && "Your order has been delivered"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <FiDollarSign className="text-blue-500 mr-2" />
                                <h3 className="font-medium text-gray-700">Product Price</h3>
                            </div>
                            <p className="text-2xl font-bold">₹{product?.price?.toFixed(2)}</p>
                        </div>
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <FiDollarSign className="text-green-500 mr-2" />
                                <h3 className="font-medium text-gray-700">Discount</h3>
                            </div>
                            <p className="text-2xl font-bold text-green-600">-₹{product?.discount?.toFixed(2)}</p>
                        </div>
                        <div className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center mb-2">
                                <FiDollarSign className="text-purple-500 mr-2" />
                                <h3 className="font-medium text-gray-700">Final Amount</h3>
                            </div>
                            <p className="text-2xl font-bold">₹{orderData.amount?.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;