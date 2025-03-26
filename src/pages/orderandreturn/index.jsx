import { useEffect } from "react";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";

const OrderAndReturn = () => {
    const fetchAllOrders = async () => {
        try {
            const response = await HttpClient.get("/order");
            console.log("Fetched Orders:", response.data.product); // Handle response data as needed

           const formattedData = response.data.product.map((product) => ({
            orderId :  product.orderId,
            orderStatus: product.orderStatus[0].status,
            createdAt : product.createdAt,
            paymentType : product.paymentType,

           }))
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error(error?.response?.data?.message || "An error occurred while fetching orders");
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    return (
        <div>
            <h1>Order and Return</h1>
            <h1>Order and Return</h1>




            <h1>Order and Return</h1>

            <h1>Order and Return</h1>
            <h1>Order and Return</h1>

            <h1>Order and Return</h1>

            <h1>Order and Return</h1>

            <h1>Order and Return</h1>
            <h1>Order and Return</h1>

            <h1>Order and Return</h1>


        </div>
    );
};

export default OrderAndReturn;
