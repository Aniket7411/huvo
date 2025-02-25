import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { FaArrowRight } from "react-icons/fa";
import { PiCurrencyInr } from "react-icons/pi";
import { CiDeliveryTruck } from "react-icons/ci";

export default function KidsCollection() {
  const [allCategories, setAllCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);


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

  const kidsProducts = allProducts.filter((item) => item.group === "kids").splice(0, 8);


  return (
    <>
      <div class="text-center mt-4">
        <h1 class="text-3xl font-bold text-gray-800" style={{
          marginTop:"70px"
        }}>Kids's Clothing</h1>
        <p class="text-lg text-[#eb25de] mt-2">
          Discover the latest trends and styles in women's fashion. From elegant dresses to casual outfits, find the perfect look for every occasion.
        </p>
      </div>



      <section className="md:px-[5%] px-[2%]  py-2">

        <ul className="flex flex-wrap justify-center">
          {allCategories.length ? (
            allCategories.map((category, i) => {
              const [groupDetails] = category?.group.filter((g) => g.name === "kids");
              return (
                <li key={i} style={{
                  outline: "1px solid gray"
                }} className="w-[45%] bg-[#fff] p-2 rounded-lg  sm:w-[30%] md:w-[22%] lg:w-[15%] m-1">
                  <Link to={`/collections?category=${category?._id}&group=women`}>
                    <div className="relative mb-2">
                      <img
                        className="h-[300px] object-cover w-full rounded-lg"
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


      <div style={{
        backgroundImage: "url('/assets/productsbg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "auto",
        width: "100%",
      }} className="md:flex  flex-wrap hidden p-5  justify-center gap-2">
        {kidsProducts.map((eachProduct) => {
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

              <div className="flex justify-between">

                <div className="flex items-center gap-1">
                  <PiCurrencyInr />

                  <p className="line-through text-red-600 font-semibold"> {eachProduct?.price}</p>
                </div>


                <div className="flex items-center  gap-1/2">

                  <PiCurrencyInr />

                  <p>{eachProduct?.discount}</p>

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




      <div className="flex p-2 md:hidden flex-wrap items-center gap-2 ">
        {kidsProducts.map((each, index) => (
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
