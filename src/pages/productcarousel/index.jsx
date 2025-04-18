import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { PiCurrencyInr } from "react-icons/pi";
import { CiDiscount1, CiDeliveryTruck } from "react-icons/ci";
import { FaArrowRight, FaStar } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductCarousel = ({ womenProducts, menProducts, kidsProducts }) => {
  const { products, title } =
    womenProducts ? { products: womenProducts, title: "Women's Collection" } :
    menProducts ? { products: menProducts, title: "Men's Collection" } :
    kidsProducts ? { products: kidsProducts, title: "Kids' Collection" } :
    { products: [], title: "Featured Products" };

  const settings = {
    dots: true,
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: Math.min(4, products.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(3, products.length) } },
      { breakpoint: 768, settings: { slidesToShow: Math.min(2, products.length) } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (

        <div className="p-4 bg-gray-50 bg-red hidden md:block ">

      {products.length ? (
        <Slider {...settings}>
          {products.map((product) => {
            return (

              <>
            

                <div
                                key={product?.i}
                                className="bg-white flex flex-col rounded-xl p-3 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                              >
                                <div className="w-full  mb-3 overflow-hidden rounded-md">
                                  <img
                                    src={product?.bannerImage || "https://via.placeholder.com/300"}
                                    alt={product?.name || "Product Image"}
                                    className="h-52 w-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
            
                                <h1 className="text-black font-semibold text-lg line-clamp-2 mb-2">
                                  {product?.name || "Product Name"}
                                </h1>
              
                                <p className="text-gray-600 text-sm mb-1">
                                  {product?.brandName || "Unknown Brand"}
                                </p>
              
                                <div className="flex items-center gap-2 text-gray-700 text-sm mb-2">
                                  <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, index) => (
                                      <FaStar key={index} className="w-4 h-4" />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-500">(New)</span>
                                </div>
              
                                <div className="flex justify-between items-center text-sm mb-2">
                                  <div className="flex items-center gap-1 text-red-600">
                                    <PiCurrencyInr />
                                    <p className="line-through font-medium">{product?.actualPrice || "N/A"}</p>
                                  </div>
                                  <div className="flex items-center gap-1 text-green-600">
                                    <CiDiscount1 />
                                    <PiCurrencyInr />
                                    <p className="font-medium">
                                      {product?.actualPrice && product?.price
                                        ? product.actualPrice - product.price
                                        : "N/A"} off
                                    </p>
                                  </div>
                                </div>
              
                                <div className="flex justify-between items-center text-lg font-bold text-gray-800 mb-3">
                                  <div className="flex items-center">
                                    <PiCurrencyInr />
                                    <span>{product?.price || "N/A"}</span>
                                  </div>
                                  {/* <span className="text-green-500 text-sm">Free Delivery</span> */}
                                </div>
              
                                <Link to={`/product-details/${product?.productId}`} className="w-full">
                                  <button className="w-full flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-all">
                                    View Product <FaArrowRight className="ml-2" />
                                  </button>
                                </Link>
                              </div>
                          </>
            );
          })}
        </Slider>
      ) : (
<h1 className="text-2xl font-semibold text-gray-800 text-center">
  No products available
</h1>
      )}
    </div>
  );
};

export default ProductCarousel;
