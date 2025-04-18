import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HttpClient } from "../../server/client/http";
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { PiCurrencyInr } from "react-icons/pi";
import { CiDiscount1, CiDeliveryTruck } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";
import Loader from "../../components/loader"; // Import the Loader component

export default function WishList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status

  const fetchWishlist = async () => {
    setIsLoading(true); // Start loading
    try {
      const { data } = await HttpClient.get("/wishlist");

      console.log("formattedDat", data)
      const formattedData = data.map((item) => ({
        bannerImage: item.bannerImage || "https://via.placeholder.com/300",
        color: item.color,
        discount: item.discount,
        quantity: item.quantity,
        size: item.size,
        name: item.name,
        price: item.price,
        productId: item.productId,
        objectID: item._id,
      }));
      setProducts(formattedData);

      console.log("formattedDatawishlist", formattedData)
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to fetch wishlist");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const removeProductFromWishlist = async (productId) => {
    try {
      const { message } = await HttpClient.delete(`/wishlist/${productId}`);
      toast.success(message);
      window.location.reload();
      fetchWishlist();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to remove product");
    }
  };

  const moveToCart = async (productId) => {
    try {
      const { message } = await HttpClient.put("/wishlist/addToBag", { productId });

      console.log("messagemessage", message)
      toast.success(message);
      fetchWishlist();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to move product to cart");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6 font-[Quicksand]">
      {isLoading ? ( // Show loader if data is being fetched
        <div className="flex items-center justify-center h-[60vh]">
          <Loader />
        </div>
      ) : products.length ? ( // Show wishlist if data is loaded
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#282c3f] mb-6">
            My Wishlist{" "}
            <span className="font-normal">({products.length} items)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.objectID}
                className="bg-white flex flex-col items-center rounded-2xl p-3 shadow-lg border border-gray-200 w-full hover:shadow-xl transition-shadow duration-300"
              >
                {/* Remove from Wishlist Button */}
                <button
                  className="self-end p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => removeProductFromWishlist(product.objectID)}
                  aria-label="Remove from wishlist"
                >
                  <RxCross2 className="text-lg" />
                </button>

                {/* Product Image */}
                <img
                  src={product.bannerImage}
                  alt={product.name}
                  className="h-40 w-40 object-cover rounded-md mb-2"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300";
                  }}
                />

                {/* Product Name */}
                <h1 className="text-black font-bold text-xl mb-2 text-center">
                  {product.name}
                </h1>

                {/* Rating and Orders */}
                <div className="flex items-center gap-4 text-gray-700 mb-2">
                  <p className="flex items-center text-sm font-semibold">
                    <span className="text-yellow-500 mr-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                      </svg>
                    </span>
                    Rating: 4.5 / 5
                  </p>
                </div>

                {/* Price Details */}
                <div className="flex justify-between w-full items-center mb-1">
                  {/* Original Price */}
                  <div className="flex items-center gap-1">
                    <PiCurrencyInr className="text-red-600" />
                    <p className="line-through text-red-600 font-semibold">
                      {product.price}
                    </p>
                  </div>

                  {/* Discount Price */}
                  <div className="flex items-center gap-1">
                    <CiDiscount1 className="text-green-600" />
                    <PiCurrencyInr className="text-green-600" />
                    <p className="font-semibold text-green-600">
                      {product.discount}
                    </p>
                  </div>
                </div>

                {/* Final Price and Delivery */}
                <div className="flex justify-between items-center w-full mb-2">
                  <div className="flex items-center text-green-600 gap-1">
                    <PiCurrencyInr />
                    <p className="font-semibold">
                      {product.price - product.discount} /-
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <CiDeliveryTruck />
                    {/* <p className="font-semibold items-end">Free delivery</p> */}
                  </div>
                </div>

                {/* Move to Cart Button */}

                <Link to={`/product-details/${product.productId}`}>
                <button
                    className="flex items-center justify-center bg-[#011F4B] text-white px-3 py-2 rounded-lg text-md hover:bg-[#02386e] transition-colors duration-200 w-full"
                    aria-label="Product details"
                  >
                      Product Details
                    <FaArrowRight className="ml-2" />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : ( // Show empty state if no products are found
        <div className="flex flex-col items-center justify-center text-center py-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            YOUR WISHLIST IS EMPTY
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Add items that you like to your wishlist.
          </p>
          <img
            className="h-[150px] sm:h-[200px] my-4"
            src="./assets/wishlistEmpty.png"
            alt="wishlistEmpty"
          />
          <Link
            to="/"
            className="py-2 sm:py-3 px-6 sm:px-8 text-sm sm:text-base font-semibold text-white bg-[#011F4B] rounded hover:bg-blue-700 transition"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      )}
    </section>
  );
}