import React, { useContext, useEffect, useState } from "react";
import { PiCurrencyInr } from "react-icons/pi";
import { Oval } from "react-loader-spinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { FaShare } from "react-icons/fa";
import { TbJewishStarFilled, TbStarFilled } from "react-icons/tb";
import Modal from "react-modal";
import { CiDeliveryTruck, CiStar } from "react-icons/ci";
import SimilarProducts from "./similarcategoryproducts";
import ProductImages from "../productimages";
import { IoClose } from "react-icons/io5";
import { CartContext } from "../../usecontext1/cartcontext";
// import { CartContext } from "../../usecontext1/cartcontext";


const isLoggedIn = localStorage.getItem("accessToken")
export default function ProductDetails() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSizeModal, setIsSizeModal] = useState(false)
  const { addToCartContext, cart, wishList, removeFromCartContext } = useContext(CartContext)


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
  // const { cart, addToCartContext, removeFromCartContext } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1); // Track the quantity, default to 1
  const [selectedSize, setSelectedSize] = useState(null); // Track selected size
  const [reviews, addReviews] = useState()
  const [projectObjectId, setProjectObjectId] = useState()
  const [rating, setRating] = useState(0); // State to track the selected star rating
  const [description, setDescription] = useState("")
  const [allReviews, setAllReviews] = useState([])
  const [reviewLoading, setReviewsLoading] = useState(false)

  const [recommendedProducts, setRecommendedProducts] = useState([])

  const handleStarClick = (value) => {
    setRating(value); // Set the rating when a star is clicked
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const navigate = useNavigate();






  const getProductDetails = async () => {
    setLoading(true);
    try {
      const data = { productId: id };
      const response = await HttpClient.get("/product/productId", data);

      setProductDetails(response.product)









      setProjectObjectId(response.product._id)
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };


  const getReviews = async () => {
    setReviewsLoading(true)
    try {
      const response = await HttpClient.get(`/review/${projectObjectId}`);
      setAllReviews(response.reviews)
      setReviewsLoading(false)
      const formattedDataReview = response.reviews.map((eachReview) => ({
        id: eachReview._id,
        rating: eachReview.rating,
        description: eachReview.description,
        product: eachReview.product,
        userName: eachReview.userName
      }))

      setAllReviews(formattedDataReview)


    } catch (error) {

    }
  }




  useEffect(() => {
    getProductDetails(id);
  }, [id]);

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => setQuantity(Math.max(1, quantity - 1)); // Ensure quantity does not go below 1

  const tokenIfLoggedIn = localStorage.getItem("accessToken")



  const addToCart = async (productDetails, selectedSize) => {
    if (!selectedSize) {
      toast.warn("Please select a size");
      return;
    }

    if (!isLoggedIn) {
      addToCartContext(productDetails, selectedSize);
      toast.success("Product added to cart locally.");
      return;
    }

    const cartData = {
      productId: productDetails?.productId,
      color: productDetails?.colors?.[0]?.colorCode || "Default Color", // Handle missing color
      size: selectedSize,
    };

    try {
      const response = await HttpClient.post("/cart/", cartData);

      if (response?.status === 200) {
        console.log("Cart Response:", response?.status);
        toast.success("Product added to cart successfully.");
        } 
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("An error occurred while adding to the cart.");
    }
  };


  // const removeProductFromCart = (productId) => {
  //   removeFromCartContext(productId)
  // };





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
          color: "red"
        }
        try {
          const response = await HttpClient.post("/wishlist/", wishlistData)
        } catch (error) {
          toast.error(error.message)
        }
      }


    }

  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Oval height={80} width={80} color="#4A90E2" visible={true} />
      </div>
    );
  }


  const scrollToReview = () => {
    const reviewSection = document.getElementById('review');
    if (reviewSection) {
      reviewSection.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const submitReview = async (productId) => {

    try {
      const response = await HttpClient.post(
        `/review/${productId}`,
        { rating, description }
      );

      if (response) {
        toast.success("Review Added")
        getReviews()
        setRating(0)
        setDescription("")
      }
    } catch (error) {

    }
  }

  // const isInCart = cart.some((item) => item.productId === productDetails?.productId);

  return (
    <>


      {
        loading ? "aniket" :
          <div className="px-3 mt-10 md:mt-5 md:p-10">
            <div className="flex flex-wrap gap-2 md:gap-16">
              <div className="flex-1 min-w-[300px] max-w-[350px]">
                <div className="p-1 rounded-md border border-gray-300 mt-5">
                  <ProductImages images={productDetails?.colors} />

                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 ">
                  <h1 className="text-2xl  font-inter md:text-xl lg:text-2xl font-semibold text-[#2563eb] ">
                    Product Name: {productDetails?.name}
                  </h1>

                </div>

                <div className="flex flex-col gap-2 mt-3">
                  <div className="flex flex-col sm:flex-row sm:gap-4 gap-2">
                    <div className="flex gap-2 items-center">
                      <div className="bg-[#338E3C] text-white px-2 py-1 flex items-center rounded-md gap-1">
                        <p className="text-sm font-bold">4.6</p>
                        <TbJewishStarFilled className="text-sm" />
                      </div>
                      <button
                        onClick={() => {
                          scrollToReview();
                          getReviews();
                        }}
                        className="text-[#717478] font-semibold text-sm hover:underline"
                      >
                        Product Rating & Reviews
                      </button>
                    </div>

                    <div className="flex gap-2 items-center">
                      <div className="bg-[#FF9800] text-white px-2 py-1 flex items-center rounded-md gap-1">
                        <p className="text-sm font-bold">{productDetails?.brand?.rating || "4.5"}</p>
                        <TbJewishStarFilled className="text-sm" />
                      </div>
                      <p className="text-[#717478] font-semibold text-sm">Brand Rating</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-lg font-medium text-gray-600">
                      Brand:{" "}
                      <span className="text-gray-800 font-semibold">
                        {productDetails?.brand?.name || "Unknown"}
                      </span>
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
                      <PiCurrencyInr className="mr-1" /> {productDetails?.price}
                    </span>


                    {/* Discount Amount */}
                    <span className="text-sm mr-2 text-gray-500 ml-2 flex items-center"> -
                      (<PiCurrencyInr className="mr-1" />{productDetails?.discount})
                    </span> 

                    {/* Discounted Price */}
                    <span className="text-green-500 flex items-center text-xl font-bold">
                      <PiCurrencyInr className="mr-1" />
                      {productDetails?.price - productDetails?.discount}
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
                            className={`px-5 py-2 border rounded-md text-sm font-medium cursor-pointer transition-all duration-200 shadow-sm
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
                        <p className="text-gray-500">No sizes available</p>
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

                    {/* Add to Cart Button */}

                    {cart.some((each) => each.productId === productDetails?.productId) ? (
                      <button
                        onClick={() => removeFromCartContext(productDetails?.productId)}

                        className="px-3 py-1 bg-green-500 text-white font-semibold rounded-lg shadow-md">
                        Added to Cart
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(productDetails, selectedSize)}
                        className="px-3 py-1 bg-[#011F4B] text-white font-semibold rounded-lg shadow-md hover:bg-[#022C6B] transition-all duration-200 transform hover:scale-105"
                      >
                        Add to Cart
                      </button>
                    )}




                  </div>

                  {/* Free Delivery Info */}
                  <div className="flex items-center gap-2 mt-1 text-gray-800">
                    <CiDeliveryTruck size={30} className="text-gray-600" />
                    <p className="font-semibold">Free delivery</p>
                  </div>
                </div>

                <p className="text-[#2562eb] mt-1 font-semibold">
                  <p onClick={openPaymentModal} className="hover:underline cursor-pointer">
                    View Payment Details
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



                <section
                  id="review"
                  className="h-auto p-4 md:p-4 bg-gray-100 rounded-lg shadow-sm"
                  style={{ scrollMarginTop: '100px' }}
                >
                  <div>
                    {/* Header Section */}
                    <div className="flex justify-between items-center border-b pb-3 border-gray-300">
                      <h2 className="text-lg md:text-2xl font-semibold text-gray-900">
                        Ratings & Reviews
                      </h2>
                      <button
                        onClick={openModal}
                        className="bg-[#011F4B] px-3 py-2 text-sm md:text-lg font-semibold rounded-md text-white shadow-md 
                   hover:bg-[#022C6B] transition-all duration-200 transform hover:scale-105"
                      >
                        Rate Product
                      </button>
                    </div>

                    {/* Loading Indicator */}
                    {reviewLoading ? (
                      <div className="flex justify-center mt-6">
                        <Oval height={50} width={50} color="#4A90E2" visible={true} />
                      </div>
                    ) : allReviews.length === 0 ? (
                      <div className="text-center text-gray-500 mt-6">
                        <p className="text-lg">No reviews added yet.</p>
                      </div>
                    ) : (
                      <div className="mt-4">
                        {allReviews.map((review) => (
                          <div
                            key={review.id}
                            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-4"
                          >
                            {/* Reviewer Name */}
                            <p className="font-bold text-gray-900">{review.userName}</p>

                            {/* Rating Stars */}
                            <div className="flex items-center mt-1">
                              {Array.from({ length: 5 }, (_, index) => {
                                const star = index + 1;
                                return star <= review.rating ? (
                                  <TbStarFilled key={index} className="text-yellow-400 text-lg" />
                                ) : (
                                  <CiStar key={index} className="text-gray-400 text-lg" />
                                );
                              })}
                            </div>

                            {/* Review Description */}
                            <p className="mt-2 text-gray-700">{review.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>


                <Modal
                  isOpen={isModalOpen}
                  onRequestClose={closeModal}
                  contentLabel="Write and Share"
                  style={{
                    content: {
                      width: "50%",
                      margin: "auto",
                      height: "300px",
                      padding: "20px",
                      borderRadius: "10px",
                      backgroundColor: "#f9f9f9",
                    },
                  }}
                >
                  {/* Modal Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg">Write and Share</h2>
                    <button
                      className="font-bold text-red-500 text-lg"
                      onClick={closeModal}
                    >
                      X
                    </button>
                  </div>

                  {/* Review Input */}
                  <textarea
                    placeholder="Write your review here..."
                    className="p-2 rounded-md w-full mb-4 border border-gray-300"
                    rows={4}
                    style={{ resize: "none" }}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value)
                    }}
                  />

                  {/* Star Rating */}
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star, index) => (
                      <button
                        key={index}
                        onClick={() => handleStarClick(star)}
                        className="text-2xl"
                      >
                        {star <= rating ? (
                          <TbStarFilled className="text-yellow-400" />
                        ) : (
                          <CiStar className="text-gray-400" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <div className="mt-4">
                    <button key={productDetails?._id}
                      onClick={() => {
                        submitReview(productDetails?._id);
                        closeModal();
                      }}
                      className="p-2 bg-blue-500 text-white rounded-md w-full"
                    >
                      Submit Review
                    </button>

                  </div>
                </Modal>
              </div>



            </div>
            <hr className="my-2" />

          </div>
      }

    </>


  );
}
