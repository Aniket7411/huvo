const order = {
    orderStatus: [
      { status: "Pending" },
      { status: "Confirmed" },
      { status: "Shipped" },
    ], // Current status is "Shipped", meaning "Out for delivery" and "Delivered" are yet to be reached.
  };

const CancelSection = () => <div className="p-8">
    <h1 className="text-lg font-bold font-sans">Cancellation Request</h1>
    <p>Order id :</p>

    <div className="w-full px-10 py-6">
      <ol className="flex items-center w-full mb-5">
        {["Pending", "Confirmed", "Shipped", "Out for delivery", "Delivered"].map(
          (item, i) => {
            const found = order.orderStatus.find((val) => val.status === item);

            return (
              <li
                className={`w-full ${i === 0 ? "" : "text-center"} ${
                  i === 4 ? "text-end" : ""
                }`}
                key={i}
              >
                <p className="text-gray-700">{item}</p>
                <p
                  className={`mt-3 flex w-full items-center text-blue-600 dark:text-blue-500 ${
                    i !== 4
                      ? `after:content-[''] after:w-full after:h-1 ${
                          found ? "after:bg-[#011F4B]" : "after:bg-gray-300"
                        }`
                      : ""
                  } ${
                    i !== 0
                      ? `before:content-[''] before:w-full before:h-1 ${
                          found ? "before:bg-[#011F4B]" : "before:bg-gray-300"
                        }`
                      : ""
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-full lg:w-10 lg:h-10 shrink-0 ${
                      found ? "bg-[#011F4B]" : "bg-gray-300"
                    }`}
                  ></span>
                </p>
              </li>
            );
          }
        )}
      </ol>
    </div>

    <div className="outline mt-3 rounded-md p-2 overflow-auto">
        <div className="flex justify-between ">
            <p>Items List</p>
            <p>Select All</p>
        </div>
        <hr className="m-2" />
        <div className="container mx-auto p-2">
            <table className="min-w-full table-auto">
                <thead>
                    <tr className="text-left bg-gray-200">
                        <th className="py-2 px-4">Select</th>
                        <th className="py-2 px-4">Product Name</th>
                        <th className="py-2 px-4">Quantity</th>
                        <th className="py-2 px-4">Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b">
                        <td className="py-2 px-4">
                            <input type="checkbox" />
                        </td>
                        <td className="py-2 px-4">Jeans</td>

                        <td className="py-2 px-4">5</td>
                        <td className="py-2 px-4">
                            <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded">
                                Delete
                            </button>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>

    </div>
    <div className="container mx-auto p-4">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Cancellation reason (Optional)
        </label>
        <textarea
            id="message"
            name="message"
            rows="4"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Write your reason here..."
        ></textarea>
    </div>
    <div className="flex justify-center w-auto">
        <div className="text-left w-[500px] p-4 bg-white border border-gray-200 rounded-lg shadow-md">
            <h1 className="text-lg font-bold mb-4 text-blue-700">Price Details</h1>
            <div className="text-gray-600 space-y-2">
                <p className="flex justify-between">
                    <span>Total MRP:</span>
                    <span>₹5,000</span>
                </p>
                <p className="flex justify-between">
                    <span>Discount on MRP:</span>
                    <span>- ₹500</span>
                </p>
                <p className="flex justify-between">
                    <span>Coupon Discount:</span>
                    <span>- ₹200</span>
                </p>
                <p className="flex justify-between">
                    <span>Platform Fee:</span>
                    <span>₹50</span>
                </p>
                <p className="flex justify-between">
                    <span>Shipping Fee:</span>
                    <span>₹100</span>
                </p>
            </div>

            <h1 className="text-lg font-bold mt-6 text-green-700">Total Amount Paid</h1>
            <p className="text-gray-600 mb-4">₹4,450</p>

            <div className="text-gray-600 space-y-2">
                <p className="flex justify-between">
                    <span>Refund Request:</span>
                    <span>₹500</span>
                </p>
                <p className="flex justify-between">
                    <span>Cancel Charges:</span>
                    <span>- ₹100</span>
                </p>
            </div>

            <h1 className="text-lg font-bold mt-6 text-red-700">Refund Amount</h1>
            <p className="text-gray-600">₹400</p>
        </div>
    </div>


</div>








export default CancelSection