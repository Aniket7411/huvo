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
import { CiLogin, CiSearch } from "react-icons/ci";
import { FaBars, FaTimes } from "react-icons/fa";
import { CartContext } from "../../usecontext1/cartcontext";
import Loader from "../loader";
import { motion } from "framer-motion";
import { IoIosLogOut } from "react-icons/io";




let loginStatus = 0;




export default function Header(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, } = useContext(CartContext)

  const cartLength = Object?.keys(cart).length;

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
    if (localStorage?.getItem("accessToken")) {
      loginStatus = 1;
      getWishList();
    }
  }, []);




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
      const response = await HttpClient.get("/search/finalSearch", { search: searchword, searchType: category });
      if (response.success) {
        setSearchResult(response.data);

      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };



  const numberOfCartItems = 0

  const localCartItem = localStorage?.getItem("cart");


  const parsedCart = JSON.parse(localCartItem);


  const localCount = Object?.keys(parsedCart).length;




  console.log("loginStatusloginStatusloginStatusloginStatus", loginStatus)




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
              {/* <option value="category_search">Category</option> */}
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
                {Object?.keys(localCount).length > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {Object?.keys(localCount).length}
                  </span>
                )}</> : <>
                {Object?.keys(cart).length > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {Object?.keys(cart).length}
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
                    className={`absolute  top-12 right-0 w-40 bg-[#fff]  shadow-lg rounded-lg border p-2 
                      transform transition-all duration-300 ease-in-out ${dropdownOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                      }`}
                  >

                    <ul className="text-[#000] text-md font-sans ">
                      <Link to="/profile">
                        <li className="p-2 hover:bg-gray-100 cursor-pointer">My Profile</li>
                      </Link>
                      <Link to="/seller">
                        {
                          localStorage?.getItem("role") === "SELLER" && <li className="p-2  hover:bg-gray-100 cursor-pointer">Product Dashboard</li>

                        }
                      </Link>
                      <Link to="/admin">
                        {
                          localStorage?.getItem("role") === "ADMIN" && <li className="p-2  hover:bg-gray-100 cursor-pointer">Admin Dashboard</li>

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





      {dropdownContent && (
        <ul className="bg-white w-[200px] shadow-lg p-4 absolute top-15 right-5 rounded-md">
          {isLoggedIn() ? (
            <>
              {["Orders", "Wishlist", "Contact Us", "Coupons", "Saved Cards", "Saved Addresses"].map(
                (item, index) => (
                  <li
                    key={index}
                    className="font-[Poppins] text-[#333] font-medium cursor-pointer hover:text-[#007bff] transition duration-200 mb-2 last:mb-0"
                  >
                    {item}
                  </li>
                )
              )}
              <Link to="/profile" onClick={() => SetdropdownContent(false)}>
                <li className="font-[Poppins] text-[#333] font-medium cursor-pointer hover:text-[#007bff] transition duration-200">
                  Edit Profile
                </li>
              </Link>
              <li
                onClick={() => logout()}
                className="font-[Poppins] text-[#333] font-medium cursor-pointer hover:text-[#ff4d4f] transition duration-200"
              >
                Logout
              </li>
            </>
          ) : (
            <>
              <Link to="/login">
                <li className="font-[Poppins] text-[red] font-medium cursor-pointer hover:text-[#007bff] transition duration-200">
                  Login
                </li>
              </Link>
            </>
          )}
        </ul>
      )}

      <div
        className="flex md:hidden p-3 text-[#011F4B] items-center justify-between"
        style={{
          backgroundImage: "linear-gradient(to right, #007bff, #fff)",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Left Section */}
        <div className="flex items-center  gap-3 ">
          <IoReorderThree
            size={38}
            className="text-3xl cursor-pointer "
            onClick={() => openSubmenu()}
          />
          <img
            src="/assets/favicon.svg"
            alt="logo"
            className="w-[30px] bg-[#fff] rounded-full shadow-md"
          />
        </div>

        {/* Center Section */}
        <p className="font-bold text-white text-2xl tracking-wide drop-shadow-md" style={{ fontFamily: "'Caveat', cursive" }}>
          Huvo
        </p>


        {/* Right Section */}
        <div className="flex gap-3  items-center relative">
          {/* Wishlist Button */}
          <button
            aria-label="Wishlist"
            onClick={() =>
              isLoggedIn() ? navigate("/wishlist") : toast.error("Please Login First")
            }
            className="relative"
          >
            <FiHeart size={25} className="text-xl cursor-pointer hover:scale-110 transition duration-200" />
            {wishListItems > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full shadow">
                {wishListItems}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button aria-label="Cart" className="relative">
            <HiOutlineShoppingBag
              size={25}
              onClick={() => {
                if (loginStatus === 0) {
                  navigate("/checkout/cart/not_login");
                } else {
                  navigate("/checkout/cart");
                }
              }}
              className="text-2xl  cursor-pointer hover:scale-110 transition duration-200"
            />
            {Object?.keys(cart)?.length > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 bg-[#007bff] text-white text-xs font-bold rounded-full shadow">
                {Object?.keys(cart).length}
              </span>
            )}
          </button>

          {/* User Profile Button */}


          {
            isLoggedIn() ? <Link to="/profile"><FaRegUser size={25} /></Link> : <Link to="/login"> Login </Link>
          }
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
          {/* <option value="category_search">Category</option> */}
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
        <section>
          <div className="block md:hidden z-20 text-[#fff] bg-blue-500 fixed sm:w-[70%] w-full p-6 top-0 right-0 shadow-lg">
            {/* Navbar Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <Link to="/">
                  <p className="font-bold text-white text-3xl tracking-wide drop-shadow-md" style={{ fontFamily: "'Caveat', cursive" }}>
                    Huvo
                  </p>
                </Link>
              </div>
              <button
                className="text-black text-xl"
                onClick={() => closeSubmenu()}
              >
                <RxCross2 />
              </button>
            </div>

            {/* Navigation Links */}
            <ul className=" font-medium space-y-3">
              <li onClick={closeSubmenu} className="cursor-pointer">
                <Link
                  to="/men-collection"
                  className="hover:text-blue-800 transition duration-300"
                >
                  Men
                </Link>
              </li>
              <li onClick={closeSubmenu} className="cursor-pointer">
                <Link
                  to="/women-collection"
                  className="hover:text-blue-800 transition duration-300"
                >
                  Women
                </Link>
              </li>
              <li onClick={closeSubmenu} className="cursor-pointer">
                <Link
                  to="/kids-collection"
                  className="hover:text-blue-800 transition duration-300"
                >
                  Kids
                </Link>
              </li>
              <li onClick={closeSubmenu} className="cursor-pointer">
                <Link
                  to="/contact-us"
                  className="hover:text-blue-800 transition duration-300"
                >
                  Contact Us
                </Link>
              </li>

              {
                isLoggedIn() && <li onClick={clickToLogout} className="cursor-pointer flex items-center gap-2">
                  <p

                    className="hover:text-blue-800 transition duration-300"
                  >
                    Logout

                  </p>
                  <IoIosLogOut />
                </li>
              }


            </ul>



          </div>
        </section>
      )}


    </>
  );
}
