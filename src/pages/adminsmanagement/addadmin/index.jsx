import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import AddAdminModal from "../adminmodal";
import { debounce } from "lodash";
import Loader from "../../../components/loader";
import Superadminheader from "../../../components/superadminheader";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";

const AdminManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  // Dummy data for admins
  const dummyAdmins = [
    {
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "12345678901",
      isVerified: true
    },
    {
      _id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phoneNumber: "09876543210",
      isVerified: true
    },
    {
      _id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      phoneNumber: "11223344556",
      isVerified: false
    },
    {
      _id: "4",
      name: "Alice Williams",
      email: "alice@example.com",
      phoneNumber: "55667788990",
      isVerified: true
    },
    {
      _id: "5",
      name: "Charlie Brown",
      email: "charlie@example.com",
      phoneNumber: "33445566778",
      isVerified: false
    }
  ];

  const [adminDetails, setAdminDetails] = useState(dummyAdmins);

  // Debounced search handler
  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 500);

  const filteredAdmins = adminDetails?.filter((admin) =>
    Object.values(admin)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery?.toLowerCase())
  );

  const clickToDeleteUser = async (email) => {
    try {
      // In a real app, you would call your API here
      setAdminDetails(adminDetails.filter(admin => admin.email !== email));
      toast.success("Admin deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete admin");
    }
  };

  const getAllAdmins = async () => {
    setLoading(true);
    try {
      // Simulate API call with timeout
      setTimeout(() => {
        setAdminDetails(dummyAdmins);
        setLoading(false);
      }, 800);
    } catch (err) {
      toast.error("There was an error fetching admins.");
      setLoading(false);
    }
  };

  const addNewAdmin = async (data) => {
    if (data?.phoneNumber.length !== 11) {
      return toast.info("Number should have 11 digits");
    }
    try {
      // Simulate API call
      const newAdmin = {
        _id: Math.random().toString(36).substr(2, 9),
        ...data,
        isVerified: false
      };
      setAdminDetails([...adminDetails, newAdmin]);
      toast.success("Admin added successfully");
    } catch (err) {
      toast.error("There was an error adding the admin.");
    }
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    getAllAdmins();
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar would go here */}
      <SuperAdminNav/>
      
      <div className="p-4 md:p-6 w-full min-h-screen bg-[#f2f7ff]">
        {/* Header */}
        <Superadminheader />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">Admin Management</h2>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500 whitespace-nowrap">{new Date().toDateString()}</p>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow w-full md:w-auto">
            <CiSearch className="text-gray-500 mr-2" />
            <input
              type="search"
              placeholder="Search by name, email..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="outline-none flex-grow text-sm w-full md:w-auto"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full w-full md:w-auto justify-center"
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
                <th className="p-3 whitespace-nowrap">Phone</th>
                <th className="p-3 whitespace-nowrap">Status</th>
                <th className="p-3 whitespace-nowrap">Action</th>
              </tr>
            </thead>

            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan="5" className="bg-[#FFF] text-center py-8">
                    <Loader size={50} color="#4ade80" />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {filteredAdmins?.length > 0 ? (
                  filteredAdmins?.map((admin, index) => (
                    <tr
                      key={admin._id}
                      className={`border-t text-sm ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                    >
                      <td className="p-3 whitespace-nowrap">{admin?.name}</td>
                      <td className="p-3 whitespace-nowrap">{admin?.email}</td>
                      <td className="p-3 whitespace-nowrap">{admin?.phoneNumber}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`font-medium ${admin?.isVerified ? "text-green-600" : "text-yellow-600"}`}>
                          {admin?.isVerified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <button
                          onClick={() => clickToDeleteUser(admin?.email)}
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
                    <td colSpan="5" className="p-4 text-center text-gray-500 font-medium">
                      No matching entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>

        {/* Add Admin Modal */}
        <AddAdminModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={addNewAdmin}
        />
      </div>
    </div>
  );
};

export default AdminManagement;