import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { FaArrowRight, FaFilter, FaStar } from "react-icons/fa";
import { PiCurrencyInr } from "react-icons/pi";
import { CiDeliveryTruck, CiDiscount1, CiFilter } from "react-icons/ci";
import ProductsCarousel from "../productcarousel";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useParams } from "react-router-dom";


import Loader from "../../components/loader";

import { FaFilterCircleXmark } from "react-icons/fa6";


export default function CategorySearh() {
  const location=useLocation();
  const [allCategories, setAllCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const { category, id } = useParams(); // Extract route params

  //console.log("idididid", id)




  const [searchTerm, setSearchTerm] = useState("");
 
 const [filtersVisible, setFiltersVisible] = useState(false);






 







  //if location param length 4 , fetch category based , otherwise other thing
  const fetchAllProducts = async () => {
    try {
      let locationLength=location.pathname.split('/').length;

      if(locationLength===3){
        //do something
        const response = await HttpClient.get("/product",{
          searchApplied:true,
          category:location.pathname.split('/')[2]
        });
      setAllProducts(response.products);


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
        actualPrice: eachProduct.actualPrice
      }))
      setAllProducts(formattedData)
      }
      else{
        //do other thing
        const response = await HttpClient.get("/product");
      setAllProducts(response.products);


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
      console.log("formattedData",formattedData)
      }
      

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
    fetchAllProducts();

  }, []);


  const menProducts = allProducts.filter((item) => item?.group === "men").splice(0, 8);

  return (
    <div className="h-auto">

      


      {/* Filter Button for Small Screens */}
      <div className="top-0 left-0 w-full bg-white shadow-md z-10 px-2 flex justify-between lg:hidden border border-gray-300 rounded-lg ring-1 ring-blue-300">
        {/* <h2 className="text-lg font-bold text-gray-800">Filter</h2> */}

        <button
          onClick={() => setFiltersVisible(!filtersVisible)}
          className="text-blue-600 font-semibold focus:outline-none px-3 py-2 border border-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
        >
          {filtersVisible ? <FaFilterCircleXmark size={25} /> : <CiFilter size={25} />}
        </button>
      </div>


      {/* Filter Sidebar */}


       







          {/* Desktop Grid Section */}
          <section className="bg-gradient-to-t from-[#aed3f4] to-[#fff]">

            {searchTerm !== "" ? (
              <h1 className="font-bold font-inter px-3 py-1">
                Search Results for '{searchTerm}'
              </h1>
            ) : (
              <h1 className="font-bold font-inter px-3 py-1 text-gray-500">
                Exploring Products You'll Love!
              </h1>
            )}


            <section className="hidden md:block">
            <div className="p-4 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {menProducts.map((eachProduct, i) => {
                const finalPrice = eachProduct.price - eachProduct.discount;
                return (
                  <div
                    key={i}
                    className="bg-white flex flex-col rounded-xl p-3 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Product Image */}
                    <div className="w-full aspect-square mb-3 overflow-hidden rounded-md">
                      <img
                        src={eachProduct?.bannerImage || "https://via.placeholder.com/300"}
                        alt={eachProduct?.name || "Product Image"}
                        className=" h-52 w-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Details */}
                    <h1 className="text-black font-semibold text-lg line-clamp-2 mb-2">
                      {eachProduct?.productName.slice(0,30) || "Product Name"}
                    </h1>

                    {/* Product Rating */}
                    <div className="flex items-center gap-2 text-gray-700 text-sm mb-2">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, index) => (
                          <FaStar key={index} className="w-4 h-4" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">(200+ orders)</span>
                    </div>

                    {/* Pricing Details */}
                    <div className="flex justify-between items-center text-sm mb-2">
                      <div className="flex items-center gap-1 text-red-600">
                        <PiCurrencyInr />
                        <p className="line-through font-medium">{eachProduct?.price}</p>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <CiDiscount1 />
                        <PiCurrencyInr />
                        <p className="font-medium">{eachProduct?.discount} off</p>
                      </div>
                    </div>

                    {/* Final Price */}
                    <div className="flex justify-between items-center text-lg font-bold text-gray-800 mb-3">
                      <div className="flex items-center">
                        <PiCurrencyInr />
                        <span>{finalPrice}</span>
                      </div>
                      {/* <span className="text-green-500 text-sm">Free Delivery</span> */}
                    </div>

                    {/* View Product Button */}
                    <Link to={`/product-details/${eachProduct?.productId}`} className="w-full">
                      <button className="w-full flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-all">
                        View Product <FaArrowRight className="ml-2" />
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
            </section>

            {/* Mobile Grid Section */}
            <div className="md:hidden grid grid-cols-2 gap-3 p-3">
              {menProducts.map((each, index) => {
                const finalPrice = each.price - each.discount;
                return (
                  <div
                    key={index}
                    className="bg-white flex flex-col rounded-lg shadow-sm p-2 border border-gray-200"
                  >
                    <Link to={`/product-details/${each?.productId}`}>
                      <div className="aspect-square w-full mb-1">
                        <img
                          src={each?.bannerImage || "https://via.placeholder.com/300"}
                          alt={each?.name || "Product Image"}
                          className="h-full w-full object-cover rounded-md"
                          loading="lazy"
                        />
                      </div>

                      <h2 className="font-semibold text-gray-800 text-sm line-clamp-2">
                        {each?.productName || "Product Name"}
                      </h2>

                      <div className="flex justify-between mt-1">
                        <div className="flex items-center gap-1">
                          <PiCurrencyInr className="text-xs" />
                          <p className="line-through text-red-600 text-xs font-semibold">{each?.price}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <PiCurrencyInr className="text-xs" />
                          <p className="text-xs">{each?.discount}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-green-600 gap-1 mt-1">
                        <PiCurrencyInr className="text-xs" />
                        <p className="font-semibold text-xs">{finalPrice} /-</p>
                      </div>

                      <button
                        type="button"
                        className="bg-[#011F4B] text-white px-2 py-1 rounded-lg text-xs mt-2 w-full"
                      >
                        View Product
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>













    </div>
  );
}
