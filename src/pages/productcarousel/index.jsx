import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";



const ProductsCarousel = () => {
    const [trendingProducts, setTrendingProducts] = useState([])
    const [allProducts, setAllProducts] = useState([]);





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
            setTrendingProducts(formattedData)

        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message);
        }
    };


    useEffect(() => {
        fetchAllProducts();
    }, [])

    return (
        <div>
            <h1>aababa</h1>

            {trendingProducts.length ? (
                <Swiper
                    loop={true}
                    className="mySwiper"
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                            spaceBetween: 10,
                        },
                        500: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        640: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 40,
                        },
                        1400: {
                            slidesPerView: 5,
                            spaceBetween: 50,
                        },
                        2000: {
                            slidesPerView: 6,
                            spaceBetween: 60,
                        },
                    }}
                >
                    {trendingProducts.map((category, i) => {


                        return (
                            <SwiperSlide key={i}>
                                <div className="p-5 ">

                                    <div className="bg-white flex flex-col items-center rounded-2xl p-3 shadow-lg border border-gray-200">
                                        {/* Heading */}
                                        <h1 className="text-black font-quicksand font-bold text-xl mb-1 text-center">
                                            {category?.productName
                                                || "Product Name"}
                                        </h1>

                                        {/* Product Image */}
                                        <img
                                            src={category?.bannerImage || "https://via.placeholder.com/300"}
                                            alt={category?.name || "Product Image"}
                                            className="h-40 w-40  object-cover rounded-full mb-1"
                                        />

                                        {/* Product Name */}
                                        <p className="text-lg font-semibold mb-1 text-gray-700">
                                            {category?.brandName || "Brands Name"}
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
                                        <Link to={`/product-details/${category?.productId}`} className="block mt-2 ">
                                            <button className="flex items-center justify-center bg-[#011F4B] text-white px-2 py-1 rounded-lg text-md  hover:bg-[#02386e] transition-colors duration-200">
                                                Product Details
                                                <FaArrowRight className="ml-2" />
                                            </button>
                                        </Link>

                                    </div>



                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            ) : (
                <h2 className="font-[Quicksand] font-medium text-center text-2xl text-[#011F4B]">
                    No Category Available
                </h2>
            )}
        </div>
    )
}


export default ProductsCarousel