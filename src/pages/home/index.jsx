import React, { useEffect, useState } from "react";

import "./index.css"
import { Link, useNavigate } from "react-router-dom";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { PiCurrencyInr } from "react-icons/pi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowRight, FaProductHunt } from "react-icons/fa";
import { TbJewishStarFilled } from "react-icons/tb";
import { SiBrandfolder } from "react-icons/si";
import { Oval } from "react-loader-spinner";
import { MdArrowOutward } from "react-icons/md";
import Slider from "react-slick";
import "swiper/css";
import "swiper/css/navigation"; // Include navigation styles
import Brandslider from "../brands";

import ProductCarouselmd from "../productcarousel";
import Loader from "../../components/loader";
import { CiSearch } from "react-icons/ci";
import CategorySlider from "../categoryslider";
import ProductGrid from "../mobileviewproduct";
import BrandSlider from "../brands";
import TrendingHeader from "../brandheadingcomponents";
import TrendingProducts from "../trendingproductsheader";
import TrendingProductsHeader from "../trendingproductsheader";
import TrendingProductsHeading from "../trendingproductsheader";
import TrendingBrandsHeader from "../brandheadingcomponents";
import Homepagetopcarausel from "../admin/homepagetopcarausel";
import TopCarousel from "./Topcarousal";
import TopCarousel2 from "./topcaroual2";


const testimonials = [
  {
    text: "The winter wear collection is both stylish and warm. I couldn't be happier with my purchase, and the quality speaks volumes.",
    name: "Sarah Thompson",
    designation: "Fashion Blogger",
  },
  {
    text: "The goggles I bought are not only trendy but also offer great UV protection. Highly recommend them for outdoor enthusiasts!",
    name: "Mark Johnson",
    designation: "Outdoor Enthusiast",
  },
  {
    text: "Exceptional customer service and fantastic product range. My wardrobe has never been this versatile and functional.",
    name: "Emily Carter",
    designation: "Lifestyle Influencer",
  },
];

const tokenIfLoggedIn = localStorage.getItem("accessToken");



