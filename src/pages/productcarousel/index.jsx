import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { PiCurrencyInr } from "react-icons/pi";
import { CiDiscount1, CiDeliveryTruck } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";
import "swiper/css";

const ProductCarouselmd = (props) => {
  const { allProducts } = props;

  // Filter products by group
  const kidsProducts = allProducts.filter((item) => item.group === "kids").splice(0, 8);
  const womenProducts = allProducts.filter((item) => item.group === "women").splice(0, 8);
  const menProducts = allProducts.filter((item) => item.group === "men").splice(0, 8);

  // Function to render a product carousel
  const renderProductCarousel = (products, title) => {
    return (
      <div className="mb-2 hidden md:block">
        <div
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="p-5"
        >
          <Swiper
            loop={true}
            className="mySwiper"
            modules={[Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              500: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
              1400: {
                slidesPerView: 5,
                spaceBetween: 50,
              },
            }}
          >
            {products.map((eachProduct, i) => {
              const finalPrice = eachProduct.price - eachProduct.discount;

              return (
                <SwiperSlide key={i}>
                  <div className="bg-white flex flex-col items-center rounded-2xl p-3 shadow-lg border border-gray-200 w-full hover:shadow-xl transition-shadow duration-300">
                    {/* Product Image */}
                    <img
                      src={eachProduct?.bannerImage || "https://via.placeholder.com/300"}
                      alt={eachProduct?.name || "Product Image"}
                      className="h-40 w-40 object-cover rounded-md mb-1"
                      loading="lazy"
                    />

                    {/* Product Name */}
                    <h1 className="text-black font-bold text-xl mb-1 text-center">
                      {eachProduct?.name || "Product Name"}
                    </h1>

                    {/* Rating and Orders */}
                    <div className="flex items-center gap-4 text-gray-700 mt-1">
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
                      <p className="text-sm text-gray-500">200 Ordered last week</p>
                    </div>

                    {/* Price Details */}
                    <div className="flex justify-between w-full items-center mt-2">
                      {/* Original Price */}
                      <div className="flex items-center gap-1">
                        <PiCurrencyInr className="text-red-600" />
                        <p className="line-through text-red-600 font-semibold">{eachProduct?.price}</p>
                      </div>

                      {/* Discount Price */}
                      <div className="flex items-center gap-1">
                        <CiDiscount1 className="text-green-600" />
                        <PiCurrencyInr className="text-green-600" />
                        <p className="font-semibold text-green-600">{eachProduct?.discount}</p>
                      </div>
                    </div>

                    {/* Final Price and Delivery */}
                    <div className="flex justify-between items-center w-full mt-2">
                      <div className="flex items-center text-green-600 gap-1">
                        <PiCurrencyInr />
                        <p className="font-semibold">{finalPrice} /-</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <CiDeliveryTruck />
                        <p className="font-semibold items-end">Free delivery</p>
                      </div>
                    </div>

                    {/* Explore Button */}
                    <Link
                      to={`/product-details/${eachProduct?.productId}`}
                      className="block mt-2 w-full"
                    >
                      <button
                        className="flex items-center justify-center bg-[#011F4B] text-white px-3 py-1 rounded-lg text-md hover:bg-[#02386e] transition-colors duration-200 w-full"
                        aria-label={`View ${eachProduct?.name} Details`}
                      >
                        Product Details
                        <FaArrowRight className="ml-2" />
                      </button>
                    </Link>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 bg-gray-50">
      {/* Women Products Carousel */}
      {womenProducts.length > 0 && renderProductCarousel(womenProducts, "Women's Products")}

      {/* Men Products Carousel */}
      {menProducts.length > 0 && renderProductCarousel(menProducts, "Men's Products")}

      {/* Kids Products Carousel */}
      {kidsProducts.length > 0 && renderProductCarousel(kidsProducts, "Kids' Products")}
    </div>
  );
};

export default ProductCarouselmd;