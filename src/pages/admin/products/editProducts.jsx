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

  const { register, handleSubmit, reset } = useForm({
    defaultValues: product,
  });

  const getProductDetails = async (_id) => {
    console.group("productId", _id)
    try {
      const { product } = await HttpClient.get(`/product/${_id}`);
      setSizeWithStock(product?.sizes);
      setColorWithImages(product?.colors);
      setBannerImage(product?.bannerImage);
      setProductDetails(product?.productDetails);
      setProduct((prevVal) => ({
        ...prevVal,
        ...product,
        category: product?.category?._id,
        brand: product?.brand?._id,
      }));
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const getAllBrands = async () => {
    try {
      const { brands } = await HttpClient.get("/brand");
      setAllBrands(brands);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const getAllCategories = async () => {
    try {
      const { categories } = await HttpClient.get("/category");
      setAllCategories(categories);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    reset(product);
  }, [product, reset]);

  useEffect(() => {
    getProductDetails(id);
  }, [id]);

  const onSubmit = async (data) => {
    console.log("aniket", data)
    try {
      const info = {
        ...data,
        bannerImage,
        sizes: sizeWithStock,
        colors: colorWithImages,
        productDetails,
      };
      const { message } = await HttpClient.put(
        `/product/${product?._id}`,
        info
      );
      toast.success(message || "Product Updated Successfully");
      navigate("/seller/products");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
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

  const handleColorChange = (e, i) => {
    const newColorWithImages = [...colorWithImages];
    newColorWithImages[i].colorCode = e.target.value;
    setColorWithImages(newColorWithImages);
  };

  return (
    <div className="container px-4 sm:mx-auto my-8">
      <h1 className="text-4xl font-bold mb-4 text-center">
        <Link to="/seller" className="text-2xl font-bold mb-4 hover:underline">
          Vardakart Seller
        </Link>
        <Link
          to="/"
          target="_blank"
          className="text-base font-bold mb-4 hover:underline ml-3"
        >
          (Website)
        </Link>
      </h1>
      <div className="flex justify-between mb-3">
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <Link
          to="/seller/products"
          className="text-2xl font-bold mb-4 hover:underline"
        >
          Product List
        </Link>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
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
            {...register("name")}
          />
        </div>
        <div className="mb-4">
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
            {...register("description")}
          ></textarea>
        </div>
        <div className="mb-4">
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
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleAddProductDetails}
          >
            Add Product Details
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group
          </label>
          <div className="flex">
            <div className="flex items-center mr-4">
              <input
                id="group-men"
                type="radio"
                name="group"
                value="men"
                className="mr-2"
                {...register("group")}
              />
              <label htmlFor="group-men">Men</label>
            </div>
            <div className="flex items-center mr-4">
              <input
                id="group-women"
                type="radio"
                name="group"
                value="women"
                className="mr-2"
                {...register("group")}
              />
              <label htmlFor="group-women">Women</label>
            </div>
            <div className="flex items-center mr-4">
              <input
                id="group-kid"
                type="radio"
                name="group"
                value="kids"
                className="mr-2"
                {...register("group")}
              />
              <label htmlFor="group-kid">Kids</label>
            </div>
          </div>
        </div>
        <div className="mb-4">
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
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md outline-none"
          >
            <option disabled>Select Category</option>
            {allCategories.map((category, i) => (
              <option value={category?._id} key={i}>
                {category?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
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
            <option disabled>Select Brand</option>
            {allBrands.map((brand, i) => (
              <option value={brand?._id} key={i}>
                {brand?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
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
            {...register("materialAndCare")}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            id="price"
            type="text"
            name="price"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md outline-none"
            {...register("price", {
              required: "*Price is required.",
              pattern: {
                value: /^\d*\.?\d*$/,
                message: "This field should only contain numbers",
              },
            })}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="discount"
            className="block text-sm font-medium text-gray-700"
          >
            Discount
          </label>
          <input
            id="discount"
            type="number"
            name="discount"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md outline-none"
            {...register("discount")}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sizes
          </label>
          <div className="flex">
            {["S", "M", "L", "XL"].map((item, i) => {
              const [checkedSize] = sizeWithStock.filter(
                (s) => s.size === item
              );
              return (
                <div className="flex items-center mr-4" key={i}>
                  <input
                    id={`size-${i}`}
                    type="checkbox"
                    name="size"
                    value={item}
                    className="mr-2"
                    checked={checkedSize}
                    onChange={(e) => handleSizeChange(e, i)}
                  />
                  <label htmlFor={`size-${i}`}>{item}</label>
                  {checkedSize && (
                    <input
                      type="number"
                      placeholder="Stock"
                      name="stock"
                      value={checkedSize?.stock || 0}
                      onChange={(e) => handleStockChange(e, item)}
                      className="mx-2 p-2 w-14 h-10 border border-gray-300 rounded-md outline-none"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mb-4">
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
                  <div className="flex gap-3 my-2">
                    <label
                      htmlFor={`Color-${i + 1}`}
                      className="h-10 w-10 rounded-full cursor-pointer"
                      style={{
                        backgroundColor: item?.colorCode,
                      }}
                    >
                      <input
                        id={`Color-${i + 1}`}
                        type="color"
                        value={item?.colorCode}
                        className="mt-1 p-2 w-14 h-10 border border-gray-300 rounded-md outline-none hidden"
                        {...register("colors")}
                        onChange={(e) => handleColorChange(e, i)}
                      />
                    </label>
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                      onClick={() => handleAddImage(i)}
                    >
                      Add Image
                    </button>
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
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
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
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
        <div className="mb-4">
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
                {...register("bannerImage")}
                onChange={async (e) => {
                  setBannerImage(await uploadImageOnCloudinary(e));
                }}
              />
              {bannerImage ? "Update" : "Upload"} Banner Image
            </label>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductEditPage;
