import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import uploadImageOnCloudinary from "../../../server/client/imageUpload";
import { HttpClient } from "../../../server/client/http";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";

function ProductEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [allCategories, setAllCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [product, setProduct] = useState({});
  const [productDetails, setProductDetails] = useState([""]);
  const [bannerImage, setBannerImage] = useState("");
  const [sizeWithStock, setSizeWithStock] = useState([]);
  const [colorWithImages, setColorWithImages] = useState([
    {
      colorCode: "#000000",
      images: [],
    },
  ]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: product,
  });

  const getProductDetails = async (_id) => {
    setLoading(true);
    try {
      const { product } = await HttpClient.get(`product/productId?productId=${_id}`);
      
      setSizeWithStock(product?.sizes || []);
      setColorWithImages(product?.colors || [{
        colorCode: "#000000",
        images: [],
      }]);
      setBannerImage(product?.bannerImage || "");
      setProductDetails(product?.productDetails || [""]);
      
      setProduct({
        ...product,
        category: product?.category?._id,
        brand: product?.brand?._id,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error(error?.response?.data?.message || "Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const getAllBrands = async () => {
    try {
      const { brands } = await HttpClient.get("/brand");
      setAllBrands(brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error(error?.response?.data?.message || "Failed to load brands");
    }
  };

  const getAllCategories = async () => {
    try {
      const { categories } = await HttpClient.get("/category");
      setAllCategories(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(error?.response?.data?.message || "Failed to load categories");
    }
  };

  useEffect(() => {
    reset(product);
  }, [product, reset]);

  useEffect(() => {
    if (id) {
      getProductDetails(id);
    }
    getAllBrands();
    getAllCategories();
  }, [id]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const info = {
        ...data,
        bannerImage,
        sizes: sizeWithStock,
        colors: colorWithImages,
        productDetails: productDetails.filter(detail => detail.trim() !== ""),
      };
      
      const { message } = await HttpClient.put(
        `/product/${product?.productId}`,
        info
      );
      
      toast.success(message || "Product Updated Successfully");
      navigate("/seller/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error?.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveColorWithImages = (colorIndex) => {
    if (colorWithImages.length <= 1) {
      toast.info("Product must have at least one color");
      return;
    }
    
    const newColorWithImages = [...colorWithImages];
    newColorWithImages.splice(colorIndex, 1);
    setColorWithImages(newColorWithImages);
  };

  const handleAddColor = () => {
    setColorWithImages([
      ...colorWithImages,
      {
        colorCode: "#000000",
        images: [],
      }
    ]);
  };

  const handleAddImage = (colorIndex) => {
    const newColorWithImages = [...colorWithImages];
    if (newColorWithImages[colorIndex].images.length >= 5) {
      toast.info("Maximum 5 images per color allowed");
      return;
    }
    
    newColorWithImages[colorIndex].images.push("");
    setColorWithImages(newColorWithImages);
  };

  const handleRemoveImage = (colorIndex, imageIndex) => {
    const newColorWithImages = [...colorWithImages];
    if (newColorWithImages[colorIndex].images.length <= 1) {
      toast.info("Each color must have at least one image");
      return;
    }
    
    newColorWithImages[colorIndex].images.splice(imageIndex, 1);
    setColorWithImages(newColorWithImages);
  };

  const getImageUrl = async (e, colorIndex, imageIndex) => {
    try {
      const imageUrl = await uploadImageOnCloudinary(e);
      const newColorWithImages = [...colorWithImages];
      newColorWithImages[colorIndex].images[imageIndex] = imageUrl;
      setColorWithImages(newColorWithImages);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
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
    if (productDetails.length <= 1) {
      toast.info("Product must have at least one detail");
      return;
    }
    
    const newProductDetails = [...productDetails];
    newProductDetails.splice(index, 1);
    setProductDetails(newProductDetails);
  };

  const handleSizeChange = (size) => {
    const index = sizeWithStock.findIndex((item) => item.size === size);
    
    if (index === -1) {
      // Add new size with default stock
      setSizeWithStock([...sizeWithStock, { size, stock: "0" }]);
    } else {
      // Remove size
      const newSizeWithStock = [...sizeWithStock];
      newSizeWithStock.splice(index, 1);
      setSizeWithStock(newSizeWithStock);
    }
  };

  const handleStockChange = (e, size) => {
    const index = sizeWithStock.findIndex((item) => item.size === size);
    const newSizeWithStock = [...sizeWithStock];
    newSizeWithStock[index].stock = e.target.value;
    setSizeWithStock(newSizeWithStock);
  };

  const handleColorChange = (e, colorIndex) => {
    const newColorWithImages = [...colorWithImages];
    newColorWithImages[colorIndex].colorCode = e.target.value;
    setColorWithImages(newColorWithImages);
  };

  const handleBannerImageChange = async (e) => {
    try {
      const imageUrl = await uploadImageOnCloudinary(e);
      setBannerImage(imageUrl);
    } catch (error) {
      console.error("Error uploading banner image:", error);
      toast.error("Failed to upload banner image");
    }
  };

  if (loading && !product.name) {
    return (
      <div className="container px-4 sm:mx-auto my-8 flex justify-center items-center h-64">
        <div className="text-xl">Loading product details...</div>
      </div>
    );
  }

  return (
    <div className="container px-4 sm:mx-auto my-8">
      <h1 className="text-4xl font-bold mb-4 text-center">
        <Link to="/seller" className="text-2xl font-bold mb-4 hover:underline">
          Huvo Seller
        </Link>
        <Link
          to="/"
          target="_blank"
          className="text-base font-bold mb-4 hover:underline ml-3"
        >
          (Website)
        </Link>
      </h1>
      
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Edit Product</h2>
        <Link
          to="/seller/products"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          ← Back to Product List
        </Link>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Basic Information</h3>
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Product Name *
            </label>
            <input
              id="name"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register("name", { required: "Product name is required" })}
            />
            {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register("description", { required: "Description is required" })}
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs italic">{errors.description.message}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Product Details
            </label>
            {productDetails.map((text, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => handleSaveProductDetails(index, e)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder={`Product detail #${index + 1}`}
                />
                <button
                  type="button"
                  className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleRemoveProductDetails(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
              onClick={handleAddProductDetails}
            >
              + Add Product Detail
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Classification</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Group *
            </label>
            <div className="flex flex-wrap">
              {["men", "women", "kids"].map((group) => (
                <div key={group} className="flex items-center mr-4 mb-2">
                  <input
                    id={`group-${group}`}
                    type="radio"
                    value={group}
                    className="mr-2"
                    {...register("group", { required: "Please select a group" })}
                  />
                  <label htmlFor={`group-${group}`} className="capitalize">
                    {group}
                  </label>
                </div>
              ))}
            </div>
            {errors.group && <p className="text-red-500 text-xs italic">{errors.group.message}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
              Category *
            </label>
            <select
              id="category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register("category", { required: "Please select a category" })}
            >
              <option value="">Select Category</option>
              {allCategories.map((category) => (
                <option value={category?._id} key={category?._id}>
                  {category?.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs italic">{errors.category.message}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="brand" className="block text-gray-700 text-sm font-bold mb-2">
              Brand *
            </label>
            <select
              id="brand"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register("brand", { required: "Please select a brand" })}
            >
              <option value="">Select Brand</option>
              {allBrands.map((brand) => (
                <option value={brand?._id} key={brand?._id}>
                  {brand?.name}
                </option>
              ))}
            </select>
            {errors.brand && <p className="text-red-500 text-xs italic">{errors.brand.message}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="materialAndCare" className="block text-gray-700 text-sm font-bold mb-2">
              Material And Care
            </label>
            <input
              id="materialAndCare"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register("materialAndCare")}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Pricing & Inventory</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="actualPrice" className="block text-gray-700 text-sm font-bold mb-2">
                Price *
              </label>
              <input
                id="actualPrice"
                type="number"
                step="0.01"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("actualPrice", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" }
                })}
              />
              {errors.price && <p className="text-red-500 text-xs italic">{errors.price.message}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="discount" className="block text-gray-700 text-sm font-bold mb-2">
                Discount
              </label>
              <input
                id="discount"
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("discount", {
                  min: { value: 0, message: "Discount cannot be negative" }
                })}
              />
              {errors.discount && <p className="text-red-500 text-xs italic">{errors.discount.message}</p>}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Sizes & Stock
            </label>
            <div className="flex flex-wrap gap-4">
              {["S", "M", "L", "XL", "Generic"].map((size) => {
                const sizeData = sizeWithStock.find((s) => s.size === size);
                const isSelected = !!sizeData;
                
                return (
                  <div key={size} className="flex items-center bg-gray-100 p-2 rounded">
                    <input
                      id={`size-${size}`}
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSizeChange(size)}
                      className="mr-2"
                    />
                    <label htmlFor={`size-${size}`} className="mr-2 font-medium">
                      {size}
                    </label>
                    {isSelected && (
                      <input
                        type="number"
                        min="0"
                        value={sizeData.stock}
                        onChange={(e) => handleStockChange(e, size)}
                        className="w-20 p-1 border rounded"
                        placeholder="Stock"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Images</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Main Image (Hero Image) *
            </label>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {bannerImage && (
                <div className="flex flex-col items-center">
                  <img
                    src={bannerImage}
                    alt="bannerImage"
                    className="h-40 rounded-md object-contain border"
                  />
                  <span className="text-sm text-gray-500 mt-1">Current Image</span>
                </div>
              )}
              <div className="flex flex-col">
                <label
                  htmlFor="bannerImage"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer text-center"
                >
                  {bannerImage ? "Change Main Image" : "Upload Main Image"}
                </label>
                <input
                  type="file"
                  id="bannerImage"
                  className="hidden"
                  onChange={handleBannerImageChange}
                  accept="image/*"
                />
                {/* <p className="text-xs text-gray-500 mt-1">Recommended: 800x600px or similar ratio</p> */}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
             Other Images
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {colorWithImages.map((color, colorIndex) => (
                <div key={colorIndex} className="border rounded p-4 bg-gray-50">
                                      {/* <h4 className="font-medium">Color {colorIndex + 1}</h4> */}
{/* 
                  <div className="flex justify-between items-center mb-3">
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 font-bold"
                      onClick={() => handleRemoveColorWithImages(colorIndex)}
                    >
                      Remove
                    </button>
                  </div> */}
                  
                  {/* <div className="flex items-center mb-3">
                    <label
                      htmlFor={`color-${colorIndex}`}
                      className="block h-10 w-10 rounded-full cursor-pointer border shadow-inner"
                      style={{ backgroundColor: color.colorCode }}
                    >
                      <input
                        id={`color-${colorIndex}`}
                        type="color"
                        value={color.colorCode}
                        onChange={(e) => handleColorChange(e, colorIndex)}
                        className="sr-only"
                      />
                    </label>
                    <span className="ml-2 text-sm">{color.colorCode}</span>
                  </div> */}
                  
                  <div className="mb-3">
                    <button
                      type="button"
                      className="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-1 px-3 rounded"
                      onClick={() => handleAddImage(colorIndex)}
                    >
                      + Add More Images
                    </button>
                    <span className="text-xs text-gray-500 ml-2">
                      {color.images.length}/5 images
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {color.images.map((url, imageIndex) => (
                      <div key={imageIndex} className="relative group">
                        {url ? (
                          <>
                            <img
                              src={url}
                              alt={`Color ${colorIndex + 1} variant ${imageIndex + 1}`}
                              className="w-full h-24 object-cover rounded border"
                            />
                            <button
                              type="button"
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveImage(colorIndex, imageIndex)}
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <label className="flex flex-col items-center justify-center h-24 border border-dashed rounded cursor-pointer">
                            <span className="text-2xl">+</span>
                            <span className="text-xs">Upload</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => getImageUrl(e, colorIndex, imageIndex)}
                              accept="image/*"
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handleAddColor}
            >
              + Add Another Color
            </button> */}
          </div>
        </div>

        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => navigate("/seller/products")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductEditPage;