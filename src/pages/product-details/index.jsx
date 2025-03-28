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
import { CartContext } from "../../usecontext1/cartcontext";



export default function ProductDetails() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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
  const { cart, addToCartContext, removeFromCartContext } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1); // Track the quantity, default to 1
  const [selectedSize, setSelectedSize] = useState(""); // Track selected size
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


  console.log("cartcartcart", cart)




  const getProductDetails = async () => {
    setLoading(true);
    try {
      const data = { productId: id };
      const response = await HttpClient.get("/product/productId", data);

      const formattedRecommendedProducts = response.recommendProduct.map((each) => ({
        bannerImage: each.bannerImage,
        brandId: each.brand,
        categoryId: each.category,
        productDescription: each.category,
        discount: each.discount,
        group: each.group,
        productDetails: each.productDetails,
        materialAndCare: each.materialAndCare,
        productName: each.name,
        price: each.price,
        sellerId: each.seller
      }))


      setRecommendedProducts(formattedRecommendedProducts)



      setProductDetails(response.product);




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




  const addToCart = async (productDetails) => {
    const { productId } = productDetails
    const dataForCart = {
      productId: productId,
      quantity: quantity,
      size: selectedSize,
      color: "red"
    }

    addToCartContext(dataForCart);
    console.log(dataForCart)

    try {
      const response = await HttpClient.post(`/cart/`, dataForCart)
      toast.success(response.message);
      getCartData();
    } catch (error) {
      console.log(error)

    }
  };

  const removeProductFromCart = (productId) => {
    console.log("productDetailsremove", productId)
    removeFromCartContext(productId)
  };




  const getCartData = async () => {
    try {
      const response = await HttpClient.get('/cart');

    } catch (err) {
      toast.error(err.message);
    }
  }

  const removeFromCart = async (productDetails) => {
    const { productId } = productDetails

    const dataToRemove = productId + selectedSize + "red"



    try {
      const response = await HttpClient.put(`/cart/remove`, { "productIdName": dataToRemove })
      console.log(response)


    } catch (error) {

    }
  }

  const addToWishlist = async (productDetails) => {
    if (tokenIfLoggedIn === null) {
      toast.error("Please login First")
      navigate("/login");



    }
    else {
      const { productId } = productDetails
      const wishlistData = {
        productId: productId,
        size: selectedSize,
        color: "red"
      }
      try {
        const response = await HttpClient.post("/wishlist/", wishlistData)
        console.log(response)
      } catch (error) {
        toast.error(error.message)
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

  console.log("sjsjsjsjssj", tokenIfLoggedIn)

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

  const isInCart = cart.some((item) => item.productId === productDetails.productId);


  return (
    <div className="px-3 mt-10 md:p-10">
      <div className="flex flex-wrap gap-2 md:gap-16">
        <div className="flex-1 min-w-[300px] max-w-[350px]">
          <div className="p-2 rounded-md border border-gray-300 mt-5">
            <img
              className="h-[240px] md:h-[400px] w-full object-cover rounded-md"
              src={productDetails.bannerImage}
              alt="Product"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 ">
            <h1 className="text-2xl  font-inter md:text-xl lg:text-2xl font-semibold text-[#2563eb] ">
              Product Name: {productDetails.name}
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
        <p className="text-sm font-bold">{productDetails.brand?.rating || "4.5"}</p>
        <TbJewishStarFilled className="text-sm" />
      </div>
      <p className="text-[#717478] font-semibold text-sm">Brand Rating</p>
    </div>
  </div>

  <div>
    <p className="text-lg font-medium text-gray-600">
      Brand:{" "}
      <span className="text-gray-800 font-semibold">
        {productDetails.brand?.name || "Unknown"}
      </span>
    </p>
  </div>
</div>


          <p className="text-gray-700 mb-2">Product description: {productDetails.description}</p>

          <div className="flex flex-wrap gap-2 md:gap-10 items-center ">

            <div className="">


              <p className="flex items-center text-lg font-semibold text-gray-800 ">
                <span className="line-through text-gray-500 mr-2">
                  <PiCurrencyInr className="mr-1" /> {productDetails.price}
                </span>
                <span className="text-green-500">
                  <PiCurrencyInr className="mr-1" />
                  {productDetails.price -  productDetails.discount }
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  ({productDetails.discount}% Off)
                </span>
              </p>

              <p className="text-gray-600 font-medium ">Material & Care:</p>
              <p className="text-gray-700">{productDetails.materialAndCare}</p>
              <div className="flex gap-4">
                <div>
                  <p className="text-gray-600 font-medium ">Sizes Available:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {productDetails.sizes?.length > 0 ? (
                      productDetails.sizes.map((sizeObj, index) => (
                        <span
                          key={index}
                          onClick={() => setSelectedSize(sizeObj.size)}
                          className={`px-3 py-1 border border-gray-300 rounded-md bg-blue-200 text-sm font-medium cursor-pointer ${selectedSize === sizeObj.size ? 'bg-green-500 text-white' : ''
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

            </div>

            <div className="" >
         

              <p className="mb-1 mt-1 font-semibold">
                Returnable : {productDetails.isReturnable ? "Yes" : "No"}
              </p>

              {
                tokenIfLoggedIn === null ?

                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => {
                        if (isInCart) {
                          removeFromCartContext(productDetails.productId); 
                          toast.error("Removed from cart");
                        } else {
                          addToCartContext({ ...productDetails, selectedSize, quantity }); 
                          toast.success("Added to cart");
                        }
                      }}
                      className={`px-2 py-1 rounded-md pointer text-md transition ${isInCart ? "bg-[#011F4B] text-white" : "bg-[#011F4B] text-white"
                        }`}
                    >
                      {isInCart ? "Remove from cart" : "Add to Cart"}
                    </button>




                    <button key={productDetails._id}
                      onClick={() => addToWishlist(productDetails, selectedSize, quantity)} 

                      className="px-2 py-1 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition"
                    >
                      Add to Wishlist
                    </button>


                  </div> : <button
                    key={productDetails.productId}
                    onClick={() => addToCart(productDetails)}
                    className="px-2 py-1 bg-[#011F4B] text-white  rounded-lg shadow-md hover:bg-bg-[#011F4B] transition duration-200"
                  >
                    Add to Cart
                  </button>

              }








              {/* 
                <button key={productDetails._id}
                  onClick={() => addToWishlist(productDetails, selectedSize, quantity)} // Pass productDetails, selectedSize, and quantity

                  className="px-2 py-1 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition"
                >
                  Add to Wishlist
                </button> */}






              <div className="flex items-center mt-1 gap-2">
                <CiDeliveryTruck size={30} />
                <p className="font-semibold items-end">Free delivery</p>

              </div>

            </div>

          </div>
          <p className="text-[#2562eb] mt-2 font-semibold">
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
            className="h-auto p-2 bg-gray-100 rounded-md"
            style={{ scrollMarginTop: '100px' }}
          >
            <div>
              <div className="flex justify-between">
                <h2 className="text-md md:text-2xl font-semibold text-[#000]">Ratings & Reviews</h2>
                <button
                  onClick={openModal}
                  className="bg-[#011F4B] px-2 py-1 text-md md:text-2xl rounded-md text-[#fff]"
                >
                  Rate Product
                </button>
              </div>
              {reviewLoading ? (
                <div className="flex justify-center">
                  <Oval height={50} width={50} color="#4A90E2" visible={true} />
                </div>
              ) : allReviews.length === 0 ? (
                <div className="text-center text-gray-500 mt-4">
                  <p>No reviews added yet.</p>
                </div>
              ) : (
                allReviews.map((review) => (
                  <div key={review.id} className="mt-4 border-b border-gray-200 pb-4">
                    <p className="font-bold">{review.userName}</p>

                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, index) => {
                        const star = index + 1;
                        return star <= review.rating ? (
                          <TbStarFilled key={index} className="text-yellow-400" />
                        ) : (
                          <CiStar key={index} className="text-gray-400" />
                        );
                      })}
                    </div>

                    <p className="mt-2 text-gray-700">{review.description}</p>
                  </div>
                ))
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
              <button key={productDetails._id}
                onClick={() => {
                  submitReview(productDetails._id);
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
      <h3 className="text-[#011F4B] text-xl font-semibold mb-2">
        Products similar to above category
      </h3>

      <SimilarProducts loading={loading} productName={productDetails?.name} group={productDetails?.group} recommendedProducts={recommendedProducts} />


      <h3 className="text-[#011F4B] text-xl font-semibold mb-2">
        Similar products in brands
      </h3>

    </div>
  );
}
