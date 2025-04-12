import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { FaArrowRight, FaFilter, FaRegUserCircle } from "react-icons/fa";
import { PiCurrencyInr } from "react-icons/pi";
import { CiDeliveryTruck, CiDiscount1, CiFilter } from "react-icons/ci";
import ProductsCarousel from "../productcarousel";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useParams } from "react-router-dom";
import ProductGrid from "../mobileviewproduct";



import Loader from "../../components/loader";

import { Swiper, SwiperSlide } from "swiper/react";
import { FaFilterCircleXmark } from "react-icons/fa6";
import Brandslider from "../brands";
import CategorySlider from "../categoryslider";


export default function WomenCollection() {
  const [allCategories, setAllCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const { category, id } = useParams(); // Extract route params

  console.log("categorycategory", category)
  console.log("idididid", id)


  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [discountRange, setDiscountRange] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchGroup, setSearchGroup] = useState(category)

  const [allBrands, setAllBrands] = useState([])

  const colors = ["Red", "Blue", "Green", "Black", "White"];
  const brands = ["Nike", "Adidas", "Puma", "Reebok", "Under Armour"];
  const discounts = ["10% & Above", "20% & Above", "30% & Above", "50% & Above"];



  const handleSearch = () => {
    // Add your search logic here
    setFiltersVisible(false)

    console.log("Search Term:", searchTerm);
    console.log("Sort Option:", sortOption);
    console.log("Rating Filter:", ratingFilter);
    console.log("Selected Colors:", selectedColors);
    console.log("Selected Brands:", selectedBrands);
    console.log("Discount Range:", discountRange);
    const price = sortOption === "lowToHigh" ? "Low" : "High"

    const dataForFilter = {
      brand: selectedBrands,
      price,
      colors: selectedColors,
      searchTerm,
      group: "women"
    }

    console.log(dataForFilter)
  };

  const handleCheckboxChange = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Function to fetch products from the API
  const fetchProducts = async () => {
    setLoading(true);
    try {


      console.log("abbabbab", searchTerm, sortOption, ratingFilter)

      const response = await HttpClient.get("/product",
        {
          group: "women",
          category: "jeans",
        },
      );


      console.log("jeansjeansjeans", response)
      setProducts();
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
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
      const { categories } = await HttpClient.get("/category?group=women");
      setAllCategories(categories);

      console.log("categoriescategories", categories)
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.response?.data?.error
      );
      console.error(error);
    }
  };

  const getAllBrands = async () => {
    try {
      const { brands } = await HttpClient.get("/brand");

      const formattedBrands = brands.map((eachBrand) => ({
        id: eachBrand._id,
        brandId: eachBrand.brandId,
        image: eachBrand.image,
        logo: eachBrand.logo,
        brandName: eachBrand.name,
      }))
      setAllBrands(formattedBrands)

      console.log("formattedBrands", formattedBrands)

    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };


  useEffect(() => {
    getAllCategories();
    fetchAllProducts();

    getAllBrands();
  }, []);


  const menProducts = allProducts.filter((item) => item.group === "men").splice(0, 8);

  console.log("menProductsmenProducts", menProducts)
  console.log("searchGroupsearchGroupsearchGroup", searchGroup)


  return (
    <div className="h-auto">


      <div class="text-center mt-3">
        <h1
          className="text-lg md:text-3xl font-bold text-transparent bg-clip-text 
             bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
            text-center transition-all duration-300 hover:scale-105"
        >
          Men's Clothing
        </h1>         <p className="font-[Poppins] font-normal text-center  mb-2 text-sm md:text-lg text-[#2581eb] mt-2">
          Explore the latest trends and styles in men's fashion. From casual wear to formal attire, find the perfect outfit for every occasion.

        </p>
      </div>








      {/* Filter Sidebar */}


      <div className="flex h-auto">
        <div
          style={{
            maxHeight: '100vh',
            overflowY: 'auto',
          }}
          className={`${filtersVisible ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 fixed lg:static top-14 left-0 lg:w-1/4 bg-white shadow-md p-4 z-20 transition-transform duration-300`}
        >
          {/* Search Input */}
          {/* <div className="mb-4">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search products"
            />
          </div> */}

          {/* Sorting Dropdown */}
          <div className="mb-4">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Sort products"
            >
              <option value="">Sort By</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>

          {/* Group Filter */}
          {/* <div className="mb-4">
            <select
              value={searchGroup}
              onChange={(e) => setSearchGroup(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by group"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Kids">Kids</option>
            </select>
          </div> */}

          {/* Color Filter */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Colors</h3>
            {colors.map((color) => (
              <label key={color} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  value={color}
                  checked={selectedColors.includes(color)}
                  onChange={() =>
                    handleCheckboxChange(selectedColors, setSelectedColors, color)
                  }
                  className="mr-2"
                />
                {color}
              </label>
            ))}
          </div>

          {/* Brand Filter */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Brands</h3>
            {allBrands.map((brand) => (
              <label key={brand.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={brand.id}
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() =>
                    handleCheckboxChange(selectedBrands, setSelectedBrands, brand.id)
                  }
                  className="mr-2"
                />
                <img
                  src={brand.image}
                  alt={brand.brandName}
                  className="w-8 h-8 object-cover rounded-full mr-2"
                />
                <span>{brand.brandName}</span>
              </label>
            ))}
          </div>

          {/* Apply Filters Button */}
          <div className="mb-[30px]">
            <button
              onClick={handleSearch}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
          </div>
        </div>

        <div className="lg:w-3/4 w-full mx-auto">






          {/* Desktop Grid Section */}
          <section className="bg-gradient-to-t from-[#aed3f4] to-[#fff]">
            <Brandslider />
            <CategorySlider />
            <div className="flex items-center gap-3 p-3 border rounded-lg shadow-sm bg-white">
              {/* Conditional Heading */}
              <h1 className={`font-bold font-inter px-3 py-1 ${searchTerm !== "" ? "text-gray-800" : "text-gray-500"}`}>
                {searchTerm !== "" ? `Search Results for '${searchTerm}'` : "Exploring Products You'll Love!"}
              </h1>

              {/* Filter Button */}
              <button
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="flex items-center justify-center gap-2 text-blue-600 font-semibold px-3 py-2 border border-blue-600 rounded-lg hover:bg-blue-100 hover:shadow-md transition-all duration-200"
                aria-label={filtersVisible ? "Close Filters" : "Open Filters"}
              >
                {filtersVisible ? <FaFilterCircleXmark size={20} /> : <CiFilter size={20} />}
                <span>{filtersVisible ? "Close Filters" : "Filters"}</span>
              </button>
            </div>



            <ProductsCarousel menProducts={menProducts} />

            <ProductGrid menProducts={menProducts} />





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




      </div>




    </div>
  );
}
