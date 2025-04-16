import { PiCurrencyInr } from "react-icons/pi";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { HttpClient } from "../../../server/client/http";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import LoadSpinner from "../../../components/LoadSpinner";
import Loader from "../../../components/loader";
import ProductReview from "../../newproduct";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isOpenOrderDetails, setIsOpenOrderDetails] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [returnReason, setReturnReason] = useState("");


  const timelineStages = ['Pending', 'Confirmed', 'Dispatched', 'Out for delivery', 'Delivered'];



  const [isLoading, setIsLoading] = useState(false)

  const fetchAllOrders = async () => {
    try {
      setIsLoading(true)
      const { data } = await HttpClient.get("/order");

      console.log("dataa", data)
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


        orderStatuses: order?.orderStatus,
        price: order?.product[0]?.price,
        discount: order?.product[0]?.discount,
        quantity: order?.product[0]?.quantity,
        orderStatus: order?.orderStatus[0].status,
        orderStatusUpdatedDate: order?.orderStatus[0].date,
      }));

      setAllOrders(formattedData);
      setIsLoading(false)


      console.log("allOrders", formattedData)
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

  const showCancelModal = (orderId) => {
    console.log(orderId)
    setCurrentOrder(orderId);
    setIsCancelModalOpen(true);
  };

  const handleCancel = async () => {
    if (cancelReason === "") {
      toast.info("Please select Reason")
    }
    else {
      try {
        const response = await HttpClient.post(
          `order/cancel/${currentOrder}`,
          { cancellationReason: cancelReason }
        );
        toast.success(response?.message)
      } catch (error) {
        toast.error(error?.message)


      }
    }
    toast.success(`Order #${currentOrder} cancellation requested`);
    toast.info(cancelReason)

    setIsCancelModalOpen(false);
    setCancelReason("");
  };

  const showReturnModal = (productId) => {
    setCurrentOrder(productId);
    setIsReturnModalOpen(true);
  };

  const handleReturn = () => {
    // Add your return logic here
    toast.success(`Return requested for order #${currentOrder}`);
    toast.info(returnReason)
    setIsReturnModalOpen(false);
    setReturnReason("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white md:p-8">
      {
        isLoading ? <div className="flex justify-center h-screen items-center">
          <Loader />
        </div> : <>  <div className="mx-auto">
          <div className="border-b border-blue-200 pb-4 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-800">Orders & Returns</h1>
          </div>

          <div className="space-y-6">
            {allOrders?.map((item, index) => {

              return (
                <div
                  key={index}
                  className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-blue-100"
                >
                  {/* Product Image */}
                  <div className="md:w-1/4 p-4 flex justify-center">
                    <img
                      src={item?.bannerImage || "/placeholder.png"}
                      alt={item?.name || "Product Image"}
                      className="w-full h-48 md:h-40 object-contain rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 p-4 md:p-6 border-b md:border-b-0 md:border-r border-dashed border-blue-200">
                    <h2 className="text-xl font-bold text-blue-900 mb-2">{item?.name}</h2>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-blue-800">Color:</span> {item?.color}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-blue-800">Size:</span> {item?.size}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="font-medium text-blue-800">Final Price:</span>
                        <PiCurrencyInr className="mx-1" />
                        {item?.price - item?.discount}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-blue-800">Qty:</span> {item?.quantity}
                      </p>
                    </div>
                    {/* 
                  <Link to={`/product-details/${item?.productId}`}>
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                      onClick={() => openOrderDetails(item)}
                    >
                      View Details
                    </button>
                  </Link> */}

                    {/* Order Status Timeline */}
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-blue-700 mb-3">ORDER STATUS</h3>
                      <div className="flex flex-col md:flex-row items-center justify-between relative">
                        {/* Connector Line */}
                        <div className="absolute top-4 left-0 right-0 h-0.5 border-t-2 border-dashed border-blue-300 hidden md:block"></div>

                        {timelineStages.map((stage, idx) => {
                          // Find if the current stage exists in the orderStatuses
                          const statusObj = item?.orderStatuses.find(s => s.status.toLowerCase() === stage.toLowerCase());
                          const isCompleted = Boolean(statusObj);
                          const isCurrent = item?.orderStatuses[item?.orderStatuses.length - 1]?.status.toLowerCase() === stage.toLowerCase();

                          return (
                            <div key={idx} className="relative flex flex-col items-center z-10 bg-white px-2">
                              {/* Step Circle */}
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center 
              ${isCompleted ? 'bg-blue-600' : 'bg-gray-300'}`}
                              >
                                <span className={`text-xs ${isCompleted ? 'text-white' : 'text-gray-600'}`}>{idx + 1}</span>
                              </div>
                              {/* Status Date */}
                              <p className="text-xs text-gray-600 mt-1">
                                {statusObj ? new Date(statusObj.date).toLocaleDateString('en-GB') : '—'}
                              </p>
                              {/* Status Label */}
                              <p className={`text-xs font-medium mt-1 text-center 
            ${isCompleted ? 'text-blue-900' : 'text-gray-500'}`}>
                                {stage}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>


                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 flex flex-col justify-center space-y-3 md:w-48">
                    {/* <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-md">
                    Track Order
                  </button> */}
                    <button
                      onClick={() => showCancelModal(item?.orderId)}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg hover:from-red-600 hover:to-red-800 transition-all shadow-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => showReturnModal(item?.orderId)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-700 text-white rounded-lg hover:from-amber-600 hover:to-amber-800 transition-all shadow-md"
                    >
                      Return
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

          {/* Cancel Order Modal */}
          <Modal
            title="Cancel Order"
            open={isCancelModalOpen}
            onOk={handleCancel}
            onCancel={() => setIsCancelModalOpen(false)}
            okText="Confirm Cancellation"
            okButtonProps={{ className: "bg-red-500 hover:bg-red-600" }}
            cancelButtonProps={{ className: "hover:bg-gray-100" }}
          >
            <div className="my-4">
              <p className="mb-2">Are you sure you want to cancel order #{currentOrder}?</p>
              <p className="mb-4 text-gray-600">This action cannot be undone.</p>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Reason for cancellation:</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                >
                  <option value="" disabled>
                    Please select a reason for cancellation
                  </option>
                  <option value="Changed my mind">Changed my mind</option>
                  <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                  <option value="Order placed by mistake">Order placed by mistake</option>
                  <option value="Item won't arrive on time">Item won't arrive on time</option>
                  <option value="Other">Other</option>
                </select>

              </div>
            </div>
          </Modal>

          {/* Return Order Modal */}
          <Modal
            title="Request Return"
            open={isReturnModalOpen}
            onOk={handleReturn}
            onCancel={() => setIsReturnModalOpen(false)}
            okText="Submit Return Request"
            okButtonProps={{ className: "bg-amber-500 hover:bg-amber-600" }}
            cancelButtonProps={{ className: "hover:bg-gray-100" }}
          >
            <div className="my-4">
              <p className="mb-2">Requesting return for order #{currentOrder}</p>
              <p className="mb-4 text-gray-600">Please provide details about your return request.</p>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Reason for return:</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                >
                  <option value="">Select a reason</option>
                  <option value="wrong-item">Wrong item received</option>
                  <option value="damaged">Item arrived damaged</option>
                  <option value="not-as-described">Not as described</option>
                  <option value="changed-mind">Changed my mind</option>
                  <option value="other">Other</option>
                </select>
                {returnReason === "other" && (
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Please specify the reason"
                  />
                )}
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-700">Note: Return requests must be submitted within 7 days of delivery.</p>
              </div>
            </div>
          </Modal>

          {/* Order Details Modal */}
          <Modal
            title="Order Details"
            open={isOpenOrderDetails}
            onCancel={closeOrderDetails}
            footer={null}
            width={800}
          >
            {orderDetails && (
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-blue-800">Product Information</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {orderDetails.name}</p>
                      <p><span className="font-medium">Color:</span> {orderDetails.color}</p>
                      <p><span className="font-medium">Size:</span> {orderDetails.size}</p>
                      <p className="flex items-center">
                        <span className="font-medium">Price:</span>
                        <PiCurrencyInr className="mx-1" />
                        {orderDetails.discountedPrice}
                      </p>
                      <p><span className="font-medium">Quantity:</span> {orderDetails.totalProduct}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-blue-800">Shipping Information</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">City:</span> {orderDetails.city}</p>
                      <p><span className="font-medium">Order ID:</span> {orderDetails.orderId}</p>
                      <p><span className="font-medium">Payment Method:</span> {orderDetails.paymentType}</p>
                      <p><span className="font-medium">Order Date:</span> {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <img
                    src={orderDetails.bannerImage}
                    alt={orderDetails.name}
                    className="w-full max-h-64 object-contain rounded-lg"
                  />
                </div>
              </div>
            )}
          </Modal>



        </>
      }


    </div>
  );
};

export default Orders;