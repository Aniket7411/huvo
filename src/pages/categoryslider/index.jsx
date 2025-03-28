import { useEffect, useState } from "react";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loader from "../../components/loader";
import { Link } from "react-router-dom";

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllCategories = async () => {
    try {
      const response = await HttpClient.get("/category");

      const formattedData = response.categories.map(
        ({
          bannerImage = "https://via.placeholder.com/300",
          description = "No description available",
          categoryId,
          name = "Unknown Category",
          _id: uniqueId,
          group = [],
        }) => ({
          bannerImage,
          description,
          categoryId,
          name,
          uniqueId,
          group: group[0]?.name || "General",
        })
      );

      setCategories(formattedData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 5 } },
      { breakpoint: 480, settings: { slidesToShow: 4 } },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="text-gray-500" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 py-2 px-4 sm:px-6 lg:px-8">
      <h1 className="font-bold text-xl font-[Quicksand] text-gray-800 mb-2 text-center">
      CATEGORIES TO EXPLORE
      </h1>
      <Slider {...settings}>
        {categories.map((category) => (
          <Link to={`/category_search/${category.group}/${category.uniqueId}`} key={category.uniqueId}>
            <div className="px-1 sm:px-2">
              <div className="flex flex-col items-center p-1 sm:p-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-tr from-blue-300 to-blue-500 p-1">
                    <img
                      src={category.bannerImage}
                      alt={category.name}
                      className="h-full w-full object-cover rounded-full border-2 border-white shadow-sm"
                      loading="lazy"
                    />
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-1 text-center">
                  {category.name}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default CategorySlider;
