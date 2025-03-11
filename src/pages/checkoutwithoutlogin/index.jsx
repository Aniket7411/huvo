import { useContext } from "react";
import { CartContext } from "../../usecontext1/cartcontext";

const CheckoutWithoutLogin = () => {
  const { cart, updateCartItem, removeCartItem } = useContext(CartContext);

  const handleIncreaseQuantity = (productId) => {
    updateCartItem(productId, "increment");
  };

  const handleDecreaseQuantity = (productId) => {
    updateCartItem(productId, "decrement");
  };

  const handleRemoveItem = (productId) => {
    removeCartItem(productId);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center mt-8">Checkout</h1>
      {cart.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((each) => (
            <div
              key={each.productId}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div className="mb-4">
                <img
                  src={each.bannerImage}
                  alt={each.productName || "Product"}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h2 className="text-lg font-semibold text-gray-800">
                  {each.productName || "Product Name"}
                </h2>
                <p className="text-sm text-gray-600">Quantity: {each.quantity}</p>
                <p className="text-sm text-gray-600">Size: {each.size || "N/A"}</p>
                <p className="text-sm text-gray-600">Color: {each.color || "N/A"}</p>
                <p className="text-sm text-gray-600">
                  Discount: {each.discount || "N/A"}
                </p>
                <p className="text-sm text-gray-600">Price: ${each.price || "N/A"}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDecreaseQuantity(each.productId)}
                    className="bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded-md hover:bg-gray-400 transition"
                  >
                    -
                  </button>
                  <span className="text-gray-800 font-semibold">
                    {each.quantity}
                  </span>
                  <button
                    onClick={() => handleIncreaseQuantity(each.productId)}
                    className="bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded-md hover:bg-gray-400 transition"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(each.productId)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckoutWithoutLogin;
