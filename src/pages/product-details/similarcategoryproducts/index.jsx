import { useEffect, useState } from "react"
import { HttpClient } from "../../../server/client/http"
import { toast } from "react-toastify"
import { PiCurrencyInr } from "react-icons/pi"
import { Link } from "react-router-dom"
import { FaArrowRight } from "react-icons/fa"
import Loader from "../../../components/loader"
import { CiDeliveryTruck, CiDiscount1 } from "react-icons/ci"
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";



const SimilarProducts = (props) => {
  const { recommendedProducts, loading } = props
  const [trendingProducts, setTrendingProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");


  const handleSearch = () => {
    console.log("Search Term:", searchTerm);
    console.log("Sort Option:", sortOption);
    // Add your search logic here
  };
  console.log("recommendedProducts", recommendedProducts)


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
        recommendedProducts === undefined ? <Loader /> : <>
          <div style={{ padding: "10px" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
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

          







          <hr className="my-5" />
        </>
      }

    </>


  )
}


export default SimilarProducts