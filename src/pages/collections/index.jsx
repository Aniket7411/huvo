import React, { useState, useEffect } from "react";
import { MdOutlineShoppingBag } from "react-icons/md";
import { RiShareForwardLine } from "react-icons/ri";
import { CiDeliveryTruck, CiDiscount1, CiHeart } from "react-icons/ci";
import { PiCurrencyInr } from "react-icons/pi";
import { LiaAngleDownSolid } from "react-icons/lia";
import { LiaFilterSolid } from "react-icons/lia";
import { RxCross2 } from "react-icons/rx";
import { Link, useSearchParams } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { isLoggedIn } from "../../server/user";
import "./collection.css"
import MultiRangeSlider from "multi-range-slider-react";
import { RiArrowDownSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import ProductCarousel from "../productcarousel";



export default function Collections() {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isOpened, setIsOpened] = useState(false)
  const [isOpenCategory, setIsOpenCategory] = useState(false)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [isSubmenu, SetisSubmenu] = useState(false);
  const [minValue, set_minValue] = useState(0);
  const [maxValue, set_maxValue] = useState(10000);
  const [value, setvalue] = useState((0, 10000))
  //use navigate for login

  const navigate = useNavigate();
  //use navigate for login
  const closeSubmenu = () => {
    SetisSubmenu(false);
    document.body.style.overflow = "scroll";
  };
  const openSubmenu = () => {
    SetisSubmenu(true);
    document.body.style.overflow = "hidden";
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(
    Object.fromEntries(searchParams.entries())
  );
  const [allProducts, setAllProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      let url = "/product?";
      Object.keys(query).forEach((key, index) => {
        url += `${index !== 0 ? "&" : ""}${key}=${query[key]}`;
      });
      const { products } = await HttpClient.get(url);
      setAllProducts(products);

      console.log("jjjjjjjjjjjjjjjjjjjjjj",products)
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };


  console.log("add to cart data")
  const addToCart = async (productDetails) => {
    console.log("Product Details:", productDetails);
    try {
      const { message } = await HttpClient.post("/cart", {
        _id: productDetails._id,
        productId: productDetails.productId,
        name: productDetails.name,
        bannerImage: productDetails.bannerImage,
        size: productDetails?.sizes[0].size,
        color: productDetails?.colors[0].colorCode,
        quantity: 1,
        price: productDetails.price,
        discount: productDetails.discount ?? 0,
        seller: productDetails?.seller,
        isReturnable: productDetails?.isReturnable,
      });
      toast.success(message);
      console.log("API Response:", message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  console.log("add to cart dove")
  const addToWishlist = async (productDetails) => {

    try {
      const { message } = await HttpClient.post("/wishlist", {
        _id: productDetails._id,
        productId: productDetails.productId,
        name: productDetails.name,
        bannerImage: productDetails.bannerImage,
        size: productDetails?.sizes[0].size,
        color: productDetails?.colors[0].colorCode,
        quantity: 1,
        price: productDetails.price,
        discount: productDetails.discount ?? 0,
        seller: productDetails?.seller,
      });
      console.log("API Response:", message);
      toast.success(message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, [query]);

  useEffect(() => {
    setQuery(Object.fromEntries(searchParams.entries()));
  }, [searchParams]);

  //code for filters
  // const newArray =allProducts

  const appliedFilters = allProducts.filter(products => {

    const matchColor = !selectedColor || products.colors.some(colorObj => colorObj.colorCode === selectedColor);

    const matchSize = !selectedSize || products.sizes.some(objSize => objSize.size === selectedSize);
    //  console.log('colormatch',matchColor)
    //  console.log("allProducts",allProducts)
    //  console.log("applied filter",appliedFilters)
    const matchesPrice =
      products.price >= minValue && products.price <= maxValue;

    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(products.group?.toLowerCase());

    return matchColor && matchSize && matchesPrice && matchesCategory;
  })


  const handleColorChange = (event) => {

    const selectedColor = event.target.value
    setSelectedColor(selectedColor)
    console.log('Selected Color:', selectedColor)
  }

  const handleSizeChange = (event) => {

    const selectedSize = event.target.value
    setSelectedColor(selectedColor)
    console.log('Selected Size:', selectedSize)
  }
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
  function togglePriceRange() {
    // setIsOpened(wasOpened => !wasOpened);
    setIsOpened(!isOpened)
  }
  function toggleCategorySelector() {
    setIsOpenCategory(!isOpenCategory)
  }
  console.log("category filter")
  const handlecategorychange = (category) => {
    setSelectedCategories(prevCategories =>
      prevCategories.includes(category)
        ? prevCategories.filter(cat => cat !== category)
        : [...prevCategories, category])
  }
  console.log("category change filter working")

  return (
    <section className="px-4 mt-10 font-[Quicksand]" style={{
      marginTop: "70px"
    }}>
      <h2 className="font-[Quicksand] font-bold mt-5 text-c
      enter text-[#011F4B] text-2xl md:text-4xl ">
        Results for searched categories
      </h2>
      <div className="hidden sm:flex items-center  sm:gap-9 mb-4 font-[Poppins]">
        <p className="text-[#515151] font-medium text-lg flex gap-2 items-center">

          <select
            name="colours"
            id="colors"
            // key={index}
            value={selectedColor}
            onChange={(e) => handleColorChange(e)}
            className="mt-1 block w-full py-1 pr-3 pl-3 border border-gray-300 rounded-md outline-none border-collectionpage"
          >
            <option value="" disabled>Colour</option>
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
        </p>
        <p className="text-[#515151] font-medium text-lg flex gap-2 items-center">

          <select
            name="colours"
            id="colors"
            // key={index}
            value={selectedSize}
            onChange={(e) => handleSizeChange(e)}
            className="mt-1 block w-full py-1 pr-3 pl-3 border border-gray-300 rounded-md outline-none border-collectionpage"
          >
            <option value="" disabled> Size</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </p>
        <div className=" relative text-[#515151] font-medium text-lg  gap-2 items-center z-10">
          <button className="flex mt-1" onClick={togglePriceRange}>
            Price Range
            <RiArrowDownSLine className="w-10 mt-1" />
          </button>

          {isOpened && (
            <div className="absolute w-40 border rounded-xl shadow-md z-99 bg-white">
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
            </div>
          )}
        </div>
        <div className="relative text-[#515151] font-medium text-lg gap-2 items-center z-10">
          <button className="flex mt-1" onClick={toggleCategorySelector}>
            Category
            <RiArrowDownSLine className="w-10 mt-1" />
          </button>
          {isOpenCategory && (
            <div className="absolute w-full h-59 border rounded-xl shadow-md z-99 bg-white">

              <div className="flex items-center space-x-4 mt-1 ml-1 ">
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
              <div className="flex items-center space-x-4 mt-1 ml-1">
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
              <div className="flex items-center space-x-4 mt-1 ml-1">
                <input
                  type="checkbox"
                  id="checkbox"
                  className="form-checkbox h-3 w-3  text-blue-600"
                  checked={selectedCategories.includes('kids')}
                  //  onChange={e=>{()=>handlecategorychange('kids');handleCheckboxChange(e)}}
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
          )}
        </div>

        {/* <p className="text-[#515151] font-medium text-lg flex gap-2 items-center">
          Fit <LiaAngleDownSolid />
        </p> */}
      </div>
      <button
        onClick={() => openSubmenu()}
        className="font-[Quicksand] flex gap-2 items-center sm:hidden md:text-xl font-bold mb-3"
      >
        <LiaFilterSolid />
        Filters
      </button>
      {isSubmenu && (
        <section>
          <div className="block sm:hidden z-10 bg-white fixed sm:w-[50%] w-[100%] p-5 top-0 h-full left-0">
            <div className="flex justify-end mb-4 items-center">
              <button className="text-black " onClick={() => closeSubmenu()}>
                <RxCross2 />
              </button>
            </div>
            <ul>

              <li className="text-[#515151] font-[Poppins] cursor-pointer mb-5">
                <select
                  name="colours"
                  id="colors"
                  // key={index}
                  value={selectedSize}
                  onChange={(e) => handleColorChange(e)}
                  className="mt-1 block border border-gray-300 rounded-md outline-none border-collectionpage"
                >
                  <option value="" className="text-sm" disabled> Color</option>
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
              </li>


              <li className="text-[#515151] font-[Poppins] cursor-pointer mb-5">
                <select
                  name="colours"
                  id="colors"
                  // key={index}
                  value={selectedSize}
                  onChange={(e) => handleSizeChange(e)}
                  className="mt-1 block border border-gray-300 rounded-md outline-none border-collectionpage"
                >
                  <option value="" className="text-sm" disabled> Size</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </li>
              <li className="text-[#515151] font-[Poppins] cursor-pointer mb-5">
                <div className="relative text-[#515151] text-lg gap-2 items-center z-10">
                  <button className="flex mt-1 text-sm" onClick={toggleCategorySelector}>
                    Category
                    <RiArrowDownSLine className="w-10 mt-1" />
                  </button>
                  {isOpenCategory && (
                    <div className="absolute w-full h-59 border rounded-xl shadow-md z-99 bg-white">

                      <div className="flex items-center space-x-4 mt-1 ml-1 ">
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
                      <div className="flex items-center space-x-4 mt-1 ml-1">
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
                      <div className="flex items-center space-x-4 mt-1 ml-1">
                        <input
                          type="checkbox"
                          id="checkbox"
                          className="form-checkbox h-3 w-3  text-blue-600"
                          checked={selectedCategories.includes('kids')}
                          //  onChange={e=>{()=>handlecategorychange('kids');handleCheckboxChange(e)}}
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
                  )}
                </div>
              </li>
              <li className="text-[#515151] font-[Poppins] cursor-pointer mb-5">
                <button className="flex mt-1" onClick={togglePriceRange}>
                  Price Range
                  <RiArrowDownSLine className="w-10 mt-1" />
                </button>

                {isOpened && (
                  <div className="absolute w-40 border rounded-xl shadow-md z-99 bg-white">
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
                  </div>
                )}
              </li>
            </ul>
          </div>
        </section>
      )}

      <hr className="my-2" />
      <ProductCarousel menProducts={appliedFilters} />

{/* 
      <div style={{
        backgroundImage: "linear-gradient(to left, #e303fc, #ffffff, #347aeb)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",

      }} className="md:flex  flex-wrap hidden p-5  gap-2">
        <ul className="flex flex-wrap gap-1">
          {appliedFilters.length ? (
            appliedFilters.map((product, i) => {

              const finalPrice = product.price - product.discount


              return (
                <>
                  <div className="bg-white flex flex-col items-center rounded-2xl p-3 shadow-lg border border-gray-200 w-[1/5]">
                    <img
                      src={product?.bannerImage || "https://via.placeholder.com/300"}
                      alt={product?.name || "Product Image"}
                      className="h-40 w-40 object-cover rounded-md mb-1"
                    />
                    <h1 className="text-black font-quicksand font-bold text-xl ">
                      {product?.productName || "Product Name"}
                    </h1>

                    <div className="flex items-center gap-4 text-gray-700 mt-1">
                      <p className="flex items-center text-sm font-semibold">
                        <span className="text-yellow-500 mr-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                          </svg>
                        </span>
                        Rating: 4.5 / 5
                      </p>
                      <p className="text-sm text-gray-500">200 Ordered last week</p>
                    </div>

                    <div className="flex justify-between w-[100%] items-center">
                      <div className="flex items-center gap-1">
                        <PiCurrencyInr className="text-red-600" />
                        <p className="line-through text-red-600 font-semibold">{product?.price}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <CiDiscount1 className="text-green-600" />{" "}
                        <PiCurrencyInr className="text-green-600" />
                        <p className="font-semibold text-green-600">{product?.discount}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center w-[100%]">
                      <div className="flex items-center text-green-600 gap-1/2">
                        <PiCurrencyInr />
                        <p className="font-semibold">{finalPrice} /-</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <CiDeliveryTruck />
                        <p className="font-semibold items-end">Free delivery</p>
                      </div>
                    </div>

                    <Link
                      to={`/product-details/${product?.productId}`}
                      className="block mt-2 "
                    >
                      <button className="flex items-center justify-center bg-[#011F4B] text-white px-3 py-1 rounded-lg text-md hover:bg-[#02386e] transition-colors duration-200">
                        Product Details
                        <FaArrowRight className="ml-2" />
                      </button>
                    </Link>
                  </div>



                </>

              );
            })
          ) : (
            <h2 className="font-[Quicksand] font-medium text-center text-4xl text-[#011F4B]">
              No Products Available
            </h2>
          )}
        </ul>
      </div> */}

{/* 

      <div className="flex p-auto md:hidden flex-wrap gap-2 justify-center ">
        {appliedFilters.map((each, index) => {

          const finalPrice = each.price - each.discount

          return (
            (
              <div
                key={index}
                className="w-auto  h-auto  flex flex-col   bg-white rounded-lg shadow-md p-2 border border-gray-200"
              >


                <Link to={`/product-details/${each?.productId}`} >


                  <img
                    src={each?.bannerImage || "https://via.placeholder.com/300"}
                    alt={each?.name || "Product Image"}
                    className="h-[150px]  object-cover rounded-md"
                  />
                  <div>
                    <h2 className=" font-semibold text-gray-800 text-sm">
                      {each?.productName || "Product Name"}
                    </h2>

                    <div className="flex justify-between">

                      <div className="flex items-center gap-1">
                        <PiCurrencyInr />

                        <p className="line-through text-red-600 font-semibold"> {each?.price}</p>
                      </div>


                      <div className="flex items-center  gap-1/2">

                        <PiCurrencyInr />

                        <p>{each?.discount}</p>

                      </div>
                    </div>

                    <div className="flex text-green-600 items-center gap-1/2">
                      <PiCurrencyInr />

                      <p className=" font-semibold">{finalPrice}/-</p>
                    </div>


                    <div className="flex items-center font-semibold  gap-2">
                      <CiDeliveryTruck />
                      <p className="text-sm  items-end">Free delivery</p>

                    </div>

                  </div>
                </Link>
              </div>
            )
          )
        })}
      </div>
 */}



    </section>
  );
}