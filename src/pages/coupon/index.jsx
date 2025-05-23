import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { HttpClient } from '../../server/client/http';
import { toast } from 'react-toastify';

Modal.setAppElement('#root'); // For accessibility

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        couponCode: '',
        couponName: '',
        couponUsageLimit: '',
        discount: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const getCouponList = async () => {
        try {
            const response = await HttpClient.get("/coupon/list")
            console.log("responsecoupon", response)
           
            const formattedData = response?.coupons.map((each) => ({
                couponCode: each?.couponCode,
                couponName:each?.couponName,
                couponUsageLimit:each?.couponUsageLimit,
                discount:each?.discount,
                couponId:each?._id
,

            }))

            console.log("formattedData",formattedData)
            setCoupons(formattedData)
        } catch (error) {

        }
    }

    useEffect(() => {
        getCouponList()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData)
        try {

            // Refresh the list
            const response = await HttpClient.post("/coupon", formData);
            setCoupons(response.data);
            setIsModalOpen(false);
            setFormData({
                couponCode: '',
                couponName: '',
                couponUsageLimit: '',
                discount: ''
            });
            toast.success(response?.message)
        } catch (error) {
            console.error('Error adding coupon:', error);
        }
    };

    const handleDelete = async (id) => {
        console.log(id)
        try {
            const response = await HttpClient.delete(`/coupon/${id}`)
            console.log(response)
            toast.success(response?.message)
            getCouponList()
        } catch (error) {
            toast.error(error?.message)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Coupon Management</h1>

            {/* Add Coupon Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6"
            >
                Add New Coupon
            </button>

            {/* Coupons Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border">Coupon Code</th>
                            <th className="py-2 px-4 border">Coupon Name</th>
                            <th className="py-2 px-4 border">Discount (₹)</th>
                            <th className="py-2 px-4 border">Max Users</th>
                            <th className="py-2 px-4 border">Used</th>
                            <th className="py-2 px-4 border">Remaining</th>
                            <th className="py-2 px-4 border">Remove</th>

                        </tr>
                    </thead>
                    <tbody>
                        {coupons?.map((coupon) => (
                            <tr key={coupon?.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border text-center">{coupon?.couponCode}</td>
                                <td className="py-2 px-4 border text-center">{coupon?.couponName}</td>
                                <td className="py-2 px-4 border text-center">₹{coupon?.discount}</td>
                                <td className="py-2 px-4 border text-center">{coupon?.couponUsageLimit}</td>
                                <td className="py-2 px-4 border text-center">{coupon?.usedCount || 0}</td>
                                <td className="py-2 px-4 border text-center">{coupon?.couponUsageLimit}</td>
                                <td className="py-2 px-4 border text-center">
                                    <button
                                        onClick={() => handleDelete(coupon?.couponId)}
                                        className="bg-blue-600 rounded-md text-sm  hover:bg-blue-800 text-[#fff] px-2 py-1"
                                    >
                                        <i className="fas fa-trash-alt"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Coupon Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="modal"
                overlayClassName="overlay"
            >
                <div className="bg-white p-6 rounded-lg max-w-md mx-auto mt-10">
                    <h2 className="text-xl font-bold mb-4">Add New Coupon</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Coupon Code</label>
                            <input
                                type="text"
                                name="couponCode"
                                value={formData.couponCode}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Coupon Name</label>
                            <input
                                type="text"
                                name="couponName"
                                value={formData.couponName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Max Users</label>
                            <input
                                type="number"
                                name="couponUsageLimit"
                                value={formData.couponUsageLimit}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Discount (₹)</label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Add Coupon
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Tailwind Modal Styling (Add to your CSS) */}
            <style jsx global>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 2rem;
        }
        .overlay {
          z-index: 1000;
        }
      `}</style>
        </div>
    );
};

export default CouponManagement;