import { useState } from "react";
import BrandAdvertisement from "./brandAdvertisement";
import GroupAdvertisement from "./groupadvertisment";
import CategoryAdvertisement from "./categoryAdvertisement";
import DiscountAdvertisment from "./discountadvertisement";
import Superadminheader from "../../components/superadminheader";
import SuperAdminNav from "../../components/superadminNavbar/superadminnav";

const Advertisement = () => {
  // State to track the selected advertisement type
  const [activeTab, setActiveTab] = useState("category");

  // Handle advertisement type change
  const handleTabChange = (e) => {
    setActiveTab(e.target.value);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <div className="w-1/5 bg-[#E7EFFA]">
        <SuperAdminNav />
      </div>

      {/* Main Content */}
      <div className="w-4/5 p-4">
        <Superadminheader />

        {/* Dropdown for Advertisement Type */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Select Advertisement Type
          </label>
          <select
            value={activeTab}
            onChange={handleTabChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="category">Category</option>
            <option value="brand">Brand</option>
            <option value="group">Group</option>
            <option value="discounted">Discount Ad</option>
          </select>
        </div>

        {/* Tab Content */}
        <div className="tab-content bg-white p-4 shadow-md rounded-lg">
          {activeTab === "category" && <CategoryAdvertisement />}
          {activeTab === "brand" && <BrandAdvertisement />}
          {activeTab === "group" && <GroupAdvertisement />}
          {activeTab === "discounted" && <DiscountAdvertisment />}
        </div>
      </div>
    </div>
  );
};

export default Advertisement;
