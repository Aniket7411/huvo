import { useLocation } from "react-router-dom";

const SellerProducts = () => {
  const location = useLocation();
  const vendorDetails = location.state;

  console.log(location)

  if (!vendorDetails) {
    return <p>No vendor details provided.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="font-poppins font-semibold text-2xl text-blue-800">
        {vendorDetails.name}'s Products
      </h1>
      <p className="text-lg text-gray-700">Location: {vendorDetails.location}</p>
      <p className="text-lg text-gray-700">Vendor ID: {vendorDetails.id}</p>
    </div>
  );
};

export default SellerProducts;
