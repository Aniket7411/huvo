import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";

const StocksTable = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    try {
      setLoading(true);
      const response = await HttpClient.get("/dashboard");
      setProductList(response.report?.products || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {productList.length > 0 ? (
            productList.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <img 
                    src={item.bannerImage} 
                    alt={item.name}
                    className="h-10 w-10 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`${item.sizes.some(size => parseInt(size.stock) > 0) ? 'text-green-600' : 'text-red-600'}`}>
                    {item.sizes.some(size => parseInt(size.stock) > 0) ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {item.price}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-4 text-center text-gray-500" colSpan="4">
                No products available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StocksTable;