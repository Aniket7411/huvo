import { useState, useEffect } from "react";
import { CiStar } from "react-icons/ci";
import { TbStarFilled } from "react-icons/tb";
import { Oval } from "react-loader-spinner";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { HttpClient } from "../../server/client/http";

const ProductReview = (props) => {

    const { productId } = props


    console.log("props", props)
    const [reviewLoading, setReviewsLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [allReviews, setAllReviews] = useState([]);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState("");



    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
            const response = await HttpClient.get(`/review/${productId}`);
            const formattedDataReview = response.reviews.map((eachReview) => ({
                id: eachReview._id,
                rating: eachReview.rating,
                description: eachReview.description,
                product: eachReview.product,
                userName: eachReview.userName,
                date: new Date(eachReview.createdAt).toLocaleDateString()
            }));
            setAllReviews(formattedDataReview);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setReviewsLoading(false);
        }
    };



    // Fetch reviews when component mounts or when productId changes
    useEffect(() => {
        fetchReviews();
    }, [productId]);


    const handleStarClick = (value) => {
        setRating(value);
    };

    const submitReview = async () => {
        if (!rating) {
            toast.warning("Please select a rating");
            return;
        }

        setSubmitLoading(true);
        try {
            const response = await HttpClient.post(`/review/${productId}`, {
                rating,
                description,
            });

            if (response) {
                toast.success("Review added successfully!");
                fetchReviews();
                resetForm();
                closeRatingModal();
            }
        } catch (error) {
            toast.error("Failed to submit review");
            console.error("Error submitting review:", error);
        } finally {
            setSubmitLoading(false);
        }
    };

    const resetForm = () => {
        setRating(0);
        setDescription("");
    };

    const openRatingModal = () => setIsRatingModalOpen(true);
    const closeRatingModal = () => {
        setIsRatingModalOpen(false);
        resetForm();
    };

    const openReviewsModal = () => setIsReviewsModalOpen(true);
    const closeReviewsModal = () => setIsReviewsModalOpen(false);

    const modalStyles = {
        content: {
            width: "90%",
            maxWidth: "500px",
            margin: "auto",
            maxHeight: "80vh",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
        },
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
        },
    };

    return (
        <section
            id="review"
            className="h-auto p-3 bg-gray-100 rounded-lg shadow-sm"
            style={{ scrollMarginTop: "100px" }}
        >
            <div className="flex justify-between items-center border-b pb-3 border-gray-300">
                <h2 className="text-sm md:text-xl font-semibold text-gray-900">
                    Ratings & Reviews
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={openReviewsModal}
                        className=" px-3 py-2 text-sm md:text-base font-medium rounded-md text-white shadow-md bg-[#022C6B] transition-colors"
                    >
                        View Reviews ({allReviews.length === 0 ? "New" : allReviews.length})
                    </button>
                    {/* <button
                        onClick={openRatingModal}
                        className="bg-[#011F4B] px-3 py-2 text-sm md:text-base font-medium rounded-md text-white shadow-md hover:bg-[#022C6B] transition-colors"
                    >
                        Rate Product
                    </button> */}
                </div>
            </div>

            {/* Rating Modal */}
            <Modal
                isOpen={isRatingModalOpen}
                onRequestClose={closeRatingModal}
                contentLabel="Rate Product"
                style={modalStyles}
            >
                <div className="flex flex-col h-full">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <h2 className="font-semibold text-base sm:text-lg md:text-xl">Rate this product</h2>
                        <button
                            onClick={closeRatingModal}
                            className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl"
                            aria-label="Close rating modal"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="flex flex-col flex-grow space-y-2">
                        {/* Star Rating */}
                        <div className="flex justify-center gap-1 sm:gap-2 mb-2 sm:mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleStarClick(star)}
                                    className="text-2xl sm:text-3xl md:text-4xl focus:outline-none transition-transform hover:scale-110"
                                    aria-label={`Rate ${star} star`}
                                >
                                    {star <= rating ? (
                                        <TbStarFilled className="text-yellow-400" />
                                    ) : (
                                        <CiStar className="text-gray-300 hover:text-yellow-400" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Review Textarea */}
                        <textarea
                            placeholder="Share your experience with this product..."
                            className="p-2 sm:p-3 rounded-md w-full border border-gray-300 flex-grow
                text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent
                min-h-[50px] sm:min-h-[80px] md:min-h-[110px]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        {/* Submit Button */}
                        <button
                            onClick={submitReview}
                            disabled={submitLoading}
                            className="p-2 sm:p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                disabled:bg-blue-400 transition-colors text-sm sm:text-base md:text-lg
                flex items-center justify-center gap-2"
                        >
                            {submitLoading ? (
                                <>
                                    <Oval
                                        height={20}
                                        width={20}
                                        color="#fff"
                                        visible={true}
                                        ariaLabel="Submitting review"
                                    />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                "Submit Review"
                            )}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Reviews Modal */}
            <Modal
                isOpen={isReviewsModalOpen}
                onRequestClose={closeReviewsModal}
                contentLabel="Product Reviews"
                style={{
                    ...modalStyles,
                    content: {
                        ...modalStyles.content,
                        maxHeight: "70vh",
                        overflowY: "auto",
                    },
                }}
            >
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-[#f9f9f9] py-2">
                    <h2 className="font-semibold text-lg">Customer Reviews</h2>
                    <button
                        onClick={closeReviewsModal}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {reviewLoading ? (
                    <div className="flex justify-center my-8">
                        <Oval height={40} width={40} color="#4A90E2" visible={true} />
                    </div>
                ) : allReviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p className="text-lg">No reviews yet. Be the first to review!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {allReviews.map((review) => (
                            <div
                                key={review.id}
                                className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                            >
                                <div className="flex justify-between items-start">
                                    <p className="font-bold text-gray-900">{review.userName}</p>
                                    <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                                <div className="flex items-center mt-1">
                                    {Array.from({ length: 5 }, (_, index) => {
                                        const star = index + 1;
                                        return star <= review.rating ? (
                                            <TbStarFilled
                                                key={index}
                                                className="text-yellow-400 text-lg"
                                            />
                                        ) : (
                                            <CiStar key={index} className="text-gray-300 text-lg" />
                                        );
                                    })}
                                </div>
                                <p className="mt-2 text-gray-700">{review.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </section>
    );
};

export default ProductReview;