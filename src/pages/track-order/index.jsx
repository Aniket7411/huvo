import React, { useEffect, useState } from "react";
import { HttpClient } from "../../server/client/http";
import { useParams } from "react-router-dom";
import Loader from "../../components/loader";

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const { id } = useParams();

  const [trackingHistory, setTrackingHistory] = useState([])


  const getOrderDetails = async () => {
    setIsLoading(true)
    try {
      const response = await HttpClient.get(`/order/${id}`);

      console.log("vresponse", response?.data)

      const formattedData = response?.data.map((order) => ({
        orderId: order.orderId,
        orderStatus: order.orderStatus.map((status) => ({
          status: status.status,
          date: status.date,
        })),
        paymentType: order.paymentType,
        seller: order.seller,
        shippingDetails: {
          name: order.shippingDetails?.name,
          address: order.shippingDetails?.address,
          city: order.shippingDetails?.city,
          postalCode: order.shippingDetails?.postalCode,
          state: order.shippingDetails?.state,
          town: order.shippingDetails?.town,
          mobileNumber: order.shippingDetails?.mobileNumber,
        },
        products: order.product.map((product) => ({
          bannerImage: product.bannerImage,
          name: product.name,
          price: product.price,
          discountedPrice: product.discountedPrice,
          color: product.color,
          size: product.size,
          quantity: product.quantity,
        })),
        totalProduct: order.totalProduct,
        updatedAt: order.updatedAt,
        user: order.user,
        trackingHistory: order?.trackingOrder?.tracking_history

      }));


      setOrders(formattedData);
      console.log("formattedDataformattedDataformattedData", orders)

      setIsLoading(false)

    } catch (error) {
      console.error("Error fetching order details:", error);
      setIsLoading(false)

    }
  };

  useEffect(() => {
    getOrderDetails();
  }, []);

  return (
    <div className="mx-auto mt-4 px-6 ">
      <h1 className="text-2xl font-semibold text-center mb-2">Order Details</h1>

      {
        isLoading ? <div className="flex justify-center h-screen items-center">
          <Loader />

        </div> : <>


          {orders.length > 0 ? (
            orders.map((order, orderIndex) => (
              <div key={orderIndex} className="border rounded-lg shadow-lg p-4 mb-6 bg-white">

                <div className="flex flex-wrap justify-between">


                  <div className="mb-1">
                    <h3 className="text-md font-bold mb-2">Shipping Details:</h3>
                    <p>{order.shippingDetails.name}</p>
                    <p>{order.shippingDetails.address}</p>
                    <p>{order.shippingDetails.city}, {order.shippingDetails.state}</p>
                    <p>{order.shippingDetails.postalCode}</p>
                    <p>{order.shippingDetails.mobileNumber}</p>
                  </div>

                  <div className="mb-1">
                    <h2 className="text-lg font-bold">Order ID: {order.orderId}</h2>
                    <p className="text-sm text-gray-600">

                    </p>
                    <p className="text-sm text-gray-600">Payment Type: {order.paymentType}</p>
                    <p className="text-sm text-gray-600">Seller ID: {order.seller}</p>
                  </div>

                </div>

                <div className="mb-2">
                  <h3 className="text-md font-bold mb-2">Products Detail:</h3>
                  {order.products.map((product, productIndex) => (
                    <div key={productIndex} className="flex items-start gap-4 mb-4 border-b pb-4">
                      <img
                        src={product.bannerImage}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div>
                        <h4 className="text-sm font-bold">{product.name}</h4>
                        <p className="text-sm text-gray-600">Color: {product.color}</p>
                        <p className="text-sm text-gray-600">Size: {product.size}</p>
                        <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                        <p className="text-sm text-gray-600">Price: ₹{product.price}</p>
                        <p className="text-sm text-green-600">
                          Discounted Price: ₹{product.discountedPrice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>


                {order?.trackingHistory?.map((history, index) => (
                  <div key={history._id} className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Status: {history.status || "N/A"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Status Code: {history.status_code || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      LSP Status: {history.lsp_status || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Remarks: {history.remarks || "No remarks available"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Location: {history.location || "Not provided"}
                    </p>
                  </div>
                ))}


                <div>
                  <p className="text-sm text-gray-600">
                    Total Products: {order.totalProduct}
                  </p>
                  <p className="text-sm text-gray-600">
                    Updated At: {new Date(order.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No orders found.</p>
          )}

        </>
      }


    </div>
  );
};

export default OrderDetails;
