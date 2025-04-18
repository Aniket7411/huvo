import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { IoReorderThree } from "react-icons/io5";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FiHeart } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { LogOut, isLoggedIn } from "../../server/user";
import { toast } from "react-toastify";
import { HttpClient } from "../../server/client/http";
import { CiSearch } from "react-icons/ci";
import { FaBars, FaTimes } from "react-icons/fa";
import { CartContext } from "../../usecontext1/cartcontext";
import Loader from "../loader";
import { motion } from "framer-motion";




let loginStatus = 0;




export default function Header(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, } = useContext(CartContext)

  const cartLength = Object.keys(cart).length;

  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };


  const { pathname } = location;
  const [loading, setLoading] = useState(false);
  const pathInclude = pathname === '/men-collection' || pathname === '/women-collection' || pathname === '/kids-collection' || pathname === '/'
  const [isSubmenu, setisSubmenu] = useState(false);
  const [dropdownContent, SetdropdownContent] = useState(false);
  //search barch functionlatiy
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState("")
  const seller = { role: 'seller' }
  const user = { role: 'user' }
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hideTimeoutRef = useRef(null);
  const [wishListItems, setWishListItems] = useState()
  const [category, setCategory] = useState("product_search")





  const getWishList = async () => {
    try {
      const response = await HttpClient.get("/wishlist/")

      const wishListLength = Object?.keys(response?.data)?.length;

      setWishListItems(wishListLength)

    } catch (error) {
      console.log(error?.message)
    }
  }


  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      loginStatus = 1;
    }

    getWishList()
  }, [])



  const handleCategoryChange = (type, event) => {
    const category = event.target.value;
    if (category) {
      navigate(`/${type}-collection/${category}`);
      closeSubmenu();
    }
  };

  const handleMouseEnter = () => {
    // Clear any existing hide timeout
    clearTimeout(hideTimeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    // Set a timeout to hide the dropdown after 3 seconds
    hideTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 3000); // 3-second delay
  };


  const clickToLogout = async () => {
    try {

      setLoading(true);
      const { message } = await HttpClient.post("/users/logout");
      setLoading(false);
      toast.success(message);
      navigate("/login");
      LogOut();
    } catch (error) {
      console.error(error);
    }
  };


  const closeSubmenu = () => {
    setisSubmenu(false);
    document.body.style.overflow = "scroll";
  };
  const openSubmenu = () => {
    setisSubmenu(true);
    document.body.style.overflow = "hidden";
  };
  const logout = async () => {
    try {
      const { message } = await HttpClient.post("/users/logout");
      toast.success(message);
      navigate("/login");
      LogOut();
    } catch (error) {
      console.error(error);
    }
  };


  const fetchSuggestions = async (searchword) => {

    try {
      const response = await HttpClient.get("/search/final", { search: searchword, searchType: category });
      if (response.success) {
        setSearchResult(response.data);

      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };



  const numberOfCartItems = 0

  const localCartItem = localStorage.getItem("cart");


  const parsedCart = JSON.parse(localCartItem);


  const localCount = Object.keys(parsedCart).length;









  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      fetchSuggestions(query);
    } else {
      setSearchResult([]);
    }
  };



  const handleSearch = async (searchword, id) => {


    try {

      const response = await HttpClient.get(`/search/result?q=${searchword}`);
      console.log('API Response:', response);
      const productId = response?.product?.productId
        ;
      if (productId) {

        if (category === "product_search") {
          navigate(`/products_category/${searchQuery}`);

        } else {
          navigate(`/${category}/${id}`);

        }

      } else {
        console.error('Product ID not found in response');
      }
    } catch (error) {
      console.error('Error fetching search result:', error);
    }

  };




  const handleSuggestionClick = async (suggestion, id) => {
    const suggestionName = suggestion;
    // setSearchQuery(suggestion, id);
    setSearchResult([]);

    await handleSearch(suggestionName, id);

  }

  return (
    <>
      <div style={{ fontFamily: "Caveat, cursive" }} className="hidden md:flex font-semibold items-center bg-gradient-to-l from-blue-500 to-white  px-8 py-3 justify-between">
        <Link to="/" >
          <img src="/assets/newlogo.jpeg" alt="Logo" className="h-[30px] w-[130px]  hidden md:block rounded-xl" />
        </Link>


        <ul className="flex gap-5 text-xl text-blue-700 " style={{ fontFamily: "Caveat, cursive" }}>
          <Link to="/">
            <li className="cursor-pointer hover:text-[#f0c040] hover:underline transition-all duration-300">
              Home
            </li>
          </Link>

          <Link to="/men-collection">
            <li className=" cursor-pointer hover:text-[#f0c040] hover:underline transition-all duration-300">
              Men
            </li>
          </Link>
          <Link to="/women-collection">
            <li className=" cursor-pointer hover:text-[#f0c040] hover:underline transition-all duration-300">
              Women
            </li>
          </Link>
          <Link to="/kids-collection">
            <li className=" cursor-pointer hover:text-[#f0c040] hover:underline transition-all duration-300">
              Kids
            </li>
          </Link>
        </ul>


        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-between rounded-full bg-[#E7EFFA] px-4 py-2 shadow-lg">
            {/* Search Icon Button */}
            <button
              className="text-gray-600 hover:text-gray-800 transition-colors mr-3"
              onClick={handleSearch}
              aria-label="Search"
            >
              <CiSearch className="text-xl" />
            </button>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search By Products,Categories or Brands"
              className="flex-1 text-sm placeholder-gray-500 text-gray-800 bg-transparent focus:outline-none"
              value={searchQuery}
              onChange={handleInputChange}
            // onKeyUp={handleKeyInput}
            />

            {/* Dropdown Menu */}
            <select
              className="ml-3 text-sm bg-transparent text-gray-700 border-0 focus:ring-2 focus:ring-blue-500"
              defaultValue="category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option disabled>Search by</option>
              <option value="product_search">Product</option>
              <option value="category_search">Category</option>
              <option value="store_product">Store</option>

            </select>

            {/* Search Suggestions */}
            {searchResult?.length > 0 && (
              <ul className="absolute top-full left-0 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-auto z-50">
                {searchResult?.map((suggestion) => (
                  <li
                    key={suggestion?._id}
                    className="p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion, suggestion?._id)}
                  >
                    {category === "userName" ? suggestion.username : suggestion.name}
                  </li>

                ))}
              </ul>
            )}
          </div>




          <button
            onClick={() =>
              isLoggedIn()
                ? navigate("/wishlist")
                : toast.error("Please Login First")
            }
            className="relative flex items-center justify-center p-2 bg-pink-300 rounded-full hover:bg-pink-300 transition"
          >
            {/* Heart Icon */}
            <FiHeart className="text-2xl text-white cursor-pointer" />

            {/* Wishlist Item Count */}
            {wishListItems > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full">
                {wishListItems}
              </span>
            )}
          </button>


          <button
            onClick={() => {
              if (loginStatus === 0) {
                navigate("/checkout/cart/not_login");
              } else {
                navigate("/checkout/cart");
              }
            }}

            className="relative flex items-center justify-center p-2 bg-red-600 rounded-full hover:bg-red-700 transition"
          >
            {/* Shopping Bag Icon */}
            <HiOutlineShoppingBag className="text-2xl text-white cursor-pointer" />

            {
              loginStatus === 0 ? <>
                {Object.keys(localCount).length > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {Object.keys(localCount).length}
                  </span>
                )}</> : <>
                {Object.keys(cart).length > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {Object.keys(cart).length}
                  </span>
                )}</>
            }


            {/* Cart Item Count */}
            {Object.keys(cart).length > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full">
                {Object.keys(cart).length}
              </span>
            )}
          </button>







          {
            loginStatus === 0 ?

              <Link to="/login">
                <p className="p-2   text-[#fff] text-lg cursor-pointer" >Login</p>
              </Link> : <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button>
                  <FaRegUser className="text-lg text-[#fff] cursor-pointer" />
                </button>
                {dropdownOpen && (
                  <div
                    className={`absolute top-12 right-0 w-40 bg-[#fff]  shadow-lg rounded-lg border p-2 
                      transform transition-all duration-300 ease-in-out ${dropdownOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                      }`}
                  >

                    <ul className="text-[#000] text-md ">
                      <Link to="/profile">
                        <li className="p-2 hover:bg-gray-100 cursor-pointer">My Profile</li>
                      </Link>
                      <Link to="/seller">
                        {
                          localStorage.getItem("role") === "SELLER" && <li className="p-2  hover:bg-gray-100 cursor-pointer">Product Dashboard</li>

                        }
                      </Link>
                      <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={clickToLogout}
                      >Logout</li>

                    </ul>



                  </div>
                )}
              </div>
          }


        </div>


      </div>
      





      <div className="relative " onClick={toggleNav}>





      </div>
      {dropdownContent && (
        <ul className="bg-white w-[180px] p-5 absolute top-15 right-9 rounded-md">
          {isLoggedIn() ? (
            <>
              <li className="font-[Poppins] text-[#696969] font-medium cursor-pointer">
                Orders
              </li>
              <li className="font-[Poppins] text-[#696969] font-medium cursor-pointer">
                Wishlist
              </li>
              <li className="font-[Poppins] text-[#696969] font-medium cursor-pointer">
                Contact Us
              </li>
              <li className="font-[Poppins] text-[#696969] font-medium cursor-pointer">
                Coupons
              </li>
              <li className="font-[Poppins] text-[#696969] font-medium cursor-pointer">
                Saved Cards
              </li>
              <li className="font-[Poppins] text-[#696969] font-medium cursor-pointer">
                Saved Addresses
              </li>
              <Link to="/profile" onClick={() => SetdropdownContent(false)}>
                <li className="font-[Poppins] text-[#696969] font-medium cursor-pointer">
                  Edit Profile
                </li>
              </Link>
              <li
                onClick={() => logout()}
                className="font-[Poppins] text-[#696969] font-medium cursor-pointer"
              >
                Logout
              </li>
            </>
          ) : (
            <>
              <Link to="/login">
                <li className="font-[Poppins] text-[#696969] font-medium cursor-pointer">
                  Login
                </li>
              </Link>
              {/* <Link to={{ pathname: '/register/user', state: { user } }}>
                  <li className="font-[Poppins] text-[#696969] font-medium cursor-pointer">
                    Register as user
                  </li>
                </Link>
                <Link to={{ pathname: '/register/seller', state: { seller } }}>
                  <li className="font-[Poppins] text-[#696969] font-medium cursor-pointer">
                    Register as seller
                  </li>
                </Link> */}
            </>
          )}
        </ul>
      )}




      <div className="flex md:hidden  py-2 px-4 mb-auto text-[#000] justify-between items-center" style={{
        backgroundImage: "linear-gradient(to right, #007bff, #fff)",
      }} >


        <div className="flex items-center gap-1">

          <IoReorderThree className="text-3xl cursor-pointer" onClick={() => openSubmenu()}
          />

          <img src="/assets/favicon.svg" alt="logo" className="w-[20px] bg-[#fff] rounded-full" />



        </div>


        <p className="text-[#fff] italic " style={{ fontFamily: "Caveat, cursive" }}>Huvo</p>

        <div className="flex gap-3 justify-between items-center cursor-pointer relative">
          {/* Wishlist Button */}
          <button
            aria-label="Wishlist"
            onClick={() =>
              isLoggedIn() ? navigate("/wishlist") : toast.error("Please Login First")
            }
            className="relative"
          >
            <FiHeart className="text-xl cursor-pointer" />
            {wishListItems > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full">
                {wishListItems}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            aria-label="Cart"
            className="relative"
          >
            <HiOutlineShoppingBag onClick={() => {
              if (loginStatus === 0) {
                navigate("/checkout/cart/not_login");
              } else {
                navigate("/checkout/cart")
              }
            }} className="text-2xl cursor-pointer" />
            {Object.keys(cart).length > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 bg-[#7272e9] text-white text-xs font-bold rounded-full">
                {Object.keys(cart).length}
              </span>
            )}
          </button>

          {/* User Profile Button */}
          <button
            aria-label="Profile"
            onClick={() =>
              isLoggedIn() ? navigate("/profile") : SetdropdownContent(!dropdownContent)
            }
          >
            <FaRegUser className="text-lg cursor-pointer" />
          </button>
        </div>

      </div>

      <div className="flex items-center md:hidden h-[40px]  rounded-full bg-[#E7EFFA] px-4 py-2 shadow-lg">
        {/* Search Icon Button */}
        <button
          className="text-gray-600 hover:text-gray-800 transition-colors mr-3"
          onClick={handleSearch}
          aria-label="Search"
        >
          <CiSearch className="text-xl" />
        </button>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search By Products,Categories or Brands"
          className="flex-1 text-sm placeholder-gray-500 text-gray-800 bg-transparent focus:outline-none"
          value={searchQuery}
          onChange={handleInputChange}
        // onKeyUp={handleKeyInput}
        />

        {/* Dropdown Menu */}
        <select
          className="ml-3 text-sm bg-transparent text-gray-700 border-0 focus:ring-2 focus:ring-blue-500"
          defaultValue="category"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option disabled>Search by</option>
              <option value="product_search">Product</option>
              <option value="category_search">Category</option>
              <option value="store_product">Store</option>
        </select>

        {/* Search Suggestions */}
        {searchResult?.length > 0 && (
          <ul className="absolute top-full left-0 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-auto z-50">
            {searchResult?.map((suggestion) => (
              <li
                key={suggestion?._id}
                className="p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion, suggestion?._id)}
              >
                {category === "userName" ? suggestion.username : suggestion.name}
              </li>

            ))}
          </ul>
        )}
      </div>
      {isSubmenu && (
        // tab nabbar
        <section>
          <div className="block md:hidden z-10 text-[blue] bg-[#fff] fixed sm:w-[50%] w-[100%] p-5 top-0 right-0">
            <div className="flex justify-between items-center">
              <div className="mb-3">
                {/* <img src="assets/newlogo.jpeg" alt="logo" /> */}
                <Link to="/">

                <img src="/assets/newlogo.jpeg" className="w-[50px] h-[30px]" alt="logo" />
                </Link>

              </div>
              <button className="text-black " onClick={() => closeSubmenu()}>
                <RxCross2 />
              </button>
            </div>
            <ul className="text-[#56B6E6] font-semibold">
              <li onClick={closeSubmenu} className="cursor-pointer mb-2">
              </li>

              <li onClick={closeSubmenu} className="cursor-pointer mb-2">
                <Link to="/men-collection">

                Men
                </Link>
              </li>

              <li onClick={closeSubmenu} className="cursor-pointer mb-2">
                <Link to="/women-collection">
                Women
                </Link>
              </li>

              <li onClick={closeSubmenu} className="cursor-pointer mb-2">
                <Link to="/kids-collection">
                Kids
                </Link>
              </li>

             
            </ul>
          </div>
        </section>
      )
      }

    </>
  );
}
