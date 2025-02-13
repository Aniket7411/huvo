import { useState } from "react";

const ProductsByBrands = () => {
  // Example product data
  const products = [
    { id: 1, name: "iPhone 14 Pro", brand: "Apple", price: 999.99, ratings: 4.8 },
    { id: 2, name: "Galaxy S23 Ultra", brand: "Samsung", price: 849.99, ratings: 4.7 },
    { id: 3, name: "Sony WH-1000XM5", brand: "Sony", price: 399.99, ratings: 4.6 },
    { id: 4, name: "Air Max Sneakers", brand: "Nike", price: 129.99, ratings: 4.5 },
    { id: 5, name: "Adidas Ultraboost", brand: "Adidas", price: 139.99, ratings: 4.4 },
    { id: 6, name: "Dell XPS 13", brand: "Dell", price: 1199.99, ratings: 4.8 },
    { id: 7, name: "Kindle Paperwhite", brand: "Amazon", price: 129.99, ratings: 4.6 },
    { id: 8, name: "PlayStation 5", brand: "Sony", price: 499.99, ratings: 4.9 },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "low-to-high") return a.price - b.price;
      if (sortOrder === "high-to-low") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Products by Brands
        </h1>

        <div className="flex flex-wrap justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="mt-4 sm:mt-0 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sort by Price</option>
            <option value="low-to-high">Low to High</option>
            <option value="high-to-low">High to Low</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="w-[45%] md:w-[33%] lg:w-1/5 flex flex-col items-center rounded-lg"
              style={{ outline: "1px solid #212529" }}
            >
              <img
                src="https://cdn.pixabay.com/photo/2016/12/06/09/31/blank-1886008_640.png"
                className="h-[200px]"
                alt="brand"
              />
              <p className="text-[#000] font-[Quicksand] font-bold text-lg">
                {product.name}
              </p>
              <p>Ratings: {product.ratings}</p>
              <button className="bg-[#2e3c7e] text-[#fff] w-[100%] py-1 rounded-md">
                Explore More
              </button>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-600 mt-6">
            No products found matching your search criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductsByBrands;
