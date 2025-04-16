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
    <div className="p-4 bg-gray-50 md:hidden ">



      <div className="flex flex-wrap gap-1 justify-between">
        {
          products.map((product) => {
            return (
              <div key={product.id} className="rounded-md  p-2 flex flex-col items-center w-[48%]" style={{
                outline: "1px solid blue"
              }} >
                <Link
                  to={`/product-details/${product.productId}`}
                  className="w-full"
                >
                  <img src={product.bannerImage || "https://via.placeholder.com/300"} className="h-[180px] rounded-lg  w-full" alt={product.name} />

                </Link>

                <h3 className="font-semibold text-lg mb-1 text-center line-clamp-2">{product?.name?.slice(0, 25) || "Product Name"}</h3>
                {/* Star Ratings */}
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <FaStar key={i} className="w-4 h-4" />)}</div>
                  <span className="text-xs text-gray-500 ml-1">(New)</span>
                </div>


                {/* Pricing Details */}
                {/* <div className="mb-2 w-full px-2">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <PiCurrencyInr className="text-gray-600" />
                    <span className="line-through mr-2">{product.price}</span>
                    <CiDiscount1 className="text-green-500" />
                    <span className="text-green-500 ml-1">{product.discount} off</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-gray-800 mt-1">
                    <div className="flex items-center">
                      <PiCurrencyInr />
                      <span>{finalPrice}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>Free Delivery</span>
                    </div>
                  </div>
                </div> */}

                {/* View Details Button */}
                <Link
                  to={`/product-details/${product.productId}`}
                  className="w-full"
                >
                  <button
                    className="w-full  rounded-lg bg-blue-600 hover:bg-blue-600 text-white text-center py-2 px-4 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`View details for ${product.name}`}
                  >
                    View
                  </button>
                </Link>


              </div>
            )
          })
        }

      </div>
    </div>
  );
};

export default ProductCarousel;
