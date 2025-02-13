import { useState } from "react";

const DiscountAdvertisment = () => {
  // State for each field
  const [couponId, setCouponId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponName, setCouponName] = useState("");
  const [discountType, setDiscountType] = useState(""); // "percentage" or "fixedAmount"
  const [bannerImage, setBannerImage] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Handle file input change (for banner image)
  const handleFileChange = (e) => {
    setBannerImage(URL.createObjectURL(e.target.files[0]));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for required fields and discount type rules
    if (!couponId || !couponCode || !couponName || !discountType || !name || !title || !description || !bannerImage) {
      setError("All fields are required!");
      return;
    }

    if (discountType !== "percentage" && discountType !== "fixedAmount") {
      setError("Discount type must be either 'percentage' or 'fixedAmount'.");
      return;
    }

    // If all checks pass, log the form data
    const adData = {
      name,
      title,
      description,
      adType: "discountCoupon",
      couponId,
      couponCode,
      couponName,
      discountType,
      bannerImage,
    };

    console.log("Advertisement Data: ", adData);

    // Clear form after successful submission (optional)
    setName("");
    setTitle("");
    setDescription("");
    setCouponId("");
    setCouponCode("");
    setCouponName("");
    setDiscountType("");
    setBannerImage("");
    setError("");
  };

  return (
    <div className="mx-auto px-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-2 text-center">Discount Coupon Advertisement</h1>

      {/* Display error message */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Advertisement Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., New Year Offer"
          />
        </div>

        {/* Title Input */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Advertisement Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Flat 20% Off"
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Description</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter the description for the advertisement"
          />
        </div>

        {/* Coupon ID Input */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Coupon ID</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={couponId}
            onChange={(e) => setCouponId(e.target.value)}
            placeholder="e.g., coupon123"
          />
        </div>

        {/* Coupon Code Input */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Coupon Code</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="e.g., NY2025"
          />
        </div>

        {/* Coupon Name Input */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Coupon Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={couponName}
            onChange={(e) => setCouponName(e.target.value)}
            placeholder="e.g., New Year Discount"
          />
        </div>

        {/* Discount Type Input */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Discount Type</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
          >
            <option value="">Select Discount Type</option>
            <option value="percentage">Percentage</option>
            <option value="fixedAmount">Fixed Amount</option>
          </select>
        </div>

        {/* Banner Image Upload */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Banner Image</label>
          <input
            type="file"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            onChange={handleFileChange}
          />
          {bannerImage && (
            <div className="mt-2">
              <img src={bannerImage} alt="Banner Preview" className="w-full h-auto" />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 mb-2 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          >
            Submit Advertisement
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiscountAdvertisment;
