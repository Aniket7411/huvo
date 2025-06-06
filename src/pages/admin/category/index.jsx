import React, { useState, useEffect } from "react";
import { HttpClient } from "../../../server/client/http";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { getUserData } from "../../../server/user";
import Loader from "../../../components/loader";

function CategoryList() {
  const [allCategory, setAllCategory] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const getAllCategory = async () => {
    try {
      setLoader(true);
      const { categories } = await HttpClient.get("/category");
      if (categories) {
        setLoader(false);
      }
      setAllCategory(categories);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const deleteCategory = async (_id) => {
    try {
      const { message } = await HttpClient.delete(`/category/${_id}`);
      toast.success(message);
      getAllCategory();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <div className="px-6 mx-auto my-4">
      <h1 className="text-4xl font-bold mb-4 text-center capitalize">
        <Link to="/seller" className="text-2xl font-bold mb-4 hover:underline">
          {getUserData()?.role.toLowerCase()} Dashboard
        </Link>
        <Link
          to="/"
          target="_blank"
          className="text-base font-bold mb-4 hover:underline ml-3"
        >
          (Website)
        </Link>
      </h1>
      <div className="flex justify-between flex-wrap mb-3">
        <h2 className="text-2xl font-bold mb-4">Category List</h2>
        <Link
          to="/seller/category/add"
          className=" font-bold mb-4 hover:underline"
        >
          <button className="bg-[#011F4B] text-[#fff] px-2 py-1 rounded-md">
          Add Category
          </button>
        </Link>
      </div>
      {allCategory.length ? (
  <div className="relative h-[62vh] overflow-auto">
    {/* Desktop Table */}
    <div className="hidden md:block">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-gray-100 z-10">
          <tr>
            {['Name', 'Description', 'Group', 'Banner Image', 'Actions'].map((header) => (
              <th 
                key={header}
                className="p-4 text-left font-medium text-gray-700 border-b border-gray-200"
                style={{ minWidth: header === 'Name' ? '220px' : '150px' }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allCategory.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50">
              <td className="p-4 border-b border-gray-200">
                <p className="font-medium text-gray-800">{item?.name}</p>
              </td>
              <td className="p-4 border-b border-gray-200">
                <p className="text-gray-600 line-clamp-2">{item?.description}</p>
              </td>
              <td className="p-4 border-b border-gray-200">
                <div className="flex flex-wrap gap-1">
                  {item?.group.map((data, i) => (
                    <span key={i} className="text-gray-600">
                      {data?.name}
                      {i < item?.group.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </td>
              <td className="p-4 border-b border-gray-200">
                <div className="flex justify-center">
                  <img
                    src={item?.bannerImage}
                    alt="Category banner"
                    className="h-20 w-20 object-cover rounded"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              </td>
              <td className="p-4 border-b border-gray-200">
                <div className="flex justify-start space-x-4">
                  <button
                    onClick={() => navigate(`/seller/category/edit/${item?.categoryId}`)}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label="Edit"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => deleteCategory(item?._id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Delete"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="currentColor"
                    >
                      <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z" />
                      <path d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z" />
                      <path d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z" />
                      <path d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile Cards */}
    <div className="md:hidden space-y-4 p-2">
      {allCategory.map((item) => (
        <div key={item._id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg text-gray-800">{item?.name}</h3>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item?.description}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/seller/category/edit/${item?.categoryId}`)}
                className="text-blue-600 p-1"
              >
                <FiEdit size={18} />
              </button>
              <button
                onClick={() => deleteCategory(item?._id)}
                className="text-red-600 p-1"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                  <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex flex-wrap gap-1 mb-2">
              <span className="font-medium text-gray-700">Groups: </span>
              {item?.group.map((data, i) => (
                <span key={i} className="text-gray-600">
                  {data?.name}
                  {i < item?.group.length - 1 ? ',' : ''}
                </span>
              ))}
            </div>

            <div className="mt-2">
              <img
                src={item?.bannerImage}
                alt="Category banner"
                className="h-32 w-full object-cover rounded"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
) : (
  <div className="h-[62vh] flex items-center justify-center">
    {loader ? <Loader /> : (
      <div className="text-center">
        <p className="text-gray-500 text-lg">No Categories Available</p>
        <button 
          onClick={() => navigate('/seller/category/add')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Category
        </button>
      </div>
    )}
  </div>
)}
    </div>
  );
}

export default CategoryList;
