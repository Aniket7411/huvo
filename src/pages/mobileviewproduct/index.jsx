import React from "react";
import { Link } from "react-router-dom";
import { PiCurrencyInr } from "react-icons/pi";
import { CiDiscount1, CiDeliveryTruck } from "react-icons/ci";
import { FaArrowRight, FaStar } from "react-icons/fa";
import { TbJewishStarFilled } from "react-icons/tb";

const ProductCarousel = ({ womenProducts, menProducts, kidsProducts }) => {
  const { products, title } =
    womenProducts ? { products: womenProducts, title: "Women's Collection" } :
      menProducts ? { products: menProducts, title: "Men's Collection" } :
        kidsProducts ? { products: kidsProducts, title: "Kids' Collection" } :
          { products: [], title: "Featured Products" };

  console.log("productsproductsproducts", products)

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
                  <Link to={`/product-details/${product?.productId}`}>

                    <h1 className="text-black font-semibold text-sm mt-2 line-clamp-2 mb-1">
                      {product?.name || "Product Name"}
                    </h1>

                  </Link>

                  {/* Stars */}


              


                  <div className="flex gap-2 justify-between mb-1 items-center">

                    <p className="text-gray-600 text-sm ">
                      {product?.brandName || "Unknown Brand"}
                    </p>


                    <div
                      className={`px-1 py-1 text-[8px] flex items-center rounded-md gap-1 text-white ${4.5 >= 3.5
                        ? "bg-green-500"
                        : 4.5 >= 3
                          ? "bg-yellow-500"
                          : "bg-red-400"
                        }`}
                    >
                      {
                        product?.totalRating >= 50 ?
                          product?.avgRating : "New"
                      }
                      <TbJewishStarFilled className="text-sm" />
                    </div>

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
                      View <FaArrowRight className="w-4 h-4" />
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
