import React, { useContext, useEffect, useState } from "react";
import { PiCurrencyInr } from "react-icons/pi";
import { Oval } from "react-loader-spinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { FaShare } from "react-icons/fa";
import { TbJewishStarFilled, TbStarFilled } from "react-icons/tb";
import Modal from "react-modal";
import { CiDeliveryTruck, CiSquareMinus, CiSquarePlus, CiStar } from "react-icons/ci";
import SimilarProducts from "./similarcategoryproducts";
import ProductImages from "../productimages";
import { IoClose } from "react-icons/io5";
import { CartContext } from "../../usecontext1/cartcontext";
import ProductReview from "../newproduct";
import Loader from "../../components/loader";
import WomenCollection from "../women";
// import { CartContext } from "../../usecontext1/cartcontext";

const isLoggedIn = localStorage.getItem("accessToken")
export default function ProductDetails() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSizeModal, setIsSizeModal] = useState(false)
  const { addToCartContext, updateCartItem, fetchServerData } = useContext(CartContext)




  const openPaymentModal = () => {
    setIsPaymentModalOpen(true);
    // Prevent scrolling on the background
    document.body.style.overflow = "hidden";
  };
  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    // Restore scrolling on the background
    document.body.style.overflow = "auto";
  };
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [recommended, setRecommended] = useState()
  // const { cart, addToCartContext, removeFromCartContext } = useContext(CartContext);
  const [selectedQuantity, setQuantity] = useState(1); // Track the quantity, default to 1
  const [selectedSize, setSelectedSize] = useState(null); // Track selected size
  const [projectObjectId, setProjectObjectId] = useState()
  const [rating, setRating] = useState(0); // State to track the selected star rating

  const [price, setPrice] = useState()




  const [isModalOpen, setIsModalOpen] = useState(false);


  const navigate = useNavigate();






  const getProductDetails = async () => {
    setLoading(true);
    try {
      const data = { productId: id };
      const response = await HttpClient.get("/product/productId", data);



      setRecommended(response)
      setPrice(response.product.price)
      setProductDetails(response.product)

      setProjectObjectId(response.product._id)
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, [id]);


  const tokenIfLoggedIn = localStorage.getItem("accessToken")










  const addToCart = async (productDetails, selectedSize, selectedQuantity) => {
    if (!selectedSize) {
      toast.warn("Please select a size");
      return;
    }
    console.log("isLoggedInisLoggedIn", isLoggedIn)
    if (tokenIfLoggedIn === null) {
      addToCartContext(productDetails, selectedSize, selectedQuantity);
      return;
    } else {
      const cartData = {
        productId: productDetails?.productId,
        color: productDetails?.colors?.[0]?.colorCode || "Default Color", // Handle missing color
        size: selectedSize,
        price: selectedQuantity * productDetails?.price,
        discount: selectedQuantity * productDetails?.price - selectedQuantity * productDetails?.discount,
        quantity: selectedQuantity
      };

      try {

        setLoading(true)

        const response = await HttpClient.post("/cart/", cartData);




        if (response?.success === true) {
          setLoading(false)
          toast.success("Product added to cart successfully.");
          fetchServerData()

        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "An error occurred while adding to the cart.");
        setLoading(false)
      }
    }


  };


  // const removeProductFromCart = (productId) => {
  //   removeFromCartContext(productId)
  // };

  const updateQuantity = async (productId, addRemove) => {
    console.log("Product:", productId, "| Action:", addRemove);

    if (!productId || !addRemove) {
      console.error("Invalid input");
      return;
    }

    if (isLoggedIn === null) {
      // Guest user - update cart locally
      updateCartItem(productId, addRemove);
    } else {
      // Logged-in user - update via API
      try {
        const response = await HttpClient.put(`/cart/update`, {
          productId,
          action: addRemove,
        });

        console.log("Cart updated:", response?.data);
        // Optional: show a toast or refresh cart
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    }
  };



  const removeFromCart = async (productDetails) => {
    const { productId } = productDetails

    const dataToRemove = productId + selectedSize + "red"



    try {
      const response = await HttpClient.put(`/cart/remove`, { "productIdName": dataToRemove })

    } catch (error) {

    }
  }

  const addToWishlist = async (productDetails) => {
    if (tokenIfLoggedIn === null) {
      toast.error("Please login First")
    }
    else {
      const { productId } = productDetails

      if (selectedSize === null) {
        toast.warn("Please select a size")
      } else {
        const wishlistData = {
          productId: productId,
          size: selectedSize,
          color: "red",
        }
        try {
          const response = await HttpClient.post("/wishlist/", wishlistData)
          getProductDetails()
          if (response?.success) {
            toast.success(response?.message)
          }
        } catch (error) {
          toast.error(error.message)

        }
      }


    }

  };


  const scrollToReview = () => {
    const reviewSection = document.getElementById('review');
    if (reviewSection) {
      reviewSection.scrollIntoView({ behavior: 'smooth' });
    }
  };





  const quantityInCart = () => {
    toast.info("First select the size and add product in cart")
  }


  console.log("responseresponseresponse", productDetails)
  return (

    <>

      {
        loading ? <div className="h-screen flex justify-center items-center">

          <Loader />
        </div> :

          <div className="p-3 mt-5 md:mt-5 md:p-8">
            <div className="flex flex-wrap gap-2 ">
              <div className="flex-1 min-w-[300px] max-w-[350px]">
                <div className="p-1 rounded-md border border-gray-300 ">
                  <ProductImages images={productDetails?.colors} bannerImage={productDetails?.bannerImage} />

                </div>
              </div>

              <div className="flex-1 w-auto">
                <div className="flex items-center gap-2 ">
                  <h1 className="text-2xl  font-inter md:text-xl lg:text-2xl font-semibold text-[#2563eb] ">
                    Product Name : {productDetails?.name}
                  </h1>

                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex flex-col sm:flex-row sm:gap-4 gap-2">



                    <div className="flex gap-2 items-center">
                      <div
                        className={`px-2 py-1 flex items-center rounded-md gap-1 text-white ${4.5 >= 3.5
                          ? "bg-green-500"
                          : 4.5 >= 3
                            ? "bg-yellow-500"
                            : "bg-red-400"
                          }`}
                      >
                        {
                          productDetails?.totalRating >= 50 ?
                            productDetails?.avgRating : "New"
                        }
                        <TbJewishStarFilled className="text-sm" />
                      </div>
                      <p className="text-[#717478] cursor-pointer font-semibold text-sm">Product Rating & Reviews</p>
                    </div>



                    <div className="flex gap-2 items-center">
                      <div
                        className={`px-2 py-1 flex items-center rounded-md gap-1 text-white ${4.5 >= 3.5
                          ? "bg-green-500"
                          : 4.5 >= 3
                            ? "bg-yellow-500"
                            : "bg-red-400"
                          }`}
                      >
                        <p className="text-sm font-bold">
                          {
                            productDetails?.totalRating >= 50 ?
                              productDetails?.avgRating : "New"
                          }
                        </p>
                        {productDetails?.totalRating >= 50 && (
                          <div className="flex">
                            {[...Array(productDetails?.avgRating || 0)].map((_, index) => (
                              <TbJewishStarFilled key={index} className="text-sm text-yellow-400" />
                            ))}
                          </div>
                        )}

                      </div>

                      <Link to={`/store_product/${productDetails?.seller}`} >
                        <p className="text-[#717478] hover:underline hover:text-blue-500 font-semibold text-sm">Brand Rating</p>
                      </Link>
                    </div>

                  </div>

                  <div>

                    <p className="text-lg font-medium text-gray-600">
                      Brand:{" "}
                      <Link to={`/products_by_brand&seller/${productDetails?.brand?.name || "default"}`} >

                        <span className="text-gray-800 font-semibold">
                          {productDetails?.brand?.name || "Unknown"}
                        </span>
                      </Link>

                    </p>
                  </div>
                </div>


                <p className="text-gray-700 mb-1">Product description: {productDetails?.productDetails}</p>


                {/* Product Info Container */}
                <div className="bg-white rounded-lg   w-full">
                  {/* Pricing Section */}
                  <p className="flex flex-wrap items-center text-lg font-semibold text-gray-800">
                    {/* Original Price */}
                    <span className="line-through text-gray-500  flex items-center">
                      <PiCurrencyInr className="mr-1" /> {productDetails?.actualPrice * selectedQuantity}
                    </span>


                    {/* Discount Amount */}
                    <span className="text-sm mr-2 text-gray-500 ml-2 flex items-center"> -
                      (<PiCurrencyInr className="mr-1" />{productDetails?.discount * selectedQuantity})
                    </span>

                    {/* Discounted Price */}
                    <span className="text-green-500 flex items-center text-xl font-bold">
                      <PiCurrencyInr className="mr-1" />
                      {productDetails?.actualPrice * selectedQuantity - productDetails?.discount * selectedQuantity}
                    </span>


                  </p>

                  {/* Material & Care Section */}
                  <p className="text-gray-600 font-medium mt-1">Material & Care:</p>
                  <p className="text-gray-700">{productDetails?.materialAndCare}</p>

                  {/* Returnable Info */}
                  <p className="mb-1 mt-1 font-semibold text-gray-800">
                    Returnable:{" "}
                    <span
                      className={`font-bold ${productDetails?.isReturnable ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {productDetails?.isReturnable ? "Yes" : "No"}
                    </span>
                  </p>

                  {/* Sizes Section */}
                  <div className="mt-1 mb-1">
                    <p className="text-gray-600 font-medium">Sizes Available: <span onClick={() => setIsSizeModal(true)} className="text-blue-500 text-sm underline cursor-pointer ">Size Chart</span></p>
                    <div className="flex flex-wrap gap-3 mt-1">
                      {productDetails?.sizes?.length > 0 ? (
                        productDetails.sizes.map((sizeObj, index) => (
                          <span
                            key={index}
                            onClick={() => {
                              setSelectedSize(sizeObj.size);
                              console.log(`Size selected: ${sizeObj.size}`);
                            }}
                            className={`px-3 py-1 border rounded-md text-sm font-medium cursor-pointer transition-all duration-200 shadow-sm
                  ${selectedSize === sizeObj.size
                                ? "bg-green-500 text-white border-green-600 shadow-md"
                                : "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 hover:scale-105"
                              }`}
                            role="button"
                            tabIndex={0}
                            aria-label={`Select size ${sizeObj.size}`}
                          >
                            {sizeObj.size}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No sizes available (Out of stock)</p>
                      )}
                    </div>
                  </div>
                </div>

                <Modal
                  isOpen={isSizeModal}
                  className="fixed inset-0 flex items-center justify-center p-4"
                  overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                >
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-5 relative">
                    {/* Close Button */}
                    <button
                      onClick={() => setIsSizeModal(false)}
                      className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                    >
                      <IoClose size={24} />
                    </button>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                      Size Chart
                    </h2>

                    {/* Size Chart Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">Size</th>
                            <th className="border border-gray-300 px-4 py-2">Chest (in)</th>
                            <th className="border border-gray-300 px-4 py-2">Waist (in)</th>
                            <th className="border border-gray-300 px-4 py-2">Hip (in)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { size: "S", chest: "34-36", waist: "28-30", hip: "34-36" },
                            { size: "M", chest: "38-40", waist: "32-34", hip: "38-40" },
                            { size: "L", chest: "42-44", waist: "36-38", hip: "42-44" },
                            { size: "XL", chest: "46-48", waist: "40-42", hip: "46-48" },
                          ].map((row, index) => (
                            <tr key={index} className="text-center">
                              <td className="border border-gray-300 px-4 py-2">
                                {row.size}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                {row.chest}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                {row.waist}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">{row.hip}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Close Button */}
                    <div className="flex justify-center mt-4">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        onClick={() => setIsSizeModal(false)}

                      >
                        Close
                      </button>
                    </div>
                  </div>
                </Modal>
                <div
                  key={productDetails?.productId}
                  className="flex items-center gap-4 mt-2 rounded-xl"
                >
                  {/* Decrement Button */}
                  <button
                    onClick={() => setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1))}
                    disabled={selectedQuantity === 1}
                    className={`text-2xl text-purple-700 hover:scale-110 transition-transform duration-200 
              ${selectedQuantity === 1 ? "text-gray-400 cursor-not-allowed" : "hover:text-purple-900"}`}
                  >
                    <CiSquareMinus />
                  </button>

                  {/* Quantity Display */}
                  <p className="text-lg font-semibold text-gray-800">
                    Quantity: <span className="text-purple-600">{selectedQuantity}</span>
                  </p>

                  {/* Increment Button */}
                  <button
                    onClick={() => setQuantity(selectedQuantity + 1)}
                    className="text-2xl text-purple-700 hover:text-purple-900 hover:scale-110 transition-transform duration-200"
                  >
                    <CiSquarePlus />
                  </button>
                </div>




                {/* Buttons & Delivery Section */}
                <div className="flex flex-col gap-3">
                  <div className="flex mt-2 flex-wrap items-center gap-2">
                    {/* Add to Wishlist Button */}


                    <button
                      key={productDetails?.productId}
                      onClick={() => addToWishlist(productDetails, selectedSize)}
                      className="px-3 py-1 bg-[#011F4B] text-white font-semibold rounded-lg shadow-md hover:bg-[#022C6B] transition-all duration-200 transform hover:scale-105"
                    >
                      Add to Wishlist
                    </button>
                    <button
                      onClick={() => addToCart(productDetails, selectedSize, selectedQuantity)}
                      className="px-3 py-1 bg-[#011F4B] text-white font-semibold rounded-lg shadow-md hover:bg-[#022C6B] transition-transform duration-200 transform hover:scale-105"
                    >
                      Add to Cart
                    </button>


                  </div>

                  {/* <div className="flex items-center gap-2 mt-1 text-gray-800"> */}
                  {/* <CiDeliveryTruck size={30} className="text-gray-600" /> */}
                  {/* <p className="font-semibold">Free delivery</p> */}
                  {/* </div> */}
                </div>

                <p className="text-[#2562eb] mt-1 font-semibold">
                  <p onClick={openPaymentModal} className="hover:underline cursor-pointer">
                    View Payment Options
                  </p>
                </p>




                <Modal
                  isOpen={isPaymentModalOpen}
                  onRequestClose={closePaymentModal}
                  contentLabel="Payment Methods"
                  className="bg-white h-auto rounded-2xl shadow-xl max-w-md mx-auto p-6 relative"
                  overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Select a Payment Method
                  </h2>
                  <ul className="space-y-3">
                    <li className="text-gray-600 hover:text-gray-800 cursor-pointer">
                      Credit/Debit Card
                    </li>
                    <li className="text-gray-600 hover:text-gray-800 cursor-pointer">
                      Net Banking
                    </li>
                    <li className="text-gray-600 hover:text-gray-800 cursor-pointer">UPI</li>
                    <li className="text-gray-600 hover:text-gray-800 cursor-pointer">
                      Cash on Delivery
                    </li>
                    <li className="text-gray-600 hover:text-gray-800 cursor-pointer">PayPal</li>
                  </ul>
                  <button
                    onClick={closePaymentModal}
                    className="mt-6 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    Close
                  </button>
                </Modal>







              </div>


              <ProductReview productId={productDetails?.productId} />



            </div>
            <SimilarProducts recommended={recommended} />

          </div>
      }


    </>

  );
}
