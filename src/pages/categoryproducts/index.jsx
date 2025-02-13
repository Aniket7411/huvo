import { useEffect, useState } from "react";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";

const ProductsByCategory = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("low-to-high"); // Default sort order
  const [selectedCategory, setSelectedCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  const getTopTrendingProducts = async (page) => {
    try {
      const response = await HttpClient.get(`/product/trending/all?page=${page}`);
      const formattedData = response.trendingProducts.map((each) => ({
        id: each.producId,
        bannerImage: each.bannerImage,
        price: each.price,
        productName: each.productName,
        totalSold: each.totalSold,
      }));
      setTrendingProducts(formattedData);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getTopTrendingProducts(currentPage);
  }, [currentPage]);

  const filteredProducts = trendingProducts
    .filter((product) => {
      const matchesCategory = selectedCategory
        ? product.category === selectedCategory
        : true;
      const matchesSearch = product.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === "low-to-high") return a.price - b.price;
      if (sortOrder === "high-to-low") return b.price - a.price;
      return 0;
    });

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl mt-2 font-bold text-center text-gray-800 mb-4">
          Products by Category
        </h1>

        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select by Category</option>
            <option value="Groceries">Groceries</option>
            <option value="Clothes">Clothes</option>
            <option value="Electronics">Electronics</option>
            <option value="Home Appliances">Home Appliances</option>
            <option value="Beauty & Health">Beauty & Health</option>
            <option value="Books">Books</option>
            <option value="Sports">Sports</option>
            <option value="Toys">Toys</option>
            <option value="Furniture">Furniture</option>
            <option value="Automotive">Automotive</option>
            <option value="Jewelry">Jewelry</option>
          </select>

          {/* Sort By Price */}
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="low-to-high">Low to High</option>
            <option value="high-to-low">High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-lg shadow-lg p-4 flex flex-col"
            >
              <img
                src={product.bannerImage}
                alt={product.productName}
                className="rounded-md mb-4"
              />
              <h2 className="font-semibold text-lg mb-2">{product.productName}</h2>
              <p className="text-gray-600 text-sm">Total Sold: {product.totalSold}</p>
              <p className="text-gray-900 font-bold text-lg mt-2">
                ₹{product.price.toFixed(2)}/-
              </p>
              <button className="mt-2 bg-blue-500 text-white py-1 px-2  rounded-lg hover:bg-blue-600 transition">
                Details
              </button>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-600 mt-6">
            No products found matching your search criteria.
          </p>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="flex items-center justify-center text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsByCategory;
