import { React, useState, useEffect } from "react";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";
import Superadminheader from "../../../components/superadminheader";
import { PiArrowArcLeft } from "react-icons/pi";
import "../superadmin.css";
import { Link } from "react-router-dom";
import { HttpClient } from "../../../server/client/http";
import "react-circular-progressbar/dist/styles.css";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "./vendorsDetails.css";
import Loader from "../../../components/loader";

export default function Vendorsdetail() {
  const { id } = useParams();

  const percentage = 60;
  const [vendorDetails, setVendorDetails] = useState([]);
  const [loading, setloading] = useState(false);
  const [detailsId, setdetailsId] = useState();
  const [basicSellerDetails, setBasicSellerDetails] = useState({})
  const [sellerStoreDetails, setSellerStoreDetails] = useState({})

  const navigate = useNavigate();

  //console.log("Extracted ID from Params:", id);
  const getVendorsDetails = async (_id) => {
    // debugger
    if (!_id) {
      console.error("id", _id);
      return;
    }
    setloading(true);

    try {
      const response = await HttpClient.get(`/dashboard/vendors/${_id}`);
      console.log(response)




      setVendorDetails(response.vendorDetail);
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

      console.log("formattingStoreDetails", response.vendorDetail.storeDetails)

      const formattingStoreDetails = response.vendorDetail.storeDetails.map((eachDetail) => ({
        storeProducts: eachDetail.products,
        storeAddress: eachDetail.storeAddress,
        storeDescription: eachDetail.storeDescription,
        storeName: eachDetail.storeName
      }))
      console.log("formattingStoreDetails", formattingStoreDetails)
      setSellerStoreDetails(formattingStoreDetails)
      console.log("sellerStoreDetails", sellerStoreDetails)


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
            <div className="flex flex-wrap justify-between mx-2 py-16 items-center gap-4">
              <div className="flex gap-2 items-center">
                <div className="h-[100px] w-[100px] bg-[#D9D9D9] rounded-full flex items-center justify-center">
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

            <div className="flex mx-6 justify-around">
              <div className="flex flex-col space-y-4 pr-2">
                <div className="flex flex-col ">
                  <h1 className="font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]">
                    Email:
                  </h1>
                  <p className="font-poppins font-normal text-[16px] leading-[21px]">
                    {basicSellerDetails.email}
                  </p>
                </div>
                <div className="flex flex-col">
                  <h1 className="font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]">
                    Address:
                  </h1>
                  <p className="font-poppins font-normal text-[16px] leading-[21px]">
                    {basicSellerDetails.address}                 </p>
                  <p>{basicSellerDetails.postalCode}, {basicSellerDetails.state}</p>
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

            <div className="my-10 mx-6">
              <h1 className="font-poppins font-medium text-[20px] leading-[21px] text-[#011F4B]">
                Recently Added Products
              </h1>
              <div className="overflow-x-auto">
                <table className="my-6 border-gray-300 w-full">
                  <thead className="border-b border-gray-300">
                    <tr>
                      <th className="font-poppins font-normal text-[14px] leading-[21px] text-[#6C757D] px-5 border-r  border-gray-300">
                        S.N.
                      </th>
                      <th className="font-poppins font-normal text-[14px] leading-[21px] text-[#6C757D] px-5  border-r  border-gray-300">
                        Order Id
                      </th>
                      <th className="font-poppins font-normal text-[14px] leading-[21px] text-[#6C757D] px-5  border-r  border-gray-300">
                        Date
                      </th>
                      <th className="font-poppins font-normal text-[14px] leading-[21px] text-[#6C757D]  px-5 ">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorDetails?.productDetails
                      ?.slice(0, 3)
                      .map((product, index) => (
                        <tr key={product.productId}>
                          <td className="text-center font-poppins font-normal text-[14px] leading-[21px] text-[#000000] px-5  border-r  border-gray-300">
                            {index + 1}
                          </td>
                          <td className="text-center font-poppins font-normal text-[14px] leading-[21px] text-[#000000] px-5  border-r  border-gray-300">
                            {" "}
                            {product.productId}
                          </td>
                          <td className="text-center font-poppins font-normal text-[14px] leading-[21px] text-[#000000] px-5 border-r  border-gray-300">
                            {product.createdAt}
                          </td>
                          <td className="text-center font-poppins font-normal text-[14px] leading-[21px] text-[#000000] px-5 ">
                            {product.price}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mx-8">
              <Link className="font-poppins font-normal text-[14px] leading-[21px] text-[#253B80]">
                See All
              </Link>
            </div>
            <div className="mx-5 py-5">
              <h5 className="font-poppins font-medium text-[20px] leading-[21px] text-[#011F4B] ">
                Performance Metrics
              </h5>
              <div className="flex flex-wrap gap-10 py-6">
                <div className="w-48 h-40 rounded overflow-hidden shadow-lg  py-6 px-4 matrixCards">
                  <div className="mb-4">
                    <div className="  font-sans font-normal text-[15px] leading-[22px] text-[#22303E]/70 mx-2">
                      Sales
                    </div>
                    <div className="mx-2 py-2 font-['Public_Sans'] text-[24px] font-medium leading-[38px] text-left">
                      {vendorDetails?.sales}
                    </div>

                    <div className="mx-2 py-2 font-[Public Sans] text-[16px] font-medium leading-[20px] text-left text-[#71DD37]">
                      34.5 hike in sales
                    </div>
                  </div>
                </div>
                <div className="w-48 h-40 rounded overflow-hidden shadow-lg py-6 px-4 matrixCards">
                  <div className="mb-4">
                    <div className="  font-sans font-normal text-[15px] leading-[22px] text-[#22303E]/70 mx-2">
                      Return Rate
                    </div>

                    <div className="font-['Public_Sans'] text-[24px] font-medium leading-[38px] text-left mx-2 py-2 text-[#22303EE5]/90">
                      {vendorDetails?.returned}
                    </div>
                  </div>
                </div>
                <div className="w-48 h-40 rounded overflow-hidden shadow-lg py-6 px-4 matrixCards">
                  <div className="mb-4">
                    <div className="  font-sans font-normal text-[15px] leading-[22px] text-[#22303E]/70 mx-2">
                      Customer Rating
                    </div>

                    <div className="mx-2">star rating</div>

                    <div className="font-['Public_Sans'] text-[16px] font-normal leading-[22px] text-left mx-2 py-10">
                      Based on 50 reviews
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap py-10 gap-5">
                <Button className="w-[150px] h-[42px] px-[30px] py-[13px] gap-[10px] rounded-tl-[8px] border-[#8592A3] bg-[#F6FAFF] text-[#000000]">
                  Send Message
                </Button>
                <Button className="w-[150px] h-[42px] px-[30px] py-[13px] gap-[10px] rounded-tl-[8px] bg-[#FFFAF1] border-[#B9861F] text-[#B9861F]">
                  Suspend
                </Button>
                <Button className="w-[150px] h-[42px] px-[30px] py-[13px] gap-[10px] rounded-tl-[8px] bg-[#FFEFEF] border-[#EB001B] text-[#EB001B]">
                  Delete
                </Button>
                <Button className="w-[150px] h-[42px] px-[30px] py-[13px] gap-[10px] rounded-tl-[8px] bg-[#18B348] border-[#007D27] text-[#FFFFFF]">
                  Approve
                </Button>
              </div>
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
