import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { FaArrowRight } from "react-icons/fa";
import { PiCurrencyInr } from "react-icons/pi";
import { CiDeliveryTruck, CiDiscount1 } from "react-icons/ci";
import ProductsCarousel from "../productcarousel";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";


export default function MenCollection() {
  const [allCategories, setAllCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  let timeout = null;

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Clear previous timeout
    clearTimeout(timeout);

    // Set new timeout to filter products after 3 seconds
    timeout = setTimeout(() => {
      filterProducts(term);
    }, 3000);
  };

  const filterProducts = async (term) => {
    try {
      const response = await HttpClient.get("api", { params: { q: term } });
      setFilteredProducts(response.data); // Adjust based on API response structure
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    console.log("Sort Option:", event.target.value);
    // Add sorting logic here if needed
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
      setAllProducts(formattedData)

    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };


  const getAllCategories = async () => {
    try {
      const { categories } = await HttpClient.get("/category?group=men");
      setAllCategories(categories);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.response?.data?.error
      );
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCategories();
    fetchAllProducts();
    filterProducts()
  }, []);


  const menProducts = allProducts.filter((item) => item.group === "men").splice(0, 8);


  return (
    <>

      <div class="text-center mt-4">
        <h1 class="text-3xl font-bold text-gray-800 mt-[60px]" >Men's Clothing</h1>

      </div>

      <section>




      </section>
      <section className="md:px-[10%] px-[2%]  py-1">


        <p className="font-[Poppins] font-normal text-center  mb-2 text-lg text-[#2581eb] mt-2">
          Explore the latest trends and styles in men's fashion. From casual wear to formal attire, find the perfect outfit for every occasion.

        </p>

        <ul className="flex flex-wrap justify-center">
          {allCategories.length ? (
            allCategories.map((category, i) => {
              const [groupDetails] = category?.group.filter((g) => g.name === "men");
              return (
                <li key={i} style={{
                  outline: "1px solid gray"
                }} className="w-[45%] bg-[#fff] p-2 rounded-lg  sm:w-[30%] md:w-[22%] lg:w-[15%] m-1">
                  <Link to={`/collections?category=${category?._id}&group=men`}>
                    <div className="relative mb-2">
                      <img
                        className="md:h-[220px]  h-[100px] object-cover w-full rounded-lg"
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

      <hr className="my-2" />
      <section className="bg-gradient-to-t from-[#aed3f4] to-[#fff]">

      <div className="flex" style={{ padding: "10px", maxWidth: "300px" }} >
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search for clothes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />

          {/* Sorting Dropdown */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <option value="">Sort By</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
            <option value="newArrivals">New Arrivals</option>
          </select>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            style={{
              padding: "8px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>
      </div>

      <div style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
          {menProducts.map((eachProduct, i) => {
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

      <hr className="my-5" />

      <div style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",

      }} className="md:flex  flex-wrap hidden p-5  justify-center gap-2">
        {menProducts.map((eachProduct) => {
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
        {menProducts.map((each, index) => {

          const finalPrice = each.price - each.discount

          return (
            (
              <div
                key={index}
                className="w-[45%] h-auto  flex flex-col   bg-white rounded-lg shadow-md p-2 border border-gray-200"
              >

                <Link to={`/product-details/${each?.productId}`}>


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

                    <div className="flex items-center text-green-600 gap-1/2">
                      <PiCurrencyInr />

                      <p className=" font-semibold">{finalPrice} /-</p>
                    </div>


                    <div className="flex items-center gap-2">
                      <CiDeliveryTruck />
                      <p className="font-semibold items-end">Free delivery</p>

                    </div>

                  </div>
                </Link>
              </div>
            )
          )
        })}
      </div>
      </section>
    </>
  );
}
