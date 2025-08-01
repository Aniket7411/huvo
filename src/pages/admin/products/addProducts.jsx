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
import Modal from "react-modal";



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
  { id: 60, name: "Steel Blue", value: "steel-blue", colorCode: "#4682B4" },
  // Additional clothing-specific colors
  { id: 61, name: "Off-White", value: "off-white", colorCode: "#FAF9F6" },
  { id: 62, name: "Cream", value: "cream", colorCode: "#FFFDD0" },
  { id: 63, name: "Rose Gold", value: "rose-gold", colorCode: "#E0BFB8" },
  { id: 64, name: "Burgundy", value: "burgundy", colorCode: "#800020" },
  { id: 65, name: "Mauve", value: "mauve", colorCode: "#E0B0FF" },
  { id: 66, name: "Oatmeal", value: "oatmeal", colorCode: "#D9D9C7" },
  { id: 67, name: "Ash Gray", value: "ash-gray", colorCode: "#B2BEB5" },
  { id: 68, name: "Pastel Blue", value: "pastel-blue", colorCode: "#AEC6CF" },
  { id: 69, name: "Pastel Pink", value: "pastel-pink", colorCode: "#FFD1DC" },
  { id: 70, name: "Pastel Green", value: "pastel-green", colorCode: "#C1E1C1" },
  { id: 71, name: "Pastel Yellow", value: "pastel-yellow", colorCode: "#FDFD96" },
  { id: 72, name: "Neon Pink", value: "neon-pink", colorCode: "#FF6EC7" },
  { id: 73, name: "Neon Green", value: "neon-green", colorCode: "#39FF14" },
  { id: 74, name: "Neon Blue", value: "neon-blue", colorCode: "#1F51FF" },
  { id: 75, name: "Neon Orange", value: "neon-orange", colorCode: "#FF5F1F" },
  { id: 76, name: "Neon Yellow", value: "neon-yellow", colorCode: "#FFFF00" },
  { id: 77, name: "Army Green", value: "army-green", colorCode: "#4B5320" },
  { id: 78, name: "Camel", value: "camel", colorCode: "#C19A6B" },
  { id: 79, name: "Dusty Rose", value: "dusty-rose", colorCode: "#DCAE96" },
  { id: 80, name: "Hunter Green", value: "hunter-green", colorCode: "#355E3B" },
  { id: 81, name: "Royal Blue", value: "royal-blue", colorCode: "#002366" },
  { id: 82, name: "Blush", value: "blush", colorCode: "#DE5D83" },
  { id: 83, name: "Taupe", value: "taupe", colorCode: "#483C32" },
  { id: 84, name: "Periwinkle", value: "periwinkle", colorCode: "#CCCCFF" },
  { id: 85, name: "Moss Green", value: "moss-green", colorCode: "#8A9A5B" },
  { id: 86, name: "Brick Red", value: "brick-red", colorCode: "#CB4154" },
  { id: 87, name: "Pewter", value: "pewter", colorCode: "#899499" },
  { id: 88, name: "Cobalt Blue", value: "cobalt-blue", colorCode: "#0047AB" },
  { id: 89, name: "Pistachio", value: "pistachio", colorCode: "#93C572" },
  { id: 90, name: "Rose Quartz", value: "rose-quartz", colorCode: "#F7CAC9" },
  { id: 91, name: "Graphite", value: "graphite", colorCode: "#383838" },
  { id: 92, name: "Pearl White", value: "pearl-white", colorCode: "#F8F8FF" },
  { id: 93, name: "Mint Green", value: "mint-green", colorCode: "#98FB98" },
  { id: 94, name: "Dark Teal", value: "dark-teal", colorCode: "#014D4E" },
  { id: 95, name: "Light Gray", value: "light-gray", colorCode: "#D3D3D3" },
  { id: 96, name: "Deep Purple", value: "deep-purple", colorCode: "#36013F" },
  { id: 97, name: "Terracotta", value: "terracotta", colorCode: "#E2725B" },
  { id: 98, name: "Pale Blue", value: "pale-blue", colorCode: "#AFEEEE" },
  { id: 99, name: "Pale Pink", value: "pale-pink", colorCode: "#FADADD" },
  { id: 100, name: "Dark Charcoal", value: "dark-charcoal", colorCode: "#333333" }
];