export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [topBrands, setTopBrands] = useState([])

  const getAllBrands = async () => {
    try {
      const { brands } = await HttpClient.get("/brand");
      setBrands(brands);

      const formattedBrands = brands.map((eachBrand) => ({
        id: eachBrand._id,
        brandId: eachBrand.brandId,
        image: eachBrand.image,
        logo: eachBrand.logo,
        brandName: eachBrand.name,
        onGoingOffer: eachBrand.onGoingOffer
      }))
      setTopBrands(formattedBrands)

    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState("")
  const [category, setCategory] = useState("product_search")
  const navigate = useNavigate();



  const handleSearch = async (searchword, id) => {

    console.log("dididididididdi", id)
    if (searchQuery.trim()) {


      try {

        const response = await HttpClient.get(`/search/result?q=${searchword}`);
        console.log('API Response:', response);
        const productId = response?.product?.productId
          ;
        console.log(productId)
        if (productId) {

          navigate(`/${category}/${id}`);
        } else {
          console.error('Product ID not found in response');
        }
      } catch (error) {
        console.error('Error fetching search result:', error);
      }
    }
  };

  const getAllCategories = async () => {
    setIsLoading(true)

    try {
      const { categories } = await HttpClient.get("/category");
      console.log("setAllCategories", categories)



      const formattedData = categories.map((product) => ({
        id: product._id,
        categoryId: product.categoryId,
        description: product.description,
        group: product.group[0]?.name,
        image: product.group[0]?.image,
        productName: product.name
      }))
      setAllCategories(formattedData)

      setIsLoading(false)





    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const fetchAllProducts = async () => {
    setIsLoading(true)
    try {
      const response = await HttpClient.get("/product");

      console.log("nnnnnn", response?.products)


      const formattedData1 = response?.products?.map((each) => ({
        actualPrice: each?.actualPrice,
        brandName: each?.brand?.name,
        bannerImage: each?.bannerImage,
        group: each?.group,
        name: each?.productDetails[0],
        reviews: each?.reviews,
        objectId: each?._id,
        productName: each?.name,

        brandImage: each?.brand?.image,
        onGoingOffer: each?.brand?.onGoingOffer,
        brandId: each?.brand?.brandId,
        categoryId: each?.category?.categoryId,
        categoryDescription: each?.category?.description,
        productDescription: each?.description,
        isReturnable: each?.isReturnable,
        discount: each?.discount,
        price: each?.price,
        productId: each?.productId,
        avgRating: each?.avgRating,
        avgBrandRating: each?.avgBrandRating,
        totalRating: each?.totalRating
      }))

      setAllProducts(formattedData1)

      console.log("llllllll", formattedData1)




      setIsLoading(false)


    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };






  useEffect(() => {

    const dataShift = async () => {
      const localData = JSON.parse(localStorage?.getItem("cart"));
      console.log("localDatalocalData:", localData);
      if (!localData || typeof localData !== "object" || Object.keys(localData).length === 0) {
        console.error("No valid cart data found in localStorage.");
        return;
      }


      let totalAmount = 0;

      const postDataObject = Object.keys(localData).reduce((acc, key) => {
        const item = localData[key];

        const price = item?.price || 0;
        const quantity = item?.quantity || 1;
        const platformFee = item?.platformCharge || 0;
        const cgstRate = item?.cgst || 0;
        const sgstRate = item?.sgst || 0;

        const totalCgst = (cgstRate * quantity);
        const totalSgst = (sgstRate * quantity);


        // Calculate total price including platform fee and taxes
        acc[key] = {
          color: item?.color || "N/A",
          price,
          plateformFee: platformFee,
          sellerId: item?.seller || "Unknown",
          name: item?.name || "Unnamed Product",
          bannerImage: item?.bannerImage || "N/A",
          quantity,
          actualPrice: item?.actualPrice || "N/A",
          cgst: totalCgst,
          sgst: totalSgst,
          size: item?.size || "N/A",
          discount: item?.discount || "N/A",
          productId: item?.productId || "N/A",
        };

        return acc;
      }, {});


      let totalCgst = 0;
      let totalSgst = 0;
      let totalCartAmout = 0;

      Object.keys(localData).forEach((key) => {
        const item = localData[key];
        totalCgst += item?.cgst * item?.quantity;
        totalSgst += item?.sgst * item?.quantity;
        totalCartAmout += item?.price * item?.quantity;

      });

      console.log("totalCgst", totalCgst)
      console.log("totalSgst", totalSgst)
      console.log("totalCartAmout", totalCartAmout)

      const dataForCart = {
        cart: postDataObject,
        cgst: totalCgst,
        sgst: totalSgst,
        totalAmount: totalCartAmout
      }

      console.log("dataForCart", dataForCart)

      try {
        const response = await HttpClient.post("/cart/login", dataForCart);
        console.log("dataForCart", response);
        if (response?.success) {
          localStorage.setItem("cart", JSON.stringify({}));
        }

      } catch (error) {
        console.error("Error during dataShift:", error);
      }
    };

    if (tokenIfLoggedIn !== undefined && tokenIfLoggedIn !== null && localStorage.getItem("cart")?.length > 0) {
      dataShift();
    }
  }, [tokenIfLoggedIn]);


  useEffect(() => {
    fetchAllProducts();
    getAllBrands();
    getAllCategories();


  }, []);


  const fetchSuggestions = async (searchword) => {
    try {
      const response = await HttpClient.get("/search/final", { search: searchword, searchType: category });
      console.log("final", response)
      if (response.success) {
        setSearchResult(response.data);

      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSuggestionClick = async (suggestion, id) => {
    const suggestionName = suggestion;
    setSearchResult([]);

    await handleSearch(suggestionName, id);

  }

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      fetchSuggestions(query);
    } else {
      setSearchResult([]);
    }
  };


  console.log("fffffk", allProducts)



  // Filter products by group
  const kidsProducts = allProducts?.filter((item) => item?.group === "kids").slice(0, 8);
  const womenProducts = allProducts?.filter((item) => item?.group === "women").slice(0, 8);
  const menProducts = allProducts?.filter((item) => item?.group === "men").slice(0, 8);


  console.log("kidsProducts1", kidsProducts)
  console.log("kidsProducts11", womenProducts)
  console.log("kidsProducts111", menProducts)

  // Combine all the products
  const combinedProducts = [...kidsProducts, ...womenProducts, ...menProducts];

  // Shuffle the combined array
  const shuffledProducts = combinedProducts
    .map((product) => ({ product, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ product }) => product);

  // Debugging output
  console.log("Combined Products:", combinedProducts);
  console.log("Shuffled Products:", shuffledProducts);

  return (
    <>
      {
        isLoading ? <div className=" h-screen flex justify-center items-center"> <Loader /> </div> :

          <section>

            <div
              className="bg-gradient-to-r -mt-4  from-blue-500 via-blue-600 to-blue-700 text-white text-center py-2 md:py-6 shadow-lg"

            >
              <div className="flex justify-center items-center h-[100px] px-2  md:h-[250px]  space-x-3 animate-pulse">
                <svg
                  className="w-6 h-6 text-yellow-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 9L3 15.75M9.75 9l6-6m0 0h4.5m-4.5 0V9M3 15.75l6 6m6-6l6-6m-6 6l-6 6"
                  />
                </svg>
                <p className="text-lg md:text-6xl font-semibold font-[Quicksand] tracking-wide">

                  Huvo is currently being dressed, stay tuned for more!
                </p>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-yellow-400 rounded-full"></div>
            </div>



            <section className="px-2 md:px-10 py-2 ">
              <h2 className="font-[Quicksand] font-bold text-center text-sm md:text-4xl text-[#011F4B]">
                CATEGORIES TO EXPLORE
              </h2>
              <p className="font-[Poppins]  text-center text-sm md:text-lg font-light mb-2">
                "Discover the Best Deals and Products Across All Categories"</p>
            </section>
            <CategorySlider />

            <hr className="my-2" />

            <Homepagetopcarausel shuffledProducts={shuffledProducts} />

            <section className="">

              {/* <Link to="/women-collection">

                <div className="md:h-[250px] h-[200px]"

                  style={{
                    backgroundImage: "url('/assets/womenbanner.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",

                    height: "250px",
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    color: "#ffffff",
                  }}
                >
                  <div className="flex items-center flex-wrap gap-0  md:gap-3 bg-[#fff] px-2 py-1 rounded-lg shadow-md">
                    <h2
                      className="font-[Quicksand] hidden md:block font-medium text-center text-2xl sm:text-lg md:text-4xl bg-clip-text text-transparent"
                      style={{
                        backgroundImage: "linear-gradient(90deg, #007bff, #f8d00f, #007bff)", // Blue to Yellow Gradient
                        backgroundSize: "200% auto",
                        backgroundPosition: "0% 50%",
                        animation: "flow-gradient 3s linear infinite",
                      }}
                    >
                      Trending Products for Women
                    </h2>
                    <FaArrowTrendUp size={30} className="text-[#4bd63b] mr-2 hidden md:block " />
                    <p className="text-gray-600 font-semibold hidden md:block">
                      Discover trendy and stylish products for women.
                    </p>
                  </div>
                </div>




              </Link> */}


              <div class="relative flex flex-col items-center justify-center py-2 px-6 bg-gradient-to-br from-fuchsia-500 to-purple-600 overflow-hidden">
                <div class="absolute inset-0 flex items-center justify-center space-x-48 opacity-20">
                  <div class="w-64 h-64 rounded-full bg-pink-400 animate-float-delay-1"></div>
                  <div class="w-80 h-80 rounded-full bg-purple-400 animate-float-delay-2"></div>
                </div>

                <h1 class="relative z-10 text-xl text-3xl md:text-5xl font-bold text-center text-white mb-2 animate-fade-in">
                  <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-100">
                    WOMEN'S COLLECTION
                  </span>
                </h1>

                <div class="relative z-10 w-32 h-1 bg-white/80 mt-2 animate-expand"></div>

                <p class="relative z-10 text-lg md:text-2xl text-pink-100 text-center mt-2 max-w-2xl  whitespace-nowrap overflow-hidden">
                  Where elegance meets confidence
                </p>

              </div>

              <TrendingProductsHeading displayCategory="Women" />

              <div>

                <section className=" hidden md:block">

                  <ProductCarouselmd womenProducts={womenProducts} />
                </section>


                <ProductGrid womenProducts={womenProducts} />


              </div>
              <hr className="my-2" />




              <TrendingBrandsHeader category="Women" />
              <BrandSlider />




              <div class="flex flex-col items-center justify-center py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white overflow-hidden">
                <h1 class="text-xl md:text-3xl lg:text-5xl  text-center mb-2 animate-fade-in ">
                  MEN'S EDGE
                </h1>

                <p class="text-lg md:text-2xl text-cyan-100 text-center max-w-2xl font-mono overflow-hidden whitespace-nowrap  ">
                  Where innovation meets style
                </p>

                {/* <div class="flex mt-2 space-x-4">
                  <div class="w-3 h-3 bg-white rounded-full animate-pulse-slow delay-100"></div>
                  <div class="w-3 h-3 bg-cyan-300 rounded-full animate-pulse-slow delay-300"></div>
                  <div class="w-3 h-3 bg-white rounded-full animate-pulse-slow delay-500"></div>
                </div> */}


              </div>

              <TrendingProductsHeading displayCategory="Men" />


              <div>


                <section className=" hidden md:block">

                  <ProductCarouselmd menProducts={menProducts} />
                </section>
                <ProductGrid menProducts={menProducts} />




              </div>

              <TrendingBrandsHeader category="Men" />
              <BrandSlider />

              <hr className="my-2" />
              {/* <Link to="/kids-collection">

                <div

                  className="md:h-[250px] h-[200px]"
                  style={{
                    backgroundImage: "url('/assets/kidsbanner.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "top", // Shift the image downward
                    backgroundRepeat: "no-repeat",

                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    color: "#ffffff",
                  }}
                >
                  <div className="flex items-center flex-wrap gap-0  md:gap-3 bg-[#fff] px-2 py-1 rounded-lg shadow-md">
                    <h2
                      className="font-[Quicksand] hidden md:block font-medium text-center text-2xl sm:text-lg md:text-4xl bg-clip-text text-transparent"
                      style={{
                        backgroundImage: "linear-gradient(90deg, #007bff, #f8d00f, #007bff)", // Blue to Yellow Gradient
                        backgroundSize: "200% auto",
                        backgroundPosition: "0% 50%",
                        animation: "flow-gradient 3s linear infinite",
                      }}
                    >
                      Products for Kids
                    </h2>
                    <FaArrowTrendUp size={30} className="text-[#4bd63b] mr-2 hidden md:block " />
                    <p className="text-gray-600 font-semibold hidden md:block">
                      Find fun and creative products for kids.
                    </p>
                  </div>
                </div>
              </Link> */}

              <div class="flex flex-col items-center justify-center py-2 px-3 bg-gradient-to-r from-pink-100 to-purple-100 overflow-hidden">
                <h1 class="text-xl md:text-3xl lg:text-5xl font-bold text-center text-purple-800 mb-2 animate-bounce">
                  Welcome to Our Kids' World
                </h1>

                <p class="text-lg md:text-xl text-center text-purple-600 max-w-2xl opacity-0 animate-fade-in animate-delay-300">
                  Discover adorable outfits and accessories for your little ones!
                </p>

                <div class="flex mt-3 space-x-2">
                  <div class="w-4 h-4 rounded-full bg-pink-400 animate-float delay-100"></div>
                  <div class="w-4 h-4 rounded-full bg-purple-400 animate-float delay-200"></div>
                  <div class="w-4 h-4 rounded-full bg-blue-400 animate-float delay-300"></div>
                </div>
              </div>


              <TrendingProductsHeading displayCategory="Kids" />

              <div>
                <section className="  md:block">

                  <ProductCarouselmd kidsProducts={kidsProducts} />
                </section>
                <ProductGrid kidsProducts={kidsProducts} />
              </div>
              <TrendingBrandsHeader category="Kids" />

            </section>
            <hr className="my-2" />
            <CategorySlider />
            {/* <section className="md:px-10 px-3 py-2 md:py-6 text-center ">
              <p className="font-[Quicksand] font-medium text-[#011F4B] text-center text-lg  md:text-4xl mb-2 border-3">
                EXPLORE TOP BRANDS
              </p>
              <div className="flex justify-center items-center">
                {brands.length ? (
                  <Swiper
                    loop={true}
                    className="mySwiper"
                    modules={[Autoplay]}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                    }}
                    breakpoints={{
                      // For small devices, show 1 slide
                      0: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                      },
                      // For medium screens, show 2 slides
                      640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                      },
                      // For large screens, show 3 slides
                      1024: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                      },
                    }}
                  >
                    {brands.map((brand, i) => {
                      return (
                        <SwiperSlide key={i}>
                          <div className="bg-[#F6F6F6] rounded-lg h-full w-full px-5 py-[10px]">
                            <Link to={`/collections?brand=${brand?._id}`}>
                              <img
                                className="my-2 m-auto h-10"
                                src={brand.logo}
                                alt={brand.name}
                                loading="lazy"
                              />

                            </Link>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                ) : (
                  <h2 className="font-[Quicksand] font-medium text-center text-2xl text-[#011F4B]">
                    No Brands Available
                  </h2>
                )}
              </div>
            </section> */}
            <section className="bg-[#F6F6F6] px-5 py-5 ">
              <p className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                Testimonials
                <span className="block h-1 w-16 bg-blue-500 mx-auto mt-2 rounded"></span>
              </p>
              <h2 className="font-[Quicksand] font-medium text-[#011F4B] text-center text-lg  md:text-4xl mb-2 border-3">
                WHAT THEY ARE SAYING
                <div className="w-[15%] md:w-[5%] h-[3px] bg-[#011F4B] m-auto mt-[2%]"></div>
              </h2>
              <Swiper
                navigation={true}
                loop={true}
                modules={[Autoplay, Navigation]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                className="mySwiper"
              >
                {testimonials.map((testimonial, index) => (
                  <SwiperSlide key={index}>
                    <div className="w-full font-[Poppins] flex flex-col justify-center items-center">
                      <p className="text-[#949494] w-2/3 font-light text-md md:text-lg  p-4 text-center">
                        "{testimonial.text}"
                      </p>
                      <p className="text-[#011F4B] font-medium text-center mb-2">
                        {testimonial.name}
                      </p>
                      <p className="text-[#949494] font-light text-sm text-center">
                        {testimonial.designation}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </section>

          </section>
      }


    </>
  );
}
