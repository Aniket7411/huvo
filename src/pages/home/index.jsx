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

      console.log("llllllll", response?.products)


      const formattedData1 = response?.product((eachProduct) => ({
        bannerImage: eachProduct?.bannerImage,
        brandName: eachProduct?.brand?.name,
        productName: eachProduct?.name,
        price: eachProduct?.price,
        discount: eachProduct?.discount,
        group: eachProduct?.group[0].name,
        productDetails: eachProduct.productDetails[0],
        totalRating: eachProduct?.totalRating,
        productId: eachProduct.productId,
        isReturnable: eachProduct.isReturnable,
        onGoingOffer: eachProduct.brand.onGoingOffer,



      }))

      setAllProducts(formattedData1)


      console.log("formattedData1formattedData1", formattedData1)

      const formattedData = response.products.map((eachProduct) => ({
        objectId: eachProduct._id,
        bannerImage: eachProduct.bannerImage,
        productName: eachProduct.name,

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


      console.log("aniket shsahsaj", formattedData)

      setAllProducts(formattedData)
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

    if (tokenIfLoggedIn !== undefined && localStorage.getItem("cart")?.length > 0) {
      dataShift();
    }
  }, [tokenIfLoggedIn]);


  useEffect(() => {
    fetchAllProducts();
    getAllBrands();
    getAllCategories();


  }, []);


  const fetchSuggestions = async (searchword) => {

    //
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

  const kidsProducts = allProducts.filter((item) => item.group === "kids").slice(0, 8);
  const womenProducts = allProducts.filter((item) => item.group === "women").slice(0, 8);
  const menProducts = allProducts.filter((item) => item.group === "men").slice(0, 8);




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
              <div>

                <section className=" hidden md:block">

                  <ProductCarouselmd womenProducts={womenProducts} />
                </section>
                <ProductGrid womenProducts={womenProducts} />


              </div>
              <hr className="my-2" />




              <TrendingHeader category="All" />
              <BrandSlider />


              {/* <Link to="/men-collection">



                <div className="md:h-[250px] h-[200px]"

                  style={{
                    backgroundImage: "url('/assets/menbanner.jpg')",
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

                  <h1 className="px-4 font-bold text-xl md:hidden">No drama,<br /> <span className="ml-4"> just vibes</span>

                  </h1>
                  <div className="md:flex items-center hidden flex-wrap gap-0  md:gap-3 bg-[#fff] px-3 rounded-lg">

                    <h1>
                      Explore the best products tailored for men.
                    </h1>
                    <h2
                      className="font-[Quicksand] font-medium hidden md:block text-center text-2xl sm:text-lg md:text-4xl bg-clip-text text-transparent"
                      style={{
                        backgroundImage: "linear-gradient(90deg, #007bff, #f8d00f, #007bff)", // Blue to Yellow Gradient
                        backgroundSize: "200% auto",
                        backgroundPosition: "0% 50%",
                        animation: "flow-gradient 3s linear infinite",
                      }}
                    >
                      Trending Products for Men
                    </h2>
                    <FaArrowTrendUp size={30} className="text-[#4bd63b] mr-2 hidden md:block " />
                    <p className="text-gray-600 font-semibold hidden md:block">Explore the best products tailored for men.</p>

                  </div>

                </div>

              </Link> */}

              <div>

                <section className=" hidden md:block">

                  <ProductCarouselmd menProducts={menProducts} />
                </section>
                <ProductGrid menProducts={menProducts} />




              </div>

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
              <div>



                <section className="  md:block">

                  <ProductCarouselmd kidsProducts={kidsProducts} />
                </section>
                <ProductGrid kidsProducts={kidsProducts} />

              </div>

            </section>
            <hr className="my-2" />
            <section className="md:px-10 px-3 py-2 md:py-6 text-center ">
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
            </section>
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
