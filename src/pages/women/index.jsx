import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { FaArrowRight } from "react-icons/fa";
import { PiCurrencyInr } from "react-icons/pi";
import { CiDeliveryTruck, CiDiscount1, CiSearch } from "react-icons/ci";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import Brandslider from "../brands";


export default function WomenCollection() {
  const [allCategories, setAllCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  const handleSearch = () => {
    console.log("Search Term:", searchTerm);
    console.log("Sort Option:", sortOption);
    // Add your search logic here
  };


  const getAllCategories = async () => {
    try {
      const { categories } = await HttpClient.get("/category?group=women");
      setAllCategories(categories);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
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
      }))
      setAllProducts(formattedData)

    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };


  useEffect(() => {
    fetchAllProducts();
    getAllCategories();
  }, []);

  const womenProducts = allProducts.filter((item) => item.group === "women").splice(0, 8);
  console.log("womenProducts", womenProducts)


  return (
    <>

      <div class="text-center mt-4">
        <h1 class="text-3xl font-bold mt-[60px] text-gray-800" >Women's Clothing</h1>

        <p className=" text-[#eb25de] font-[Poppins] font-normal text-center  mb-2 text-sm md:text-lg  mt-2 ">
            Discover the latest trends and styles in women's fashion. From elegant dresses to casual outfits, find the perfect look for every occasion.

          </p>
      </div>


    


      <section className="md:px-[5%] px-[2%]  py-1">
          
        
        <ul className="flex flex-wrap justify-center">
          {allCategories.length ? (
            allCategories.map((category, i) => {
              const [groupDetails] = category?.group.filter((g) => g.name === "women");
              return (
                <li key={i} style={{
                  outline: "1px solid gray"
                }} className="w-[45%] bg-[#fff] p-2 rounded-lg  sm:w-[30%] md:w-[22%] lg:w-[15%] m-1">
                  <Link to={`/collections?category=${category?._id}&group=women`}>
                    <div className="relative mb-2">
                      <img
                        className="md:h-[220px]  h-[90px] object-cover w-full rounded-lg"
                        src={groupDetails?.image}
                        alt={groupDetails?.name}
                      />
                      <p className="font-[Quicksand] absolute bottom-0 font-medium text-xl tracking-wide bg-[#969696A8] w-full text-center text-white py-1 px-2 uppercase">
                        {category?.name}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })
          ) : (
            <h2 className="font-[Quicksand] font-medium text-center text-4xl text-[#011F4B]">
              No Categories Available
            </h2>
          )}
        </ul>





      </section>

      <Brandslider />


      <section className="bg-gradient-to-t from-[#fdbdff] to-[#fff]">

      <hr className="my-2" />
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 p-4">
  {/* Search Input */}
  <input
    type="text"
    placeholder="Search for clothes..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full sm:w-48 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label="Search products"
  />

  {/* Sorting Dropdown */}
  <select
    value={sortOption}
    onChange={(e) => setSortOption(e.target.value)}
    className="w-full sm:w-48 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label="Sort products"
  >
    <option value="">Sort By</option>
    <option value="lowToHigh">Price: Low to High</option>
    <option value="highToLow">Price: High to Low</option>
    <option value="newArrivals">New Arrivals</option>
  </select>

  {/* Search Button */}
  <button
    onClick={handleSearch}
    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label="Search"
  >
    Search
  </button>
</div>


      <div style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
 
      }} className="md:flex flex-wrap hidden p-5  justify-between gap-2">
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
          {womenProducts.map((eachProduct, i) => {
            const finalPrice = eachProduct.price - eachProduct.discount;

            return (
              <SwiperSlide key={i}>
                <div className="bg-white flex flex-col items-center rounded-2xl p-3 shadow-lg border border-gray-200 w-full">
                  <img
                    src={eachProduct?.bannerImage || "https://via.placeholder.com/300"}
                    alt={eachProduct?.name || "Product Image"}
                    className="h-40 w-40 object-cover rounded-md mb-1"
                  />

                  {/* Product Name */}
                  <h1 className="text-black font-quicksand font-bold text-xl mb-1 text-center">
                    {eachProduct?.productName || "Product Name"}
                  </h1>

                  <div className="flex items-center gap-4 text-gray-700 mt-1">
                    <p className="flex items-center text-sm font-semibold">
                      <span className="text-yellow-500 mr-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                        </svg>
                      </span>
                      Rating: 4.5 / 5
                    </p>
                    <p className="text-sm text-gray-500">200 Ordered last week</p>
                  </div>

                  <div className="flex justify-between w-full items-center">
                    {/* Original Price */}
                    <div className="flex items-center gap-1">
                      <PiCurrencyInr className="text-red-600" />
                      <p className="line-through text-red-600 font-semibold">{eachProduct?.price}</p>
                    </div>

                    {/* Discount Price */}
                    <div className="flex items-center gap-1">
                      <CiDiscount1 className="text-green-600" />{" "}
                      <PiCurrencyInr className="text-green-600" />
                      <p className="font-semibold text-green-600">{eachProduct?.discount}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full">
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
                  <Link to={`/product-details/${eachProduct?.productId}`} className="block mt-2">
                    <button className="flex items-center justify-center bg-[#011F4B] text-white px-3 py-1 rounded-lg text-md hover:bg-[#02386e] transition-colors duration-200">
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



      <div style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",

      }} className="md:flex  flex-wrap hidden p-5  justify-center gap-2">
        {womenProducts.map((eachProduct) => {
          const finalPrice = eachProduct.price - eachProduct.discount

          return (
            <div className="bg-white flex flex-col items-center rounded-2xl p-3 shadow-lg border border-gray-200 w-[1/5]">


              <img
                src={eachProduct?.bannerImage || "https://via.placeholder.com/300"}
                alt={eachProduct?.name || "Product Image"}
                className="h-40 w-40  object-cover rounded-md mb-1"
              />
              <h1 className="text-black font-quicksand font-bold text-xl ">
                {eachProduct?.productName
                  || "Product Name"}
              </h1>

              <div className="flex items-center gap-4 text-gray-700 mt-1">
                <p className="flex items-center text-sm font-semibold">
                  <span className="text-yellow-500 mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                    </svg>
                  </span>
                  Rating: 4.5 / 5
                </p>
                <p className="text-sm text-gray-500">200 Ordered last week</p>
              </div>

              <div className="flex justify-between w-[100%] items-center">
                {/* Original Price */}
                <div className="flex items-center gap-1">
                  <PiCurrencyInr className="text-red-600" />
                  <p className="line-through text-red-600 font-semibold">{eachProduct?.price}</p>
                </div>

                {/* Discount Price */}
                <div className="flex items-center gap-1">
                  <CiDiscount1 className="text-green-600" />{"-"}
                  <PiCurrencyInr className="text-green-600" />
                  <p className="font-semibold text-green-600">{eachProduct?.discount}</p>
                </div>
              </div>

              <div className="flex justify-between items-center w-[100%]">

                <div className="flex items-center text-green-600 gap-1/2">
                  <PiCurrencyInr />

                  <p className=" font-semibold">{finalPrice} /-</p>
                </div>

                <div className="flex items-center gap-2">
                  <CiDeliveryTruck />
                  <p className="font-semibold items-end">Free delivery</p>

                </div>
              </div>




              {/* Explore Button */}
              <Link to={`/product-details/${eachProduct?.productId}`} className="block mt-2 ">
                <button className="flex items-center justify-center bg-[#011F4B] text-white px-3 py-1 rounded-lg text-md  hover:bg-[#02386e] transition-colors duration-200">
                  Product Details
                  <FaArrowRight className="ml-2" />
                </button>
              </Link>  {/* Product Name */}


            </div>
          )
        })}
      </div>




      <div className="flex p-auto md:hidden flex-wrap gap-2 justify-center ">
        {womenProducts.map((each, index) => {

          const finalPrice = each.price - each.discount

          return (
            (
              <div
                key={index}
                className="w-auto  h-auto  flex flex-col   bg-white rounded-lg shadow-md p-2 border border-gray-200"
              >


                <Link to={`/product-details/${each?.productId}`} >


                  {/* Product Image */}
                  <img
                    src={each?.bannerImage || "https://via.placeholder.com/300"}
                    alt={each?.name || "Product Image"}
                    className="h-[150px]  object-cover rounded-md"
                  />
                  <div>
                    {/* Product Name */}
                    <h2 className=" font-semibold text-gray-800 text-sm">
                      {each?.productName || "Product Name"}
                    </h2>

                    <div className="flex justify-between">

                      <div className="flex items-center gap-1">
                        <PiCurrencyInr />

                        <p className="line-through text-red-600 font-semibold"> {each?.price}</p>
                      </div>


                      <div className="flex items-center  gap-1/2">

                        <PiCurrencyInr />

                        <p>{each?.discount}</p>

                      </div>
                    </div>

                    <div className="flex text-green-600 items-center gap-1/2">
                      <PiCurrencyInr />

                      <p className=" font-semibold">{finalPrice}/-</p>
                    </div>


                    <div className="flex items-center font-semibold  gap-2">
                      <CiDeliveryTruck />
                      <p className="text-sm  items-end">Free delivery</p>

                    </div>

                  </div>
                </Link>
              </div>
            )
          )
        })}
      </div>
      </section>
      <hr className="my-2" />


    </>
  );
}
