import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ProductImages = ({ images }) => {
  const allImages = images?.[0]?.images || [];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="relative flex flex-col items-center p-4">
      {/* Image Container */}
      <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg w-[300px] h-[350px] flex items-center justify-center">
        {allImages.length > 0 ? (
          <img
            src={allImages[currentIndex]}
            alt="Product"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <p className="text-gray-500">No images available</p>
        )}
      </div>

      {/* Navigation Arrows */}
      {allImages.length > 1 && (
        <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4">
          <button
            onClick={prevImage}
            className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 transition"
          >
            <FaArrowLeft size={20} />
          </button>
          <button
            onClick={nextImage}
            className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 transition"
          >
            <FaArrowRight size={20} />
          </button>
        </div>
      )}

      {/* Dots Indicator */}
      <div className="flex gap-2 mt-3">
        {allImages.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === currentIndex ? "bg-blue-500" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
