import React from "react";
import { Link } from "react-router-dom";
import { PiCurrencyInr } from "react-icons/pi";
import { CiDiscount1, CiDeliveryTruck } from "react-icons/ci";
import { FaArrowRight, FaStar } from "react-icons/fa";

const ProductCarousel = ({ womenProducts, menProducts, kidsProducts }) => {
  const { products, title } =
    womenProducts ? { products: womenProducts, title: "Women's Collection" } :
      menProducts ? { products: menProducts, title: "Men's Collection" } :
        kidsProducts ? { products: kidsProducts, title: "Kids' Collection" } :
          { products: [], title: "Featured Products" };

  return (
    <div className=" bg-gray-50 md:hidden ">



      <div className="flex flex-wrap gap-1 justify-between">
        {
          products.map((product) => {
            return (
              <div className="w-[49%] bg-[#fff] py-2 rounded-lg flex flex-col shadow-md ">
                <img
                  src={product?.bannerImage || "https://via.placeholder.com/300"}
                  alt={product?.name || "Product Image"}
                  className="h-[150px]  object-cover"
                  loading="lazy"
                />
                <div className="px-3">

                  <h1 className="text-black font-semibold text-sm mt-2 line-clamp-2 mb-1">
                    {product?.name || "Product Name"}
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
                  <div className="flex justify-between items-center text-sm mb-1">
                    <p className="line-through font-medium text-red-600">{product?.actualPrice || "N/A"}</p>
                    <div className="flex items-center gap-1 text-green-600">
                      <PiCurrencyInr />
                      <p className="font-medium">
                        {product?.price || "N/A"}
                      </p>
                    </div>
                  </div>
                  <Link to={`/product-details/${product?.productId}`}>
                    <button className="bg-blue-600 text-white px-2 py-1 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-all">
                      Views <FaArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>



              </div>
            )
          })
        }

      </div>
    </div>
  );
};

export default ProductCarousel;
