import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import uploadImageOnCloudinary from "../../../server/client/imageUpload";
import { HttpClient } from "../../../server/client/http";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import './products.css'
import Select from "react-dropdown-select";
import { MdArrowOutward } from "react-icons/md";
import Loader from "../../../components/loader";
import ReactModal from "react-modal";
import { IoCloseCircleOutline } from "react-icons/io5";

function ProductAddPage() {

  const [verifyModal, setVerifyModal] = useState(false)

  const [totalProductCost, setTotalProductCost] = useState(null)

  
  const options = [
    { id: 1, name: "Red", value: "red", colorCode: "#FF0000" },
    { id: 2, name: "Green", value: "green", colorCode: "#008000" },
    { id: 3, name: "Blue", value: "blue", colorCode: "#0000FF" },
    { id: 4, name: "Yellow", value: "yellow", colorCode: "#FFFF00" },
    { id: 5, name: "Pink", value: "pink", colorCode: "#FFC0CB" },
    { id: 6, name: "Purple", value: "purple", colorCode: "#800080" },
    { id: 7, name: "Orange", value: "orange", colorCode: "#FFA500" },
    { id: 8, name: "Black", value: "black", colorCode: "#000000" },
    { id: 9, name: "White", value: "white", colorCode: "#FFFFFF" },
    { id: 10, name: "Grey", value: "grey", colorCode: "#808080" },
    { id: 11, name: "Turquoise", value: "turquoise", colorCode: "#40E0D0" },
    { id: 12, name: "Brown", value: "brown", colorCode: "#A52A2A" },
    { id: 13, name: "Cyan", value: "cyan", colorCode: "#00FFFF" },
    { id: 14, name: "Magenta", value: "magenta", colorCode: "#FF00FF" },
    { id: 15, name: "Lime", value: "lime", colorCode: "#00FF00" },
    { id: 16, name: "Beige", value: "beige", colorCode: "#F5F5DC" },
    { id: 17, name: "Maroon", value: "maroon", colorCode: "#800000" },
    { id: 18, name: "Navy", value: "navy", colorCode: "#000080" },
    { id: 19, name: "Olive", value: "olive", colorCode: "#808000" },
    { id: 20, name: "Teal", value: "teal", colorCode: "#008080" },
    { id: 21, name: "Lavender", value: "lavender", colorCode: "#E6E6FA" },
    { id: 22, name: "Coral", value: "coral", colorCode: "#FF7F50" },
    { id: 23, name: "Gold", value: "gold", colorCode: "#FFD700" },
    { id: 24, name: "Silver", value: "silver", colorCode: "#C0C0C0" },
    { id: 25, name: "Crimson", value: "crimson", colorCode: "#DC143C" },
    { id: 26, name: "Indigo", value: "indigo", colorCode: "#4B0082" },
    { id: 27, name: "Violet", value: "violet", colorCode: "#EE82EE" },
    { id: 28, name: "Salmon", value: "salmon", colorCode: "#FA8072" },
    { id: 29, name: "Aqua", value: "aqua", colorCode: "#00FFFF" },
    { id: 30, name: "Azure", value: "azure", colorCode: "#F0FFFF" },
    { id: 31, name: "Bisque", value: "bisque", colorCode: "#FFE4C4" },
    { id: 32, name: "Chocolate", value: "chocolate", colorCode: "#D2691E" },
    { id: 33, name: "Copper", value: "copper", colorCode: "#B87333" },
    { id: 34, name: "Emerald", value: "emerald", colorCode: "#50C878" },
    { id: 35, name: "Fuchsia", value: "fuchsia", colorCode: "#FF00FF" },
    { id: 36, name: "Ivory", value: "ivory", colorCode: "#FFFFF0" },
    { id: 37, name: "Khaki", value: "khaki", colorCode: "#F0E68C" },
    { id: 38, name: "Mint", value: "mint", colorCode: "#98FF98" },
    { id: 39, name: "Mustard", value: "mustard", colorCode: "#FFDB58" },
    { id: 40, name: "Peach", value: "peach", colorCode: "#FFE5B4" },
    { id: 41, name: "Plum", value: "plum", colorCode: "#DDA0DD" },
    { id: 42, name: "Ruby", value: "ruby", colorCode: "#E0115F" },
    { id: 43, name: "Sapphire", value: "sapphire", colorCode: "#0F52BA" },
    { id: 44, name: "Sky Blue", value: "sky-blue", colorCode: "#87CEEB" },
    { id: 45, name: "Tan", value: "tan", colorCode: "#D2B48C" },
    { id: 46, name: "Tangerine", value: "tangerine", colorCode: "#F28500" },
    { id: 47, name: "Wine", value: "wine", colorCode: "#722F37" },
    { id: 48, name: "Amber", value: "amber", colorCode: "#FFBF00" },
    { id: 49, name: "Charcoal", value: "charcoal", colorCode: "#36454F" },
    { id: 50, name: "Denim", value: "denim", colorCode: "#1560BD" },
    { id: 51, name: "Eggplant", value: "eggplant", colorCode: "#614051" },
    { id: 52, name: "Jade", value: "jade", colorCode: "#00A86B" },
    { id: 53, name: "Lilac", value: "lilac", colorCode: "#C8A2C8" },
    { id: 54, name: "Pearl", value: "pearl", colorCode: "#EAE0C8" },
    { id: 55, name: "Rust", value: "rust", colorCode: "#B7410E" },
    { id: 56, name: "Sand", value: "sand", colorCode: "#C2B280" },
    { id: 57, name: "Sea Green", value: "sea-green", colorCode: "#2E8B57" },
    { id: 58, name: "Slate", value: "slate", colorCode: "#708090" },
    { id: 59, name: "Snow", value: "snow", colorCode: "#FFFAFA" },
    { id: 60, name: "Steel Blue", value: "steel-blue", colorCode: "#4682B4" }
  ];

  const [isLoading, setIsloading] = useState(false)

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      brand: "Select Brand",
      category: "Select Category",
      group: "men",
    },
  });

  const [returnableDays, setReturnableDays] = useState()

  const [bannerImage, setBannerImage] = useState("");
  const [productDetails, setProductDetails] = useState([""]);
  const [allCategories, setAllCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState("1212");
  const [sizeWithStock, setSizeWithStock] = useState([]);
  const [colorWithImages, setColorWithImages] = useState([
    {
      colorCode: "#000000",
      images: [],
    },
  ]);

  const { register: bindField, handleSubmit: processForm, watch: observeField } = useForm({
    defaultValues: {
      selectedCategory: "Select Category",
      availableSizes: {},
    },
  });

  const [isShoeSelectionEnabled, toggleShoeSelection] = useState(false);
  const observedSizes = observeField("availableSizes", {});

  const handleFormSubmission = (formData) => {
    console.log("Submitted Data:", formData);


  };

  const toggleCategorySelection = () => {
    toggleShoeSelection((prevValue) => !prevValue);
  };

  console.log(returnableDays)



  const onSubmit = async (data) => {
    let platformCharge = 0;
    const shippingFee = 100; // Constant shipping fee
    console.log("Form Data:", data);

    // Calculate platform fee based on price
    if (data.price <= 500) {
      platformCharge = 10; // Rs. 10 for amount up to 500
    } else if (data.price > 500 && data.price <= 1000) {
      platformCharge = 15; // Rs. 15 for amount between 501 and 1000
    } else if (data.price > 1000) {
      platformCharge = 20; // Rs. 20 for amount above 1000
    }

    // Validation checks for price
    if (parseInt(data?.price) < 0) {
      toast.info("Price can't be less than zero.");
      return; // Exit if validation fails
    }

    else if (parseInt(data?.price) < parseInt(data?.discount)) {
      toast.info("Price can't be less than the discount.");
      return; // Exit if validation fails
    } else {
      try {
        setIsloading(true); // Indicate loading state

        // Construct product info object
        const productInfo = {
          ...data,
          bannerImage,
          isReturnable: data?.isReturnable === "true",
          sizes: sizeWithStock,
          colors: colorWithImages,
          productDetails,
          platformCharge,
          shippingFee,
          returnableDays,
        };

        // Send API request
        const response = await HttpClient.post("/product", productInfo);
        console.log("API Response:", response);

        // Handle success
        setIsloading(false); // Reset loading state

        setReturnableDays("");
setBannerImage("");
setProductDetails([""]);
setActiveCategoryId("");
setSizeWithStock([]);
setColorWithImages([
  {
    colorCode: "#000000",
    images: [],
  },
]);


toggleShoeSelection(false);

toast.success("Product added successfully");


        
      } catch (error) {
        // Handle error
        setIsloading(false); // Reset loading state
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    }




  };



  const handleRemoveColorWithImages = (colorIndex) => {
    const newColorWithImages = [...colorWithImages];
    newColorWithImages.splice(colorIndex, 1);
    setColorWithImages(newColorWithImages);
  };

  const handleAddImage = (i) => {
    const newColorWithImages = [...colorWithImages];
    newColorWithImages[i].images.push("");
    setColorWithImages(newColorWithImages);
  };

  const handleRemoveImage = (colorIndex, imageIndex) => {
    const newColorWithImages = [...colorWithImages];
    newColorWithImages[colorIndex].images.splice(imageIndex, 1);
    setColorWithImages(newColorWithImages);
  };

  const getImageUrl = async (e, colorIndex, imageIndex) => {
    const newColorWithImages = [...colorWithImages];
    newColorWithImages[colorIndex].images[imageIndex] =
      await uploadImageOnCloudinary(e);
    setColorWithImages(newColorWithImages);
  };

  const handleAddProductDetails = () => {
    setProductDetails([...productDetails, ""]);
  };

  const handleSaveProductDetails = (index, event) => {
    const newProductDetails = [...productDetails];
    newProductDetails[index] = event.target.value;
    setProductDetails(newProductDetails);
  };

  const handleRemoveProductDetails = (index) => {
    const newProductDetails = [...productDetails];
    newProductDetails.splice(index, 1);
    setProductDetails(newProductDetails);
  };

  const getAllBrands = async () => {
    try {
      const { brands } = await HttpClient.get("/brand");
      setAllBrands(brands);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const getAllCategories = async () => {
    try {
      const { categories } = await HttpClient.get("/category");
      setAllCategories(categories);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllBrands();
    getAllCategories();
  }, []);

  const handleSizeChange = (e) => {
    const { name, value } = e.target;
    if (name === "size") {
      const index = sizeWithStock.findIndex((item) => item.size === value);
      if (index === -1) {
        setSizeWithStock((prev) => [...prev, { size: value }]);
      } else {
        const newSizeWithStock = [...sizeWithStock];
        newSizeWithStock.splice(index, 1);
        setSizeWithStock(newSizeWithStock);
      }
    }
  };

  const handleStockChange = (e, size) => {
    const index = sizeWithStock.findIndex((item) => item.size === size);
    const newSizeWithStock = [...sizeWithStock];
    newSizeWithStock[index].stock = e.target.value;
    setSizeWithStock(newSizeWithStock);
  };
  const handleColorChange = (selectedColorCode, i) => {
    const newColorWithImages = [...colorWithImages];
    newColorWithImages[i].colorCode = selectedColorCode; // Update colorCode based on selection
    setColorWithImages(newColorWithImages);
    console.log(`Color changed for index ${i}: ${selectedColorCode}`); // Log the selected color code
  };


  return (
    <div className="container  sm:mx-auto my-2">
      <div className="flex justify-between border-b py-2 px-3 ">
        <h2 className="text-lg font-bold">Add Product below</h2>
        <Link
          to="/seller/products"
          className="text-lg font-bold hover:underline"
        >
          <button className="flex items-center">
            Products List <MdArrowOutward className="ml-2" />
          </button>
        </Link>

      </div>
      <div className="relative  overflow-auto shadow-md sm:rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 ">
          <div className="mb-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md outline-none"
              {...register("name", {
                required: "*Name is required.",
              })}
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md outline-none"
              {...register("description", {
                required: "*Description is required.",
              })}
            ></textarea>
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label
              htmlFor="prodcuctDetails"
              className="block text-sm font-medium text-gray-700"
            >
              Product Details
            </label>
            {productDetails.map((text, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  id="prodcuctDetails"
                  name={`prodcuctDetails[${index}]`}
                  defaultValue={text}
                  onChange={(e) => handleSaveProductDetails(index, e)}
                  className="mt-1 p-2 border border-gray-300 rounded-md outline-none flex-1"
                />
                <button
                  type="button"
                  className="ml-2 bg-red-500 text-white px-3 py-1 rounded-md"
                  onClick={() => handleRemoveProductDetails(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md"
              onClick={handleAddProductDetails}
            >
              Add Product Details
            </button>
            {errors.productDetails && (
              <span className="text-red-500">
                {errors.productDetails.message}
              </span>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group
            </label>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <input
                  id="group-men"
                  type="radio"
                  name="group"
                  value="men"
                  defaultChecked
                  {...register("group")}
                />
                <label htmlFor="group-men">Men</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="group-women"
                  type="radio"
                  name="group"
                  value="women"
                  {...register("group")}
                />
                <label htmlFor="group-women">Women</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="group-kid"
                  type="radio"
                  name="group"
                  value="kids"
                  {...register("group")}
                />
                <label htmlFor="group-kid">Kids</label>
              </div>
            </div>
            {errors.group && (
              <span className="text-red-500">{errors.group.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              {...register("category")}
              onChange={(event) => setActiveCategoryId(event.target.options[event.target.selectedIndex].text)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md outline-none"
            >
              <option defaultValue disabled>
                Select Category
              </option>
              {allCategories.map((category, i) => (
                <option value={category?._id} key={i}>
                  {category?.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-red-500">{errors.category.message}</span>
            )}
          </div>



          <form onSubmit={processForm(handleFormSubmission)} >
            {/* Category Toggle Button */}


            {/* Shoe Sizes Section */}
            {activeCategoryId === "Shoes" && (
              <div className=" mb-2">
                <h3 className="text-lg font-semibold">Available Shoe Sizes</h3>
                <p>Select sizes and specify the quantity for each:</p>
                <div className="flex flex-wrap gap-4 mt-3">
                  {/* Numeric Sizes Group */}
                  <div>
                    <h4 className="font-medium">Numeric Sizes (7, 8, 9, 10):</h4>
                    {["7", "8", "9", "10"].map((size) => (
                      <div key={size} className="flex flex-wrap items-center gap-4 mb-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            {...bindField(`availableSizes.${size}.isChecked`)}
                            value={true}
                            className="form-checkbox"
                          />
                          {size}
                        </label>
                        {observedSizes[size]?.isChecked && (
                          <input
                            type="number"
                            min="1"
                            placeholder="Quantity"
                            {...bindField(`availableSizes.${size}.quantity`)}
                            className="border rounded-md px-2 py-1 text-sm"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* European Sizes Group */}
                  <div>
                    <h4 className="font-medium">European Sizes (42, 43, 45):</h4>
                    {["42", "43", "45"].map((size) => (
                      <div key={size} className="flex items-center gap-4 mb-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            {...bindField(`availableSizes.${size}.isChecked`)}
                            value={true}
                            className="form-checkbox"
                          />
                          {size}
                        </label>
                        {observedSizes[size]?.isChecked && (
                          <input
                            type="number"
                            min="1"
                            placeholder="Quantity"
                            {...bindField(`availableSizes.${size}.quantity`)}
                            className="border rounded-md px-2 py-1 text-sm"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Submit Preferences
                  </button>
                </div>
              </div>
            )}


          </form>

          {isShoeSelectionEnabled ? "" : <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {["S", "M", "L", "XL", "XXL"].map((item, i) => {
                const isChecked = sizeWithStock.some((s) => s.size === item);
                return (
                  <div className="flex items-center mr-4" key={i}>
                    <input
                      id={`size-${i}`}
                      type="checkbox"
                      name="size"
                      value={item}
                      className="mr-2"
                      checked={isChecked}
                      onChange={(e) => handleSizeChange(e, i)}
                    />
                    <label htmlFor={`size-${i}`}>{item}</label>
                    {isChecked && (
                      <input
                        type="number"
                        name="stock"
                        placeholder="Stock"
                        onChange={(e) => handleStockChange(e, item)}
                        className="mx-2 p-2 w-14 h-10 border border-gray-300 rounded-md outline-none"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>}

          <div className="mb-3">
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-700"
            >
              Brand
            </label>
            <select
              id="brand"
              name="brand"
              {...register("brand")}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md outline-none"
            >
              <option defaultValue disabled>
                Select Brand
              </option>
              {allBrands.map((brand, i) => (
                <option value={brand?._id} key={i}>
                  {brand?.name}
                </option>
              ))}
            </select>
            {errors.brand && (
              <span className="text-red-500">{errors.brand.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label
              htmlFor="materialAndCare"
              className="block text-sm font-medium text-gray-700"
            >
              Material And Care
            </label>
            <input
              id="materialAndCare"
              type="text"
              name="materialAndCare"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md outline-none"
              {...register("materialAndCare", {
                required: "*Material And Care is required.",
              })}
            />
            {errors.materialAndCare && (
              <span className="text-red-500">
                {errors.materialAndCare.message}
              </span>
            )}
          </div>
          <div className="mb-3">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price (In Rupees)
            </label>
            <input
              id="price"
              type="text"
              name="price"
              placeholder="Price in Rupees"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md outline-none"
              {...register("price", {
                required: "*Price is required.",
                pattern: {
                  value: /^\d*\.?\d*$/,
                  message: "This field should only contain numbers",
                },
              })}
            />
            {errors.price && (
              <span className="text-red-500">{errors.price.message}</span>
            )}
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-600">
              Additional shipping charge of Rs. 100 and platform fee will be added to the price you set.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Platform fee is calculated as per the following:
            </p>
            <ul className="text-sm text-gray-600 list-disc pl-4">
              <li>Amount up to 500 → Rs. 10</li>
              <li>Amount from 501 to 1000 → Rs. 15</li>
              <li>Amount above 1000 → Rs. 20</li>
            </ul>
          </div>



          <div className="mb-3">
            <label
              htmlFor="discount"
              className="block text-sm font-medium text-gray-700"
            >
              Discount  (In Rupees)
            </label>
            <input
              id="discount"
              type="number"
              name="discount"
              placeholder="Discount in Rupees"

              className="mt-1 p-2 w-full border border-gray-300 rounded-md outline-none"
              {...register("discount", {
                required: "*Discount is required.",
              })}
            />
            {errors.discount && (
              <span className="text-red-500">{errors.discount.message}</span>
            )}
          </div>

          {/* {isShoeSelectionEnabled ? "" :  <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sizes
            </label>
            <div className="flex">
              {["S", "M", "L", "XL"].map((item, i) => {
                const isChecked = sizeWithStock.some((s) => s.size === item);
                return (
                  <div className="flex items-center mr-4" key={i}>
                    <input
                      id={`size-${i}`}
                      type="checkbox"
                      name="size"
                      value={item}
                      className="mr-2"
                      checked={isChecked}
                      onChange={(e) => handleSizeChange(e, i)}
                    />
                    <label htmlFor={`size-${i}`}>{item}</label>
                    {isChecked && (
                      <input
                        type="number"
                        name="stock"
                        placeholder="Stock"
                        onChange={(e) => handleStockChange(e, item)}
                        className="mx-2 p-2 w-14 h-10 border border-gray-300 rounded-md outline-none"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>} */}





          <div className="mb-2">
            <label className="block text-md font-medium text-gray-700">
              Colors
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-3">
              {colorWithImages.map((item, i) => {
                return (
                  <div key={i}>
                    <label
                      htmlFor="color"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {`Color-${i + 1}`}
                    </label>
                    <div className="flex  p-3 gap-3 my-2">

                      <select
                        value={item.colorCode} // Bind the current colorCode value
                        onChange={(e) => handleColorChange(e.target.value, i)} // Pass the selected value and index
                      >
                        {options.map((option) => (
                          <option key={option.id} value={option.colorCode}>
                            {option.name}
                          </option>
                        ))}
                      </select>



                      <button
                        type="button"
                        className="bg-blue-500 text-white px-2 py-1 rounded-md cursor-pointer"
                        onClick={() => handleAddImage(i)}
                      >
                        Add Image
                      </button>
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-2 py-1 rounded-md cursor-pointer"
                        onClick={() => handleRemoveColorWithImages(i)}
                      >
                        Remove
                      </button>

                    </div>
                    {item?.images.map((url, index) => (
                      <div key={index} className="flex items-center mb-2">
                        {url && (
                          <img
                            src={url}
                            alt="productImage"
                            className="w-16 h-16 mr-2 rounded-md"
                          />
                        )}
                        <label htmlFor={`images[${index}]`}>
                          <input
                            type="file"
                            id={`images[${index}]`}
                            name={`images[${index}]`}
                            className={`mt-1 p-2 border border-gray-300 rounded-md outline-none ${url && "hidden"
                              }`}
                            {...register(`images[${index}]`)}
                            onChange={(e) => getImageUrl(e, i, index)}
                          />
                          {url && (
                            <span className="mx-2 bg-red-500 text-white px-3 py-1 rounded-md">
                              Update Image
                            </span>
                          )}
                        </label>
                        <button
                          type="button"
                          className="ml-2 bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer"
                          onClick={() => handleRemoveImage(i, index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="bg-blue-500 text-white px-2 py-1 rounded-md"
              onClick={() =>
                setColorWithImages([
                  ...colorWithImages,
                  {
                    colorCode: "#000000",
                    images: [""],
                  },
                ])
              }
            >
              Add More Color
            </button>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image
            </label>
            <div className="flex gap-6 items-center">
              {bannerImage && (
                <img
                  src={bannerImage}
                  alt="bannerImage"
                  className="h-40 rounded-md object-contain"
                />
              )}
              <label
                htmlFor="bannerImage"
                className="m-2 bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer"
              >
                <input
                  type="file"
                  id="bannerImage"
                  name="bannerImage"
                  className="mt-1 p-2 border border-gray-300 rounded-md outline-none hidden"
                  {...register("bannerImage", {
                    required: "*Banner Image are required.",
                  })}
                  onChange={async (e) => {
                    setBannerImage(await uploadImageOnCloudinary(e));
                  }}
                />
                {bannerImage ? "Update" : "Upload"} Banner Image
              </label>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Returnability
              </label>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input
                    id="returnable-true"
                    type="radio"
                    name="isReturnable"
                    value={true}
                    {...register("isReturnable", { valueAsBoolean: true })}
                  />
                  <label htmlFor="returnable-true">Returnable</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="returnable-false"
                    type="radio"
                    name="isReturnable"
                    value={false}
                    {...register("isReturnable", { valueAsBoolean: true })}
                  />
                  <label htmlFor="returnable-false">Non-Returnable</label>
                </div>
              </div>
              {errors.isReturnable && (
                <span className="text-red-500">{errors.isReturnable.message}</span>
              )}
            </div>

              <label
                htmlFor="returnable"
                className="text-sm bg-gray-50 p-3 gap-2 rounded-lg shadow-sm font-medium text-gray-700"
              >
                Returnable within 7 days after delivery
              </label>

          </div>




          <ReactModal
            isOpen={verifyModal}
            onRequestClose={() => setVerifyModal(false)}  // Allows closing on overlay click & Esc key
            className="bg-white rounded-lg shadow-lg p-6 w-96 mx-auto mt-20 relative"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            {/* Modal Content */}
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            <button onClick={() => setVerifyModal(false)}>Close</button>


            <h1>Product Image</h1>
            <img src={bannerImage} alt="bannerImage" />
            <p>Product Price </p>
          </ReactModal>


          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white mt-2 px-2 py-1 rounded-md"
            >
              Add Product
            </button>
          </div>


        </form>
      </div>
    </div>
  );
}

export default ProductAddPage;
