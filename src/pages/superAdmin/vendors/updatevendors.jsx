import React, { useState } from "react";
import Modal from "react-modal";
import { HttpClient } from "../../../server/client/http";

Modal.setAppElement("#root"); // Required for accessibility

export default function SellerActionModal({ _id }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleAction = async (action) => {
    try {
      setLoading(true);
      const response = await HttpClient.get(
        `/delete/suspend,retain/vendors/${_id}?action=${action}`
      );
      console.log("API Response:", response.data);
      alert(`${action} action completed successfully!`);
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-2" >
      {/* Open Modal Button */}
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Manage Seller
      </button>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="bg-white rounded-lg p-6 max-w-sm mx-auto shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Manage Seller
        </h2>

        <div className="flex flex-col gap-3">
          {/* Delete Button */}
          <button
            disabled={loading}
            onClick={() => handleAction("delete")}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Delete"}
          </button>

          {/* Suspend / Retain Button */}
          <button
            disabled={loading}
            onClick={() => handleAction("suspend_or_retain")}
            className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Suspend / Retain"}
          </button>
        </div>

        {/* Cancel Button */}
        <button
          onClick={closeModal}
          className="mt-4 w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </Modal>
    </div>
  );
}
