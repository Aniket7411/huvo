import { useEffect, useState } from "react";
import { HttpClient } from "../../../server/client/http";

const GroupAdvertisement = () => {
  // State for each field
  const [groupName, setGroupName] = useState("");
  const [subType1, setSubType1] = useState(["brand"]); // Default value for subType1
  const [subType2, setSubType2] = useState(["category"]); // Default value for subType2
  const [bannerImage, setBannerImage] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Handle file input change (for banner image)
  const handleFileChange = (e) => {
    setBannerImage(URL.createObjectURL(e.target.files[0]));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for required fields and subtype rules
    if (!groupName || !name || !title || !description || !bannerImage || !selectedCategory) {
      setError("All fields are required!");
      return;
    }

    if (!subType1.includes("brand")) {
      setError("subType1 must include 'brand'.");
      return;
    }

    if (!subType2.includes("category") && !subType2.includes("group")) {
      setError("subType2 must include 'category' or 'group'.");
      return;
    }

    // If all checks pass, log the form data
    const adData = {
      name,
      title,
      description,
      adType: "group",
      groupName,
      bannerImage,
      subType1,
      subType2,
      selectedCategory,
    };

    console.log("Advertisement Data: ", adData);

    // Clear form after successful submission (optional)
    setName("");
    setTitle("");
    setDescription("");
    setGroupName("");
    setBannerImage("");
    setSelectedCategory("");
    setError("");
  };

  // Fetch categories and brands from the server
  const getAllCategories = async () => {
    try {
      const response = await HttpClient.get("/category/");
      const formattedData = response.categories.map((eachCategory) => ({
        id: eachCategory._id,
        categoryName: eachCategory.name,
      }));

      setCategories(formattedData); // Set the formatted categories in the state
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getAllBrands = async () => {
    try {
      const response = await HttpClient.get("/brand/");
      const formattedData = response.brands.map((eachBrand) => ({
        id: eachBrand._id,
        brandName: eachBrand.name,
      }));

      setBrands(formattedData); // Set the formatted brands in the state
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    getAllBrands();
    getAllCategories();
  }, []);

  return (
    <div className="mx-auto px-4 bg-white rounded-lg shadow-lg ">
      <h1 className="text-2xl font-semibold mb-2 text-center">Group Advertisement</h1>

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
            placeholder="e.g., Trendy Kids Wear"
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
            placeholder="e.g., Discover Stylish Wear for Kids"
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

        {/* Group Name Input */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Group Name</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          >
            <option value="">Select a Group</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>
        </div>

        {/* Select Category */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Select Category</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
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

export default GroupAdvertisement;
