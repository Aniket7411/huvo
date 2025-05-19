import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HttpClient } from "../../server/client/http";
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { PiCurrencyInr } from "react-icons/pi";
import { CiDiscount1, CiDeliveryTruck } from "react-icons/ci";
import { FaArrowRight, FaStar } from "react-icons/fa";
import Loader from "../../components/loader"; // Import the Loader component
import ProductsShowingComponent from "../filterproductComponent";
import { MdDelete } from "react-icons/md";

export default function WishList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status

  const fetchWishlist = async () => {
    setIsLoading(true); // Start loading
    try {
      const { data } = await HttpClient.get("/wishlist");

      console.log("formattedDatsssssss", data)
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

      console.log("formattedDatawishlist", products)
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to fetch wishlist");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const removeProductFromWishlist = async (productId) => {

    console.log("jjjjj", productId)
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
    <section className="px-4 sm:px-6 lg:px-8 py-4 font-[Quicksand]">
      {isLoading ? ( // Show loader if data is being fetched
        <div className="flex items-center justify-center h-[60vh]">
          <Loader />
        </div>
      ) : products.length ? ( // Show wishlist if data is loaded
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#282c3f] mb-2">
            My Wishlist{" "}
            <span className="font-normal">({products.length} items)</span>
          </h2>


          {/* small screen */}

          <div className="flex md:hidden flex-wrap  items-center gap-1">

            {
              products && products.length > 0 ? (
                products.map((eachProduct, i) => (
                  <div key={i} className="w-[49%] bg-[#fff] py-2 rounded-lg flex flex-col shadow-md ">
                    <img
                      src={eachProduct?.bannerImage || "https://via.placeholder.com/300"}
                      alt={eachProduct?.name || "Product Image"}
                      className="h-[150px] object-cover"
                      loading="lazy"
                    />
                    <div className="px-3">
                      <h1 className="text-[blue] font-semibold text-sm mt-2 line-clamp-2 mb-1">
                        {eachProduct?.name ? eachProduct.name.slice(0, 15) : "Product Name"}
                      </h1>
                      {/* Stars */}
                      <div className="flex items-center gap-2 text-gray-700 text-sm mb-2">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, index) => (
                            <FaStar key={index} className="w-4 h-4" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">(New)</span>
                      </div>
                      {/* Pricing */}
                      <div className="flex gap-3 items-center text-sm mb-1">
                        <p className=" font-medium ">{eachProduct?.size || "N/A"}</p>
                        <div className="flex items-center gap-1 text-green-600">
                          <PiCurrencyInr />
                          <p className="font-medium">{eachProduct?.price || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        {/* View Button */}
                        <Link to={`/product-details/${eachProduct?.productId}`}>
                          <button className="bg-blue-600 text-white px-2 py-1 rounded-md flex items-center gap-1 sm:gap-2 text-xs sm:text-sm hover:bg-blue-700 transition-all">
                            View <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </Link>


                        {/* Delete Button */}
                        <button
                          className="ml-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs sm:text-sm hover:bg-red-700 transition-all"
                          onClick={() => removeProductFromWishlist(eachProduct?.objectID)}
                          aria-label="Remove from wishlist"
                        >
                          Delete
                        </button>
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center w-full text-gray-500 mt-4">
                  No products available.
                </div>
              )
            }


          </div>




          {/* large screen */}


          <div className=" hidden md:flex flex-wrap items-center p-2 justify-start gap-4">
            {products && products.length > 0 ? (
              products.map((eachProduct, i) => (
                <div
                  key={i}
                  className="bg-white flex flex-col h-auto rounded-xl p-3 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300
                           w-full sm:w-[48%]  md:w-1/3 lg:w-1/5 xl:w-[23%] 2xl:w-[18%]"
                >
                  {/* Product Image */}
                  <div className="w-full overflow-hidden rounded-md flex items-center justify-center">
                    <img
                      src={eachProduct?.bannerImage || "https://via.placeholder.com/300"}
                      alt={eachProduct?.name || "Product Image"}
                      className="h-[220px] w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Product Name */}
                  <h1 className="text-black font-semibold text-lg line-clamp-2 mb-1">
                    {eachProduct?.name || "Product Name"}
                  </h1>

                  <div className="flex justify-between">
                    {/* Stars */}
                    <div className="flex items-center gap-2 text-gray-700 text-sm mb-2">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, index) => (
                          <FaStar key={index} className="w-4 h-4" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">(New)</span>
                    </div>

                    {/* Brand */}
                    <p className="text-gray-600 text-sm mb-1">
                      {eachProduct?.brandName || "Unknown Brand"}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="flex justify-between items-center text-sm mb-1">
                    <div className="flex items-center gap-1 text-red-600">
                     
                      <p className=" font-medium">{eachProduct?.size || "N/A"}</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <CiDiscount1 />
                      <PiCurrencyInr />
                      <p className="font-medium">
                        {eachProduct?.actualPrice && eachProduct?.price
                          ? eachProduct.actualPrice - eachProduct.price
                          : "N/A"}{" "}
                        off
                      </p>
                    </div>
                  </div>

                  {/* Final Price */}
                  <div className="flex justify-between items-center text-lg font-bold text-gray-800 mb-1">
                    <div className="flex items-center">
                      <PiCurrencyInr />
                      <span>{eachProduct?.price || "N/A"}/-</span>
                    </div>
                  </div>


                  <div className="flex justify-between items-center ">
                    {/* View Product Button */}
                    <Link
                      to={`/product-details/${eachProduct?.productId}`}
                      className="w-full"
                    >
                      <button
                        className="w-auto flex items-center justify-center bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-all duration-300"
                        aria-label={`View details of ${eachProduct?.name || "the product"}`}
                      >
                        View Product <FaArrowRight className="ml-2" />
                      </button>
                    </Link>

                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={() => removeProductFromWishlist(eachProduct?.objectID)}
                      className="w-auto flex items-center justify-center bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-all duration-300"
                      aria-label="Remove product from wishlist"
                    >
                      Remove 
                    </button>


                  </div>

                </div>
              ))
            ) : (
              <div className="text-center w-full text-gray-500 mt-4">
                No products available.
              </div>
            )}
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