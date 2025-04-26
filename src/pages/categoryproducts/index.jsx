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
import { Swiper, SwiperSlide } from "swiper/react";
import { FaFilterCircleXmark } from "react-icons/fa6";
import CategorySlider from "../categoryslider";
import BrandSlider from "../brands";
import ProductsShowingComponent from "../filterproductComponent";

export default function ProductByCategory() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();
  const [isLoading, setLoading] = useState(false);
  const searchWord = location.pathname.split("/")[2];

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [genderCategory, setGenderCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  // Function to fetch products from the API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await HttpClient.get("/product/productBySeach", {
        searchTerm: searchWord
      });

      const formattedData = response.data.map((eachProduct) => ({
        objectId: eachProduct._id,
        bannerImage: eachProduct.bannerImage,
        name: eachProduct.name,
        brandName: eachProduct.brand?.name || "Unknown Brand",
        brandImage: eachProduct.brand?.image,
        onGoingOffer: eachProduct.brand?.onGoingOffer,
        brandId: eachProduct.brand?.brandId,
        categoryId: eachProduct.category?.categoryId,
        categoryDescription: eachProduct.category?.description,
        productDescription: eachProduct.description,
        productDetails: eachProduct.productDetails?.[0] || "No details available",
        group: eachProduct.group?.toLowerCase() || "unisex",
        isReturnable: eachProduct.isReturnable,
        discount: eachProduct.discount,
        price: eachProduct.price,
        productId: eachProduct.productId,
        actualPrice: eachProduct.actualPrice
      }));

      setAllProducts(formattedData);
      setFilteredProducts(formattedData);
      setLoading(false);

    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...allProducts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        (product.productName &&
          product.productName.toLowerCase().includes(searchQuery.toLowerCase())) ||
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


  // Fetch products when search word changes
  useEffect(() => {
    fetchProducts();
  }, [searchWord]);

  return (
    <>

{
  isLoading ? (
    <div className="flex h-screen justify-center items-center">
      <Loader />
    </div>
  ) : allProducts && allProducts.length > 0 ? (
    <ProductsShowingComponent allProducts={allProducts} />
  ) : (
    <div className="flex flex-col justify-center items-center h-screen">
      {/* <img
        src="https://via.placeholder.com/150"
        alt="No Products"
        className="w-40 h-40 object-cover mb-4"
      /> */}
      <p className="text-gray-600 text-lg font-semibold">
        No products available!
      </p>
      <button
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
        onClick={() => window.location.reload()}
      >
        Refresh
      </button>
    </div>
  )
}






    </>
  );
}