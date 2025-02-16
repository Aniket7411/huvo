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
import { ProductContext } from "../../usecontext1/cartcontext";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaBars, FaTimes } from "react-icons/fa";




const loginStatus = localStorage.getItem("role")

console.log("loginStatus", loginStatus)


export default function Header(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { products } = useContext(ProductContext);

  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };


  const { pathname } = location;
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

  const getWishList = async () => {
    try {
      const response = await HttpClient.get("/wishlist/")

      const wishListLength = Object.keys(response.data).length;

      setWishListItems(wishListLength)

    } catch (error) {
      console.log(error.message)
    }
  }


  useEffect(() => {
    getWishList()
  }, [])


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
      const { message } = await HttpClient.post("/users/logout");
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
  const className =
    (!pathInclude ? "bg-[#011f4b] text-white" : "bg-transparent absolute") +
    " w-full font-semibold text-[#515151]  z-10";


  const fetchSuggestions = async (searchword) => {
    try {
      const response = await HttpClient.get(`/search/?q=${searchword}`)
        ;

      setSearchResult(response.results);
      console.log(response.results)
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };



  const numberOfCartItems = products.length

  console.log(numberOfCartItems)

  // const debouncedFetchSuggestions = debounce((query) => {
  //   if (query.trim()) {
  //     fetchSuggestions(query);
  //   } else {
  //     setSearchResult([]);
  //   }
  // }, 300);


  const handleInputChange = (e) => {
    console.log("testing")
    const query = e.target.value;
    setSearchQuery(query);
    console.log("Search Query:", query);
    // debouncedFetchSuggestions(query); // Trigger search suggestion
    console.log("testing 2")
    if (query.trim()) {
      fetchSuggestions(query);
    } else {
      setSearchResult([]);
    }
  };


  const handleSearch = async (searchword) => {
    if (searchQuery.trim()) {

      try {

        const response = await HttpClient.get(`/search/result?q=${searchword}`);
        console.log('API Response:', response);
        const productId = response?.product?.productId
          ;
        console.log(productId)
        if (productId) {

          navigate(`/product-details/${productId}`);
        } else {
          console.error('Product ID not found in response');
        }
      } catch (error) {
        console.error('Error fetching search result:', error);
      }
    }
  };


  const handleKeyInput = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };


  const handleSuggestionClick = async (suggestion) => {
    const suggestionName = suggestion;
    setSearchQuery(suggestion);
    setSearchResult([]);

    await handleSearch(suggestionName);

  }

  return (
    <>
      <header className={className}>
        <div className="hidden md:flex items-center bg-[#fff] text-[#2563AB] px-8 py-2 justify-between">
          <Link to="/" >
            <img src="/assets/newlogo.jpeg" alt="Logo" className="h-[30px]  hidden md:block rounded-xl" />
          </Link>


          <ul className="flex gap-5 text-[#2563AB]">
            <Link to="/">
              <li className="font-[Poppins] cursor-pointer hover:text-[#f0c040] hover:underline transition-all duration-300">
                Home
              </li>
            </Link>

            <Link to="/men-collection">
              <li className="font-[Poppins] cursor-pointer hover:text-[#f0c040] hover:underline transition-all duration-300">
                Men
              </li>
            </Link>
            <Link to="/women-collection">
              <li className="font-[Poppins] cursor-pointer hover:text-[#f0c040] hover:underline transition-all duration-300">
                Women
              </li>
            </Link>
            <Link to="/kids-collection">
              <li className="font-[Poppins] cursor-pointer hover:text-[#f0c040] hover:underline transition-all duration-300">
                Kids
              </li>
            </Link>
          </ul>

          <div className="flex items-center gap-3">
            <div className=" flex items-center justify-between rounded-full  bg-[#E7EFFA]  px-2 py-3  searchBtn">
              <button
                className="mr-5"
                onClick={handleSearch}
              >
                <CiSearch className="text-[#000000]" />
              </button>
              <input
                placeholder="Search"
                className="border-0 w-full gap-10 outline-none  bg-[#E7EFFA]"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyUp={handleKeyInput}

              >
              </input>
              {searchResult.length > 0 && (
                <ul className="absolute top-20 left-100 w-40 bg-white border rounded-lg mt-2 z-50 max-h-48 overflow-auto shadow-lg">
                  {searchResult.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
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
              onClick={() =>
                isLoggedIn()
                  ? navigate("/checkout/cart")
                  : toast.error("Please Login First")
              }
              className="relative flex items-center justify-center p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition"
            >
              {/* Shopping Bag Icon */}
              <HiOutlineShoppingBag className="text-2xl text-white cursor-pointer" />

              {/* Cart Item Count */}
              {numberOfCartItems > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {numberOfCartItems}
                </span>
              )}
            </button>



            {
              loginStatus === null ?

                <Link to="/login">
                  <p className="p-2   text-blue-600 cursor-pointer">Login</p>
                </Link> : <div
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button>
                    <FaRegUser className="text-lg cursor-pointer" />
                  </button>
                  {dropdownOpen && (
                    <div
                      className={`absolute top-12 right-0 w-40 bg-[#fff]  shadow-lg rounded-lg border p-2 
                      transform transition-all duration-300 ease-in-out ${dropdownOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                        }`}
                    >

                      <ul className="text-[#000] ">
                        <Link to="/profile">
                          <li className="p-2 hover:bg-gray-100 cursor-pointer">My Profile</li>
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
          {/* Hamburger Icon */}
          <GiHamburgerMenu
            onClick={() => openSubmenu()}
            style={{
              position: "fixed",
              top: "16px",
              left: "16px",
              zIndex: 50,
              padding: "8px",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "24px",
            }}

          />





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
          <IoReorderThree onClick={() => openSubmenu()} className="text-3xl cursor-pointer" />

          <div className="flex gap-3 justify-between items-center cursor-pointer">
            {/* <MdOutlineShoppingBag />
            <CiSearch />
            <FaRegUser onClick={() => SetdropdownContent(true)} /> */}
            <button
              onClick={() =>
                isLoggedIn()
                  ? navigate("/wishlist")
                  : toast.error("Please Login First")
              }
            >
              <FiHeart className="text-xl cursor-pointer" />
            </button>
            <button
              onClick={() =>
                isLoggedIn()
                  ? navigate("/checkout/cart")
                  : toast.error("Please Login First")
              }
            >
              <HiOutlineShoppingBag className="text-xl cursor-pointer" />
            </button>
            {/* <FaRegUser
                onClick={() => SetdropdownContent(!dropdownContent)}
                className="text-lg cursor-pointer"
              /> */}
            <button
              onClick={() =>
                isLoggedIn()
                  ? navigate("/profile")
                  : SetdropdownContent(!dropdownContent)
              }
            >
              <FaRegUser className="text-lg cursor-pointer" />
            </button>
          </div>
        </div>
      </header >
      {isSubmenu && (
        // tab nabbar
        <section>
          <div className="block md:hidden z-10 text-[blue] bg-[#fff] fixed sm:w-[50%] w-[100%] p-5 top-0 h-full right-0">
            <div className="flex justify-between items-center">
              <div className="mb-5">
                {/* <img src="assets/newlogo.jpeg" alt="logo" /> */}
                <img src="/assets/newlogo.jpeg" className="w-[30px]" alt="logo" />

              </div>
              <button className="text-black " onClick={() => closeSubmenu()}>
                <RxCross2 />
              </button>
            </div>
            <ul className="text-[#56B6E6] font-semibold">
              <li
                onClick={() => closeSubmenu()}
                className=" cursor-pointer mb-5"
              >
                <Link to="/">Homee</Link>
              </li>

              <li
                onClick={() => closeSubmenu()}
                className=" cursor-pointer mb-5"
              >
                <Link to="/men-collection">Men</Link>
              </li>
              <li
                onClick={() => closeSubmenu()}
                className=" cursor-pointer mb-5"
              >
                <Link to="/women-collection">Women</Link>
              </li>
              <li
                onClick={() => closeSubmenu()}
                className="cursor-pointer mb-5"
              >
                <Link to="/kids-collection">Kids</Link>
              </li>
              {/* <li
                onClick={() => closeSubmenu()}
                className="text-[#515151] cursor-pointer mb-3"
              >
                <Link to="/brands">Brands</Link>
              </li> */}
            </ul>
          </div>
        </section>
      )
      }
    </>
  );
}
