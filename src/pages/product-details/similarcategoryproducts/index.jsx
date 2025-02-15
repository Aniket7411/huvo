import { useEffect, useState } from "react"
import { HttpClient } from "../../../server/client/http"
import { toast } from "react-toastify"
import { PiCurrencyInr } from "react-icons/pi"
import { Link } from "react-router-dom"
import { FaArrowRight } from "react-icons/fa"
import Loader from "../../../components/loader"
import { CiDeliveryTruck, CiDiscount1 } from "react-icons/ci"

const SimilarProducts = () => {
  const [trendingProducts, setTrendingProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)


  const getCategoryProducts = async () => {
    setIsLoading(true)
    try {
      const response = await HttpClient.get("/product")

      console.log(response)
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
      setTrendingProducts(formattedData)
      console.log("formattedData", formattedData)
      setIsLoading(false)
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  }


  useEffect(() => {
    getCategoryProducts()
  }, [])

  return (

    <>
      {
        isLoading ? <Loader /> : <>
          <div className="md:flex flex-wrap hidden  justify-between gap-2">
            {trendingProducts.map((eachProduct) => {
              const finalPrice = eachProduct.price - eachProduct.discount

              return (
                <div className="bg-white flex flex-col items-center rounded-2xl p-3 shadow-lg border border-gray-200 w-[1/5]">
                  <h1 className="text-black font-quicksand font-bold text-xl mb-1 text-center">
                    {eachProduct?.productName
                      || "Product Name"}
                  </h1>

                  <img
                    src={eachProduct?.bannerImage || "https://via.placeholder.com/300"}
                    alt={eachProduct?.name || "Product Image"}
                    className="h-40 w-40  object-cover rounded-md mb-1"
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


                  <div className="flex items-center text-green-600 gap-1/2">
                    <PiCurrencyInr />

                    <p className=" font-semibold">{finalPrice} /-</p>
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


          <div className="flex p-auto md:hidden flex-wrap gap-2 justify-center ">
            {trendingProducts.map((each, index) => {

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
          <hr className="my-5" />
        </>
      }

    </>


  )
}



export default SimilarProducts