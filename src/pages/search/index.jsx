import React, { useState, useEffect } from "react";
import { MdOutlineShoppingBag } from "react-icons/md";
import { RiShareForwardLine } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";
import { PiCurrencyInr } from "react-icons/pi";
import { LiaAngleDownSolid } from "react-icons/lia";
import { LiaFilterSolid } from "react-icons/lia";
import { RxCross2 } from "react-icons/rx";
import { Link, useSearchParams } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { isLoggedIn } from "../../server/user";
import "./search.css"
import MultiRangeSlider from "multi-range-slider-react";
import { RiArrowDownSLine } from "react-icons/ri";

export default function Search() {
  const [selectedCategories,setSelectedCategories] =useState([])
  const [isOpened,setIsOpened] = useState(false)
  const [isOpenCategory,setIsOpenCategory] = useState(false)
  const [selectedColor,setSelectedColor] = useState('')
  const [selectedSize,setSelectedSize] = useState('')
  const [isSubmenu, SetisSubmenu] = useState(false);
  const [minValue, set_minValue] = useState(0);
  const [maxValue, set_maxValue] = useState(10000);
   const [value, setvalue] = useState((0, 10000))
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
  const [allProducts, setAllProducts] = useState("");

  const getAllProducts = async () => {
    try {
      let url = "/search/result?";
      // Object.keys(query).forEach((key, index) => {
      //   url += `${index !== 0 ? "&" : ""}${key}=${query[key]}`;
      // });
      Object.keys(query).forEach((key, index) => {
        url += `${index !== 0 ? "&" : ""}${key}=${encodeURIComponent(query[key])}`;
      });
      console.log("Constructed API URL:", url);
      const response = await HttpClient.get(url);
      console.log("API Response:", response); 
      const { products } = response; 
      setAllProducts(products);

      console.log("theproducts",allProducts)
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  //   const updateQueryParams = (newParams) => {
  //     const params = new URLSearchParams(searchParams);
  //     Object.keys(newParams).forEach((key) => {
  //       if (newParams[key] === undefined || newParams[key] === null) {
  //         params.delete(key);
  //       } else {
  //         params.set(key, newParams[key]);
  //       }
  //     });
  //     setSearchParams(params);
  //   };

  const addToCart = async (productDetails) => {
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
      });
      toast.success(message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

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
      toast.success(message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, [query]);
  //   useEffect(() => {
  //   if (allProducts.length > 0) {
  //     console.log("Updated products:", allProducts);
  //   }
  // }, [allProducts]);

  useEffect(() => {
    setQuery(Object.fromEntries(searchParams.entries()));
  }, [searchParams]);

  //code for filters
  // const newArray =allProducts
  
//   const appliedFilters = allProducts.filter(products =>{
    
//     const matchColor =!selectedColor || products.colors.some(colorObj => colorObj.colorCode === selectedColor);
      
//     const matchSize =!selectedSize || products.sizes.some(objSize => objSize.size === selectedSize);
// //  console.log('colormatch',matchColor)
// //  console.log("allProducts",allProducts)
// //  console.log("applied filter",appliedFilters)
// const matchesPrice =
// products.price >= minValue && products.price <= maxValue;

// const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(products.group?.toLowerCase());

//  return matchColor && matchSize  && matchesPrice && matchesCategory;
//   })
 

  const handleColorChange =(event)=>{

    const selectedColor = event.target.value
    setSelectedColor(selectedColor)
  }
 
  const handleSizeChange =(event)=>{

    const selectedSize = event.target.value
    setSelectedColor(selectedColor)
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
  function toggleCategorySelector(){
    setIsOpenCategory(!isOpenCategory)
  }
  const handlecategorychange = (category) => {
    setSelectedCategories(prevCategories =>
      prevCategories.includes(category)
        ? prevCategories.filter(cat => cat !== category)
        : [...prevCategories, category])
  }

  return (
    <section className="px-10 sm:px-20 py-7 font-[Quicksand]">
      <h2 className="font-[Quicksand] text-c
      enter text-[#011F4B] mt-4 text-lg  font-bold md:text-4xl mb-3">
        WESTERN WEAR
      </h2>
      <div className="hidden sm:flex items-center  sm:gap-9 mb-4 font-[Poppins]">
        <p className="text-[#515151] font-medium text-lg flex gap-2 items-center">
          {/* Color <LiaAngleDownSolid /> */}
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
        
        {isOpened &&(
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
                <Link to="">
                  Color <LiaAngleDownSolid className="inline" />
                  
                </Link>
              </li>
              <li className="text-[#515151] font-[Poppins] cursor-pointer mb-5">
                <Link to="">
                  Size <LiaAngleDownSolid className="inline" />
                </Link>
              </li>
              <li className="text-[#515151] font-[Poppins] cursor-pointer mb-5">
                <Link to="">
                  Pattern <LiaAngleDownSolid className="inline" />
                </Link>
              </li>
              <li className="text-[#515151] font-[Poppins] cursor-pointer mb-5">
                <Link to="">
                  Fit <LiaAngleDownSolid className="inline" />
                </Link>
              </li>
            </ul>
          </div>
        </section>
      )}

      <div className="grid sm:grid-cols-3 gap-5 font-[Quicksand] z-5">
        {allProducts.length ? (
         allProducts.map((product, i) => {
            return (
              <div key={i}>
                <div className="relative">
                  <Link to={`/product-details/${product.productId}`}>
                    <img
                      loading="lazy"
                      src={product?.bannerImage}
                      alt={product?.name}
                      className="w-full h-[450px] rounded-lg"
                    />
                  </Link>
                  <button
                    onClick={() =>
                      isLoggedIn()
                        ? addToCart(product)
                        : toast.error("Please Login First")
                    }
                    className="absolute flex justify-center items-center w-[40px] h-[40px] bg-[white] text-[#515151] rounded-full bottom-[10px] right-[10px] text-xl"
                  >
                    <MdOutlineShoppingBag />
                  </button>
                </div>
                <div className="flex justify-between items-center text-[#515151] text-lg">
                  <Link to={`/product-details/${product.productId}`}>
                    <p className="mt-2">{product?.name}</p>{" "}
                  </Link>
                  <p className="flex gap-4">
                    <button
                      onClick={() => {
                        alert(
                          `${window.location.host}/product-details/${product.productId}`
                        );
                      }}
                    >
                      <RiShareForwardLine />
                    </button>
                    <button
                      onClick={() =>
                        isLoggedIn()
                          ? addToWishlist(product)
                          : toast.error("Please Login First")
                      }
                    >
                      <CiHeart />
                    </button>
                  </p>
                </div>
                {/* <p className="text-[#515151] text-lg">
                  <span>
                    <PiCurrencyInr/>
                  </span>
                  {product?.price}
                </p> */}
                <p className="flex items-center text-[#515151] font-medium mb-2">
                  <span></span>
                  <PiCurrencyInr />
                  <span>
                    {Math.floor(
                      product.price - (product.discount / 100) * product.price
                    )}
                  </span>
                  {product.discount ? (
                    <span className="ml-2 line-through text-xs flex items-center">
                      <PiCurrencyInr /> {product.price}
                    </span>
                  ) : (
                    ""
                  )}
                </p>
              </div>
            );
          })
        ) : (
          <h2>No Products Available</h2>
        )}
      </div>
      <button className="font-[Quicksand] font-medium text-xl text-[#011F4B] border-[#011F4B] rounded-[3px] bg-white block m-auto py-[5px] px-5 border-2 border-solid mt-4">
        LOAD MORE
      </button>
    </section>
  );
}
