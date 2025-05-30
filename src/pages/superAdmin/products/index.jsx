import React, { useState, useEffect } from "react";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";
import Superadminheader from "../../../components/superadminheader";
import { CiSearch } from "react-icons/ci";
import { HttpClient } from "../../../server/client/http";
import Loader from "../../../components/loader";

export default function ProductsAdmin() {
  const [productList, setProductList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productToSearch, setProductToSearch] = useState("");
  const [sortOption, setSortOption] = useState("");

  const getProductList = async () => {
    setLoading(true);
    try {
      const response = await HttpClient.get("/product");
      setProductList(response.products);
      setFilteredProducts(response.products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setProductToSearch(searchQuery);
    const filtered = productList.filter((item) =>
      item.name.toLowerCase().includes(searchQuery)
    );
    setFilteredProducts(filtered);
  };

  const handleSort = (event) => {
    const value = event.target.value;
    setSortOption(value);

    const sortedList = [...filteredProducts];
    if (value === "priceLowToHigh") {
      sortedList.sort((a, b) => a.price - b.price);
    } else if (value === "priceHighToLow") {
      sortedList.sort((a, b) => b.price - a.price);
    } else if (value === "alphabetical") {
      sortedList.sort((a, b) => a.name.localeCompare(b.name));
    }
    setFilteredProducts(sortedList);
  };

  useEffect(() => {
    getProductList();
  }, []);

  return (
    <div className="flex">
      <div className="bg-[#E7EFFA] h-screen">
        <SuperAdminNav />
      </div>
      <div className="w-full">
        <Superadminheader />
        <div className="mx-2">
          <div className="flex items-center justify-between">
            <h1 className="mr-2">Products</h1>
            <div className="flex items-center gap-10">
              <select
                className="p-1 border rounded-lg"
                value={sortOption}
                onChange={handleSort}
              >
                <option value="" disabled hidden>
                  Sort By
                </option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
              <div className="border flex items-center p-1 bg-[#FFFFFF] rounded-lg">
                <CiSearch className="mr-2 text-[#000000]" />
                <input
                  placeholder="Search"
                  className="border-0 w-full outline-none"
                  onChange={handleSearch}
                  value={productToSearch}
                />
              </div>
            </div>
          </div>
        </div>
        <hr className="mx-2 mt-2" />

        <div
          className="p-8"
          style={{
            height: "76vh",
            overflowY: "auto",
          }}
        >
          {loading ? (
            <Loader />
          ) : filteredProducts.length ? (
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Seller ID</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productId}</td>
                    <td>{item.name}</td>
                    <td>{item.seller}</td>
                    <td>{item.price}</td>
                    <td>{item.isReturnable ? "Returnable" : "Not Returnable"}</td>
                    <td>
                      <img
                        src={item.bannerImage}
                        alt="banner"
                        className="h-20 w-20 object-contain rounded-md"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex items-center justify-center h-[62vh]">
              No Products Available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