function ProductAddPage() {

  const [responseData, setResponseData] = useState([])

  const [returnableRadio, setReturnableRadio] = useState(true)


  console.log("returnableRadioreturnableRadioreturnableRadio",returnableRadio)


  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  const [verifyModal, setVerifyModal] = useState(false)

  const [totalProductCost, setTotalProductCost] = useState(null)



  const [isLoading, setIsloading] = useState(false)

  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      brand: "Select Brand",
      category: "Select Category",
      group: "men",
    },
  });

  const [returnableDays, setReturnableDays] = useState(0)

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
    //debugger
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
          returnableDays: data.isReturnable === "true" ? returnableDays : 0

        };

        // Send API request
        const response = await HttpClient.post("/product", productInfo);
        console.log("API:", response);
        setResponseData(response)

        console.log("API", response)
        reset();

        setIsModalOpen(true)






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


  const handleDaysChange = (event) => {
    setReturnableDays(event.target.value)
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
              Product Name <span className="text-[red]">*</span>
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
              Product Description <span className="text-[red]">*</span>
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
              Product Details <span className="text-[red]">*</span>
            </label>
            {productDetails?.map((text, index) => (
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
              Group   <span className="text-[red]">*</span>
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
              Category  <span className="text-[red]">*</span>
            </label>
            <select
              id="category"
              name="category"
              {...register("category")}
              onChange={(event) => setActiveCategoryId(event.target.options[event.target.selectedIndex].text)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md outline-none"
            >
              <option defaultValue disabled>
                Select Category  <span className="text-[red]">*</span>
              </option>
              {allCategories?.map((category, i) => (
                <option value={category?._id} key={i}>
                  {category?.name}
                </option>
              ))}
            </select>
            {errors?.category && (
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
                    {["7", "8", "9", "10"]?.map((size) => (
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
              Sizes  <span className="text-[red]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {["S", "M", "L", "XL", "XXL","Generic"].map((item, i) => {
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
             Product Brand (If Not available then add)  <span className="text-[red]">*</span>
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
              {allBrands?.map((brand, i) => (
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
              Material And Care Instruction  <span className="text-[red]">*</span>
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
              Price (In Rupees)  <span className="text-[red]">*</span>
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
              Discount  (In Rupees)  <span className="text-[red]">*</span>
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


          <div className="mb-3">
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700"
            >
              Weight  (In Grams )  <span className="text-[red]">*</span>
            </label>
            <input
              id="weight"
              type="number"
              name="weight"
              placeholder="Weight in Grams"

              className="mt-1 p-2 w-full border border-gray-300 rounded-md outline-none"
              {...register("weight", {
                required: "*Weight is required.",
              })}
            />

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
              Product Color  <span className="text-[red]">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-2">
              {colorWithImages?.map((item, i) => {
                return (
                  <div key={i}>
                    <label
                      htmlFor="color"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {/* {`Select Color-${i + 1}`} */}
                      Select color below
                    </label>
                    <div className="flex  gap-3 my-2">

                      <select
                        value={item.colorCode} // Bind the current colorCode value
                        onChange={(e) => handleColorChange(e.target.value, i)} // Pass the selected value and index
                      >
                        {options?.map((option) => (
                          <option key={option?.id} value={option?.colorCode}>
                            {option?.name}
                          </option>
                        ))}
                      </select>



                      <button
                        type="button"
                        className="bg-blue-500 w-auto text-white px-2 py-1 rounded-md cursor-pointer"
                        onClick={() => handleAddImage(i)}
                      >
                        Click to add multiple images
                      </button>
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-2 py-1 rounded-md cursor-pointer"
                        onClick={() => handleRemoveColorWithImages(i)}
                      >
                        Remove
                      </button>

                    </div>
                    {item?.images?.map((url, index) => (
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

            {/* <button
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
            </button> */}
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product's Banner Image (Image that will be firstly visible)  <span className="text-[red]">*</span>
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
                Returnability  <span className="text-[red]">*</span>
              </label>


              



              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input
                    id="returnable-true"
                    type="radio"
                    name="isReturnable"
                    onClick={() => setReturnableRadio(true)}
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
                    onClick={() => setReturnableRadio(false)}
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

            {
              returnableRadio && (
                <label
                  htmlFor="returnable"
                  className="text-sm p-3 gap-2 rounded-lg font-medium text-gray-700 flex flex-col"
                >
                  Returnable within
                  <select
                    id="days-dropdown"
                    value={returnableDays}
                    onChange={handleDaysChange}
                    className="border border-gray-300 rounded-lg p-2 mt-1"
                    aria-label="Select returnable days"
                  >
                    <option value="" disabled>
                      Choose days
                    </option>
                    {Array.from({ length: 9 }, (_, index) => {
                      const day = index + 8; // Start at 8 and go up to 15
                      return (
                        <option key={day} value={day}>
                          {`${day} days`}
                        </option>
                      );
                    })}
                  </select>
                  days after delivery
                </label>
              )
            }



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


      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Product Details Modal"
        className="bg-white max-w-3xl w-full mx-auto p-6 rounded-2xl shadow-lg flex flex-col outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
      >
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Product Added Successfully!</h2>

          <div className="flex flex-col md:flex-row gap-6 overflow-auto flex-grow">
            {/* Left Column - Product Image */}
            <div className="md:w-1/3 flex flex-col items-center">
              <img
                src={responseData?.bannerImage}
                className="w-full h-auto max-h-64 object-contain rounded-lg border border-gray-200"
                alt="Product"
              />
              <div className="mt-4 w-full">
                <h3 className="font-semibold text-lg">{responseData?.name || "N/A"}</h3>
                <p className="text-gray-600 text-sm">{responseData?.description || "No description"}</p>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="md:w-2/3 space-y-4">
              {/* Pricing Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3">Pricing Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Initial Price:</span>
                    <span className="font-medium ml-2">₹{responseData?.labelPrice}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Discount:</span>
                    <span className="text-green-600 font-medium ml-2">
                      ₹{responseData?.discount || "0.00"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">GST:</span>
                    <span className="font-medium ml-2">
                      ₹{(responseData?.cgst || 0) + (responseData?.sgst || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Platform Fee:</span>
                    <span className="font-medium ml-2">₹{responseData?.platformCharge || "0.00"}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-gray-200">
                    <span className="text-gray-500">Final Price:</span>
                    <span className="font-bold text-lg ml-2">₹{responseData?.price || "0.00"}</span>
                  </div>
                </div>
              </div>

              {/* Product Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Product ID</h4>
                  <div className="bg-gray-100 px-3 py-2 rounded text-sm">
                    {responseData?.productId || "N/A"}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Return Policy</h4>
                  <div className={`px-3 py-2 rounded text-sm ${responseData?.isReturnable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {responseData?.isReturnable ? `Returnable within ${responseData?.returnableDays} Days` : "Non-returnable"}
                  </div>
                </div>
              </div>

              {/* Colors Section */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Colors</h4>
                {responseData?.colors?.length ? (
                  <div className="flex flex-wrap gap-3">
                    {responseData.colors.map((color, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: color?.colorCode || "#000" }}
                        />
                        {color?.images?.[0] && (
                          <a
                            href={color.images[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 text-sm underline"
                          >
                            View Image
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">No colors specified</div>
                )}
              </div>

              {/* Sizes Section */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Sizes & Stock</h4>
                {responseData?.sizes?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {responseData.sizes.map((size, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        <span className="font-medium">{size.size}</span>
                        <span className="text-gray-500 ml-1">({size.stock || "0"})</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">No sizes specified</div>
                )}
              </div>

              {/* Material Section */}
              {responseData?.materialAndCare && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Material & Care</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded">{responseData.materialAndCare}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer with Button */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">


            <button
              onClick={closeModal}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Close or Add Another Product
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProductAddPage;
