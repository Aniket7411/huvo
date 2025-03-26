import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Modal, Button, Spin } from 'antd';
import { PiArrowArcLeft } from 'react-icons/pi';
import SuperAdminNav from '../../../components/superadminNavbar/superadminnav';
import Superadminheader from '../../../components/superadminheader';
import { HttpClient } from '../../../server/client/http';

export default function ApprovalSlip() {
  const [approvalDetails, setApprovalDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userId, setUserId] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const getApprovalDetails = async (_id) => {
    if (!_id) {
      console.error("Invalid ID", _id);
      return;
    }

    setLoading(true);
    try {
      const response = await HttpClient.get("/approval/requests", { sellerId: _id });
      setApprovalDetails(response);
      setUserId(response?.message?.pan?.userId || "");
    } catch (error) {
      console.error("Error fetching approval details", error);
      toast.error("Failed to fetch approval details.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async () => {
    setIsModalVisible(false);
    setLoading(true);

    try {
      const response = await HttpClient.post(`/verify/documents`, { userId });
      toast.success(response?.message || "Approval successful.");
      navigate(-1); // Navigate back after approval
    } catch (error) {
      console.error("Error approving document", error);
      toast.error("Approval failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApprovalDetails(id);
  }, [id]);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  return (
    <div className="flex h-screen">
      <div className="bg-[#E7EFFA] h-full">
        <SuperAdminNav />
      </div>

      <div className="flex flex-col w-full flex-1 overflow-auto">
        <div className="px-5">
          <div className="flex items-center">
            <div
              className="h-14 w-14 bg-[#E7EFFA] rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <PiArrowArcLeft className="text-[#000000]" />
            </div>
            <div className="w-full">
              <Superadminheader />
            </div>
          </div>

          <div className="mx-2 mt-5">
            <h1 className="font-poppins font-bold text-xl">Approval Slip</h1>
          </div>

          <div className="mx-2 mt-4">
            {loading ? (
              <div className="flex justify-center items-center">
                <Spin size="large" />
              </div>
            ) : approvalDetails ? (
              <div className="bg-white p-5 rounded-lg shadow-lg">
                <h2 className="font-semibold text-lg">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-gray-600">Business Name:</p>
                    <p>{approvalDetails?.message?.businessName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email:</p>
                    <p>{approvalDetails?.message?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Address:</p>
                    <p>{approvalDetails?.message?.address || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Contact Number:</p>
                    <p>{approvalDetails?.message?.contactNumber || "N/A"}</p>
                  </div>
                </div>

                <h2 className="font-semibold text-lg mt-6">GST Information</h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-gray-600">GST Number:</p>
                    <p>{approvalDetails?.message?.gst?.gstin || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">GSTN Status:</p>
                    <p>{approvalDetails?.message?.gst?.gstinStatus || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Legal Name:</p>
                    <p>{approvalDetails?.message?.gst?.legalNameOfBusiness || "N/A"}</p>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button type="primary" danger onClick={showModal}>
                    Approve
                  </Button>
                </div>
              </div>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>

        <Modal
          title="Confirm Approval"
          visible={isModalVisible}
          onOk={handleApproval}
          onCancel={handleCancel}
          okText="Approve"
          cancelText="Cancel"
        >
          <p>Are you sure you want to approve this document?</p>
        </Modal>
      </div>
    </div>
  );
}
