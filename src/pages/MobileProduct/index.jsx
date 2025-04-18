import { Link } from "react-router-dom";
import { PiCurrencyInr } from "react-icons/pi";
import { CiDeliveryTruck, CiDiscount1 } from "react-icons/ci";
import { FaStar } from "react-icons/fa";

const MobileProductCarousel = ({ womenProducts }) => {
  return (
    <div className="grid grid-cols-2 gap-3 p-4 md:hidden">
      {womenProducts.map((product) => {
        const finalPrice = product.price - product.discount;
        const discountPercentage = Math.round((product.discount / product.price) * 100);

        return (
          <div
            key={product.productId}
            className="group relative flex flex-col bg-white rounded-lg shadow-sm p-2 border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                {discountPercentage}% OFF
              </span>
            )}

            <Link 
              to={`/product-details/${product.productId}`} 
              className="flex flex-col gap-1.5"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-md bg-gray-50">
                <img
                  src={product.bannerImage || "https://via.placeholder.com/300"}
                  alt={product.name || "Product Image"}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Product Info */}
              <div className="mt-1 px-1">
                {/* Product Name */}
                <h2 className="font-medium text-gray-800 text-sm line-clamp-2 h-10">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center mt-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-3 h-3" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">(24)</span>
                </div>

                {/* Price Section */}
                <div className="mt-2">
                  {/* Final Price */}
                  <div className="flex items-center">
                    <PiCurrencyInr className="text-gray-900" />
                    <span className="font-bold text-gray-900">{finalPrice}</span>
                  </div>

                  {/* Original Price */}
                  <div className="flex items-center">
                    <PiCurrencyInr className="text-gray-400 text-xs" />
                    <span className="line-through text-gray-400 text-xs">
                      {product.price}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-green-600 text-xs font-medium ml-1 flex items-center">
                        <CiDiscount1 className="mr-0.5" /> {product.discount} off
                      </span>
                    )}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <CiDeliveryTruck className="mr-1" />
                  {/* <span>Free Delivery</span> */}
                </div>
              </div>

              {/* CTA Button */}
              <button 
                type="button" 
                className="mt-2 bg-[#011F4B] hover:bg-[#02386e] text-white text-sm font-medium rounded-md py-1.5 transition-colors duration-200"
              >
                View Details
              </button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default MobileProductCarousel;