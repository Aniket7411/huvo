import { PiCurrencyInr } from "react-icons/pi";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { HttpClient } from "../../../server/client/http";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import LoadSpinner from "../../../components/LoadSpinner";
import Loader from "../../../components/loader";
import ProductReview from "../../newproduct";
import OrderStatusTracker from "./orderstatuses";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isOpenOrderDetails, setIsOpenOrderDetails] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [currentproductId, setCurrentProductId] = useState(null);

  const [cancelReason, setCancelReason] = useState("");
  const [returnReason, setReturnReason] = useState("");


  const timelineStages = ['Pending', 'Confirmed', 'Dispatched', 'Out for delivery', 'Delivered'];



  const [isLoading, setIsLoading] = useState(false)

  const fetchAllOrders = async () => {
    try {
      setIsLoading(true)
      const { data } = await HttpClient.get("/order");

      console.log("dataa", data)
      const formattedData = data.filter(order => Object.keys(order?.orderStatus || {}).length > 1).map(order => ({
          createdAt: order?.createdAt,
          orderId: order?.orderId,
          productId: order?.product[0]?.productId,
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
          orderStatus: order?.orderStatus[0]?.status,
          orderStatusUpdatedDate: order?.orderStatus[0]?.date,
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

  const showCancelModal = (orderId, productId) => {
    console.log(orderId)
    setCurrentProductId(productId)
    setCurrentOrder(orderId);
    setIsCancelModalOpen(true);
  };

  const handleCancel = async () => {

    console.log("currentOrder", currentOrder)
    if (cancelReason === "") {
      toast.info("Please select Reason")
    }
    else {
      try {
        //debugger
        const response = await HttpClient.post(
          `order/cancel/${currentOrder}`,
          { cancellationReason: cancelReason, productId: currentproductId }
        );
        toast.success(response?.message)
      } catch (error) {
        if (error?.response?.status === 400) {
          toast.error(error?.response?.data?.message)
        }
      }
    }

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


  console.log("allOrdersallOrdersallOrders", allOrders)
  return (
    <div className="min-h-screen  md:p-8">
      {
        isLoading ? <div className="flex justify-center h-screen items-center">
          <Loader />
        </div> : <>  <div className="mx-auto">
          <div className="border-b border-blue-200 pb-4 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-800">Orders & Returns</h1>
          </div>

          <div className="space-y-6">
            {allOrders?.length > 0 ? (
              allOrders.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-blue-100"
                >
                  {/* Product Image */}
                  <div className="md:w-1/4 p-4 flex justify-center items-center bg-blue-50">
                    <img
                      src={item?.bannerImage || "/placeholder.png"}
                      alt={item?.name || "Product Image"}
                      className="w-full h-48 md:h-40 object-contain rounded-lg hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 p-4 md:p-6 border-b md:border-b-0 md:border-r border-dashed border-blue-200">
                    <h2 className="text-xl font-bold text-blue-900 mb-3 truncate">{item?.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center">
                        <span className="font-medium text-blue-800 min-w-[70px]">Color:</span>
                        <span className="ml-2 text-gray-700">{item?.color}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-blue-800 min-w-[70px]">Size:</span>
                        <span className="ml-2 text-gray-700">{item?.size}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-blue-800 min-w-[70px]">Price:</span>
                        <span className="ml-2 text-gray-700 flex items-center">
                          <PiCurrencyInr className="mr-1" />
                          {item?.price}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-blue-800 min-w-[70px]">Qty:</span>
                        <span className="ml-2 text-gray-700">{item?.quantity}</span>
                      </div>
                    </div>
                    <OrderStatusTracker orderStatuses={item?.orderStatuses} />
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 flex flex-col justify-center space-y-3 md:w-52 bg-blue-50">
                    <Link
                      to={`/tracking_order/${item?.orderId}/${item?.productId}`}
                      className="w-full"
                    >
                      <button
                        className="w-auto px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                      >

                        Track Order
                      </button>
                    </Link>

                    <button
                      onClick={() => showReturnModal(item?.orderId)}
                      className="w-auto px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                    >

                      Return
                    </button>

                    <button
                      onClick={() => showCancelModal(item?.orderId, item?.productId)}
                      className="w-auto px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                    >

                      Cancel
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-xl shadow-sm border border-blue-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Placed Yet</h3>
                <p className="text-gray-500 text-center max-w-md">
                  You haven't placed any orders yet. Start shopping to see your orders here!
                </p>
                <Link
                  to="/"
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Browse Products
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {allOrders?.map((item, index) => {

              return (
                <div
                  key={index}
                  className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-blue-100"
                >
                  {/* Product Image */}
                  <div className="md:w-1/4 p-2 flex justify-center">
                    <img
                      src={item?.bannerImage || "/placeholder.png"}
                      alt={item?.name || "Product Image"}
                      className="w-full h-48 md:h-40 object-contain rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 p-2 md:p-3 border-b md:border-b-0 md:border-r border-dashed border-blue-200">
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
                        {item?.price}
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
                    <OrderStatusTracker orderStatuses={item?.orderStatuses} />




                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 flex flex-col justify-center space-y-3 md:w-48">
                    {/* <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-md">
                    Track Order
                  </button> */}
                    <button
                      onClick={() => showCancelModal(item?.orderId, item?.productId)}
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
                    <Link to={`/tracking_order/${item?.orderId}/${item?.productId}`}>
                      <button
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-700 text-white rounded-lg hover:from-amber-600 hover:to-amber-800 transition-all shadow-md"
                      >
                        Track Order
                      </button>
                    </Link>


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