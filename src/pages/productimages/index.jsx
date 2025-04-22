import { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ProductImages = ({ images }) => {
  const allImages = images?.[0]?.images || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const imageRef = useRef(null);

  // Minimum swipe distance required
  const minSwipeDistance = 50;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextImage();
    if (isRightSwipe) prevImage();
  };

  // Auto-rotate images if there are multiple
  useEffect(() => {
    if (allImages.length <= 1) return;

    const interval = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, allImages.length]);

  return (
    <div className="relative flex  md:flex-row gap-4 p-2 w-full max-w-4xl mx-auto">
      {/* Thumbnail/Dots Indicator - Left Side */}
      {allImages.length > 1 && (
        <div className="flex flex-col gap-2 overflow-y-auto h-auto">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => goToImage(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${i === currentIndex ? "border-blue-500" : "border-transparent"
                } hover:border-gray-300 transition-colors`}
              aria-label={`Go to image ${i + 1}`}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Container */}
      <div className="flex-1 flex flex-col items-center">
        <div
          className="relative border border-gray-200 rounded-lg overflow-hidden shadow-md w-full aspect-[3/4] flex items-center justify-center bg-gray-100"
          ref={imageRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {allImages.length > 0 ? (
            <>
              <img
                src={allImages[currentIndex]}
                alt={`Product ${currentIndex + 1}`}
                className="w-full h-full object-contain transition-opacity duration-300"
                loading="lazy"
              />

              {/* Navigation Arrows - Only show on hover for non-touch devices */}
              <div className="hidden md:flex absolute top-0 left-0 right-0 h-full items-center justify-between opacity-0 hover:opacity-100 transition-opacity duration-300 px-2">
                <button
                  onClick={prevImage}
                  className="bg-white/80 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <FaArrowLeft size={18} />
                </button>
                <button
                  onClick={nextImage}
                  className="bg-white/80 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <FaArrowRight size={18} />
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm">No images available</p>
          )}
        </div>

        {/* Always visible arrows for mobile */}
        {/* {allImages.length > 1 && (
          <div className="md:hidden flex justify-between w-full mt-2 px-2">
            <button
              onClick={prevImage}
              className="bg-gray-800/90 text-white p-2 rounded-full shadow hover:bg-gray-700 transition"
              aria-label="Previous image"
            >
              <FaArrowLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              className="bg-gray-800/90 text-white p-2 rounded-full shadow hover:bg-gray-700 transition"
              aria-label="Next image"
            >
              <FaArrowRight size={16} />
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ProductImages;