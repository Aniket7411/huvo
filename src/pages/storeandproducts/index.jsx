import { useEffect, useState } from "react";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import Loader from "../../components/loader";
import { Link } from "react-router-dom";
import { TbJewishStarFilled } from "react-icons/tb";
import { useParams } from "react-router-dom";
import ProductsShowingComponent from "../filterproductComponent";
import { FiShoppingBag, FiShoppingCart } from "react-icons/fi";

const StoreAndProducts = () => {
  const [genderCategory, setGenderCategory] = useState("men");
  const [sortOrder, setSortOrder] = useState("low-to-high");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();

  const fetchAllProducts = async () => {
    setIsLoading(true);
    try {
      const response = await HttpClient.get(`/product/storeproducts`, { sellerId: id });

      console.log("filteredProductss", response)

      const formattedData = response.data.map((eachProduct) => ({
        objectId: eachProduct._id,
        bannerImage: eachProduct.bannerImage,
        name: eachProduct.name,
        brandName: eachProduct.brand.name,
        brandImage: eachProduct.brand.image,
        onGoingOffer: eachProduct.brand.onGoingOffer,
        brandId: eachProduct.brand.brandId,
        categoryId: eachProduct.category.categoryId,
        categoryDescription: eachProduct.category.description,
        productDescription: eachProduct.description,
        productDetails: eachProduct.productDetails[0],
        group: eachProduct.group, //men
        isReturnable: eachProduct.isReturnable,
        discount: eachProduct.discount,
        price: eachProduct.price,
        actualPrice: eachProduct.actualPrice,
        productId: eachProduct?.productId
      }));

      setAllProducts(formattedData);
      applyFilters(formattedData);
      setTotalPages(response.totalPages || 1);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  const applyFilters = (products) => {
    let filtered = [...products];

    // Apply gender filter
    if (genderCategory && genderCategory !== "all") {
      filtered = filtered.filter(product => product.group === genderCategory);
    }

    // Apply search filter
    if (searchQuery) {

      // Apply sorting
      console.log("searchQuery", searchQuery)

      console.log("searchQuery", filtered)

      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase) ||
        product.brandName.toLowerCase().includes(searchQuery.toLowerCase)
      );
    }

    // Apply sorting
    if (sortOrder === "low-to-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-to-low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchAllProducts();
  }, [id]);

  useEffect(() => {
    applyFilters(allProducts);
  }, [genderCategory, sortOrder, searchQuery]);

  const handleGenderChange = (e) => setGenderCategory(e.target.value);
  const handleSortChange = (e) => setSortOrder(e.target.value);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => Math.max(1, Math.min(prev + direction, totalPages)));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    console.log(searchQuery);

  };


  console.log("filteredProducts", filteredProducts)

  return (
    <>




    <div className="relative overflow-hidden md:mt-[15px] bg-gradient-to-br from-indigo-50 to-blue-100 shadow-xl rounded-2x transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
  {/* Background brand image with overlay */}
  <div className="absolute inset-0 z-0 opacity-20">
    <img 
      src="/assets/hnm.png" 
      alt="Brand background"
      className="object-cover w-full h-full"
    />
  </div>
  
  {/* Content */}
  <div className="relative z-10 p-6 md:p-6">
    {/* Welcome text */}
    <div className="mb-3">
      <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Welcome to</h2>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">
        Shopiflor <span className="text-blue-600">Store</span>
      </h1>
      <p className="text-gray-600 mt-2">
        Discover the latest fashion trends and premium quality clothing for every occasion.
      </p>
    </div>

    {/* Store info card */}
    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-white shadow-sm hover:bg-white transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Store name and details */}
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <img
                src="/assets/hnm.png"
                alt="Store logo"
                className="w-12 h-12 object-contain rounded-lg"
              />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Official Store</p>
              <h3 className="text-xl font-bold text-gray-900">Shopiflor</h3>
            </div>
          </div>
        </div>


        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <div className="flex items-center gap-2 group">
            <div className="p-2 bg-yellow-50 rounded-full group-hover:bg-yellow-100 transition-colors">
              <TbJewishStarFilled className="text-yellow-500 text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Rating</p>
              <p className="font-bold text-gray-900">4.8/5.0</p>
            </div>
          </div>

          <div className="flex items-center gap-2 group">
            <div className="p-2 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors">
              <FiShoppingBag className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Products Sold</p>
              <p className="font-bold text-gray-900">120+</p>
            </div>
          </div>
        </div>


        
        <button className=" py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
        <FiShoppingCart className="text-lg" />
        Shop Now
      </button>
      </div>

   
    </div>
  </div>
</div>


      <ProductsShowingComponent allProducts={filteredProducts} />


    </>
  );
};

export default StoreAndProducts;