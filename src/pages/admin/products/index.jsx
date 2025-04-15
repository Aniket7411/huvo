import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";
import { RiArrowDownSLine } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { HttpClient } from "../../../server/client/http";
import { IoAddCircleOutline } from "react-icons/io5";
import MultiRangeSlider from "multi-range-slider-react";
import Loader from "../../../components/loader";
import Modal from "antd/es/modal/Modal";

import './products.css'
import { MdDelete } from "react-icons/md";

function ProductList() {

  ;
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [sortisModalOpen, setSortisModalOpen] = useState(false);
  const [KeywordSearch, setKeywordSearch] = useState("");
  const [loader, setLoader] = useState(false);
  const [showModal, SetShowModal] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isModalOpen, setisModalOpen] = useState(false); // State to manage modal visibility


  const [value, setvalue] = useState((0, 10000))
  //slide
  const [minValue, set_minValue] = useState(0);
  const [maxValue, set_maxValue] = useState(10000);
  const [selectedColor, setSelectedColor] = useState('')



  const [sortOption, setSortOption] = useState('')


  const getAllProducts = async () => {
    try {
      setLoader(true);
      const { products } = await HttpClient.get("/product");

      console.log(products)
      if (products) {
        setLoader(false);
      }
      setAllProducts(products);
      console.log(products)
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const deleteProduct = async (_id) => {


    console.log(_id)
    try {
      const { message } = await HttpClient.delete(`/product/${_id}`);
      toast.success(message);
      getAllProducts();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleKeywordSearch = (e) => {
    setKeywordSearch(e.target.value);
  };

  const handlecategorychange = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]
    );
  };

  const handleSlider = (event) => {
    set_minValue(event.minValue);
    set_maxValue(event.maxValue);
  }
  const rangeSelector = (e, newValue) => {

    if (Array.isArray(newValue)) {
      set_minValue(newValue[0]);
      set_maxValue(newValue[1]);
    }

  }
  const handleColorChange = (event) => {

    const selectedColor = event.target.value
    setSelectedColor(selectedColor)
    console.log('Selected Color:', selectedColor)
  }
  const handleSortApplication = (event) => {
    setSortOption(event.target.value)


  }

  const keyfilteredproducts = allProducts.filter(products => {
    const tomatchkeyword = KeywordSearch ?
      Object.values(products).some((value) =>
        value !== null &&
        value !== undefined &&
        value.toString().toLowerCase().includes(KeywordSearch.toLowerCase())
      )

      :
      true;



    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(products.group?.toLowerCase());


    const matchesPrice =
      products.price >= minValue && products.price <= maxValue;


    // const matchColor =!selectedColor || products.colors.some(colorObj => colorObj.colorCode.trim().toLowerCase() === selectedColor.toLowerCase());
    const matchColor = !selectedColor || products.colors.some(colorObj => colorObj.colorCode === selectedColor);

    console.log('colormatch', matchColor)

    return tomatchkeyword && matchesCategory && matchesPrice && matchColor;


  })
    .sort((a, b) => {
      switch (sortOption) {
        case "priceLowToHigh":
          return a.price - b.price;
        case "priceHighToLow":
          return b.price - a.price;
        case "alphabetical":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const openModal = () => {
    setisModalOpen(true); // Open modal
  };

  const closeModal = () => {
    setisModalOpen(false); // Close modal
  };


  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex  z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4 max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b">
              <h2 className="text-xl font-semibold">Filter</h2>
              <button onClick={closeModal} className="text-black">
                &#10005; {/* Close Icon */}
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4">
              {/* KEYWORDS Input */}
              <div className="mb-4">
                <label className="block font-semibold mb-2">KEYWORDS</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter keywords"
                  onChange={handleKeywordSearch}
                  value={KeywordSearch}
                />
              </div>

              {/* CATEGORIES Radio Buttons */}
              <div className="mb-4">
                <label className="block font-semibold mb-2">CATEGORIES</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      value="male"
                      checked={selectedCategories.includes("men")}
                      onChange={() => handlecategorychange("men")}
                    />
                    Male
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      value="female"
                      checked={selectedCategories.includes("women")}
                      onChange={() => handlecategorychange("women")}
                    />
                    Female
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      value="kids"
                      checked={selectedCategories.includes("kids")}
                      onChange={() => handlecategorychange("kids")}
                    />
                    Kids
                  </label>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <p className="block font-semibold">
                  Price Range
                </p>
                <RiArrowDownSLine className="w-10" />
              </div>

              {/* Price Sorting Radio Buttons */}
              <div className="mb-4">
                <p>Sort by Price:</p>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="mr-2"
                    name="sortOption"
                    value="priceLowToHigh"
                    checked={sortOption === "priceLowToHigh"}
                    onChange={handleSortApplication}
                  />
                  Low to High
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="mr-2"
                    name="sortOption"
                    value="priceHighToLow"
                    checked={sortOption === "priceHighToLow"}
                    onChange={handleSortApplication}
                  />
                  High to Low
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="mr-2"
                    name="sortOption"
                    value="alphabetical"
                    checked={sortOption === "alphabetical"}
                    onChange={handleSortApplication}
                  />
                  Alphabetically
                </label>
              </div>

              {/* Select Color */}
              <div className="mb-4">
                <label className="block font-semibold mb-2">Select Color</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="colours"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e)}
                >
                  <option value="" disabled>Select Color</option>
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="yellow">Yellow</option>
                  <option value="pink">Pink</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                  <option value="black">Black</option>
                  <option value="white">White</option>
                  <option value="grey">Grey</option>
                  <option value="turquoise">Turquoise</option>
                </select>
              </div>

              {/* Price Range Slider */}
              <div className="flex justify-between items-center mb-4">
                <p className="block font-semibold">
                  Price Range
                </p>
                <RiArrowDownSLine className="w-10" />
              </div>

              <div className="rangeSlider">
                <MultiRangeSlider
                  min={0}
                  max={10000}
                  step={6}
                  value={value}
                  minValue={minValue}
                  maxValue={maxValue}
                  onChange={rangeSelector}
                  onInput={handleSlider}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-start mt-3">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}





      <div className="w-full">




      <div className="flex justify-between items-center flex-wrap  p-3 space-y-4 sm:space-y-0">
      {/* Search Section */}
      <div className="flex items-center bg-white rounded-lg shadow-md p-2 w-full sm:w-auto">
        <button className="p-2 hover:bg-gray-100 rounded-full transition">
          <CiSearch className="text-gray-600 text-xl" />
        </button>
        <input
          onChange={handleKeywordSearch}
          type="search"
          placeholder="Search"
          className="border-0 w-full text-gray-800 text-sm px-1 outline-none placeholder-gray-400"
        />
      </div>

      {/* Title */}
      <h1 className="font-[Poppins] text-black text-2xl font-semibold sm:font-medium sm:text-lg w-full sm:w-auto text-center sm:text-left">
        All listed Products
      </h1>

      {/* Add Product Button */}

      <div className="flex items-center gap-2">
  <Link
    to="/seller/products/add"
    className="flex items-center gap-2 bg-[#011F4B] text-white px-4 py-2 rounded-md  transition"
  >
    <IoAddCircleOutline className="text-xl" />
    <span className="text-sm font-medium">Add Product</span>
  </Link>
</div>

    
    </div>
        <button class="bg-blue-500 text-white font-bold py-2 px-4 rounded lg:hidden ml-3 sm:block" onClick={openModal} >
          Filter
        </button>


        <div className="flex px-2">



          {
            keyfilteredproducts.length ?
              <div className="w-auto">
                <div className="relative overflow-auto shadow-md sm:rounded-lg ">
                  <table className="w-full table-auto sticky-banner">
                    <thead className="sticky top-[-2px] bg-gray-2 dark:bg-meta-4 shadow fixed z-10 bg-white">
                      <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="min-w-[35px] p-4  font-medium text-black border-y border-[#eee]">
                          Name
                        </th>
                        <th className="w-[35px] p-4  font-medium text-black border-y border-[#eee]">
                          Product Id
                        </th>
                        <th className="min-w-[35px] p-4  font-medium text-black border-y border-[#eee]">
                          Group
                        </th>
                        <th className="min-w-[100px] p-4  font-medium text-black border-y border-[#eee]">
                          Banner Image
                        </th>
                        <th className="min-w-[100px] p-4  font-medium text-black border-y border-[#eee]">
                          Price
                        </th>

                        <th className="p-4  font-medium text-black border-y border-[#eee]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {

                        keyfilteredproducts.map((item, key) => (
                          <tr key={key}>
                            <td className="border-y border-[#eee] p-4  dark:border-strokedark">
                              <h5 className="font-medium text-black">{item?.name}</h5>
                            </td>
                            <td className="w-[40px] border-y border-[#eee] p-4  dark:border-strokedark">
                              <h5 className="font-medium text-[#FF470D]">
                                {item?.productId}
                              </h5>
                            </td>

                            <td className="border-y border-[#eee] p-4  dark:border-strokedark">
                              <h5 className="font-medium text-black">
                                {item?.group.toUpperCase()}
                              </h5>
                            </td>
                            <td className="border-y border-[#eee] p-4  dark:border-strokedark">
                              <h5 className="font-medium text-black">
                                <img
                                  src={item.bannerImage}
                                  alt="bannerImage"
                                  className="h-20 w-20 rounded-md object-contain"
                                />
                              </h5>
                            </td>
                            <td className="border-y border-[#eee] p-4  dark:border-strokedark">
                              <h5 className="font-medium text-black">
                                {"₹ " + item?.price}
                              </h5>
                            </td>

                            <td className="border-y border-[#eee] py-5 px-4 dark:border-strokedark">
                              <div className="flex items-center space-x-3.5">
                                {/* <button
                                  className="hover:text-primary"
                                  onClick={() =>
                                    navigate(
                                      `/seller/products/edit/${item?.productId}`
                                    )
                                  }
                                >
                                  <FiEdit />
                                </button> */}

                                <button
                                  className="hover:text-primary hover:text-[red]"
                                  onClick={() => deleteProduct(item?.productId)}
                                >        
                                                        <MdDelete size={30} />

                                
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                        // ) 
                        // : (
                        //   <tr>
                        //     <td className="text-center p-3 text-lg" colSpan="5">
                        //       No Products Available
                        //     </td>
                        //   </tr>
                        // )
                      }
                    </tbody>
                  </table>
                </div>

                {/* (allProducts.length===0 || allProducts.length>0) && */}


              </div>
              :
              <div
                className="h-[62vh]"
                style={{

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {loader === true ? <div className="w-[50vw] h-[100vh] flex justify-center items-center border">
                  <Loader />
                </div> :
                  <div className="w-[50vw] h-[100vh] flex justify-center items-center border">
                    <h1>
                      No Products Available
                    </h1>
                  </div>







                }
              </div>
          }

          <div className="px-2 w-1/3 hidden lg:block">
            <div className="border rounded-md shadow-lg py-5 mb-3">
              <div className="flex justify-between">
                <p className=" px-5 py-1 font-[Poppins] text-[000000] font-normal leading-5">
                  Keyword
                </p>
                <RiArrowDownSLine className="w-10" />
              </div>
              <div className="flex items-center p-2 mr-2 ml-4 border border-[#CED4DA] rounded-md mt-3">
  <CiSearch className="text-[#000000] mr-2" />
  <input
    type="search"
    placeholder="Search product"
    className="w-full border-none focus:ring-0 focus:outline-none"
    onChange={handleKeywordSearch}
    value={KeywordSearch}
  />

</div>

            </div>
            <div className="border rounded-md shadow-lg py-5 mb-3">
              <div className="flex justify-between">
                <p className="px-5 py-1 font-[Poppins] text-[000000] font-normal leading-5">
                  Categories
                </p>
                <RiArrowDownSLine className="w-10" />
              </div>
              <div className="mx-4 my-2">

                <div className="flex items-center space-x-4 mt-1">
                  <input
                    type="checkbox"
                    id="checkbox"
                    className="form-checkbox h-3 w-3  text-blue-600"
                    checked={selectedCategories.includes('men')}
                    onChange={() => handlecategorychange('men')}
                  />
                  <label
                    htmlFor="checkbox"
                    className="font-normal font-[Poppins] text-[000000] leading-5"
                  >
                    Male
                  </label>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <input
                    type="checkbox"
                    id="checkbox"
                    className="form-checkbox h-3 w-3  text-blue-600"
                    checked={selectedCategories.includes('women')}
                    onChange={() => handlecategorychange('women')}
                  />
                  <label
                    htmlFor="checkbox"
                    className="font-normal font-[Poppins] text-[000000] leading-5"
                  >
                    Female
                  </label>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <input
                    type="checkbox"
                    id="checkbox"
                    className="form-checkbox h-3 w-3  text-blue-600"
                    checked={selectedCategories.includes('kids')}
                    onChange={() => handlecategorychange('kids')}


                  />
                  <label
                    htmlFor="checkbox"
                    className="font-normal font-[Poppins] text-[000000] leading-5"
                  >
                    Kids
                  </label>
                </div>
              </div>
            </div>
            {/* <div className="border rounded-md shadow-lg py-5 mb-3">
              <div className="flex justify-between">
                <p className="px-5 py-1 font-[Poppins] text-[000000] leading-5">

                  Price Range
                </p>
                <RiArrowDownSLine className="w-10" />
              </div>
              <div className="rangeSlider pl-4 pr-4 pt-5"
              >
                <MultiRangeSlider
                  min={0}
                  max={10000}
                  step={6}
                  value={value}
                  minValue={minValue}
                  maxValue={maxValue}
                  onChange={rangeSelector}
                  onInput={(event) => {
                    handleSlider(event);
                  }}
                />

              </div>
            </div> */}
            {/* <div className="border rounded-md shadow-lg py-5 mb-3">
              <div className="flex justify-between">
                <p className="px-5 py-1 font-[Poppins] text-[000000] font-normal leading-5">
                  Colour
                </p>
                <RiArrowDownSLine className="w-10" />
              </div>

              <div className="flex items-center space-x-4 ml-5 mt-2 pr-3">
                <select
                  name="colours"
                  id="colors"
                  // key={index}
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e)}
                  className="mt-1 block w-full py-1 pr-3 pl-3 border border-gray-300 rounded-md outline-none"
                >
                  <option value="" disabled>Select Colour</option>
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="yellow">Yellow</option>
                  <option value="pink">Pink</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                  <option value="black">Black</option>
                  <option value="white">White</option>
                  <option value="grey">Grey</option>
                  <option value="turquoise">Turquoise</option>
                </select>

              </div>

            </div> */}
            <div className="border rounded-md shadow-lg py-5 mb-3">
              <div className="flex justify-between">
                <p className="px-5 py-1 font-[Poppins] text-[000000] font-normal leading-5">
                  Sort By
                </p>
                <RiArrowDownSLine className="w-10" />
              </div>
              <div className="mx-4 my-2">

                <div className="flex items-center space-x-4 mt-1">
                  <input
                    type="checkbox"
                    id="priceLowToHigh"
                    name="sortOption"
                    value='priceLowToHigh'
                    className="form-checkbox h-3 w-3  text-blue-600"
                    checked={sortOption === "priceLowToHigh"}
                    onChange={handleSortApplication}
                  />
                  <label
                    htmlFor="priceLowToHigh"
                    className="font-normal font-[Poppins] text-[000000] leading-5"
                  >
                    Price Low to High
                  </label>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <input
                    type="checkbox"
                    id="priceHighToLow"
                    className="form-checkbox h-3 w-3  text-blue-600"
                    name="sortOption"
                    value='priceHighToLow'
                    checked={sortOption === "priceHighToLow"}
                    onChange={handleSortApplication}
                  />
                  <label
                    htmlFor="priceHighToLow"
                    className="font-normal font-[Poppins] text-[000000] leading-5"
                  >
                    Price High to Low
                  </label>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <input
                    type="checkbox"
                    id="alphabetical"
                    className="form-checkbox h-3 w-3  text-blue-600"
                    value='alphabetical'
                    name="sortOption"
                    onChange={handleSortApplication}
                    checked={sortOption === "alphabetical"}


                  />
                  <label
                    htmlFor="alphabetical"
                    className="font-normal font-[Poppins] text-[000000] leading-5"
                  >
                    Alphabatically
                  </label>
                </div>
              </div>


            </div>
          </div>
        </div>


      </div>

    </>
  );
}

export default ProductList;