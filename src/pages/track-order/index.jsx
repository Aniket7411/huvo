import React from "react";

const OrderDetails = () => {
  const order = {
    orderId: "ORD12345",
    orderStatus: "Delivered",
    customer: {
      name: "Amit Sharma",
      email: "amit.sharma@example.com",
      phone: "+91 9876543210",
      address: "H.No 12, Sector 21, Kanpur, Uttar Pradesh",
    },
    products: [
      {
        id: 1,
        name: "Casual Shirt",
        size: "L",
        color: "Blue",
        price: "₹1299",
        quantity: 1,
        image: "https://via.placeholder.com/80",
      },
      {
        id: 2,
        name: "Slim Fit Jeans",
        size: "32",
        color: "Black",
        price: "₹2199",
        quantity: 2,
        image: "https://via.placeholder.com/80",
      },
    ],
  };

  return (
    <div className=" mx-auto mt-[55px] px-6">
      {/* Order Header */}
      <div className="mb-2 ">
        <h1 className="md:text-3xl text-lg font-bold text-gray-800">Order Details</h1>
        <p className="text-gray-600">Order ID: {order.orderId}</p>
      </div>

      {/* Order Status and Customer Details */}
      <div className="grid sm:grid-cols-2 gap-6 mb-2">
        {/* Order Status */}
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Status</h2>
          <p
            className={`text-lg font-medium ${
              order.orderStatus === "Delivered" ? "text-green-600" : "text-red-600"
            }`}
          >
            {order.orderStatus}
          </p>
        </div>

        {/* Customer Details */}
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Customer Details</h2>
          <p className="text-gray-700">
            <span className="font-medium">Name:</span> {order.customer.name}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Email:</span> {order.customer.email}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Phone:</span> {order.customer.phone}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Address:</span> {order.customer.address}
          </p>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-gray-100 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Products in Order</h2>
        <div className="space-y-4">
          {order.products.map((product) => (
            <div
              key={product.id}
              className="flex flex-wrap sm:flex-nowrap items-center justify-between bg-white p-4 rounded-lg shadow"
            >
              <div className="flex items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-md mr-4"
                />
                <div>
                  <p className="text-gray-800 font-medium">{product.name}</p>
                  <p className="text-gray-600 text-sm">
                    Size: {product.size}, Color: {product.color}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
                <p className="text-gray-800 font-medium">Price: {product.price}</p>
                <p className="text-gray-800">Quantity: {product.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
