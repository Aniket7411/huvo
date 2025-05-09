import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { HttpClient } from "../../server/client/http";

const OrderTracking = () => {
    const location = useLocation();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Extract `orderId` from query params
    const searchParams = new URLSearchParams(location.search);
    // const orderId = searchParams.get("orderId");
    const orderId = "mMwk1mihJP3VBo8ST9BMs";


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
                setOrderData(response.data.data);
            } catch {
                setOrderData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Track Your Order</h1>

            {loading && (
                <div className="flex items-center justify-center h-16 w-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent">
                    <span className="sr-only">Loading...</span>
                </div>
            )}

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-md mt-4 max-w-md">
                    {error}
                </div>
            )}

            {orderData && !loading && (
                <div className="bg-white p-6 shadow-md rounded-md mt-4 w-full max-w-md">
                    <h2 className="text-lg font-semibold mb-2">Order Details:</h2>
                    <p><strong>Airway Bill No:</strong> {orderData?.airwaybilno || "N/A"}</p>
                    <p><strong>Order No:</strong> {orderData?.orderno || "N/A"}</p>
                    <p><strong>Order Type:</strong> {orderData?.ordertype || "N/A"}</p>
                    <p><strong>Latest Status:</strong> {orderData?.latest_status || "N/A"}</p>
                    <p><strong>Latest Status Code:</strong> {orderData?.latest_status_code || "N/A"}</p>
                    <p><strong>Expected Delivery:</strong> {orderData?.exp_delivery || "N/A"}</p>

                    <h3 className="font-semibold mt-4">Tracking History:</h3>
                    {orderData?.tracking_history?.length > 0 ? (
                        orderData?.tracking_history?.map((item: any) => (
                            <div key={item?._id} className="mt-2 p-2 border border-gray-200 rounded-md">
                                <p><strong>Status:</strong> {item?.status || "N/A"}</p>
                                <p><strong>Status Code:</strong> {item?.status_code || "N/A"}</p>
                                <p><strong>LSP Status:</strong> {item?.lsp_status || "N/A"}</p>
                                <p><strong>Remarks:</strong> {item?.remarks || "N/A"}</p>
                            </div>
                        ))
                    ) : (
                        <p>No tracking history available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
