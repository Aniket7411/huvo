import { useEffect, useState } from "react";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loader from "../../components/loader";

const Brandslider = () => {
  const [brands, setBrands] = useState([]);
  const [topBrands, setTopBrands] = useState([]);
  const [loading, setLoading] = useState(true);

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
        onGoingOffer: eachBrand.onGoingOffer,
      }));
      setTopBrands(formattedBrands);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBrands();
  }, []);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Default for larger screens
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024, // Medium screens
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768, // Small screens (e.g., tablets)
        settings: {
          slidesToShow: 3, // Increased from 2 to 3
        },
      },
      {
        breakpoint: 480, // Extra-small screens (e.g., phones)
        settings: {
          slidesToShow: 2, // Keeps 2 for very small screens
        },
      },
    ],
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Loader className="text-gray-500"/>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-2   sm:px-5 ">
      
      <h1 className="font-bold font-inter px-3 py-1 text-gray-500">
      Explore by Brands
              </h1>
      <Slider {...settings}>
        {topBrands.map((brand) => (
          <div key={brand.id} className="">
            <div className="flex flex-col items-center p-2 bg-white border  border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
          
              <img
                src={brand.image}
                alt={` ${brand.brandName}`}
                className="h-16 w-full object-cover rounded-md"
                loading="lazy"
              />
              <p className="text-sm font-medium text-gray-700 mt-1">
                {brand.brandName}
              </p>
     
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Brandslider;
