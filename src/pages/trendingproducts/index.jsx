import { useEffect, useState } from "react";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { Link } from "react-router-dom";

const TrendingProducts = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const getTrendingProducts = async () => {
    setIsLoading(true);
    try {
      const response = await HttpClient.get("/product/trending/all", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      });

      const formattedData = response.trendingProducts.map((each) => ({
        id: each._id,
        discountedPrize: each.discountedPrize,
        price: each.price,
        totalSold: each.totalSold,
        bannerImage: each.bannerImage,
      }));

      setTrendingProducts(formattedData);
      setTotalPages(Math.ceil(response.totalProducts / itemsPerPage));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTrendingProducts();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-6 p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Trending Products</h1>

      {isLoading ? (
        <div className="flex justify-center">
          <Oval height={50} width={50} color="#4A90E2" visible={true} />
        </div>
      ) : (
        <>
          {/* Product Cards with Flexbox */}
          <div className="flex flex-wrap gap-6 justify-center">
            {trendingProducts.map((product) => (
              <div
                key={product.id}
                className="border border-gray-300 rounded-lg shadow-lg flex flex-col items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 transition-transform transform hover:scale-105 duration-300"
              >
                <img
                  src={product.bannerImage}
                  alt="Product"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg text-gray-800">{product.id}</h3>
                  <p className="text-sm text-gray-500">Discounted Price: ₹{product.discountedPrize}</p>
                  <p className="text-sm text-gray-600 line-through">Price: ₹{product.price}</p>
                  <p className="text-sm text-gray-400">Total Sold: {product.totalSold}</p>
                </div>

                <Link to="/product-details" className="w-full">
                  <button className="bg-blue-600 text-white py-2 px-6 rounded-b-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none">
                    View Details
                  </button>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex justify-center gap-3 items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300 transition-all duration-200 hover:bg-blue-600"
            >
              Previous
            </button>
            <span className="text-lg font-medium">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300 transition-all duration-200 hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TrendingProducts;
