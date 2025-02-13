import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { FaArrowRight } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

export default function ProductsByBrands() {
  const [allProducts, setAllProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("")
  const [sortOrder, setSortOrder] = useState("");



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

      <div class="text-center mt-4">
        <h1 class="text-4xl font-extrabold text-gray-900">
          Iconic Brands for Every Style
        </h1>
        <p
          className="text-lg mt-2 text-center bg-clip-text text-transparent"
          style={{
            background: "linear-gradient(to right, #2563eb, #eb25de)",
            WebkitBackgroundClip: "text", // Ensures compatibility with WebKit browsers
            backgroundClip: "text",
            color: "transparent", // Required for text gradient to show
          }}
        >
          Celebrate individuality with top brands offering the latest trends and timeless classics. Discover fashion that suits every identity and occasion.
        </p>


      </div>


      <section>




      </section>


      <hr className="my-2" />

      <div className="flex flex-wrap gap-4 items-center p-3 bg-gray-50 rounded-lg shadow">
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
        <select
          className="border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map((each) => (
            <option value={each.brandName} key={each.brandId}>
              {each.brandName}
            </option>
          ))}
        </select>





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
        </select>

      </div>


      <hr className="my-5" />




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
      <hr className="my-5" />

      <div className="flex p-2 md:hidden flex-wrap items-center gap-2 ">
        {allProducts.map((each, index) => (
          <div
            key={index}
            className="w-[31%] flex flex-col  items-center bg-white rounded-lg shadow-md p-2 border border-gray-200"
          >


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
          </div>
        ))}
      </div>

      <hr className="my-2" />
    </>
  );
}


