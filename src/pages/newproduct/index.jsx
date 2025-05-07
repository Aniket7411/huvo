import { useState, useEffect } from "react";
import { TbStarFilled } from "react-icons/tb";
import { CiStar } from "react-icons/ci";
import { Oval } from "react-loader-spinner";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { HttpClient } from "../../server/client/http";

const ProductReview = ({ productId }) => {
  const [reviewLoading, setReviewsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [allReviews, setAllReviews] = useState([]);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

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

  useEffect(() => {
    fetchReviews();
  }, [productId]);

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
    setHoverRating(0);
    setDescription("");
  };

  const openRatingModal = () => setIsRatingModalOpen(true);
  const closeRatingModal = () => {
    setIsRatingModalOpen(false);
    resetForm();
  };

  const openReviewsModal = () => setIsReviewsModalOpen(true);
  const closeReviewsModal = () => setIsReviewsModalOpen(false);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Ratings & Reviews</h2>
        <div className="flex gap-2">
          <button
            onClick={openReviewsModal}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
          >
            View Reviews ({allReviews.length})
          </button>
          <button
            onClick={openRatingModal}
            className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 transition"
          >
            Add Review
          </button>
        </div>
      </div>

      {/* Rating Modal */}
      <Modal
        isOpen={isRatingModalOpen}
        onRequestClose={closeRatingModal}
        style={{
          content: {
            width: '90%',
            maxWidth: '400px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center'
          }
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Rate this product</h3>
            <button onClick={closeRatingModal} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="text-3xl"
              >
                {star <= (hoverRating || rating) ? (
                  <TbStarFilled className="text-yellow-400" />
                ) : (
                  <CiStar className="text-gray-300" />
                )}
              </button>
            ))}
          </div>
          
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share your experience..."
            className="p-2 border rounded h-24"
          />
          
          <button
            onClick={submitReview}
            disabled={submitLoading}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 flex justify-center items-center gap-2"
          >
            {submitLoading ? (
              <>
                <Oval width={20} height={20} color="#fff" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </Modal>

      {/* Reviews Modal */}
      <Modal
        isOpen={isReviewsModalOpen}
        onRequestClose={closeReviewsModal}
        style={{
          content: {
            width: '90%',
            maxWidth: '600px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxHeight: '70vh',
            overflowY: 'auto'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center'
          }
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center sticky top-0 bg-white py-2">
            <h3 className="text-lg font-medium">Customer Reviews</h3>
            <button onClick={closeReviewsModal} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          {reviewLoading ? (
            <div className="flex justify-center py-8">
              <Oval width={40} height={40} color="#3b82f6" />
            </div>
          ) : allReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No reviews yet. Be the first to review!
            </div>
          ) : (
            <div className="space-y-4">
              {allReviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{review.userName}</p>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex gap-1 my-1">
                    {[...Array(5)].map((_, i) => (
                      i < review.rating ? 
                        <TbStarFilled key={i} className="text-yellow-400" /> : 
                        <CiStar key={i} className="text-gray-300" />
                    ))}
                  </div>
                  <p className="text-gray-700 mt-1">{review.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ProductReview;