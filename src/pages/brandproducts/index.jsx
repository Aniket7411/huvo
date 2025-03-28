import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { CiSearch } from "react-icons/ci";
import { useParams } from "react-router-dom";

export default function ProductsByBrands() {
  const [allProducts, setAllProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const { brandName } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchAllProducts();
    getAllBrands();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await HttpClient.get("/product");
      const formattedData = response.products.map((eachProduct) => ({
        objectId: eachProduct._id,
        bannerImage: eachProduct.bannerImage,
        productName: eachProduct.name,
        brandName: eachProduct.brand.name,
        price: eachProduct.price,
        productId: eachProduct.productId,
      }));
      setAllProducts(formattedData);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const getAllBrands = async () => {
    try {
      const { brands } = await HttpClient.get("/brand");
      const formattedBrands = brands.map((eachBrand) => ({
        brandId: eachBrand.brandId,
        brandName: eachBrand.name,
        image: eachBrand.image,
      }));
      setBrands(formattedBrands);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);
  const handleSelectBrand = (brand) => {
    setSelectedBrand(brand);
    closeDropdown();
  };

  return (
    <div>
      <div className="text-center px-5">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text"
          style={{
            background: "linear-gradient(to right, #2563eb, #eb25de)",
            WebkitBackgroundClip: "text",
          }}
        >
          Iconic Brands for Every Style
        </h1>
        <p className="hidden md:block text-gray-600">
          Discover fashion that suits every identity and occasion.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 items-center bg-gray-50 p-4 rounded-lg shadow">
        {/* Search Box */}
        <div className="flex items-center border border-gray-300 bg-white rounded-lg px-2 py-1 w-full md:w-auto">
          <CiSearch className="text-gray-500 mr-2" />
          <input
            type="search"
            placeholder="Search Product"
            className="w-full focus:outline-none bg-transparent"
          />
        </div>

        {/* Brand Dropdown */}
        <div className="relative w-64">
          <div
            className="border border-gray-300 rounded-lg px-2 py-1 bg-white cursor-pointer"
            onClick={toggleDropdown}
          >
            <span>{selectedBrand || "All Brands"}</span>
          </div>
          {isOpen && (
            <ul
              className="absolute z-10 bg-white border mt-1 rounded-lg shadow-lg max-h-64 overflow-y-auto w-full"
              onBlur={closeDropdown}
            >
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectBrand("")}
              >
                All Brands
              </li>
              {brands.map((brand) => (
                <li
                  key={brand.brandId}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectBrand(brand.brandName)}
                >
                  <img
                    src={brand.image}
                    alt={brand.brandName}
                    className="w-6 h-6 mr-2"
                  />
                  {brand.brandName}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sorting Dropdown */}
        <select
          className="border border-gray-300 rounded-lg px-2 py-1 bg-white"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by Price</option>
          <option value="Low to High">Low to High</option>
          <option value="High to Low">High to Low</option>
        </select>

        {/* Size Dropdown */}
        <select
          className="border border-gray-300 rounded-lg px-2 py-1 bg-white"
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
        >
          <option value="">Select Size</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>
      </div>

      <div className="flex flex-wrap px-6 justify-between gap-2">
        {allProducts.map((product) => (
          <div
            key={product.objectId}
            className="bg-white flex flex-col items-center rounded-lg p-3 shadow-lg w-1/5"
          >
            <h1 className="text-lg font-bold text-center">
              {product.productName}
            </h1>
            <img
              src={product.bannerImage || "https://via.placeholder.com/300"}
              alt={product.productName}
              className="h-40 w-40 object-cover rounded-full mb-2"
            />
            <p className="text-sm text-gray-700">{product.brandName}</p>
            <p className="text-lg text-gray-900 font-semibold">₹{product.price}</p>
            <Link to={`/product-details/${product.productId}`} className="mt-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
