import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaFilter, FaStar } from "react-icons/fa";
import { PiCurrencyInr } from "react-icons/pi";
import { CiDiscount1 } from "react-icons/ci";
import CategorySlider from "../categoryslider";
import Loader from "../../components/loader";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { TbJewishStarFilled } from "react-icons/tb";

const ProductsShowingComponent = (props) => {
  const { allProducts } = props;




  console.log("allProductsallProductsallProducts", allProducts)
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [genderCategory, setGenderCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  // Initialize filtered products with all products
  useEffect(() => {
    setFilteredProducts(allProducts);
  }, [allProducts]);

  // Apply filters
  const applyFilters = () => {
    let filtered = [...allProducts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        (product.name &&
          product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.brandName &&
          product.brandName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Gender filter
    if (genderCategory !== "all") {
      filtered = filtered.filter(product =>
        product.group === genderCategory.toLowerCase()
      );
    }

    // Sort filter
    if (sortOrder === "low-to-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-to-low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };

  // Handler functions
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGenderCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setGenderCategory("all");
    setSortOrder("default");
    setFilteredProducts(allProducts);
  };

  // Apply filters when any filter state changes
  useEffect(() => {
    applyFilters();
  }, [searchQuery, genderCategory, sortOrder, allProducts]);



  return (

    <div className="h-auto">

      <section className="filter-section bg-white py-2 ">
        <div className="flex flex-col space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 md:p-2">
            <div className="flex flex-row justify-between items-center mb-1">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaFilter className="text-blue-500" />
                Filters
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                {showFilters ? (
                  <>
                    <span>Hide Filters</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Show Filters</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="flex flex-col md:flex-row gap-2 pt-2 border-t border-gray-200">

                <div className="flex-1 min-w-[200px]">
                  <label className="block font-medium text-gray-700 text-sm mb-2">
                    Find Products
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearch}
                      placeholder="Find by name or brand..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* <div className="flex-1 min-w-[200px]">
                  <label className="block font-medium text-gray-700 text-sm mb-2">
                    Gender Category
                  </label>
                  <select
                    value={genderCategory}
                    onChange={handleGenderChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div> */}

                <div className="flex-1 min-w-[200px]">
                  <label className="block font-medium text-gray-700 text-sm mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="default">Default</option>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                  </select>
                </div>


                <div className="flex-1 flex items-end min-w-[200px]">
                  <button
                    onClick={resetFilters}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FaFilterCircleXmark />
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>



      <div className="lg:w-full mx-auto">

        <section className="bg-gradient-to-t from-[#aed3f4] to-[#fff]">
          {searchQuery !== "" ? (
            <h1 className="font-bold font-inter px-3 py-1">
              Search Results for '{searchQuery}'
            </h1>
          ) : (
            <h1 className="font-bold mb-2 font-inter text-md md:text-3xl px-2 text-gray-500">
              Exploring Products You'll Love!
            </h1>
          )}

          {isLoading ? (
            <Loader />
          ) : filteredProducts && filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <Loader />
            </div>
          ) : (

            <>
              {/* small screen */}

              <div className="flex md:hidden flex-wrap justify-center items-center gap-1">

                {
                  filteredProducts && filteredProducts.length > 0 ? (
                    filteredProducts.map((eachProduct, i) => (
                      <div key={i} className="w-[49%] bg-[#fff] py-2 rounded-lg flex flex-col shadow-md ">
                        <Link to={`/product-details/${eachProduct?.productId}`}>

                          <img
                            src={eachProduct?.bannerImage || "https://via.placeholder.com/300"}
                            alt={eachProduct?.name || "Product Image"}
                            className="h-[150px] object-cover"
                            loading="lazy"
                          />                       
                         </Link>

                        <div className="px-3">
                          <h1 className="text-blue-600 font-semibold text-sm mt-1 mb-1">
                            {eachProduct?.name?.length > 20 ? `${eachProduct.name.slice(0, 25)}` : eachProduct?.name || "Product Name"}
                          </h1>
                          {/* Stars */}


                          <div className="flex gap-2 justify-between mb-1 items-center">

                            <p className="text-gray-600 text-sm ">
                              {eachProduct?.brandName || "Unknown Brand"}
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
                                eachProduct?.totalRating >= 50 ?
                                  eachProduct?.avgRating : "New"
                              }
                              <TbJewishStarFilled className="text-sm" />
                            </div>

                          </div>

                          {/* Pricing */}
                          <div className="flex justify-between items-center text-sm mb-1">
                            <p className="line-through font-medium text-red-600">{eachProduct?.actualPrice || "N/A"}</p>
                            <div className="flex items-center gap-1 text-green-600">
                              <PiCurrencyInr />
                              <p className="font-medium">{eachProduct?.price || "N/A"}</p>
                            </div>
                          </div>
                          <Link to={`/product-details/${eachProduct?.productId}`}>
                            <button className="bg-blue-600 text-white px-2 py-1 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-all">
                              View <FaArrowRight className="w-4 h-4" />
                            </button>
                          </Link>
                        </div>


                        <div className="flex justify-between items-center">
                          {/* <h1 className="text-black font-semibold text-lg line-clamp-2">
                            {eachProduct?.name?.length > 20 ? `${eachProduct.name.slice(0, 25)}` : eachProduct?.name || "Product Name"}
                          </h1> */}




                        </div>






                      </div>
                    ))
                  ) : (
                    <div className="text-center w-full text-gray-500 mt-4">
                      No products available.
                    </div>
                  )
                }


              </div>

              {/* large screen */}


              <div className=" hidden md:flex flex-wrap items-center p-2 justify-center gap-4">
                {filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map((eachProduct, i) => (
                    <div
                      key={i}
                      className="bg-white flex flex-col h-auto rounded-xl p-3 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300
                 w-full sm:w-[48%]  md:w-1/3 lg:w-1/5 xl:w-[23%] 2xl:w-[18%]"
                    >
                      {/* Product Image */}
                      <div className="w-full overflow-hidden rounded-md flex items-center justify-center">
                        <Link to={`/product-details/${eachProduct?.productId}`}>

                          <img
                            src={eachProduct?.bannerImage || "https://via.placeholder.com/300"}
                            alt={eachProduct?.name || "Product Image"}
                            className="h-[220px] w-full object-cover"
                            loading="lazy"
                          />
                        </Link>
                      </div>

                      {/* Product Name */}
                      <h1 className="text-blue-600 font-semibold text-lg ">
                        {eachProduct?.name?.length > 20 ? `${eachProduct.name.slice(0, 25)}` : eachProduct?.name || "Product Name"}
                      </h1>




                      <div className="flex gap-1 justify-between mb-1 items-center">

                        <p className="text-gray-600 text-md ">
                          {eachProduct?.brandName || "Unknown Brand"}
                        </p>
                        <div
                          className={`px-2 py-1 flex items-center rounded-md gap-1 text-white ${4.5 >= 3.5
                            ? "bg-green-500"
                            : 4.5 >= 3
                              ? "bg-yellow-500"
                              : "bg-red-400"
                            }`}
                        >
                          {
                            eachProduct?.totalRating >= 50 ?
                              eachProduct?.avgRating : "New"
                          }
                          <TbJewishStarFilled className="text-sm" />
                        </div>

                      </div>

                      {/* Pricing */}
                      <div className="flex justify-between items-center text-sm mb-1">
                        <div className="flex items-center gap-1 text-red-600">
                          <PiCurrencyInr />
                          <p className="line-through font-medium">{eachProduct?.actualPrice || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <CiDiscount1 />
                          <PiCurrencyInr />
                          <p className="font-medium">
                            {eachProduct?.actualPrice && eachProduct?.price
                              ? eachProduct.actualPrice - eachProduct.price
                              : "N/A"}{" "}
                            off
                          </p>
                        </div>
                      </div>

                      {/* Final Price */}
                      <div className="flex justify-between items-center text-lg font-bold text-gray-800 mb-1">
                        <div className="flex items-center">
                          <PiCurrencyInr />
                          <span>{eachProduct?.price || "N/A"}/-</span>
                        </div>
                      </div>

                      {/* Button */}
                      <Link to={`/product-details/${eachProduct?.productId}`} className="w-full">
                        <button className="w-full flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-all">
                          View Product <FaArrowRight className="ml-2" />
                        </button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center w-full text-gray-500 mt-4">
                    No products available.
                  </div>
                )}
              </div>



            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductsShowingComponent;