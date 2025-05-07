import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import Loader from "../../components/loader";

const SellerProducts = () => {
  const location = useLocation();
  const vendorDetails = location.state;
  const [loading, setLoading] = useState(false);
  const [formattedProducts, setFormattedProducts] = useState([]);
  const { id } = useParams();

  const getVendorsDetails = async (_id) => {
    if (!_id) {
      console.error("Invalid ID", _id);
      return;
    }
    setLoading(true);

    try {
      const response = await HttpClient.get(`/dashboard/vendors/${_id}`);
      const products = response?.products?.map((product) => ({
        id: product?._id,
        name: product?.productDetails?.name || "Unnamed Product",
        price: product?.actualPrice,
        rating: product?.avgRating || 0,
        image: product?.bannerImage,
        sizes: product?.sizes,
      }));

      setFormattedProducts(products || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getVendorsDetails(id);
  }, [id]);

  if (!vendorDetails) {
    return <p>No vendor details provided.</p>;
  }

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader/>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {formattedProducts.length > 0 ? (
            formattedProducts.map((product) => (
              <div
                key={product.id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={product.image || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-2"
                />
                <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  Price: ₹{product.price || "N/A"}
                </p>
                <p className="text-sm text-yellow-600 mb-2">
                  Rating: {product.rating} ★
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes?.length > 0 ? (
                    product.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 border rounded-full text-sm font-medium bg-blue-100 text-blue-600"
                      >
                        {size.size}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No sizes available</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No products found for this vendor.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
