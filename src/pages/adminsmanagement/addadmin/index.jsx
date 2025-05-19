import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import AddAdminModal from "../adminmodal";
import { debounce } from "lodash";
import Loader from "../../../components/loader";
import Superadminheader from "../../../components/superadminheader";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";
import { HttpClient } from "../../../server/client/http";

const AdminManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [adminDetails, setAdminDetails] = useState([]);

  // Debounced search handler
  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 500);



  const getAllAdmins = async () => {
    setLoading(true);
    try {
      const response = await HttpClient.get("/users/admin/get");

      console.log(response)

      const formattedAdminData = response?.users?.map((details) => ({
        firstName: details?.firstName,
        lastName: details?.lastName,
        email: details?.email,
      }))

      console.log(formattedAdminData)
      setAdminDetails(formattedAdminData || []);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch admins.");
      setLoading(false);
    }
  };

  const addNewAdmin = async (data) => {
    try {
      const response = await HttpClient.post("/users/admin/add", {
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
        password: data?.password,
      });
      setAdminDetails([...adminDetails, response.data]);
      toast.success("Admin added successfully");
    } catch (error) {
      toast.error("Failed to add admin.");
    }
  };

  const clickToDeleteUser = async (email) => {
    
    console.log(email)
    try {
      const response = await HttpClient.post("/users/admin/delete", {email})
      toast.success(response?.message)
    } catch (error) {
      toast.error(error?.message)
    }
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    getAllAdmins();
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      <SuperAdminNav />

      <div className="p-4 md:p-6 w-full min-h-screen bg-[#f2f7ff]">
        <Superadminheader />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">Admin Management</h2>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500 whitespace-nowrap">{new Date().toDateString()}</p>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          {/* <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow w-full md:w-auto">
            <CiSearch className="text-gray-500 mr-2" />
            <input
              type="search"
              placeholder="Search by name, email..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="outline-none flex-grow text-sm w-full md:w-auto"
            />
          </div> */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full w-full md:w-auto justify-center"
          >
            <FiPlus className="mr-2" />
            Add Admin
          </button>
        </div>

        <hr className="mb-4" />

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-sm font-medium">
                <th className="p-3 whitespace-nowrap">Name</th>
                <th className="p-3 whitespace-nowrap">Email</th>
                <th className="p-3 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan="4" className="bg-[#FFF] text-center py-8">
                    <Loader size={50} color="" />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {adminDetails?.length > 0 ? (
                  adminDetails.map((detail) => (
                    <tr
                      key={detail?.email}

                    >
                      <td className="p-3 whitespace-nowrap">
                        {detail?.firstName} {detail?.lastName}
                      </td>
                      <td className="p-3 whitespace-nowrap">{detail?.email}</td>

                      <td className="p-3 whitespace-nowrap">
                        <button

                          onClick={() => clickToDeleteUser(detail?.email)}
                          className="flex items-center justify-center bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-colors"
                          aria-label="Delete admin"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500 font-medium">
                      No matching entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>

        <AddAdminModal isOpen={isModalOpen} onClose={closeModal} onSubmit={addNewAdmin} />
      </div>
    </div>
  );
};

export default AdminManagement;
