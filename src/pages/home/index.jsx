import React, { useEffect, useState } from "react";

import "./index.css"
import { Link } from "react-router-dom";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { PiCurrencyInr } from "react-icons/pi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowRight, FaProductHunt } from "react-icons/fa";
import { TbJewishStarFilled } from "react-icons/tb";
import { SiBrandfolder } from "react-icons/si";
import { Oval } from "react-loader-spinner";
import { MdArrowOutward } from "react-icons/md";
import Slider from "react-slick";
import "swiper/css";
import "swiper/css/navigation"; // Include navigation styles


const testimonials = [
  {
    text: "The winter wear collection is both stylish and warm. I couldn't be happier with my purchase, and the quality speaks volumes.",
    name: "Sarah Thompson",
    designation: "Fashion Blogger",
  },
  {
    text: "The goggles I bought are not only trendy but also offer great UV protection. Highly recommend them for outdoor enthusiasts!",
    name: "Mark Johnson",
    designation: "Outdoor Enthusiast",
  },
  {
    text: "Exceptional customer service and fantastic product range. My wardrobe has never been this versatile and functional.",
    name: "Emily Carter",
    designation: "Lifestyle Influencer",
  },
];


export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [topBrands, setTopBrands] = useState([])

  const getAllBrands = async () => {
    try {
      const { brands } = await HttpClient.get("/brand");
      setBrands(brands);
      console.log(brands)

      const formattedBrands = brands.map((eachBrand) => ({
        id: eachBrand._id,
        brandId: eachBrand.brandId,
        image: eachBrand.image,
        logo: eachBrand.logo,
        brandName: eachBrand.name,
        onGoingOffer: eachBrand.onGoingOffer

      }))
      console.log("formattedBrandss", formattedBrands)
      setTopBrands(formattedBrands)

    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const getAllCategories = async () => {
    try {
      const { categories } = await HttpClient.get("/category");

      setAllCategories(categories);

      const formattedData = categories.map((product) => ({
        id: product._id,
        categoryId: product.categoryId,
        description: product.description,
        group: product.group[0]?.name,
        image: product.group[0]?.image,
        productName: product.name
      }))
      setAllCategories(formattedData)




    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await HttpClient.get("/product");
      setAllProducts(response.products);

      console.log("trending products", response.products)

      const formattedData = response.products.map((eachProduct) => ({
        objectId: eachProduct._id,
        bannerImage: eachProduct.bannerImage,
        productName: eachProduct.name,
        brandName: eachProduct.brand.name,
        brandImage: eachProduct.brand.image,
        onGoingOffer: eachProduct.brand.onGoingOffer,
        brandId: eachProduct.brand.brandId,
        categoryId: eachProduct.category.categoryId,
        categoryDescription: eachProduct.category.description,
        productDescription: eachProduct.description,
        productDetails: eachProduct.productDetails[0],
        group: eachProduct.group,
        isReturnable: eachProduct.isReturnable,
        discount: eachProduct.discount,
        price: eachProduct.price,
        productId: eachProduct.productId,
        productName: eachProduct.name
      }))
      setTrendingProducts(formattedData)

    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const geTopProducts = async () => {
    try {
      const response = await HttpClient.get("/product/trending/top")
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }

  }



  useEffect(() => {
    fetchAllProducts();
    getAllBrands();
    getAllCategories();
    geTopProducts();


  }, []);



  const kidsProducts = allProducts.filter((item) => item.group === "kids").splice(0, 8);
  const womenProducts = allProducts.filter((item) => item.group === "women").splice(0, 8);
  const menProducts = allProducts.filter((item) => item.group === "men").splice(0, 8);






  return (
    <>
      <section>
        <Swiper
          pagination={true}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
        >
          <SwiperSlide>
            <div className="man-women  text-[#fff] sm:h-screen py-[33%] md:py-[20%] xl:py-[16%] px-[10%]">
              <div>
                <p className="font-[Quicksand]  md:font-normal  font-bold   text-xl md:text-7xl ">
                  Style for {" "}
                </p>{" "}
                <p className="font-[Quicksand] md:font-normal font-bold  text-xl md:text-7xl mb-2">
                  {" "}
                  Every Story
                </p>
                <p className="font-[Poppins]  font-normal  ">
                  Discover a world of fashion for the whole family—trendy, <br /> timeless, and tailored for all budgets.
                </p>

                <div className="ml-3 w-[15%] md:w-[5%] h-[3px] bg-[#011F4B]  mt-[1%]"></div>
              </div>


            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="home-banner text-[#fff]   sm:h-screen py-[33%] md:py-[20%] xl:py-[16%] px-[10%]">
              <div>
                <p className="font-[Quicksand]  md:font-normal  font-bold   text-xl md:text-7xl ">
                  PERFECT TIME{" "}
                </p>{" "}
                <p className="font-[Quicksand] md:font-normal font-bold  text-xl md:text-7xl mb-2">
                  {" "}
                  TO SHOP
                </p>
                <p className="font-[Poppins]  font-normal text-[#fff] ">
                  Unlock exclusive offers and browse through <br /> our vast collection of premium products.

                </p>
                <p className="font-[Poppins]  font-normal text-[#fff]">
                  {" "}
                  Now is the best time to elevate your style with high-quality <br /> essentials at amazing prices.                </p>
                <div className="ml-3 w-[15%] md:w-[5%] h-[3px] bg-[#011F4B]  mt-[1%]"></div>
              </div>
            </div>
          </SwiperSlide>

        </Swiper>
      </section>

      <section className="px-2 md:px-10 py-3 ">
        <h2 className="font-[Quicksand]  font-bold text-center text-sm md:text-4xl text-[#011F4B]">
          CATEGORIES TO EXPLORE
        </h2>
        <p className="font-[Poppins]  text-center text-lg font-light mb-2">
          "Discover the Best Deals and Products Across All Categories"</p>



        {allCategories.length ? (
          <Swiper
            loop={true}
            className="mySwiper"
            modules={[Autoplay, Navigation]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            breakpoints={{
              0: {
                slidesPerView: 3,
                spaceBetween: 5,
              },
              500: {
                slidesPerView: 4,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 6,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 8,
                spaceBetween: 10,
              },
              1400: {
                slidesPerView: 10,
                spaceBetween: 8,
              },
              2000: {
                slidesPerView: 12,
                spaceBetween: 6,
              },
            }}
          >
            {allCategories.map(({ id, categoryId, description, group, image, productName }) => (
              <SwiperSlide key={id}>
                <div className="flex flex-col  items-center">
                  {/* Image */}
                  <img
                    src={image || "https://via.placeholder.com/300"}
                    alt={description || "Product Image"}
                    className="h-[90px] w-[90px] object-cover rounded-full mb-2 shadow-md"
                  />
                  {/* Description */}
                  <p className="text-md font-medium text-center text-[#2E3C7E]">
                    {description || "No Description"}
                  </p>
                </div>
              </SwiperSlide>
            ))}
            {/* Navigation Buttons */}
            {/* <button
              className="swiper-button-prev absolute top-1/2 left-2 transform -translate-y-1/2  text-white p-2 rounded-full "
              style={{ zIndex: 10 }}
            >

            </button> */}
            {/* <button
              className="swiper-button-next absolute top-1/2 right-2 transform -translate-y-1/2  text-white p-2 rounded-full"
              style={{ zIndex: 10 }}
            >

            </button> */}
          </Swiper>
        ) : (
          <h2 className="font-[Quicksand] font-medium text-center text-2xl text-[#011F4B]">
            No Categories Available
          </h2>
        )}
      </section>

      <hr className="my-5" />

      {/* trending products */}



      <div
        style={{
          backgroundImage: "url('/assets/trendingproducts.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "top", // Shift the image downward
          backgroundRepeat: "no-repeat",
          padding: "5px",
          height: "250px",
          display: "flex",
          justifyContent: "start",
          alignItems: "end",
          color: "#ffffff",
        }}
      >
        <div className="flex items-center flex-wrap gap-0  md:gap-3 bg-[#fff] px-2 py-1 rounded-lg shadow-md">
          <h2
            className="font-[Quicksand] font-medium text-center text-2xl sm:text-sm md:text-4xl bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(90deg, #007bff, #f8d00f, #007bff)", // Blue to Yellow Gradient
              backgroundSize: "200% auto",
              backgroundPosition: "0% 50%",
              animation: "flow-gradient 3s linear infinite",
            }}
          >
            Trending Products
          </h2>
          <FaArrowTrendUp size={30} className="text-[#4bd63b] mr-2 " />
          <p className="text-gray-600 font-semibold">
            Discover the latest and most popular items everyone loves!
          </p>
        </div>
      </div>





      <section className="p-2 hidden md:block">

        {trendingProducts.length ? (
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
              2000: {
                slidesPerView: 6,
                spaceBetween: 60,
              },
            }}
          >
            {trendingProducts.map((category, i) => {


              return (
                <SwiperSlide key={i}>
                  <div className="p-5 ">

                    <div className="bg-white flex flex-col items-center rounded-2xl p-3 shadow-lg border border-gray-200">
                      {/* Heading */}
                      <h1 className="text-black font-quicksand font-bold text-xl mb-1 text-center">
                        {category?.productName
                          || "Product Name"}
                      </h1>

                      {/* Product Image */}
                      <img
                        src={category?.bannerImage || "https://via.placeholder.com/300"}
                        alt={category?.name || "Product Image"}
                        className="h-40 w-40  object-cover rounded-full mb-1"
                      />

                      {/* Product Name */}
                      <p className="text-lg font-semibold mb-1 text-gray-700">
                        {category?.brandName || "Brands Name"}
                      </p>
                      <div className="flex items-center gap-4 text-gray-700 mt-1">
                        <p className="flex items-center text-sm font-semibold">
                          <span className="text-yellow-500 mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                            </svg>
                          </span>
                          Rating: 4.5 / 5
                        </p>
                        <p className="text-sm text-gray-500">Ordered last week</p>
                      </div>


                      {/* Explore Button */}
                      <Link to={`/product-details/${category?.productId}`} className="block mt-2 ">
                        <button className="flex items-center justify-center bg-[#011F4B] text-white px-2 py-1 rounded-lg text-md  hover:bg-[#02386e] transition-colors duration-200">
                          Product Details
                          <FaArrowRight className="ml-2" />
                        </button>
                      </Link>

                    </div>



                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <h2 className="font-[Quicksand] font-medium text-center text-2xl text-[#011F4B]">
            No Category Available
          </h2>
        )}






      </section>



      <div className="flex p-2 md:hidden flex-wrap justify-between gap-2 ">
        {trendingProducts.map((each, index) => (
          <div
            key={index}
            className="w-[31%] flex flex-col  items-center bg-white rounded-lg shadow-md p-2 border border-gray-200"
          >
            <Link to={`/product-details/${each?.productId}`} >


            {/* Product Image */}
            <img
              src={each?.bannerImage || "https://via.placeholder.com/300"}
              alt={each?.name || "Product Image"}
              className="h-20 w-20 object-cover rounded-md"
            />
            {/* Product Name */}
            <h3 className="text-center font-semibold text-gray-800 text-sm mb-2">
              {each?.productName || "Product Name"}
            </h3>
            </Link>
          </div>
        ))}
      </div>
      <hr className="my-5" />



      <div
        style={{
          backgroundImage: "url('/assets/trendingbrands.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center", // Shift the image downward
          backgroundRepeat: "no-repeat",
          padding: "5px",
          height: "250px",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          color: "#ffffff",
          marginBottom: "5px"
        }}
      >
        <div className="flex items-center  flex-wrap gap-0  md:gap-3 bg-[#fff] px-2 py-1 rounded-lg shadow-md">
          <h2
            className="font-[Quicksand] font-medium text-center text-2xl sm:text-sm md:text-4xl bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(90deg, #007bff, #f8d00f, #007bff)", // Blue to Yellow Gradient
              backgroundSize: "200% auto",
              backgroundPosition: "0% 50%",
              animation: "flow-gradient 3s linear infinite",
            }}
          >
            In-demand and selling fast
          </h2>
          <FaArrowTrendUp size={30} className="text-[#4bd63b] mr-2 " />
          <p className="text-gray-600 font-semibold">
            Don't miss out on the buzz—shop our trending picks now!
          </p>
        </div>
      </div>


      <section className="p-2 hidden md:block ">

        {topBrands.length ? (
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
              2000: {
                slidesPerView: 6,
                spaceBetween: 60,
              },
            }}
          >
            {topBrands.map((product, i) => {


              return (
                <SwiperSlide key={i}>
                  <div className="p-5">

                    <div className="bg-white flex flex-col items-center rounded-2xl p-3 shadow-lg border border-gray-200">
                      {/* Heading */}
                      <h1 className="text-black font-quicksand font-bold text-xl mb-1 text-center">
                        {product?.onGoingOffer || "On Going Offer"}
                      </h1>

                      {/* Product Image */}
                      <img
                        src={product?.image || "https://via.placeholder.com/300"}
                        alt={product?.name || "Product Image"}
                        className="h-24 w-24  object-cover rounded-full mb-1"
                      />

                      {/* Product Name */}
                      <p className="text-lg font-semibold mb-1 text-gray-700">
                        {product?.brandName || "Brand Name"}
                      </p>

                      {/* brandName */}



                      {/* Explore Button */}
                      <Link to={`/products_by_brand/${product?.brandName}`}>
                      <button className="flex items-center justify-center bg-[#011F4B] text-white px-2 py-1 rounded-lg text-lg  hover:bg-[#02386e] transition-colors duration-200">
                          Explore Brand
                          <FaArrowRight className="ml-2" />
                        </button>
                      </Link>

                    </div>



                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <h2 className="font-[Quicksand] font-medium text-center text-2xl text-[#011F4B]">
            No Category Available
          </h2>
        )}



      </section>


      <div className="flex flex-wrap md:hidden gap-1 ">
        {topBrands.map((product, i) => (
          <div
            key={i}
            className=" w-[31%] flex flex-col   items-center bg-white rounded-lg shadow-md p-2 border border-gray-200"
          >
            {/* Heading */}
            

            {/* Explore Button */}
            <Link to={`/products_by_brand/${product?.brandName}`}>
            <h1 className="text-center font-semibold text-gray-800 text-sm mb-2">
              {product?.onGoingOffer || "On Going Offer"}
            </h1>
            

            {/* Product Image */}
            <img
              src={product?.image || "https://via.placeholder.com/300"}
              alt={product?.name || "Product Image"}
              className="h-20 w-20 object-cover  mb-2"
            />

            {/* Product Name */}
            <p className="text-base flex-end font-semibold  text-gray-700 text-center">
              {product?.brandName || "Brand Name"}
            </p>
            </Link>
          </div>
        ))}
      </div>

      <hr className="my-5" />

      <div
        style={{
          backgroundImage: "url('/assets/womenbanner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center", // Shift the image downward
          backgroundRepeat: "no-repeat",
          padding: "5px",
          height: "250px",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          color: "#ffffff",
        }}
      >
        <div className="flex items-center flex-wrap gap-0  md:gap-3 bg-[#fff] px-2 py-1 rounded-lg shadow-md">
          <h2
            className="font-[Quicksand] font-medium text-center text-2xl sm:text-lg md:text-4xl bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(90deg, #007bff, #f8d00f, #007bff)", // Blue to Yellow Gradient
              backgroundSize: "200% auto",
              backgroundPosition: "0% 50%",
              animation: "flow-gradient 3s linear infinite",
            }}
          >
            Products for Women
          </h2>
          <FaArrowTrendUp size={30} className="text-[#4bd63b] mr-2 " />
          <p className="text-gray-600 font-semibold">
            Discover trendy and stylish products for women.
          </p>
        </div>
      </div>



      <section className="p-2 hidden md:block">

        {allCategories.length ? (
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
              2000: {
                slidesPerView: 6,
                spaceBetween: 60,
              },
            }}
          >
            {womenProducts.map((category, i) => {

              const discountedPrice = category?.price && category?.discount
                ? (category.price - (category.price * category.discount) / 100).toFixed(2)
                : null;
              return (
                <SwiperSlide key={i}>
                  <div className="p-5">

                    <div className="bg-white flex flex-col items-center rounded-2xl p-3 shadow-lg border border-gray-200">
                      {/* Heading */}
                      <h1 className="text-black font-quicksand font-bold text-xl mb-1 text-center">
                        {category?.brand?.name || "Trending Brand Name"}
                      </h1>

                      {/* Product Image */}
                      <img
                        src={category?.bannerImage || "https://via.placeholder.com/300"}
                        alt={category?.name || "Product Image"}
                        className="h-48 w-full object-cover rounded-lg mb-1"
                      />

                      {/* Product Name */}
                      <p className="text-lg font-semibold mb-1 text-gray-700">
                        {category?.name || "Product Name"}
                      </p>

                      {/* Pricing and Discount */}
                      <div className="flex justify-between items-center w-full mb-2">
                        <div className="flex items-center text-lg text-gray-800">
                          <PiCurrencyInr className="mr-1" />
                          <span>{category?.price || "0.00"}</span>
                        </div>
                        {category?.discount && (
                          <div className="flex items-center text-sm text-green-600">
                            <p className="mr-1">{category?.discount}% OFF</p>
                          </div>
                        )}
                      </div>

                      {/* Discounted Price */}
                      {discountedPrice && (
                        <p className="text-sm text-blue-600 font-medium mb-2">
                          Discounted Price: <PiCurrencyInr className="inline mr-1" />{discountedPrice}
                        </p>
                      )}

                      {/* Explore Button */}
                      <Link to="/store_Products" className="w-full">
                        <button className="bg-[#011F4B] w-full text-white px-5 py-2 rounded-lg">
                          Visit Store & Product
                        </button>
                      </Link>
                    </div>



                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <h2 className="font-[Quicksand] font-medium text-center text-2xl text-[#011F4B]">
            No Category Available
          </h2>
        )}



      </section>

      <div className="flex flex-wrap justify-between px-2 md:hidden gap-1">


        {womenProducts.map((each, index) => (
          <div
            key={index}
            className="w-[48%]  flex flex-col  items-center bg-white rounded-lg shadow-md p-2 border border-gray-200"
          >


            <p className="text-[black] font-quicksand font-sm font-bold  mb-1 text-center">
              {each?.brand?.name || "Trending Brand Name"}
            </p>

            {/* Product Image */}

            <img
              src={each?.bannerImage || "https://via.placeholder.com/300"}
              alt={each?.name || "Product Image"}
              className="h-20 w-20 object-cover  mb-2"
            />
            {/* Product Name */}
            <h2 className="text-center font-semibold text-gray-800 text-sm ">
              {each?.name || "Product Name"}
            </h2>
            <div className="flex items-center justify-between  text-sm ">
              <span className="text-gray-700">Ratings: 4.5</span>
              <TbJewishStarFilled className="text-[#ebf73d]" />
            </div>


            <Link to="/store_Products">
              <button className="bg-[#011F4B] mt-2 text-white text-sm px-2 py-1 rounded-lg">
                Visit Store & Product
              </button>
            </Link>
          </div>
        ))}

      </div>
      <hr className="my-5" />



      <div
        style={{
          backgroundImage: "url('/assets/menbanner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "250px",
          display: "flex",
          padding: "5px",
          justifyContent: "start",
          alignItems: "center",
          color: "#ffffff",
        }}
      >
        <div className="flex items-center flex-wrap gap-0  md:gap-3 bg-[#fff] px-3 rounded-lg">
          <h2
            className="font-[Quicksand] font-medium text-center text-2xl sm:text-lg md:text-4xl bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(90deg, #007bff, #f8d00f, #007bff)", // Blue to Yellow Gradient
              backgroundSize: "200% auto",
              backgroundPosition: "0% 50%",
              animation: "flow-gradient 3s linear infinite",
            }}
          >
            Products for Men
          </h2>
          <FaArrowTrendUp size={30} className="text-[#4bd63b] mr-2 " />
          <p className="text-gray-600 font-semibold">Explore the best products tailored for men.</p>

        </div>

      </div>


      <section className="p-2 hidden md:block ">

        {menProducts.length ? (
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
              2000: {
                slidesPerView: 6,
                spaceBetween: 60,
              },
            }}
          >
            {menProducts.map((category, i) => {

              const discountedPrice = category?.price && category?.discount
                ? (category.price - (category.price * category.discount) / 100).toFixed(2)
                : null;
              return (
                <SwiperSlide key={i}>
                  <div className="p-3">

                    <div className="bg-white flex flex-col items-center rounded-2xl p-3 shadow-lg border border-gray-200">
                      {/* Heading */}
                      <h1 className="text-black font-quicksand font-bold text-xl mb-1 text-center">
                        {category?.brand?.name || "Trending Brand Name"}
                      </h1>

                      {/* Product Image */}
                      <img
                        src={category?.bannerImage || "https://via.placeholder.com/300"}
                        alt={category?.name || "Product Image"}
                        className="h-48 w-full object-cover rounded-lg mb-1"
                      />

                      {/* Product Name */}
                      <p className="text-lg font-semibold mb-1 text-gray-700">
                        {category?.name || "Product Name"}
                      </p>

                      {/* Pricing and Discount */}
                      <div className="flex justify-between items-center w-full mb-2">
                        <div className="flex items-center text-lg text-gray-800">
                          <PiCurrencyInr className="mr-1" />
                          <span>{category?.price || "0.00"}</span>
                        </div>
                        {category?.discount && (
                          <div className="flex items-center text-sm text-green-600">
                            <p className="mr-1">{category?.discount}% OFF</p>
                          </div>
                        )}
                      </div>

                      {/* Discounted Price */}
                      {discountedPrice && (
                        <p className="text-sm text-blue-600 font-medium mb-2">
                          Discounted Price: <PiCurrencyInr className="inline mr-1" />{discountedPrice}
                        </p>
                      )}

                      {/* Explore Button */}
                      <Link to="/store_Products" className="w-full">
                        <button className="bg-[#011F4B] w-full text-white px-5 py-2 rounded-lg">
                          Visit Store & Product
                        </button>
                      </Link>
                    </div>


                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <h2 className="font-[Quicksand] font-medium text-center text-2xl text-[#011F4B]">
            No Category Available
          </h2>
        )}



      </section>
      <div className="flex flex-wrap justify-between px-2 md:hidden gap-1">


        {menProducts.map((each, index) => (
          <div
            key={index}
            className="w-[48%]  flex flex-col  items-center bg-white rounded-lg shadow-md p-2 border border-gray-200"
          >

            <p className="text-[black] font-quicksand font-sm font-bold  mb-1 text-center">
              {each?.brand?.name || "Trending Brand Name"}
            </p>

            {/* Product Image */}

            <img
              src={each?.bannerImage || "https://via.placeholder.com/300"}
              alt={each?.name || "Product Image"}
              className="h-20 w-20 object-cover  mb-2"
            />
            {/* Product Name */}
            <h2 className="text-center font-semibold text-gray-800 text-sm ">
              {each?.name || "Product Name"}
            </h2>
            <div className="flex items-center justify-between  text-sm ">
              <span className="text-gray-700">Ratings: 4.5</span>
              <TbJewishStarFilled className="text-[#ebf73d]" />
            </div>


            <Link to="/store_Products">
              <button className="bg-[#011F4B] mt-2 text-white text-sm px-2 py-1 rounded-lg">
                Visit Store & Product
              </button>
            </Link>
          </div>
        ))}
      </div>

      <hr className="my-5" />



      <div
        style={{
          backgroundImage: "url('/assets/kidsbanner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "top", // Shift the image downward
          backgroundRepeat: "no-repeat",
          height: "250px",
          padding: "5px",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          color: "#ffffff",
        }}
      >
        <div className="flex items-center flex-wrap gap-0  md:gap-3 bg-[#fff] px-2 py-1 rounded-lg shadow-md">
          <h2
            className="font-[Quicksand] font-medium text-center text-2xl sm:text-lg md:text-4xl bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(90deg, #007bff, #f8d00f, #007bff)", // Blue to Yellow Gradient
              backgroundSize: "200% auto",
              backgroundPosition: "0% 50%",
              animation: "flow-gradient 3s linear infinite",
            }}
          >
            Products for Kids
          </h2>
          <FaArrowTrendUp size={30} className="text-[#4bd63b] mr-2 " />
          <p className="text-gray-600 font-semibold">
            Find fun and creative products for kids.
          </p>
        </div>
      </div>




      <section className="p-2 hidden md:block ">

        {kidsProducts.length ? (
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
              2000: {
                slidesPerView: 6,
                spaceBetween: 60,
              },
            }}
          >
            {kidsProducts.map((category, i) => {

              const discountedPrice = category?.price && category?.discount
                ? (category.price - (category.price * category.discount) / 100).toFixed(2)
                : null;
              return (
                <SwiperSlide key={i}>
                  <div className="p-5">

                    <div className="bg-white flex flex-col items-center rounded-2xl p-3 shadow-lg border border-gray-200">
                      {/* Heading */}
                      <h1 className="text-black font-quicksand font-bold text-xl mb-1 text-center">
                        {category?.brand?.name || "Trending Brand Name"}
                      </h1>

                      {/* Product Image */}
                      <img
                        src={category?.bannerImage || "https://via.placeholder.com/300"}
                        alt={category?.name || "Product Image"}
                        className="h-48 w-full object-cover rounded-lg mb-1"
                      />

                      {/* Product Name */}
                      <p className="text-lg font-semibold mb-1 text-gray-700">
                        {category?.name || "Product Name"}
                      </p>

                      {/* Pricing and Discount */}
                      <div className="flex justify-between items-center w-full mb-2">
                        <div className="flex items-center text-lg text-gray-800">
                          <PiCurrencyInr className="mr-1" />
                          <span>{category?.price || "0.00"}</span>
                        </div>
                        {category?.discount && (
                          <div className="flex items-center text-sm text-green-600">
                            <p className="mr-1">{category?.discount}% OFF</p>
                          </div>
                        )}
                      </div>

                      {/* Discounted Price */}
                      {discountedPrice && (
                        <p className="text-sm text-blue-600 font-medium mb-2">
                          Discounted Price: <PiCurrencyInr className="inline mr-1" />{discountedPrice}
                        </p>
                      )}

                      {/* Explore Button */}
                      <Link to={`/product-details/${category?.productId}`} className="w-full">
                        <button className="bg-[#011F4B] w-full text-white px-5 py-2 rounded-lg">
                          Visit Store & Product
                        </button>
                      </Link>
                    </div>


                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <h2 className="font-[Quicksand] font-medium text-center text-2xl text-[#011F4B]">
            No Category Available
          </h2>
        )}



      </section>

      <div className="flex flex-wrap justify-between px-2 md:hidden gap-1">


        {kidsProducts.map((each, index) => (
          <div
            key={index}
            className="w-[48%]  flex flex-col  items-center bg-white rounded-lg shadow-md p-2 border border-gray-200"
          >

            <p className="text-[black] font-quicksand font-sm font-bold  mb-1 text-center">
              {each?.brand?.name || "Trending Brand Name"}
            </p>

            {/* Product Image */}

            <img
              src={each?.bannerImage || "https://via.placeholder.com/300"}
              alt={each?.name || "Product Image"}
              className="h-20 w-20 object-cover  mb-2"
            />
            {/* Product Name */}
            <h2 className="text-center font-semibold text-gray-800 text-sm ">
              {each?.name || "Product Name"}
            </h2>
            <div className="flex items-center justify-between  text-sm ">
              <span className="text-gray-700">Ratings: 4.5</span>
              <TbJewishStarFilled className="text-[#ebf73d]" />
            </div>


            <Link to="/store_Products">
              <button className="bg-[#011F4B] mt-2 text-white text-sm px-2 py-1 rounded-lg">
                Visit Store & Product
              </button>
            </Link>
          </div>
        ))}
      </div>





      {/*       
      <section>

        <div className="shopping py-[30%] md:py-[25%] lg:py-[14%] mb-3">
          <Link tp="/women-collection">
            <h2 className="font-[Quicksand] z-[1] relative text-[#011F4B] text-center font-bold text-3xl md:text-7xl lg:text-8xl">
              Women’s Fashion

            </h2></Link>  <p className="font-[Quicksand] text-center p-2 bg-[#cdefe6] font-semibold rounded-lg text-[#000] text-md md:text-xl m-4">
            Discover the latest trends and timeless styles that make every woman feel confident and stylish.
            From chic outfits to elegant accessories, we have everything you need to express your unique look.
          </p>

        </div>

        {allProducts.length ? (
          <>
            <div className="block sm:hidden">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                autoplay={{ delay: 3000, disableOnInteraction: false }}
              >


                {allProducts
                  .filter((item) => item.group === "men")
                  .splice(0, 8)
                  .map((data, index) => (
                    <SwiperSlide key={index}>
                      <div className="w-full px-4">
                        <div className="relative mb-2" key={data.productId}>
                          <Link to={`/product-details/${data.productId}`}>
                            <img
                              className="w-full h-[200px] md:h-[300px] "
                              src={data?.bannerImage || "/assets/similar-lady.png"}
                              alt={data?.name}
                              loading="lazy"
                            />
                          </Link>
                        </div>
                        <div className="flex gap-2 justify-between font-[Poppins]">
                          <p className="font-medium text-[#011F4B]">{data.name}</p>
                          <p className="flex gap-1 items-center text-[#EF939D] font-medium text-sm mb-2">
                            {data.discount ? (
                              <span className="line-through text-xs flex items-center">
                                <PiCurrencyInr /> {data.price}
                              </span>
                            ) : (
                              ""
                            )}
                            <span className="flex items-center">
                              <PiCurrencyInr />
                              {Math.floor(
                                data.price - (data.discount / 100) * data.price
                              )}
                            </span>
                          </p>
                        </div>
                        {data?.brand && data?.brand?.name && (
                          <p className="text-[#EF939D] font-semibold text-sm">
                            {data?.brand?.name}
                          </p>
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>


            <div className="hidden sm:grid sm:grid-cols-4 p-10 gap-5">
              {allProducts
                .filter((item) => item.group === "women")
                .splice(0, 8)
                .map((data, index) => (
                  <div className="w-full px-4" key={index}>
                    <div className="relative mb-2">
                      <Link to={`/product-details/${data.productId}`}>
                        <img
                          className="w-full h-[300px] rounded-md"
                          src={data?.bannerImage || "/assets/similar-lady.png"}
                          alt={data?.name}
                          loading="lazy"
                        />
                      </Link>
                    </div>
                    <div className="flex gap-2 justify-between font-[Poppins]">
                      <p className="font-medium text-[#011F4B]">{data.name}</p>
                      <p className="flex gap-1 items-center text-[#EF939D] font-medium text-sm mb-2">
                        {data.discount ? (
                          <span className="line-through text-xs flex items-center">
                            <PiCurrencyInr /> {data.price}
                          </span>
                        ) : (
                          ""
                        )}
                        <span className="flex items-center">
                          <PiCurrencyInr />
                          {Math.floor(
                            data.price - (data.discount / 100) * data.price
                          )}
                        </span>
                      </p>
                    </div>
                    {data?.brand && data?.brand?.name && (
                      <p className="text-[#EF939D] font-semibold text-sm">
                        {data?.brand?.name}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </>

        ) : (
          <>
            <div className="w-full sm:w-fit ">
              <div className="relative mb-2">
                <img
                  className="w-full"
                  src="assets/blouse.png"
                  alt="blouse"
                />
                <p className="font-[Poppins] absolute top-[15px] right-0 bg-[#011F4B] text-white py-1 px-5">
                  out of stock
                </p>
              </div>
              <div className="flex justify-between font-[Poppins]">
                <p className="font-medium text-[#011F4B]">White Blouse</p>
                <p className="text-[#EF939D] font-light text-sm">
                  <span className="mr-4 line-through	">$250</span>
                  <span>$150</span>{" "}
                </p>
              </div>
              <p className="text-[#EF939D] font-semibold text-sm">
                join life
              </p>
            </div>
            <div className="w-full sm:w-fit ">
              <div className="relative mb-2">
                <img className="w-full" src="assets/s8.png" alt="blouse" />
                <p className="font-[Poppins] absolute top-[15px] right-0 bg-[#011F4B] text-white py-1 px-5">
                  out of stock
                </p>
              </div>
              <div className="flex justify-between font-[Poppins]">
                <p className="font-medium text-[#011F4B]">White Blouse</p>
                <p className="text-[#EF939D] font-light text-sm">
                  <span className="mr-4 line-through	">$250</span>
                  <span>$150</span>{" "}
                </p>
              </div>
              <p className="text-[#EF939D] font-semibold text-sm">
                join life
              </p>
            </div>
            <div className="w-full  ">
              <div className="relative mb-2">
                <img className="w-full" src="assets/s2.png" alt="blouse" />
                <p className="font-[Poppins] absolute top-[15px] right-0 bg-[#011F4B] text-white py-1 px-5">
                  out of stock
                </p>
              </div>
              <div className="flex justify-between font-[Poppins]">
                <p className="font-medium text-[#011F4B]">White Blouse</p>
                <p className="text-[#EF939D] font-light text-sm">
                  <span className="mr-4 line-through	">$250</span>
                  <span>$150</span>{" "}
                </p>
              </div>
              <p className="text-[#EF939D] font-semibold text-sm">
                join life
              </p>
            </div>
            <div className="w-full sm:w-fit ">
              <div className="relative mb-2">
                <img className="w-full" src="assets/s3.png" alt="blouse" />
                <p className="font-[Poppins] absolute top-[15px] right-0 bg-[#011F4B] text-white py-1 px-5">
                  out of stock
                </p>
              </div>
              <div className="flex justify-between font-[Poppins]">
                <p className="font-medium text-[#011F4B]">White Blouse</p>
                <p className="text-[#EF939D] font-light text-sm">
                  <span className="mr-4 line-through	">$250</span>
                  <span>$150</span>{" "}
                </p>
              </div>
              <p className="text-[#EF939D] font-semibold text-sm">
                join life
              </p>
            </div>
            <div className="w-full sm:w-fit ">
              <div className="relative mb-2">
                <img className="w-full" src="assets/s4.png" alt="blouse" />
                <p className="font-[Poppins] absolute top-[15px] right-0 bg-[#011F4B] text-white py-1 px-5">
                  out of stock
                </p>
              </div>
              <div className="flex justify-between font-[Poppins]">
                <p className="font-medium text-[#011F4B]">White Blouse</p>
                <p className="text-[#EF939D] font-light text-sm">
                  <span className="mr-4 line-through	">$250</span>
                  <span>$150</span>{" "}
                </p>
              </div>
              <p className="text-[#EF939D] font-semibold text-sm">
                join life
              </p>
            </div>
            <div className="w-full sm:w-fit ">
              <div className="relative mb-2">
                <img className="w-full" src="assets/s5.png" alt="blouse" />
                <p className="font-[Poppins] absolute top-[15px] right-0 bg-[#011F4B] text-white py-1 px-5">
                  out of stock
                </p>
              </div>
              <div className="flex justify-between font-[Poppins]">
                <p className="font-medium text-[#011F4B]">White Blouse</p>
                <p className="text-[#EF939D] font-light text-sm">
                  <span className="mr-4 line-through	">$250</span>
                  <span>$150</span>{" "}
                </p>
              </div>
              <p className="text-[#EF939D] font-semibold text-sm">
                join life
              </p>
            </div>
            <div className="w-full sm:w-fit ">
              <div className="relative mb-2">
                <img className="w-full" src="assets/s6.png" alt="blouse" />
                <p className="font-[Poppins] absolute top-[15px] right-0 bg-[#011F4B] text-white py-1 px-5">
                  out of stock
                </p>
              </div>
              <div className="flex justify-between font-[Poppins]">
                <p className="font-medium text-[#011F4B]">White Blouse</p>
                <p className="text-[#EF939D] font-light text-sm">
                  <span className="mr-4 line-through	">$250</span>
                  <span>$150</span>{" "}
                </p>
              </div>
              <p className="text-[#EF939D] font-semibold text-sm">
                join life
              </p>
            </div>
            <div className="w-full sm:w-fit ">
              <div className="relative mb-2">
                <img className="w-full" src="assets/s7.png" alt="blouse" />
                <p className="font-[Poppins] absolute top-[15px] right-0 bg-[#011F4B] text-white py-1 px-5">
                  out of stock
                </p>
              </div>
              <div className="flex justify-between font-[Poppins]">
                <p className="font-medium text-[#011F4B]">White Blouse</p>
                <p className="text-[#EF939D] font-light text-sm">
                  <span className="mr-4 line-through	">$250</span>
                  <span>$150</span>{" "}
                </p>
              </div>
              <p className="text-[#EF939D] font-semibold text-sm">
                join life
              </p>
            </div>
          </>
        )}
      </section> */}






      <section>


        {/* <div className="py-[30%] md:py-[25%] lg:py-[14%] mb-3" style={{
          backgroundImage: `url(/assets/menfashion.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
          <Link to="/men-collection">
            <h2 className="font-[Quicksand] ml-2 z-[1] relative text-[#011F4B] p-2 text-left font-bold text-xl md:text4xl lg:text-8xl">
              Men's Fashion

            </h2></Link>
          <p className="font-[Quicksand] w-[200px] md:w-[50%] text-center p-2 bg-[#cdefe6] font-semibold rounded-lg text-[#000] text-lg md:text-xl m-4">
            Elevate your style with the latest in men’s fashion. From casual essentials to sophisticated statements,
            we offer a variety of pieces that make dressing sharp effortless and stylish.
          </p>

        </div> */}


      </section>
      <hr className="my-5" />






      <section className="px-10 py-6 text-center ">
        <p className="font-[Quicksand] font-medium text-[#011F4B] text-center text-lg  md:text-4xl mb-2 border-3">
          EXPLORE TOP BRANDS
        </p>


        <div className="flex justify-center items-center">
          {brands.length ? (
            <Swiper
              loop={true}
              className="mySwiper"
              modules={[Autoplay]}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                // For small devices, show 1 slide
                0: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                // For medium screens, show 2 slides
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                // For large screens, show 3 slides
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
            >
              {brands.map((brand, i) => {
                return (
                  <SwiperSlide key={i}>
                    <div className="bg-[#F6F6F6] rounded-lg h-full w-full px-5 py-[15px]">
                      <Link to={`/collections?brand=${brand?._id}`}>
                        <img
                          className="my-2 m-auto h-10"
                          src={brand.logo}
                          alt={brand.name}
                          loading="lazy"
                        />
                        <p className="font-[Quicksand] text-center font-medium text-2xl text-[#292929]">
                          {brand.onGoingOffer}
                        </p>
                      </Link>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <h2 className="font-[Quicksand] font-medium text-center text-2xl text-[#011F4B]">
              No Brands Available
            </h2>
          )}
        </div>




      </section>

      <section className="p-2">
        <Link to="/product_category/eyewear">
          <p className="font-[Quicksand]  text-center text-[#011F4B] font-bold text-lg  md:text-4xl">
            Explore Goggles
          </p>
        </Link>
        <p className="font-[Poppins] font-light text-center text-[#949494] mb-3">
          Discover trendy and protective eyewear for every occasion
        </p>


        <ul className="flex flex-wrap justify-center">
          {allProducts.length ? (
            allProducts
              .filter((item) => item?.category?.name === "Eyewear")
              .map((data, index) => {
                return (
                  <li className="w-[80px] lg:w-1/6 m-1" >
                    <Link to={`/product-details/${data.productId}`} key={index}>
                      <div className="relative">
                        <img src={data?.bannerImage || "assets/goggles.png"} alt={data.name} className="sm:w-[1/2] lg:h-[180px] rounded-lg h-[80px] w-[100%]" />
                        <p className="text-black p-1 font-semibold flex justify-between items-center text-[8px] lg:text-[14px]  rounded-lg shadow-sm">
                          <span className="font-[Quicksand] font-bold truncate text-[10px] lg:text-[16px] tracking-wide">
                            {data.name.toUpperCase()}
                          </span>
                          <span className="font-[Quicksand] font-extrabold ml-4 text-[10px] lg:text-[16px] ">
                            {"₹" + data.price}
                          </span>
                        </p>

                      </div>
                    </Link>
                  </li>
                );
              })
          ) : (
            <h2 className="font-[Quicksand] font-medium text-center text-4xl text-[#011F4B]">
              No Eyewear Available
            </h2>
          )}
        </ul>
      </section>
      <section className="p-2">
        <Link to="/product_category/winterwear">
          <p className="font-[Quicksand]  text-center text-[#011F4B] font-bold text-lg  md:text-4xl">
            WINTER WEAR
          </p>
        </Link>

        <p className="font-[Poppins] font-light text-center text-[#949494] mb-4">
          Explore cozy and stylish options for the chilly season

        </p>


        <ul className="flex flex-wrap justify-center">
          {allProducts.length ? (
            allProducts
              .filter((item) => item?.category?.name === "Winterwear")
              .map((data, index) => {
                return (
                  <li className="w-[80px] lg:w-1/6 m-1" >
                    <Link to={`/product-details/${data.productId}`} key={index}>
                      <div className="relative">
                        <img src={data?.bannerImage || "assets/goggles.png"} alt={data.name} className="sm:w-[1/2] lg:h-[180px] h-[80px] w-[100%] rounded-lg" />
                        <p className="text-black p-1 font-semibold flex justify-between items-center text-[8px] lg:text-[14px]  rounded-lg shadow-sm">
                          <span className="font-[Quicksand] font-bold truncate text-[10px] lg:text-[16px] tracking-wide">
                            {data.name.toUpperCase()}
                          </span>
                          <span className="font-[Quicksand] font-extrabold ml-4 text-[10px] lg:text-[16px]">
                            {"₹" + data.price}
                          </span>
                        </p>


                      </div>
                    </Link>
                  </li>
                );
              })
          ) : (
            <h2 className="font-[Quicksand] font-medium text-center text-4xl text-[#000]">
              No Eyewear Available
            </h2>
          )}
        </ul>
      </section>
      <section className="px-10 py-3">
        <p className="font-[Quicksand] text-center font-bold text-[#949494] text-6xl">
          That’s it!
        </p>

        <button className="font-quicksand font-medium text-xl text-[#011F4B] rounded bg-white shadow hover:shadow-lg transition-all duration-300 m-auto py-1 px-2 border-2 border-[#011F4B] mt-4 flex items-center gap-2 hover:bg-[#011F4B] hover:text-white">
          EXPLORE ACCESSORIES
          <MdArrowOutward className="text-xl transition-all" />
        </button>

      </section>

      <section className="bg-[#F6F6F6] px-5 py-5 ">
        <p className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Testimonials
          <span className="block h-1 w-16 bg-blue-500 mx-auto mt-2 rounded"></span>
        </p>
        <h2 className="font-[Quicksand] font-medium text-[#011F4B] text-center text-lg  md:text-4xl mb-2 border-3">
          WHAT THEY ARE SAYING
          <div className="w-[15%] md:w-[5%] h-[3px] bg-[#011F4B] m-auto mt-[2%]"></div>
        </h2>
        <Swiper
          navigation={true}
          loop={true}
          modules={[Autoplay, Navigation]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="mySwiper"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="w-full font-[Poppins] flex flex-col justify-center items-center">
                <p className="text-[#949494] w-2/3 font-light text-lg p-4 text-center">
                  "{testimonial.text}"
                </p>
                <p className="text-[#011F4B] font-medium text-center mb-2">
                  {testimonial.name}
                </p>
                <p className="text-[#949494] font-light text-sm text-center">
                  {testimonial.designation}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>;
      </section>
    </>
  );
}
