import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';

const HomepageTopCarousel = ({ shuffledProducts }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const settings = {
    dots: true,
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
          dots: true
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          dots: true
        }
      },
      {
        breakpoint: 640,  // Changed from 768 to 640 for better mobile display
        settings: {
          slidesToShow: 2,  // Show 2 products on small screens
          dots: true        // Keep dots visible
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,  // Still show 2 products on very small screens
          dots: true,       // Keep dots visible
          slidesToScroll: 2  // Scroll by 2 at a time
        }
      },
    ],
    appendDots: dots => (
      <div className="mt-4">
        <ul className="flex justify-center space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${i === activeSlide ? 'bg-primary-500 w-6' : 'bg-gray-300'}`} />
    ),
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