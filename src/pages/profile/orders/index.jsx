import { PiCurrencyInr } from "react-icons/pi";
import IndiaTime from "../../../components/getIndiaTime";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { HttpClient } from "../../../server/client/http";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isOpenOrderDetails, setIsOpenOrderDetails] = useState(false);

  const fetchAllOrders = async () => {
    try {
      const { data } = await HttpClient.get("/order");
      const formattedData = data.map((order) => ({
        createdAt: order?.createdAt,
        orderId: order?.orderId,
        productId: order?.product[0].productId,
        paymentType: order?.paymentType,
        totalProduct: order?.totalProduct,
        user: order?.user,
        updatedAt: order?.updatedAt,
        bannerImage: order?.product[0]?.bannerImage,
        color: order?.product[0]?.color,
        discountedPrice: order?.product[0]?.discountedPrice,
        name: order?.product[0]?.name,
        size: order?.product[0]?.size,
        city: order?.shippingDetails[0]?.city,
      }));

      setAllOrders(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch orders.");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const openOrderDetails = (order) => {
    setOrderDetails(order);
    setIsOpenOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setOrderDetails(null);
    setIsOpenOrderDetails(false);
  };

  return (
    <div className="p-2 md:p-5 ">
      <div className="border-b border-gray-300 pb-4 mb-6">
        <h1 className="md:text-xl text-lg font-semibold text-gray-800">Orders & Returns</h1>
      </div>

      <div className="flex flex-col space-y-4">
        {allOrders?.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-start md:items-center border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-200"
          >
            <img
              src={item?.bannerImage || "/placeholder.png"}
              alt={item?.name || "Product Image"}
              className="w-full md:w-32 h-32 object-cover rounded-lg mb-4 md:mb-0 md:mr-4"
            />

            <div className="flex-1">
              <h2 className="text-lg font-medium text-gray-800">{item?.name}</h2>
              <p className="text-sm text-gray-600">
                Color: <span className="text-gray-800">{item?.color}</span>
              </p>
              <p className="text-sm text-gray-600">
                Size: <span className="text-gray-800">{item?.size}</span>
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                Price: <PiCurrencyInr className="mx-1" />{" "}
                <span className="text-gray-800">{item?.discountedPrice}</span>
              </p>
            
              <p className="text-sm text-gray-600">
                Total Products: <span className="text-gray-800">{item?.totalProduct}</span>
              </p>

              <Link to={`/product-details/${item?.productId}`}>
              <button
                className="text-sm text-blue-500 mt-2"
                onClick={() => openOrderDetails(item)}
              >
                View Details
              </button>
              </Link>
              
            </div>

            <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Cancel
              </button>
              <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                Return
              </button>
            </div>
          </div>
        ))}
      </div>

      {isOpenOrderDetails && (
        <Modal
          title="Order Details"
          visible={isOpenOrderDetails}
          onCancel={closeOrderDetails}
          footer={null}
        >
          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-medium text-gray-800">
              Order ID: {orderDetails?.orderId}
            </h2>
            <p>
              <strong>Payment Type:</strong> {orderDetails?.paymentType}
            </p>
            <p>
              <strong>Total Products:</strong> {orderDetails?.totalProduct}
            </p>
            <p>
              <strong>City:</strong> {orderDetails?.city}
            </p>
            <p>
              <strong>Updated At:</strong> {IndiaTime(orderDetails?.updatedAt)}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Orders;
