import { useEffect, useState } from "react";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import Loader from "../../components/loader";
import { Link } from "react-router-dom";
import { TbJewishStarFilled } from "react-icons/tb";
import { useParams } from "react-router-dom";

const StoreAndProducts = () => {
  const [genderCategory, setGenderCategory] = useState("men");
  const [sortOrder, setSortOrder] = useState("low-to-high");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();

  console.log("ididid", id)
  console.log("genderCategory", genderCategory)

  console.log("sortOrder", sortOrder)



  const fetchAllProducts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await HttpClient.get(`/product/storeproducts`, {productId: id,genderCategory,sortOrder });
      console.log("storeproducts",response.data)
      
      const formattedData = response.data.map((eachProduct) => ({
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
        productId: eachProduct?.productId
      }));

      console.log(formattedData)
      setAllProducts(formattedData);
      setFilteredProducts(formattedData);
      setTotalPages(response.totalPages || 1);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts(currentPage);
  }, [currentPage,genderCategory,sortOrder]);

  const handleGenderChange = (e) => setGenderCategory(e.target.value);
  const handleSortChange = (e) => setSortOrder(e.target.value);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => Math.max(1, Math.min(prev + direction, totalPages)));
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query) {
      const filtered = allProducts.filter((product) =>
        product.productName.toLowerCase().includes(query) ||
        product.brandName.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
  };

  return (
    <>
      {/* Store and Filter Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-4">
        {/* Store Information */}
        <div className="bg-white shadow-md p-4 rounded-lg w-full md:w-1/3">

        <div className="flex justify-between">
          <div>
  <label className="block font-semibold text-gray-700 text-lg mb-2">Store Name</label>
  <p className="text-xl font-bold text-gray-900 mb-4">Shopiflor</p>
  </div>
            <img
              src="https://via.placeholder.com/120"
              alt="Store logo"
              className="object-cover rounded-full mb-1"
            />
          </div>

  <div className="flex items-center justify-between text-sm text-gray-700 ">
  <div className="flex items-center gap-2">
  <span className="font-semibold">Rating:</span>
  <div className="flex items-center gap-1">
    <TbJewishStarFilled className="text-yellow-500 text-lg" />
    <span className="text-gray-800 font-medium">4.8</span>
  </div>
</div>

    <div className="flex items-center gap-2">
      <span className="font-semibold">Products Sold:</span>
      <span>120+</span>
    </div>
  </div>
</div>


        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-white shadow-md p-4 rounded-lg w-full md:w-2/3">
          {/* Gender Category */}
          <div className="w-full md:w-1/3">
            <label className="block font-semibold text-gray-700 text-sm mb-2">Select Gender Category</label>
            <select
              value={genderCategory}
              onChange={handleGenderChange}
              className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="w-full md:w-1/3">
            <label className="block font-semibold text-gray-700 text-sm mb-2">Sort By</label>
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low-to-high">Low to High</option>
              <option value="high-to-low">High to Low</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-1/3">
            <label className="block font-semibold text-gray-700 text-sm mb-2">Search Products</label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by name or brand"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <hr className="my-2" />

      {/* Product List Section */}
      <div>
        {isLoading ? (
          <div>
            <Loader />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div>
            <p>No products available</p>
          </div>
        ) : (
          <div className="flex flex-wrap  gap-6 p-4">
            {filteredProducts.map((product, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg shadow-md border border-gray-200 p-4"
                style={{
                  width: "300px",
                  backgroundColor: "#ffffff",
                  marginTop: "8px", // Less margin for compact view
                }}
              >
                <h1
                  className="font-bold text-lg mb-2 text-center"
                  style={{ color: "#011F4B" }}
                >
                  {product.brandName || "Trending Brand Name"}
                </h1>
                <img
                  src={product.bannerImage || "https://via.placeholder.com/300"}
                  alt={product.productName || "Product Image"}
                  className="w-full h-48 object-cover rounded-md mb-1"
                  style={{ border: "1px solid #ddd" }}
                />
                <p className="text-base font-medium mb-2 text-gray-700">
                  {product.productName || "Product Name"}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  {product.categoryDescription || "Category"}
                </p>
                <div className="flex justify-between items-center w-full mb-1">
                  <div className="text-base text-gray-800">
                    ₹{product.price || "0.00"}
                  </div>
                  {product.discount && (
                    <div className="text-sm text-green-600 font-medium">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
                {product.discount && (
                  <p className="text-sm text-blue-600 font-semibold mb-1">
                    Discounted Price: ₹
                    {(product.price - (product.price * product.discount) / 100).toFixed(2)}
                  </p>
                )}
                <Link
                  to={`/product-details/${product?.productId}`}
                  className=" text-center bg-[#011F4B] text-white px-2 py-1 rounded-lg"
                  style={{ letterSpacing: "1px", display: "inline-block" }}
                >
                  Product details
                </Link>

              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => handlePageChange(-1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="font-semibold text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default StoreAndProducts;
