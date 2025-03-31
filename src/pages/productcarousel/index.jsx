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
    <div className="p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>
      {products.length ? (
        <Slider {...settings}>
          {products.map((product) => {
            const finalPrice = product.price - product.discount;
            return (
              <div key={product.id} className="p-2 flex flex-col items-center border border-gray-200 rounded-md bg-white shadow-md">
                <img src={product.bannerImage || "https://via.placeholder.com/300"} className="h-52 w-full object-contain" alt={product.name} />
                <h3 className="font-semibold text-lg mb-2 text-center line-clamp-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <FaStar key={i} className="w-4 h-4" />)}</div>
                  <span className="text-xs text-gray-500 ml-1">(24)</span>
                </div>
                <div className="mb-2 w-full px-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <PiCurrencyInr className="text-gray-600" />
                    <span className="line-through mr-2">{product.price}</span>
                    <CiDiscount1 className="text-green-500" />
                    <span className="text-green-500 ml-1">{product.discount} off</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-gray-800 mt-1">
                    <div className="flex items-center">
                      <PiCurrencyInr />
                      <span>{finalPrice}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CiDeliveryTruck className="mr-1" />
                      <span>Free Delivery</span>
                    </div>
                  </div>
                </div>
                <Link to={`/product-details/${product.productId}`} className="block rounded-lg w-full bg-[#011F4B] hover:[#011F4B]] text-white text-center py-2 transition-all flex items-center justify-center">
                  View Details <FaArrowRight className="ml-2" />
                </Link>
              </div>
            );
          })}
        </Slider>
      ) : (
        <h1 className="text-2xl font-bold mb-6 text-center">No products available</h1>
      )}
    </div>
  );
};

export default ProductCarousel;
