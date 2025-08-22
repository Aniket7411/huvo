import { React, useState, useEffect } from "react";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";
import Superadminheader from "../../../components/superadminheader";
import { PiArrowLeft } from "react-icons/pi";
import "../superadmin.css";
import { Link } from "react-router-dom";
import { HttpClient } from "../../../server/client/http";
import "react-circular-progressbar/dist/styles.css";
import { Button, Modal, Card, Tag, Divider } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "./vendorsDetails.css";
import Loader from "../../../components/loader";
import { toast } from "react-toastify";
import {
  MailOutlined,
  PhoneOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

export default function Vendorsdetail() {
  const { id } = useParams();
  const [vendorDetails, setVendorDetails] = useState([]);
  const [loading, setloading] = useState(false);
  const [basicSellerDetails, setBasicSellerDetails] = useState({});
  const [sellerStoreDetails, setSellerStoreDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionModal, setActionModal] = useState(""); // block | approve
  const [vendorProductDetails, setVendorProductDetails] = useState();
  const [sellerEmail, setSellerEmail] = useState("");

  const navigate = useNavigate();

  const getVendorsDetails = async (_id) => {
    if (!_id) return;
    setloading(true);
    try {
      const response = await HttpClient.get(`/dashboard/vendors/${_id}`);
      setSellerEmail(response?.vendorDetail?.email);
      setVendorDetails(response?.vendorDetail);
      setVendorProductDetails(response);

      const formattedSellerDetails = response.vendorDetail.address.map(
        (each) => ({
          address: each?.address,
          city: each?.city,
          isDefault: each?.isDefault,
          mobileNumber: each?.mobileNumber,
          postalCode: each?.postalCode,
          state: each?.state,
          town: each?.town,
          name: each?.name,
        })
      );

      setBasicSellerDetails(formattedSellerDetails[0]);
      setSellerStoreDetails(response?.vendorDetail?.storeDetails);
    } catch (error) {
      console.error(error.response);
    } finally {
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
    setIsModalOpen(false);
  };

  const handleConfirmAction = async () => {
    if (actionModal === "block") {
      await blockSeller();
    } else if (actionModal === "approve") {
      await approveSeller();
    }
    setIsModalOpen(false);
  };

  const getStatusTag = (status) => {
    return status ? (
      <Tag color="green" className="ml-2">
        Verified
      </Tag>
    ) : (
      <Tag color="red" className="ml-2">
        Blocked
      </Tag>
    );
  };

  const approveSeller = async () => {
    try {
      const response = await HttpClient.put("/users/block", {
        sellerId: id,
        blockType: "approve", // any non-block will set verificationStatus: true
      });
      toast.success(response?.message || "Seller approved successfully");
      getVendorsDetails(id); // refresh without reload
    } catch (error) {
      toast.error("Couldn't verify");
    }
  };

  const blockSeller = async () => {
    try {
      const response = await HttpClient.put("/users/block", {
        sellerId: id,
        blockType: "block", // sets verificationStatus: false
      });
      toast.success(response?.message || "Seller blocked successfully");
      getVendorsDetails(id); // refresh without reload
    } catch (error) {
      toast.error("Couldn't block");
    }
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
          <div className="mt-1 flex items-center">
            <p className="font-poppins font-medium text-[#46484D] text-lg">
              Seller Info
            </p>
            {getStatusTag(vendorDetails?.verificationStatus)}
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
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Registered</p>
                      <p className="font-medium">15-09-2024</p>
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-2">
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
                  </div> */}
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
                      {basicSellerDetails?.postalCode &&
                        `${basicSellerDetails?.postalCode}, `}
                      {basicSellerDetails?.state}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-2xl shadow-md bg-white w-full max-w-sm">
                  {/* Contact Section */}
                  <div className="flex flex-col">
                    <h3 className="flex items-center gap-2 text-gray-600 font-medium">
                      <PhoneOutlined /> Contact
                    </h3>
                    <p className="text-gray-800 font-semibold">
                      {basicSellerDetails?.mobileNumber || "Not Available"}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow"
                      onClick={() => {
                        setIsModalOpen(true);
                        setActionModal("block");
                      }}
                    >
                      Block Seller
                    </button>
                    <button
                      className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow"
                      onClick={() => {
                        setIsModalOpen(true);
                        setActionModal("approve");
                      }}
                    >
                      Approve Seller
                    </button>
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
                    <p className="text-gray-800">
                      {sellerStoreDetails?.storeName}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-gray-600">Store Description</h3>
                    <p className="text-gray-800">
                      {sellerStoreDetails?.storeDescription}
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-col">
                    <h3 className="text-gray-600">Store Address</h3>
                    <p className="text-gray-800">
                      {sellerStoreDetails?.storeAddress}
                    </p>
                  </div>
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
                <span className="font-medium text-blue-700">
                  View Seller Products
                </span>
                <span className="text-blue-500">→</span>
              </div>
            </Link>
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
          <Button
          className="text-[#000]"
            key="submit"
            type="primary"
            danger={actionModal === "block"}
            onClick={handleConfirmAction}
          >
            {actionModal === "block" ? "Block" : "Approve"}
          </Button>,
        ]}
      >
        <p>
          Are you sure you want to{" "}
          <span
            className={
              actionModal === "block" ? "text-red-500" : "text-green-500"
            }
          >
            {actionModal === "block" ? "block" : "approve"}
          </span>{" "}
          this seller?
        </p>
      </Modal>
    </div>
  );
}
