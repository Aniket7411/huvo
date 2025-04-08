import { useEffect, useState } from "react";
import { HttpClient } from "../../../server/client/http";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";

const CategoryAdvertisement = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
 const [name,setName] = useState("")
 const [description,setDescription] = useState("")
 const [title,setTitle] = useState("")

  const getAllCategories = async () => {
    try {
      const response = await HttpClient.get("/category/");
      console.log(response);

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
      console.log(response);

      const formattedData = response.brands.map((eachBrand) => ({
        id: eachBrand._id,
        brandName: eachBrand.name,
      }));

      setBrands(formattedData);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    getAllCategories();
    getAllBrands();
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Store the selected file
  };

  // Handle select changes
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleBrandChange = (e) => {
    const { value, checked } = e.target;
    setSelectedBrands((prevSelectedBrands) =>
      checked ? [...prevSelectedBrands, value] : prevSelectedBrands.filter((brand) => brand !== value)
    );
  };

  const handleGroupChange = (e) => {
    const { value, checked } = e.target;
    setSelectedGroups((prevSelectedGroups) =>
      checked ? [...prevSelectedGroups, value] : prevSelectedGroups.filter((group) => group !== value)
    );
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form data (for example, send to the server)
    console.log("Category:", selectedCategory);
    console.log("Brands:", selectedBrands);
    console.log("Groups:", selectedGroups);
    console.log("File:", selectedFile);
  };

  return (
    < div className="flex">
   
    <div className="  px-4 bg-white rounded-lg shadow-lg w-full">
      <h1 className="text-2xl font-semibold mb-2 text-center">Category Advertisement</h1>

      <form onSubmit={handleSubmit}>
        {/* Category Selection */}

        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Advertisement Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Adidas Offers"
          />
        </div>


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

         {/* Title Input */}
         <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Advertisement Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Exclusive Discounts on Adidas"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Select Category</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Selection (Checkboxes for multiple brands) */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Select Brands</label>
          <div className=" flex items-center gap-5 flex-wrap">
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

        {/* Group Selection (Checkboxes for multiple groups) */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Select Groups</label>
          <div className="flex items-center gap-5 flex-wrap">
            {["Men", "Women", "Kids"].map((group) => (
              <div key={group} className="flex items-center">
                <input
                  type="checkbox"
                  id={`group-${group}`}
                  value={group}
                  onChange={handleGroupChange}
                  className="mr-2"
                />
                <label htmlFor={`group-${group}`} className="text-lg">
                  {group}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* File Input */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Upload Advertisement Image</label>
          <input
            type="file"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            onChange={handleFileChange}
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
    </div>
  );
};

export default CategoryAdvertisement;
