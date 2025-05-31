import React, { useState, useEffect } from "react";
import { HttpClient } from "../../../server/client/http";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit, FiPlus } from "react-icons/fi";
import { getUserData } from "../../../server/user";
import Loader from "../../../components/loader";
import { MdDelete } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

function BrandList() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [loader, setLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllBrands = async () => {
    try {
      setLoader(true);
      const { brands } = await HttpClient.get("/brand");
      if (brands) {
        setLoader(false);
      }
      setBrands(brands);
      setFilteredBrands(brands);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const deleteBrand = async (_id) => {
    try {
      const { message } = await HttpClient.delete(`/brand/${_id}`);
      toast.success(message);
      getAllBrands();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setFilteredBrands(brands);
    } else {
      const filtered = brands.filter(brand =>
        brand.name.toLowerCase().includes(term)
      );
      setFilteredBrands(filtered);
    }
  };

  useEffect(() => {
    getAllBrands();
  }, []);

  return (
    <div className="mx-auto my-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          <Link to="/seller" className="hover:text-blue-600 transition-colors">
            {getUserData()?.role.toUpperCase()} Dashboard
          </Link>
          <Link
            to="/"
            target="_blank"
            className="text-sm ml-3 text-[#011f4b] hover:underline"
          >
            (Visit Website)
          </Link>
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Brands</h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex items-center w-full sm:w-64">
              <CiSearch className="absolute left-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search brands..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#011f4b] focus:border-transparent"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <Link
              to="/seller/brands/add"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#011f4b] text-white rounded-lg  transition-colors shadow-sm"
            >
              <FiPlus size={18} />
              <span>Add Brand</span>
            </Link>
          </div>
        </div>
      </div>

      {loader ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : filteredBrands.length ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Logo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offer
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBrands.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-16 w-16">
                        <img className="h-full w-full object-contain" src={item.logo} alt={item.name} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-16 w-16">
                        <img className="h-full w-full object-contain" src={item.image} alt={item.name} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.onGoingOffer || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => navigate(`/seller/brands/edit/${item.brandId}`)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit"
                        >
                          <FiEdit size={20} />
                        </button>
                        <button
                          onClick={() => deleteBrand(item._id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "No matching brands found" : "No brands available"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Try a different search term" : "Get started by adding a new brand"}
          </p>
          <Link
            to="/seller/brands/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#011f4b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Brand
          </Link>
        </div>
      )}
    </div>
  );
}

export default BrandList;