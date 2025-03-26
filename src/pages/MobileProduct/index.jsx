import { Link } from "react-router-dom";
import { PiCurrencyInr } from "react-icons/pi";
import { CiDeliveryTruck } from "react-icons/ci";

const MobileProductCarousel = (props) => {
  const { allProducts } = props;

  // Filter products by group
  const menProducts = allProducts.filter((item) => item.group === "men").splice(0, 8);


  return (
    <div className="flex flex-wrap gap-2 justify-center p-4 md:hidden">
      {menProducts.map((each, index) => {
        const finalPrice = each.price - each.discount;

        return (
          <div
            key={index}
            className="w-[45%] h-auto flex flex-col bg-white rounded-lg shadow-md p-2 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <Link to={`/product-details/${each?.productId}`} className="flex flex-col gap-2">
              {/* Product Image */}
              <img
                src={each?.bannerImage || "https://via.placeholder.com/300"}
                alt={each?.name || "Product Image"}
                className="h-[150px] w-full object-cover rounded-md"
                loading="lazy"
              />

              {/* Product Name */}
              <h2 className="font-semibold text-gray-800 text-sm mt-1">
                {each?.name || "Product Name"}
              </h2>

              {/* Price Details */}
              <div className="flex justify-between items-center">
                {/* Original Price */}
                <div className="flex items-center gap-1">
                  <PiCurrencyInr className="text-red-600" />
                  <p className="line-through text-red-600 font-semibold text-sm">
                    {each?.price}
                  </p>
                </div>

                {/* Discount Price */}
                <div className="flex items-center gap-1">
                  <PiCurrencyInr className="text-green-600" />
                  <p className="text-green-600 font-semibold text-sm">{each?.discount}</p>
                </div>
              </div>

              {/* Final Price */}
              {/* <div className="flex items-center text-green-600 gap-1">
                <PiCurrencyInr />
                <p className="font-semibold text-sm">{finalPrice} /-</p>
              </div> */}

              {/* Free Delivery */}
              {/* <div className="flex items-center gap-2">
                <CiDeliveryTruck className="text-gray-600" />
                <p className="text-gray-600 font-semibold text-sm">Free delivery</p>
              </div> */}
              <button type="button" className="bg-[#011F4B] text-[#fff] rounded-lg py-1">Visit Store</button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default MobileProductCarousel;