import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { FaArrowRight } from "react-icons/fa";

export default function MenCollection() {
  const [allCategories, setAllCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
      const [trendingProducts, setTrendingProducts] = useState([])
    
  


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
  }, []);


  const menProducts = allProducts.filter((item) => item.group === "men").splice(0, 8);


  return (
    <>

<div class="text-center mt-4">
  <h1 class="text-3xl font-bold text-gray-800">Men's Clothing</h1>
  <p class="text-lg text-[#2563eb] mt-2">
    Explore the latest trends and styles in men's fashion. From casual wear to formal attire, find the perfect outfit for every occasion.
  </p>
</div>

      <section>



<div class="flex justify-center items-center mt-2">
  <div class="bg-black p-4 rounded-2xl  shadow-lg w-full">
    <video class="w-[100vw] rounded-lg h-[200px]" controls>
      <source src="assets/mensshoppingvideo.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</div>

     
      </section>
      <section className="md:px-[10%] px-[2%]  py-2">
        <div className="flex items-center gap-2 my-2">
        <h2
            className="font-[Quicksand] font-medium text-center text-2xl sm:text-sm md:text-4xl bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(90deg, #007bff, #f8d00f, #007bff)", // Blue to Yellow Gradient
              backgroundSize: "200% auto",
              backgroundPosition: "0% 50%",
              animation: "flow-gradient 3s linear infinite",
            }}
          >
            CATEGORIES
          </h2>
        <p className="font-[Poppins] font-normal text-[#949494] m-auto text-center w-full  mb-2">
          Unleash Your Boldness with Fashion that Defines Strength and Style.

        </p>
        </div>
        <ul className="flex flex-wrap justify-center">
          {allCategories.length ? (
            allCategories.map((category, i) => {
              const [groupDetails] = category?.group.filter((g) => g.name === "men");
              return (
                <li key={i} style={{
                  outline : "1px solid gray"
                }} className="w-[45%] bg-[#fff] p-2 rounded-lg  sm:w-[30%] md:w-[22%] lg:w-[15%] m-1">
                  <Link to={`/collections?category=${category?._id}&group=men`}>
                    <div className="relative mb-2">
                      <img
                        className="md:h-[250px] h-[100px] object-cover w-full rounded-lg"
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

      <hr className="my-2"/>

<div  className="flex-wrap px-6 justify-between gap-2 hidden md:flex">
           {menProducts.map((eachProduct) => {
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
        {menProducts.map((each, index) => (
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

       <hr className="my-2"/>
    </>
  );
}
