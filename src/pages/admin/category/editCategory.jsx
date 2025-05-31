import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import uploadImageOnCloudinary from "../../../server/client/imageUpload";
import { HttpClient } from "../../../server/client/http";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";

function CategoryEditPage() {
  const navigate = useNavigate();
  const [bannerImage, setBannerImage] = useState("");
  const { id } = useParams();
  const [categoryDetails, setCategoryDetails] = useState({
    name: "",
    description: "",
    bannerImage: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: categoryDetails,
  });

  const getCategoryDetails = async (_id) => {
    try {
      const data = await HttpClient.get(`/category/${_id}`);
      setBannerImage(data?.bannerImage);
      setGroup(data?.group);
      setCategoryDetails(data);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    reset(categoryDetails);
  }, [categoryDetails, reset]);

  useEffect(() => {
    getCategoryDetails(id);
  }, [id]);

  const onSubmit = async (data) => {
    try {
      const info = {
        ...data,
        bannerImage,
        group,
      };
      const { message } = await HttpClient.put(
        `/category/${categoryDetails?._id}`,
        info
      );
      toast.success(message || "Category Updated Successfully");
      navigate("/seller/category");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const [group, setGroup] = useState([]);

  const handleGroupNameChange = (e) => {
    const { name, value } = e.target;
    if (name === "groupName") {
      const index = group.findIndex((item) => item.name === value);
      if (index === -1) {
        setGroup((prev) => [...prev, { name: value }]);
      } else {
        const newGroup = [...group];
        newGroup.splice(index, 1);
        setGroup(newGroup);
      }
    }
  };

  const handleGroupImageChange = async (e, groupName) => {
    try {
      const index = group.findIndex((item) => item.name === groupName);
      const newGroup = [...group];
      newGroup[index].image = await uploadImageOnCloudinary(e);
      setGroup(newGroup);
    } catch (error) {
      console.error(error);
      toast.error("Error in upload image");
    }
  };

  return (
    <div className="container mx-auto my-8">
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
      <div className="flex justify-between mb-3">
        <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
        <Link
          to="/seller/category"
          className="text-2xl font-bold mb-4 hover:underline"
        >
          Category List
        </Link>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name
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
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            name="description"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            {...register("description")}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Image
          </label>
          <div className="flex gap-6 items-center">
            {bannerImage && (
              <img
                src={bannerImage}
                alt="categoryImage"
                className="h-40 rounded-md object-contain"
              />
            )}
            <label
              htmlFor="bannerImage"
              className="m-2 bg-red-500 text-white px-3 py-1 rounded-md"
            >
              <input
                type="file"
                id="bannerImage"
                name="bannerImage"
                className="mt-1 p-2 border border-gray-300 rounded-md hidden"
                {...register("bannerImage")}
                onChange={async (e) => {
                  setBannerImage(await uploadImageOnCloudinary(e));
                }}
              />
              {bannerImage ? "Update" : "Upload"}
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group
          </label>
          <div className="flex">
            {["men", "women", "kids"].map((item, i) => {
              const [checkedGroup] = group.filter((g) => g.name === item);
              return (
                <div className="flex items-center mr-4 gap-3" key={i}>
                  <input
                    id={`group-${i}`}
                    type="checkbox"
                    name="groupName"
                    value={item}
                    className="mr-2"
                    checked={checkedGroup}
                    onChange={handleGroupNameChange}
                  />
                  <label htmlFor={`group-${i}`}>{item}</label>
                  {checkedGroup && (
                    <>
                      {checkedGroup?.image && (
                        <img
                          src={checkedGroup?.image}
                          alt={checkedGroup?.name}
                          className="h-40 rounded-md object-contain"
                        />
                      )}
                      <label
                        htmlFor={`image${i}`}
                        className="bg-red-500 text-white px-3 py-1 rounded-md"
                      >
                        <input
                          type="file"
                          id={`image${i}`}
                          name={`image${i}`}
                          className="mt-1 p-2 border border-gray-300 rounded-md hidden"
                          {...register("image")}
                          onChange={(e) => handleGroupImageChange(e, item)}
                        />
                        {checkedGroup?.image ? "Update" : "Upload"}
                      </label>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          {errors.group && (
            <span className="text-red-500">{errors.group.message}</span>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="bg-[#011f4b] text-white px-4 py-2 rounded-md"
          >
            Update Category
          </button>
        </div>
      </form>
    </div>
  );
}

export default CategoryEditPage;
