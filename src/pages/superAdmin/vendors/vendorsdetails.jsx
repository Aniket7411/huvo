import { React, useState, useEffect } from "react";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";
import Superadminheader from "../../../components/superadminheader";
import { PiArrowArcLeft } from "react-icons/pi";
import "../superadmin.css";
import { Link } from "react-router-dom";
import { HttpClient } from "../../../server/client/http";
import "react-circular-progressbar/dist/styles.css";
import { Button, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "./vendorsDetails.css";
import Loader from "../../../components/loader";
import { toast } from "react-toastify";

const products = [
  { id: 1, name: "Product A", price: "$10", status: "Approved" },
  { id: 2, name: "Product B", price: "$15", status: "Pending" },
  { id: 3, name: "Product C", price: "$20", status: "Rejected" },
];


export default function Vendorsdetail() {
  const { id } = useParams();

  const percentage = 60;
  const [vendorDetails, setVendorDetails] = useState([]);
  const [loading, setloading] = useState(false);
  const [detailsId, setdetailsId] = useState();
  const [basicSellerDetails, setBasicSellerDetails] = useState({})
  const [sellerStoreDetails, setSellerStoreDetails] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionModal, setActionModal] = useState(true);
  const [vendorProductDetails, setVendorProductDetails] = useState()
  const [sellerEmail, setSellerEmail] = useState("")


  const navigate = useNavigate();

  //console.log("Extracted ID from Params:", id);
  const getVendorsDetails = async (_id) => {
    // 
    if (!_id) {
      console.error("id", _id);
      return;
    }
    setloading(true);

    try {
      const response = await HttpClient.get(`/dashboard/vendors/${_id}`);
      console.log("responseresponse", response)
      setSellerEmail(response?.vendorDetail?.email)


      console.log("basics", response)
      setVendorDetails(response.vendorDetail);
      setVendorProductDetails(response)
      const formattedSellerDetails = response.vendorDetail.address.map((each) => ({
        address: each.address,
        city: each.city,
        isDefault: each.isDefault,
        mobileNumber: each.mobileNumber,
        postalCode: each.postalCode,
        state: each.state,
        town: each.town,
        name: each.name

      }))


      setBasicSellerDetails(formattedSellerDetails[0])



      const formattingStoreDetails = response.vendorDetail.storeDetails.map((eachDetail) => ({
        storeProducts: eachDetail.products,
        storeAddress: eachDetail.storeAddress,
        storeDescription: eachDetail.storeDescription,
        storeName: eachDetail.storeName
      }))

      console.log("formattedSellerDetails", formattedSellerDetails)
      setSellerStoreDetails(formattingStoreDetails)




      if (response) {
        setloading(false);
      }
    } catch (error) {
      console.error(error.response);
      setloading(false);
    }
    //getVendorsDetails();
  };
  useEffect(() => {
    getVendorsDetails(id);
  }, [id]);

  const handleNavigate = () => {
    navigate(`/admin/vendors`);
  };




  const handleModalClose = () => {
    setActionModal(false)
  }

  const handleConfirmAction = () => {
    console.log("handleConfirmAction")
  }


  return (
    <div className="flex h-screen">
      <div className="bg-[#E7EFFA] h-full">
        <SuperAdminNav />
      </div>

      <div className="flex flex-col w-full flex-1 overflow-auto">
        <div className="px-5">
          <div className="flex items-center">
            <div
              className="h-14 w-14  bg-[#E7EFFA] rounded-full flex items-center justify-center"
              onClick={() => handleNavigate()}
            >
              <PiArrowArcLeft className="text-[#000000]" />
            </div>

            <div className="w-full">
              <Superadminheader />
            </div>
          </div>
          <div className="">
            <p className=" font-poppins font-medium text-[#46484D]">
              Vendors
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        {vendorDetails ? (
          <div className="">
            <div className="flex flex-wrap justify-between mx-2 py-5 items-center gap-4">
              <div className="flex gap-2 items-center">
                <div className="h-[50px] w-[50px] bg-[#D9D9D9] rounded-full flex items-center justify-center">
                  {" "}
                  image
                </div>
                <div className="items-center flex-col space-y-2">
                  <div className="font-poppins font-normal text-[14px] leading-[21px]">
                    {basicSellerDetails?.name}
                  </div>
                  <div className="font-poppins font-normal text-[32px] leading-[21px] text-center">
                  </div>
                </div>
              </div>
              <div className="flex flex-col mx-4">
                <div className="">
                  <div className="flex justify-between font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]">
                    Registration Date:
                    <div className="  font-poppins font-normal ml-1 break-words text-[#000000]">
                      15-09-2024
                    </div>
                  </div>
                  <div className="flex justify-between font-poppins font-medium text-[14px] leading-[21px]  text-[#6B6B6B]">
                    {" "}
                    Status:
                    <div
                      className={`font-poppins font-normal ml-1 break-words ${vendorDetails?.vendorDetail?.status === true
                        ? "text-green-600"
                        : "text-[#FFA940]"
                        }`}
                    >
                      {vendorDetails?.vendorDetail?.status === true
                        ? "Verified"
                        : "Pending Verification"}
                    </div>
                  </div>
                  <div className="flex justify-between font-poppins font-medium text-[14px] leading-[21px]  text-[#6B6B6B]">
                    Valid Upto:
                    <div className=" font-poppins font-normal text-[14px] leading-[21px] ml-1 break-words text-[#000000]">
                      15-11-2024
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex mx-6 ">
              <div className="flex flex-col space-y-4 pr-2">
                <div className="flex flex-col ">
                  <h1 className="font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]">
                    Email:
                  </h1>
                  <p className="font-poppins font-normal text-[16px] leading-[21px]">
                    {sellerEmail}
                  </p>
                </div>
                <div className="flex flex-col">
                  <h1 className="font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]">
                    Address:
                  </h1>
                  <p className="font-poppins font-normal text-[16px] leading-[21px]">
                    {basicSellerDetails?.address}                 </p>
                  <p>{basicSellerDetails?.postalCode}, {basicSellerDetails?.state}</p>
                </div>
              </div>
              {/* for the vertical line */}
              <div className="vertical-line  border-r-2 mx-2"></div>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col">
                  <h1 className="font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]">
                    Store Details
                  </h1>
                  <p className="font-poppins font-normal text-[16px] leading-[21px]">
                    kkk
                  </p>
                </div>
                <div className="flex flex-col">
                  <h1 className="font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]">
                    Contact Number:
                  </h1>
                  <p className="font-poppins font-normal text-[16px] leading-[21px]">
                    {basicSellerDetails.mobileNumber}
                  </p>
                </div>
              </div>
            </div>

            {actionModal && (
              <Modal
                title="Action Confirmation"
                isOpen={actionModal}
                onClose={handleModalClose}
              >
                <div className="p-4">
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to perform this action?
                  </p>
                  <div className="flex gap-4 justify-end">
                    <Button
                      onClick={handleModalClose}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleConfirmAction}
                      className="px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </Modal>
            )}
            <div className="mx-5 py-5">

              <Link
                state={vendorProductDetails}
                to="/admin/vendors/product_details/"
                aria-label="Go to home page"
                className="block p-4 mb-2 bg-blue-50 hover:bg-blue-100 rounded-lg shadow-md transition-all duration-200"
              >
                <div className="p-4">
                  <h1 className="font-poppins font-semibold text-xl text-blue-800">
                    Products added by Seller
                  </h1>
                  <div className="overflow-x-auto mt-4">
                    <table className="min-w-full border-collapse border border-gray-300">
                      <thead className="bg-blue-100">
                        <tr>
                          <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">#</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Product Name</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Price</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product, index) => (
                          <tr key={product.id} className="odd:bg-white even:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.price}</td>
                            <td
                              className={`border border-gray-300 px-4 py-2 ${product.status === "Approved"
                                  ? "text-green-500"
                                  : product.status === "Pending"
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                }`}
                            >
                              {product.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Link>







            </div>
          </div>
        ) : (
          <div
            className="h-[62vh]"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading === true ? <Loader /> : "No Products Available"}
          </div>
        )}
      </div>
    </div>
  );
}
