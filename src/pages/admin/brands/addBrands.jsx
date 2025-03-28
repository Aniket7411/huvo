import React, { useState } from "react";
import { useForm } from "react-hook-form";
import uploadImageOnCloudinary from "../../../server/client/imageUpload";
import { HttpClient } from "../../../server/client/http";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function BrandAddPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [image, setImage] = useState("");
  const [logo, setLogo] = useState("");

  const onSubmit = async (data) => {
    try {
      const info = {
        name: data.name,
        onGoingOffer: data.onGoingOffer.toUpperCase(),
        image,
        logo,
      };
      const { message } = await HttpClient.post("/brand", info);
      toast.success(message || "Brand Added Successfully");
      navigate('/seller/brands')
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="container mx-auto my-3 p-4">
      <h1 className="text-4xl font-bold mb-4 text-center"><Link
          to="/seller"
          className="text-2xl font-bold mb-4 hover:underline"
        >Huvo Seller</Link>
        <Link
          to="/"
          target="_blank"
          className="text-base font-bold mb-4 hover:underline ml-3"
        >(Website)</Link></h1>
      <div className="flex justify-between mb-3">
        <h2 className="text-2xl font-bold mb-4">Add Brands</h2>
        <Link to="/seller/brands" className="text-2xl font-bold mb-4 hover:underline">
          Brand List
        </Link>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Brand Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            {...register("name", {
              required: "*Name is required.",
            })}
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="onGoingOffer"
            className="block text-sm font-medium text-gray-700"
          >
            On Going Offer (In %)
          </label>
          <input
            id="onGoingOffer"
            type="number"
            name="onGoingOffer"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            {...register("onGoingOffer")}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo
          </label>
          <div className="flex gap-6 items-center">
            {logo && (
              <img
                src={logo}
                alt="logo"
                className="h-40 w-40 rounded-md object-contain"
              />
            )}
            <label
              htmlFor="logo"
              className="m-2 bg-red-500 text-white px-3 py-1 rounded-md"
            >
              <input
                type="file"
                id="logo"
                name="logo"
                className="mt-1 p-2 border border-gray-300 rounded-md hidden"
                {...register("logo")}
                onChange={async (e) => {
                  setLogo(await uploadImageOnCloudinary(e));
                }}
              />
              {logo ? "Update" : "Upload"} Logo
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Image
          </label>
          <div className="flex gap-6 items-center">
            {image && (
              <img
                src={image}
                alt="brandImage"
                className="h-40 rounded-md object-contain"
              />
            )}
            <label
              htmlFor="image"
              className="m-2 bg-red-500 text-white px-3 py-1 rounded-md"
            >
              <input
                type="file"
                id="image"
                name="image"
                className="mt-1 p-2 border border-gray-300 rounded-md hidden"
                {...register("image")}
                onChange={async (e) => {
                  setImage(await uploadImageOnCloudinary(e));
                }}
              />
              {image ? "Update" : "Upload"} Image
            </label>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add Brand
          </button>
        </div>
      </form>
    </div>
  );
}

export default BrandAddPage;
