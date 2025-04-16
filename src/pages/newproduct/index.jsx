import { useState } from "react";
import { CiStar } from "react-icons/ci";
import { TbStarFilled } from "react-icons/tb";
import { Oval } from "react-loader-spinner";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { HttpClient } from "../../server/client/http";



const ProductReview = () => {

    const [reviewLoading, setReviewsLoading] = useState(false)
    const [allReviews, setAllReviews] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleStarClick = (value) => {
        setRating(value); // Set the rating when a star is clicked
    };

    const [rating, setRating] = useState(0); // State to track the selected star rating
    const [description, setDescription] = useState("")



    const getReviews = async () => {
        setReviewsLoading(true)
        try {
            const response = await HttpClient.get(`/review/${""}`);
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



    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (
        <>


            <section
                id="review"
                className="h-auto p-4 md:p-4  bg-gray-100 rounded-lg shadow-sm"
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


            <Modal className="z-10"
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
                    <button key={"productDetails?._id"}
                        onClick={() => {
                            submitReview("");
                            closeModal();
                        }}
                        className="p-2 bg-blue-500 text-white rounded-md w-full"
                    >
                        Submit Review
                    </button>

                </div>
            </Modal>
        </>
    )
}


export default ProductReview