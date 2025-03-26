import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { FaArrowRight } from "react-icons/fa";
import { CiDeliveryTruck, CiSearch } from "react-icons/ci";
import { TbJewishStarFilled } from "react-icons/tb";

import { useParams } from "react-router-dom";
import { PiCurrencyInr } from "react-icons/pi";

export default function ProductsByBrands() {
  const [allProducts, setAllProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("")
  const [sortOrder, setSortOrder] = useState("");
  const [selectedSize, setSelectedSize] = useState(""); // State for size selection
  const { brandName } = useParams();

  console.log("brandName", brandName)





  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleSelectBrand = (brandName) => {
    setSelectedBrand(brandName);
    closeDropdown(); // Close dropdown after selection
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
      console.log("formattedBrands", formattedBrands)
      setBrands(formattedBrands)

    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };




  useEffect(() => {
    fetchAllProducts();
    getAllBrands();
  }, []);




  return (
    <>

      <div class="text-center px-5">
        <h1 className="text-3xl  text-center bg-clip-text text-transparent"
          style={{
            background: "linear-gradient(to right, #2563eb, #eb25de)",
            WebkitBackgroundClip: "text", // Ensures compatibility with WebKit browsers
            backgroundClip: "text",
            color: "transparent", // Required for text gradient to show
          }}>
          Iconic Brands for Every Style
        </h1>
        <p className="hidden md:block"
          style={{
            background: "linear-gradient(to right, #2563eb, #eb25de)",
            WebkitBackgroundClip: "text", // Ensures compatibility with WebKit browsers
            backgroundClip: "text",
          }}
        >
          Celebrate individuality with top brands offering the latest trends and timeless classics. Discover fashion that suits every identity and occasion.
        </p>


      </div>


      <section>




      </section>


      <hr className="my-2" />

      <div className="flex flex-wrap gap-2 items-center  bg-gray-50 rounded-lg shadow">
        {/* Search Box */}
        <div className="flex items-center border border-gray-300 bg-[#fff] rounded-lg px-2 py-1 w-full md:w-auto">
          <CiSearch className="text-gray-500 mr-2" />
          <input
            type="search"
            placeholder="Search Product"
            className="w-full focus:outline-none bg-transparent"
          />
        </div>

        {/* Brand Dropdown */}

        <div className="relative w-64">
          {/* Dropdown Trigger */}
          <div
            className="border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none cursor-pointer"
            onClick={toggleDropdown}
          >
            <span>{selectedBrand || "All Brands"}</span>
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <ul
              className="absolute z-10 bg-white border border-gray-300 mt-1 rounded-lg shadow-lg max-h-64 overflow-y-auto w-full"
              onBlur={closeDropdown}
              tabIndex={-1} // Allow the menu to lose focus when clicked outside
            >
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectBrand("")}
              >
                All Brands
              </li>
              {brands.map((each) => (
                <li
                  key={each.brandId}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectBrand(each.brandName)}
                >
                  <img
                    src={each.image}
                    alt={each.brandName}
                    className="w-6 h-6 mr-2"
                  />
                  {each.brandName}
                </li>
              ))}
            </ul>
          )}
        </div>





        {/* Sorting Dropdown */}
        <select
          className="border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by Price</option>
          <option value="Low to High">Low to High</option>
          <option value="High to Low">High to Low</option>
        </select>


        {/* Sorting Dropdown */}
        <select className="border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none">
          <option>Category</option>
          <option>Men</option>
          <option>Women</option>
          <option>Kids</option>
        </select>

        {/* 
        <select className="border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none">
          <option>Wear Category</option>
          <option>Top Wear</option>
          <option>Bottom Wear</option>
          <option>Outerwear</option>
          <option>Ethnic Wear</option>
          <option>Innerwear & Loungewear</option>
          <option>Footwear</option>
          <option>Activewear</option>
          <option>Accessories</option>
          <option>Seasonal Wear</option>
        </select> */}


        {/* Size Dropdown */}
        <select
          className="border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none"
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
        >
          <option value="">Select Size</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>

      </div>


      <hr className="my-2" />




      <div className="flex-wrap px-6 justify-between gap-2 hidden md:flex">
        {allProducts.map((eachProduct) => {
          return (
            <div className="bg-white flex flex-col items-center rounded-2xl p-3 shadow-lg border border-gray-200 w-[1/5]">
              <h1 className="text-black font-quicksand font-bold text-xl mb-1 text-center">
                {eachProduct?.productName
                  || "Product Name"}
              </h1>

              <img
                src={eachProduct?.bannerImage || "https://via.placeholder.com/300"}
                alt={eachProduct?.name || "Product Image"}
                className="h-40  w-40  object-cover rounded-full mb-1"
              />

              {/* Product Name */}
              <p className="text-lg font-semibold mb-1 text-gray-700">
                {eachProduct?.brandName || "Brands Name"}
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
              <Link to={`/product-details/${eachProduct?.productId}`} className="block mt-2 ">
                <button className="flex items-center justify-center bg-[#011F4B] text-white px-2 py-1 rounded-lg text-md  hover:bg-[#02386e] transition-colors duration-200">
                  Product Details
                  <FaArrowRight className="ml-2" />
                </button>
              </Link>  {/* Product Name */}


            </div>
          )
        })}
      </div>
      <hr className="my-2" />


      <div className="flex p-auto md:hidden flex-wrap gap-2 justify-center ">
        {allProducts.map((each, index) => {

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

      <hr className="my-2" />
    </>
  );
}


