import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HttpClient } from "../../server/client/http";
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";

export default function WishList() {
  const [products, setProducts] = useState([]);

  const fetchWishlist = async () => {
    try {
      const { data } = await HttpClient.get("/wishlist");
      const formattedData = data.map((item) => ({
        bannerImage: item.bannerImage || "./assets/fallbackImage.png",
        color: item.color,
        discount: item.discount,
        quantity: item.quantity,
        size: item.size,
        name: item.name,
        price: item.price,
        productId: item.productId,
        objectID: item._id,
      }));
      setProducts(formattedData);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to fetch wishlist");
    }
  };

  const removeProductFromWishlist = async (productId) => {
    console.log(productId)
    try {
      const { message } = await HttpClient.delete(`/wishlist/${productId}`);
      toast.success(message);
      fetchWishlist();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to remove product");
    }
  };

  const moveToCart = async (productId) => {
    try {
      const { message } = await HttpClient.put("/wishlist/addToBag", { productId });
      toast.success(message);
      fetchWishlist();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to move product to cart");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <section className="px-6 sm:px-10 py-7 font-[Quicksand]">
      {products.length ? (
        <div>
          <h2 className="text-lg font-bold text-[#282c3f] mb-6">
            My Wishlist{" "}
            <span className="font-normal">
              ({products.length} items)
            </span>
          </h2>
          <div className="flex flex-wrap gap-6 ">
            {products.map((product, i) => (
              <div
                key={product.objectID}
                className="border border-solid border-[#e9e9eb] rounded-lg relative w-[280px] flex flex-col items-center shadow-md hover:shadow-lg transition-shadow"
              >
                <button
                  className="absolute top-3 right-3 h-6 w-6 border border-solid border-[#d4d5d9] rounded-full bg-white flex items-center justify-center font-bold text-xl"
                  onClick={() => removeProductFromWishlist(product.objectID)}
                  aria-label="Remove from wishlist"
                >
                  <RxCross2 className="text-sm" />
                </button>
                <Link to={`/product-details/${product.productId}`}>
                  <img
                    src={product.bannerImage}
                    alt={product.name}
                    className="w-full h-[200px] object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.src = "./assets/fallbackImage.png";
                    }}
                  />
                </Link>
                <div className="text-center my-3">
                  <p className="text-ellipsis text-base text-[#282c3f]">
                    {product.name}
                  </p>
                  <p className="text-ellipsis text-base text-[#282c3f] font-bold">
                    ₹{product.price}
                  </p>
                  <p className="text-sm text-gray-500">Size: {product.size}</p>
                  <p className="text-sm text-gray-500">Color: {product.color}</p>
                </div>
                <div className="flex w-full py-3 border-t border-solid border-[#e9e9eb] justify-between px-4">
                  
                <button
                    className="text-white bg-red-500 px-3 py-2 rounded hover:bg-red-600 transition"
                    onClick={() => removeProductFromWishlist(product.objectID)}
                  >
                    Delete
                  </button>
                  <button
                    className="text-white bg-blue-600 px-3 py-2 rounded hover:bg-blue-700 transition"
                    onClick={() => moveToCart(product.objectID)}
                  >
                    Add to Cart
                  </button>
          
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <h2 className="text-xl font-semibold mb-2">YOUR WISHLIST IS EMPTY</h2>
          <p className="mb-4 text-sm text-gray-600">
            Add items that you like to your wishlist.
          </p>
          <img
            className="h-[200px] my-4"
            src="./assets/wishlistEmpty.png"
            alt="wishlistEmpty"
          />
          <Link
            to="/"
            className="py-3 px-8 text-base font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      )}
    </section>
  );
}
