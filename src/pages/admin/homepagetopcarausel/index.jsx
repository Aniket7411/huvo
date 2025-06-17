import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';

const HomepageTopCarousel = ({ shuffledProducts }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const settings = {
    dots: false, // Changed from true to false to remove dots
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: true,
    beforeChange: (current, next) => setActiveSlide(next),
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          dots: false // Changed to false
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          dots: false // Changed to false
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          dots: false // Changed to false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          dots: false, // Changed to false
          slidesToScroll: 2
        }
      },
    ]
    // Removed appendDots and customPaging since we're not showing dots
  };

  return (
    <div className="w-full py-3 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2 px-2">Category Products</h2>

        <Slider {...settings}>
          {shuffledProducts.map((product) => (
            <div key={product.productId} className="px-1 sm:px-2 focus:outline-none">
              <div className="group relative bg-white p-2 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 flex flex-col h-full">
                <div className="relative pt-[100%] bg-gray-100 overflow-hidden">
                  <Link to={`/product-details/${product?.productId}`}>
                    <img
                      src={product.bannerImage || '/placeholder-product.jpg'}
                      alt={product.productName}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                  </Link>
                </div>

                <Link to={`/product-details/${product?.productId}`}>
                  <h3 className="font-semibold text-center text-sm sm:text-base text-gray-800 line-clamp-2" title={product.productName}>
                    {product.productName}
                  </h3>
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HomepageTopCarousel;