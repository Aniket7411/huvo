import React, { useState } from "react";
import axios from "axios";
import { HttpClient } from "../../server/client/http";

const SellerProfileComponent = () => {
  const [formData, setFormData] = useState({
    userName: "",
    businessName: "",
    businessDescription: "",
    businessAddress: "",
    emailAddress: "",
    mobileNumber: "",
    contactNumberIncharge: "",
    state: "",
    city: "",
    zipCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      const response = await HttpClient.post("/users/sellerStore", formData);
      console.log("Success:", response.data);
     
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("An error occurred while saving data.");
    }
  };

  return (
    <div className="bg-[#F2F2F2] h-full p-2 md:p-5">
      <div className="px-5 border-b border-solid border-[#D6D6D6]">
        <p className="text-[#2F2F2F] font-semibold text-lg mb-2">
          Business Verification Form
        </p>
      </div>
      <form onSubmit={handleSubmit} className="px-5 md:px-5 my-4">
        <div className="mb-5">
          Business Information
          <hr />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
          <div>
            <label className="text-[#626262] font-medium mb-2 ml-2">
            User Name (Your buyer can search you using this)
            </label>
            <input
              type="text"
              name="userName"
              placeholder="User Name"
              className="w-full p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px]"
              value={formData.userName}
              onChange={handleChange}
              required
            />
            <label className="text-[#626262] font-medium mb-2 ml-2">
              Store Name
            </label>
            <input
              type="text"
              name="businessName"
              placeholder="Store Name"
              className="w-full p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px]"
              value={formData.businessName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-[#626262] font-medium mb-2 ml-2">
              Business Description
            </label>
            <input
              type="text"
              name="businessDescription"
              placeholder="Business description"
              className="w-full p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px]"
              value={formData.businessDescription}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {/* <div className="mb-5 mt-5">
          Contact Information
          <hr />
        </div> */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[#626262] font-medium mb-2 ml-2">
              Business Address
            </label>
            <input
              type="text"
              name="businessAddress"
              placeholder="Business address"
              className="border border-gray-300 rounded-lg p-3 w-full"
              value={formData.businessAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-[#626262] font-medium mb-2 ml-2">
              Email Address
            </label>
            <input
              type="email"
              name="emailAddress"
              placeholder="Enter your email"
              className="border border-gray-300 rounded-lg p-3 w-full"
              value={formData.emailAddress}
              onChange={handleChange}
              required
            />
          </div>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[#626262] font-medium mb-2 ml-2">
              City Address
            </label>
            <input
              type="text"
              name="city"
              placeholder="City"
              className="border border-gray-300 rounded-lg p-3 w-full"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-[#626262] font-medium mb-2 ml-2">
              State
            </label>
            <input
              type="text"
              name="state"
              placeholder="Enter your State"
              className="border border-gray-300 rounded-lg p-3 w-full"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <label className="block text-[#626262] font-medium mb-2 ml-2">
          Mobile Number
        </label>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <select className="border border-gray-300 rounded-lg p-3 w-full">
            <option>+91</option>
          </select>
          <input
            type="text"
            name="mobileNumber"
            placeholder="Enter your mobile number"
            className="border border-gray-300 rounded-lg p-3 w-full col-span-2"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </div>
        <label className="block text-[#626262] font-medium mb-2 ml-2">
          Zip Code
        </label>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="zipCode"
            placeholder="Enter Zip Code"
            className="border border-gray-300 rounded-lg p-3 w-full col-span-2"
            value={formData.zipCode}
            onChange={handleChange}
            required
          />
        </div> */}
        {/* Add other form fields here */}
        <button
          className="bg-[#011F4B] text-[#FFFFFF] font-bold rounded-md px-8 py-3 mx-auto block my-4"
          type="submit"
        >
          SAVE
        </button>
      </form>
    </div>
  );
};

export default SellerProfileComponent;
