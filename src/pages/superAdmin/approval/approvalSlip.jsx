import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Button, Spin } from "antd";
import { PiArrowLeft } from "react-icons/pi";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";
import Superadminheader from "../../../components/superadminheader";
import { HttpClient } from "../../../server/client/http";
import { toast } from "react-toastify";

export default function ApprovalSlip() {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchSellerDetails = async () => {
    setPageLoading(true);
    try {
      const response = await HttpClient.get(`/approval/requests`, { sellerId: id });
      setSellerDetails(response);
    } catch (error) {
      console.error("Error fetching seller details:", error);
    } finally {
      setPageLoading(false);
    }
  };



  useEffect(() => {
    if (id) fetchSellerDetails();
  }, [id]);

  const renderDocumentPreview = (url, altText) => (
    <a
      href={url}
      download
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mt-2 text-blue-600 underline hover:text-blue-800"
    >
      <img src={url} alt={altText} className="max-w-[200px] border rounded-md shadow" />
      <p className="text-sm mt-1">Click to View</p>
    </a>
  );

  const startPanVerification = (pan) => {
    setPageLoading(true);

    const intervalId = setInterval(() => {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

      if (panRegex.test(pan)) {
        toast.success("Valid PAN number ✅");
      } else {
        toast.error("Invalid PAN number ❌");
      }

      clearInterval(intervalId); // Stop repeating
      setPageLoading(false); // End loading after result
    }, 2000); // Run after 2 seconds
  };

  const approveSeller = async () => {
    try {
      const response = await HttpClient.put("")
      console.log(response)

    } catch (error) {
      toast.error("Couldn't verify")
    }
  }



  return (
    <div className="flex">
      <SuperAdminNav />
      <div className="flex flex-col min-h-screen w-full bg-gray-100 p-4">
        <Superadminheader />

        {/* Header Section */}
        <div className="flex items-center mb-4">
          <div
            className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <PiArrowLeft className="text-black text-xl" />
          </div>
          <h1 className="ml-4 text-2xl font-semibold">Approval Slip</h1>
        </div>

        {/* Details Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full mx-auto">
          {pageLoading ? (
            <div className="flex justify-center items-center">
              <Spin size="large" />
            </div>
          ) : (
            <>
              {/* Personal Info */}
              <h2 className="text-lg font-semibold border-b pb-2">Personal Information</h2>
              <div className="py-2 space-y-3">
                <div className="flex items-center gap-4">
                  <strong className="text-gray-600 w-40">Seller Name:</strong>
                  <p>{sellerDetails?.createdBy?.firstName} {sellerDetails?.createdBy?.lastName}</p>
                </div>

                <div className="flex items-center gap-4">
                  <strong className="text-gray-600 w-40">Seller ID:</strong>
                  <p>{sellerDetails?.createdBy?._id}</p>
                </div>

                <div className="flex items-center gap -4">
                  <strong className="text-gray-600 w-40">Email:</strong>
                  <p>{sellerDetails?.createdBy?.email}</p>
                </div>

                <div className="flex items-center gap-4">
                  <strong className="text-gray-600 w-40">Registered Date:</strong>
                  <p>{sellerDetails?.createdAt?.slice(0, 10)}</p>
                </div>
              </div>


              {/* GST Info */}
              <h2 className="text-lg font-semibold border-b pb-2 mt-6">GST Information</h2>
              <div className="flex flex-wrap mt-4 gap-6">
              <div className="flex items-center flex-wrap gap-4">
  <strong className="text-gray-600">GST Number :</strong>
  <p className="text-gray-800">{sellerDetails?.GSTIN}</p>
  <button
    onClick={() => {
      navigator.clipboard.writeText(sellerDetails?.GSTIN || '');
      toast.success("GSTIN copied to clipboard ✅");
    }}
    className="text-blue-600 text-sm hover:underline"
  >
    Copy GSTN
  </button>
  <a
    href="https://services.gst.gov.in/services/searchtp"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 text-sm hover:underline"
  >
    Visit GST Website
  </a>
</div>

           

                <div className="w-full flex flex-c  ol md:flex-row md:items-center gap-4">
                  <div>
                    <strong className="text-gray-600">GST Document : </strong>
                    {renderDocumentPreview(sellerDetails?.gstDoc, "GST Document")}
                  </div>
                  <button className="bg-[#011F4B] rounded-lg px-4 py-2 text-white self-start md:self-center">
                    Verify GST
                  </button>
                

                </div>

                <div className="flex items-center gap-4">
                  <strong className="text-gray-600">PAN Number : </strong>
                  <p>{sellerDetails?.PAN}</p>
                </div>

                <div className="w-full flex flex-col md:flex-row md:items-center gap-4">
                  <div>
                    <strong className="text-gray-600">PAN Document : </strong>
                    {renderDocumentPreview(sellerDetails?.panDoc, "PAN Document")}
                  </div>
                  <button onClick={() => startPanVerification(sellerDetails?.PAN)}
                    className="bg-[#011F4B] rounded-lg px-4 py-2 text-white self-start md:self-center">
                    Verify PAN
                  </button>
                </div>
                <div className="flex gap-2">

                  <button onClick={approveSeller} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition duration-200">
                    Approve Seller
                  </button>


                  <button className="bg-red-700 hover:bg-red-800 text-white px-2 py-1 rounded-lg transition duration-200">
                    Suspend Seller
                  </button>

                </div>
              </div>
            </>

          )}
        </div>

        {/* Approval Confirmation Modal */}
        <Modal
          title="Confirm Approval"
          visible={modalVisible}
          onOk={() => {
            setModalVisible(false);
            setLoading(true);
            setTimeout(() => {
              alert("Approval successful");
              setLoading(false);
              navigate(-1);
            }, 2000);
          }}
          onCancel={() => setModalVisible(false)}
          okText="Approve"
          cancelText="Cancel"
        >
          <p>Are you sure you want to approve this document?</p>
        </Modal>
      </div>
    </div>
  );
}
