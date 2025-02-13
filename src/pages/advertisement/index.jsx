import { useState } from "react";
import BrandAdvertisement from "./brandAdvertisement";
import GroupAdvertisement from "./groupadvertisment";
import CategoryAdvertisement from "./categoryAdvertisement";
import DiscountAdvertisment from "./discountadvertisement";

const Advertisement = () => {
  // State to track the selected advertisement type
  const [activeTab, setActiveTab] = useState("category");

  // Handle advertisement type change
  const handleTabChange = (e) => {
    setActiveTab(e.target.value);
  };

  return (
    <div className="p-6 mx-auto bg-white rounded-lg">
       {/* Select Dropdown for Advertisement Type */}
      <div className="mb-2">
        <label className="block text-lg font-medium mt-2 mb-2">Select Advertisement Type</label>
        <select
          value={activeTab}
          onChange={handleTabChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="category">Category</option>
          <option value="brand">Brand</option>
          <option value="group">Group</option>
          <option value="discounted">Discount Ad</option>
        </select>
      </div>

      {/* Content for Active Advertisement Type */}
      <div className="tab-content">
        {activeTab === "category" && <CategoryAdvertisement />}
        {activeTab === "brand" && <BrandAdvertisement />}
        {activeTab === "group" && <GroupAdvertisement />}
        {activeTab === "discounted" && <DiscountAdvertisment />}
      </div>
    </div>
  );
};

export default Advertisement;
