import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { FaArrowRight, FaFilter } from "react-icons/fa";
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
import ProductsShowingComponent from "../filterproductComponent";


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
        actualPrice: eachProduct?.actualPrice,
        discount: eachProduct?.discount,

        name: eachProduct?.productDetails[0],

        onGoingOffer: eachProduct.brand.onGoingOffer,
        brandId: eachProduct.brand.brandId,
        categoryId: eachProduct.category.categoryId,
        categoryDescription: eachProduct.category.description,
        productDescription: eachProduct.description,
        group: eachProduct.group,
        isReturnable: eachProduct.isReturnable,
        price: eachProduct.price,
        productId: eachProduct.productId,
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


  const womenProducts = allProducts.filter((item) => item.group === "women").splice(0, 8);

  console.log("menProductsmenProducts", womenProducts)
  console.log("searchGroupsearchGroupsearchGroup", searchGroup)


  return (
    <div className="h-auto px-2 md:px-4">


      <div class="text-center mt-3">
        <p className="font-[Poppins] font-normal text-center  text-sm md:text-lg text-[#2581eb]  lg:mt-[70px] mt-4">
          Explore the latest trends and styles in women's fashion. From chic casual wear to elegant formal attire, discover the perfect outfit for every occasion.        </p>
      </div>



      <div className=" w-full mx-auto">






        {/* Desktop Grid Section */}
        <section className="bg-gradient-to-t from-[#aed3f4] to-[#fff]">




          <ProductGrid womenProducts={womenProducts} />

          {
            isLoading ? <div className="flex h-screen justify-center items-center"><Loader /></div> : <ProductsShowingComponent allProducts={womenProducts} />

          }





        </section>





      </div>








    </div>
  );
}
