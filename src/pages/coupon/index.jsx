import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HttpClient } from "../../server/client/http";
import { FiPlus } from "react-icons/fi";
import Loader from "../../components/loader";
import SellerCoupons from "../sellercoupons";

function CouponList() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCouponForm, setShowCouponForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");
    const [couponData, setCouponData] = useState({
        name: "",
        discountPercentage: "",
        validFrom: "",
        validUntil: ""
    });
    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { categories } = await HttpClient.get("/category");
            setCategories(categories || []);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCouponData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedGroup(""); // Reset group when category changes
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCategory || !selectedGroup) {
            toast.error("Please select both category and group");
            return;
        }

        if (!couponData.name || !couponData.discountPercentage) {
            toast.error("Please fill all coupon details");
            return;
        }


        try {
            setLoading(true);
            const payload = {
                ...couponData,
                categoryId: selectedCategory,
                group: selectedGroup,
                discountPercentage: Number(couponData.discountPercentage)
            };

            console.log(payload)

            await HttpClient.post("/coupons", payload);
            toast.success("Coupon created successfully!");
            setShowCouponForm(false);
            setCouponData({
                name: "",
                discountPercentage: "",
                validFrom: "",
                validUntil: ""
            });
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to create coupon");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);


    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className="p-4  mx-auto">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Seller Details</h2>
                <button
                    onClick={() => setShowCouponForm(!showCouponForm)}
                    className="bg-[#011f4b] text-white text-sm px-2 py-1 rounded-md transition"
                >
                    {showCouponForm ? "View Coupons" : "Add New Coupon"}
                </button>
            </div>

            {showCouponForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h3 className="text-xl font-semibold mb-4">Create New Coupon</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    className="w-full border p-2 rounded-md"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Group</label>
                                <select
                                    value={selectedGroup}
                                    onChange={(e) => setSelectedGroup(e.target.value)}
                                    className="w-full border p-2 rounded-md"
                                    required
                                    disabled={!selectedCategory}
                                >
                                    <option value="">Select Group</option>

                                    <option value="men" >Men</option>
                                    <option value="women">Women</option>
                                    <option value="kids">Kids</option>

                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Coupon Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={couponData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. SUMMER20"
                                    className="w-full border p-2 rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Discount Percentage</label>
                                <input
                                    type="number"
                                    name="discountPercentage"
                                    value={couponData.discountPercentage}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 20"
                                    min="1"
                                    max="100"
                                    className="w-full border p-2 rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Valid From</label>
                                <input
                                    type="date"
                                    name="validFrom"
                                    value={couponData.validFrom}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]} // Sets minimum to today's date
                                    className="w-full border p-2 rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Valid Until</label>
                                <input
                                    type="date"
                                    name="validUntil"
                                    value={couponData.validUntil}
                                    onChange={handleInputChange}
                                    min={couponData.validFrom || new Date().toISOString().split('T')[0]} // Minimum is either today or validFrom date
                                    className="w-full border p-2 rounded-md"
                                    required
                                />
                            </div>


                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {loading ? "Processing..." : "Create Coupon"}
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-left">Description</th>
                                <th className="p-4 text-left">Groups</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">{capitalizeFirstLetter(category.name)}</td>
                                    <td className="p-4">{capitalizeFirstLetter(category.description)}</td>
                                    <td className="p-4">
                                        {category.group.map((group, i) => (
                                            <span
                                                key={group._id}
                                                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                                            >
                                                {capitalizeFirstLetter(group.name)}
                                            </span>
                                        ))}
                                    </td>
                                </tr>

                            ))}
                        </tbody>
                    </table> */}

                    <SellerCoupons />
                </div>
            )}
        </div>
    );
}

export default CouponList;