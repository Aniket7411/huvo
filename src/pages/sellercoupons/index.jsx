import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HttpClient } from "../../server/client/http";
import Modal from "react-modal";
import { FiTrash2, FiEdit } from "react-icons/fi";

// Make sure to bind modal to your appElement
Modal.setAppElement("#root");

const dummyCoupons = [
  {
    id: "CPN001",
    code: "SUMMER25",
    discount: "25%",
    category: "T-Shirts",
    group: "Men",
    validity: "Jun 1 - Aug 31, 2023",
    status: "Active"
  },
  {
    id: "CPN002",
    code: "WINTER20",
    discount: "20%",
    category: "Jackets",
    group: "Women",
    validity: "Dec 1 - Feb 28, 2024",
    status: "Upcoming"
  },
];

const SellerCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await HttpClient.get("/coupons");
      setCoupons(response.data || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (coupon) => {
    setCouponToDelete(coupon);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCouponToDelete(null);
  };

  const handleDeleteCoupon = async () => {
    if (!couponToDelete) return;

    try {
      setLoading(true);
      await HttpClient.delete(`/coupons/${couponToDelete._id}`);
      toast.success("Coupon deleted successfully");
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon");
    } finally {
      setLoading(false);
      closeDeleteModal();
    }
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "500px",
      width: "90%",
      borderRadius: "8px",
      padding: "2rem",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
  };

  return (
    <div className="p-4  mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Coupons</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading coupons...</p>
        </div>
      ) : dummyCoupons.length === 0 ? (
        <p className="text-gray-500">No coupons found.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {dummyCoupons.map((coupon) => (
              <div key={coupon.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">{coupon.code}</p>
                    <p className="text-gray-600">{coupon.discount}</p>
                  </div>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => openDeleteModal(coupon)}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Category</p>
                    <p>{coupon.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Group</p>
                    <p>{coupon.group}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Validity</p>
                    <p>{coupon.validity === "No expiry" ? "No expiry" : coupon.validity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <table className="w-full hidden md:table">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Code</th>
                <th className="p-4 text-left">Discount</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Group</th>
                <th className="p-4 text-left">Validity</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyCoupons.map((coupon) => (
                <tr key={coupon.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold">{coupon.code}</td>
                  <td className="p-4">{coupon.discount}</td>
                  <td className="p-4">{coupon.category}</td>
                  <td className="p-4">{coupon.group}</td>
                  <td className="p-4">
                    {coupon.validity === "No expiry" ? "No expiry" : coupon.validity}
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => openDeleteModal(coupon)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        style={customStyles}
        contentLabel="Delete Coupon Confirmation"
      >
        <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-6">
          Are you sure you want to delete coupon{" "}
          <span className="font-bold">"{couponToDelete?.code}"</span>?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={closeDeleteModal}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteCoupon}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SellerCoupons;