import { useEffect, useState } from "react";
import { HttpClient } from "../../../server/client/http";
import uploadImageOnCloudinary from "../../../server/client/imageUpload";

const BrandAdvertisement = () => {
  // State for each field
  const [brandId, setBrandId] = useState("");
  const [brandName, setBrandName] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]); // For multiple brand selections
  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedGroup, setSelectedGroup] = useState(""); // Tracks selected group
  const group = ["Men", "Women", "All"]; // Options for group dropdown


  // Handle file input change (for banner image)
  const handleFileChange = (e) => {
    setBannerImage(URL.createObjectURL(e.target.files[0]));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();




    // If all checks pass, log the form data
    const adData = {
      name,
      title,
      description,
      adType: "brand",
      brandId,
      brandName,
      bannerImage,
      selectedBrands,
      selectedCategory,
    };

    const addDetails = {
      addCategory: selectedCategory,
      brands: selectedBrands,
      group: selectedGroup,
      addImage: bannerImage
    }

    console.log("Advertisement Data: ", addDetails);

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

        {/* Select Group */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Select Group</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a group
            </option>
            {group.map((grp, index) => (
              <option key={index} value={grp}>
                {grp}
              </option>
            ))}
          </select>
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





        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Upload Advertisement Image</label>
          <input
            type="file"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            // onChange={handleFileChange}

            onChange={async (e) => {
              setBannerImage(await uploadImageOnCloudinary(e));
            }}
          />
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
