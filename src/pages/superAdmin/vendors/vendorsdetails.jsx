import { React, useState, useEffect } from "react";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";
import Superadminheader from "../../../components/superadminheader";
import { PiArrowArcLeft, PiArrowLeft } from "react-icons/pi";
import "../superadmin.css";
import { Link } from "react-router-dom";
import { HttpClient } from "../../../server/client/http";
import "react-circular-progressbar/dist/styles.css";
import { Button, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "./vendorsDetails.css";
import Loader from "../../../components/loader";
import { toast } from "react-toastify";
import { Card, Tag, Divider } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  CalendarOutlined
} from '@ant-design/icons';

export default function Vendorsdetail() {
  const { id } = useParams();
  const [vendorDetails, setVendorDetails] = useState([]);
  const [loading, setloading] = useState(false);
  const [detailsId, setdetailsId] = useState();
  const [basicSellerDetails, setBasicSellerDetails] = useState({});
  const [sellerStoreDetails, setSellerStoreDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionModal, setActionModal] = useState(true);
  const [vendorProductDetails, setVendorProductDetails] = useState();
  const [sellerEmail, setSellerEmail] = useState("");

  const navigate = useNavigate();

  const getVendorsDetails = async (_id) => {
    if (!_id) {
      console.error("id", _id);
      return;
    }
    setloading(true);

    try {
      const response = await HttpClient.get(`/dashboard/vendors/${_id}`);
      setSellerEmail(response?.vendorDetail?.email);
      setVendorDetails(response?.vendorDetail);
      setVendorProductDetails(response);

      const formattedSellerDetails = response.vendorDetail.address.map((each) => ({
        address: each?.address,
        city: each?.city,
        isDefault: each?.isDefault,
        mobileNumber: each?.mobileNumber,
        postalCode: each?.postalCode,
        state: each?.state,
        town: each?.town,
        name: each?.name
      }));

      setBasicSellerDetails(formattedSellerDetails[0]);
      setSellerStoreDetails(response?.vendorDetail?.storeDetails);

      if (response) {
        setloading(false);
      }
    } catch (error) {
      console.error(error.response);
      setloading(false);
    }
  };

  useEffect(() => {
    getVendorsDetails(id);
  }, [id]);

  const handleNavigate = () => {
    navigate(`/admin/vendors`);
  };

  const handleModalClose = () => {
    setActionModal(false);
  };

  const handleConfirmAction = () => {
    console.log("handleConfirmAction");
  };

  const getStatusTag = (status) => {
    return status ? (
      <Tag color="green" className="ml-2">Verified</Tag>
    ) : (
      <Tag color="orange" className="ml-2">Pending Verification</Tag>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="bg-[#E7EFFA] h-full">
        <SuperAdminNav />
      </div>

      <div className="flex flex-col w-full flex-1 overflow-auto">
        <div className="px-5 py-4 bg-white shadow-sm">
          <div className="flex items-center">
            <div
              className="h-14 w-14 bg-[#E7EFFA] rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => handleNavigate()}
            >
              <PiArrowLeft className="text-[#000000]" />
            </div>

            <div className="w-full ml-4">
              <Superadminheader />
            </div>
          </div>
          <div className="mt-1">
            <p className="font-poppins font-medium text-[#46484D] text-lg">
              Seller Info
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        {vendorDetails ? (
          <div className="p-5">
            {/* Vendor Profile Card */}
            <Card className="mb-2 shadow-sm">
              <div className="flex flex-wrap justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {basicSellerDetails?.name?.charAt(0) || "V"}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {basicSellerDetails?.name}
                    </h2>
                    {getStatusTag(vendorDetails?.vendorDetail?.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Registration</p>
                      <p className="font-medium">15-09-2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Valid Until</p>
                      <p className="font-medium">15-11-2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShopOutlined className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Store</p>
                      <p className="font-medium">
                        {sellerStoreDetails?.storeName || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="space-y-2">
                  <div className="flex flex-col">
                    <h3 className="flex items-center gap-2 text-gray-600">
                      <MailOutlined /> Email
                    </h3>
                    <p className="text-gray-800">{sellerEmail}</p>
                  </div>

                  <div className="flex flex-col">
                    <h3 className="flex items-center gap-2 text-gray-600">
                      <EnvironmentOutlined /> Address
                    </h3>
                    <p className="text-gray-800">
                      {basicSellerDetails?.address}
                      <br />
                      {basicSellerDetails?.postalCode && `${basicSellerDetails?.postalCode}, `}
                      {basicSellerDetails?.state}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <h3 className="flex items-center gap-2 text-gray-600">
                      <PhoneOutlined /> Contact
                    </h3>
                    <p className="text-gray-800">{basicSellerDetails?.mobileNumber}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Store Details Card */}
            <Card title="Store Information" className="mb-1 shadow-sm">
    <div className="flex flex-wrap gap-4">
        <div className="flex-1 space-y-2">
            <div className="flex flex-col">
                <h3 className="text-gray-600">Store Name</h3>
                <p className="text-gray-800">{sellerStoreDetails?.storeName}</p>
            </div>
            <div className="flex flex-col">
                <h3 className="text-gray-600">Store Description</h3>
                <p className="text-gray-800">{sellerStoreDetails?.storeDescription}</p>
            </div>
        </div>

        <div className="flex-1 space-y-2">
            <div className="flex flex-col">
                <h3 className="text-gray-600">Store Name</h3>
                <p className="text-gray-800">{sellerStoreDetails?.storeName}</p>
            </div>
        </div>

        <div className="flex-1 space-y-2">
            <div className="flex flex-col">
                <h3 className="text-gray-600">Store Address</h3>
                <p className="text-gray-800">{sellerStoreDetails?.storeAddress}</p>
            </div>
        </div>

        <div >
          <Link to="/add_coupons">
    <button
        type="button"
        className="bg-[#011f4b]  text-white py-2 px-4 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
    >
        Add Coupons
    </button>
    </Link>
</div>  
    </div>
</Card>




            {/* Products Link */}
            <Link
              to={`/admin/vendors/product_details/${id}`}
              state={vendorProductDetails}
              className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-700">View Seller Products</span>
                <span className="text-blue-500">→</span>
              </div>
            </Link>

            {/* Action Buttons */}
            {/* <div className="mt-6 flex gap-4">
              <Button 
                type="primary" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsModalOpen(true)}
              >
                Verify Vendor
              </Button>
              <Button 
                danger 
                onClick={() => setIsModalOpen(true)}
              >
                Suspend Vendor
              </Button>
            </div> */}
          </div>
        ) : (
          <div className="h-[62vh] flex items-center justify-center">
            {loading === true ? <Loader /> : "No Vendor Details Available"}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        title="Action Confirmation"
        open={isModalOpen}
        onOk={handleConfirmAction}
        onCancel={handleModalClose}
        footer={[
          <Button key="back" onClick={handleModalClose}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleConfirmAction}>
            Confirm
          </Button>,
        ]}
      >
        <p>Are you sure you want to perform this action?</p>
      </Modal>
    </div>
  );
}