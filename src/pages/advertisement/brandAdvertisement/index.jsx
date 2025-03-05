import { useEffect, useState } from "react";
import { HttpClient } from "../../../server/client/http";

const BrandAdvertisement = () => {
  // State for each field
  const [brandId, setBrandId] = useState("");
  const [brandName, setBrandName] = useState("");
  const [subType1, setSubType1] = useState(["category"]); // Default value for subType1
  const [subType2, setSubType2] = useState(["group"]); // Default value for subType2
  const [bannerImage, setBannerImage] = useState(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]); // For multiple brand selections
  const [selectedCategory, setSelectedCategory] = useState("");

  // Handle file input change (for banner image)
  const handleFileChange = (e) => {
    setBannerImage(URL.createObjectURL(e.target.files[0]));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for required fields and subtype rules
    if (!brandId || !brandName || !name || !title || !description || !bannerImage || !selectedCategory || selectedBrands.length === 0) {
      setError("All fields are required!");
      return;
    }

    if (!subType1.includes("category")) {
      setError("subType1 must include 'category'.");
      return;
    }

    if (!subType2.includes("group")) {
      setError("subType2 must include 'group'.");
      return;
    }

    // If all checks pass, log the form data
    const adData = {
      name,
      title,
      description,
      adType: "brand",
      brandId,
      brandName,
      bannerImage,
      subType1,
      subType2,
      selectedBrands,
      selectedCategory,
    };

    console.log("Advertisement Data: ", adData);

    // Clear form after successful submission (optional)
    setName("");
    setTitle("");
    setDescription("");
    setBrandId("");
    setBrandName("");
    setBannerImage(null);
    setSelectedCategory("");
    setSelectedBrands([]);
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

  // Handle multiple brand selection
  const handleBrandChange = (e) => {
    const { value, checked } = e.target;
    setSelectedBrands((prevSelected) =>
      checked ? [...prevSelected, value] : prevSelected.filter((brand) => brand !== value)
    );
  };

  return (
    <div className=" bg-white rounded-lg shadow-lg ">
      <h1 className="text-2xl font-semibold mb-4 text-center">Brand Advertisement</h1>

      {/* Display error message */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Advertisement Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Adidas Offers"
            required
          />
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Advertisement Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Exclusive Discounts on Adidas"
            required
          />
        </div>

        {/* Description Input */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Description</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter the description for the advertisement"
            required
          />
        </div>

        {/* Select Brands (Multiple) */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Select Brands</label>
          <div className="flex flex-wrap gap-4">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`brand-${brand.id}`}
                  value={brand.brandName}
                  onChange={handleBrandChange}
                  className="mr-2"
                />
                <label htmlFor={`brand-${brand.id}`} className="text-lg">
                  {brand.brandName}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Select Category */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Select Category</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
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
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Banner Image</label>
          <input
            type="file"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            onChange={handleFileChange}
            required
          />
          {bannerImage && (
            <div className="mt-2 flex items-center">
              <img src={bannerImage} alt="Banner Preview" className="w-32 h-32 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => setBannerImage(null)}
                className="bg-red-500 px-2 ml-2 text-white rounded-lg py-1"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          >
            Submit Advertisement
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandAdvertisement;
