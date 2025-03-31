import React, { useState } from "react";
import axios from "axios";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import Modal from "react-modal";


export default function Footer() {
  const [mailToSubscribe, setMailToSubscribe] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubscribe = async () => {
    if (!mailToSubscribe) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // try {
    //   const response = await axios.post("/api/subscribe", {
    //     email: mailToSubscribe,
    //   });
    //   if (response.status === 200) {
    //     setSuccessMessage("Thank you for subscribing!");
    //     setMailToSubscribe("");
    //   }
    // } catch (error) {
    //   setErrorMessage("Failed to subscribe. Please try again later.");
    // }
  };

  return (
    <footer className="bg-[#FAFAFA] px-3 md:px-10  py-[30px]">
      <div className="mb-12 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4">
          <p className="font-[Quicksand] text-[#011F4B] font-semibold mb-4 text-xl">
            Like to hear from us!
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="email"
              placeholder="ENTER YOUR EMAIL ADDRESS"
              required
              onChange={(e) => {
                setMailToSubscribe(e.target.value);
                setSuccessMessage("");
                setErrorMessage("");
              }}
              value={mailToSubscribe}
              className="flex-1 bg-white border-2 border-[#011F4B] rounded-md outline-none text-[#9E9E9E] text-lg font-medium py-1 px-2"
            />
            <button
              type="button"
              onClick={handleSubscribe}
              className="bg-[#011F4B] text-white text-lg font-medium rounded-md py-1 px-3"
            >
              SUBSCRIBE
            </button>
          </div>
          {successMessage && (
            <p className="text-green-500 mt-2">{successMessage}</p>
          )}
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-3">
  {/* Online Shopping */}
  <Link to="/" className="flex flex-col">
    <div className="flex items-center md:text-xl text-sm font-[Quicksand] font-medium text-[#0F0F0F] mb-1">
      <p className="mr-2">Online shopping</p>
      <MdArrowOutward className="text-2xl text-[#0F0F0F]" />
    </div>
    <p className="text-[#949494] text-sm md:text-lg font-[Poppins] font-light">
      Visit our wide range of products.
    </p>
  </Link>

  {/* Privacy Policy */}
  <Link to="/privacy_policy" className="flex flex-col">
    <div className="flex items-center md:text-xl text-sm font-[Quicksand] font-medium text-[#0F0F0F] mb-1">
      <p className="mr-2">Privacy Policy</p>
      <MdArrowOutward className="text-2xl text-[#0F0F0F]" />
    </div>
    <p className="text-[#949494] text-sm md:text-lg font-[Poppins] font-light">
      Complete description of our privacy policy.
    </p>
  </Link>

  {/* Mail Us */}
  <a
    href="https://mail.google.com/mail/?view=cm&fs=1&to=huvoofficial@gmail.com"
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col"
  >
    <div className="flex items-center md:text-xl text-sm font-[Quicksand] font-medium text-[#0F0F0F] mb-1">
      <p className="mr-2">Mail us</p>
      <MdArrowOutward className="text-2xl text-[#0F0F0F]" />
    </div>
    <p className="text-[#949494] text-sm md:text-lg font-[Poppins] font-light">
      huvoofficial@gmail.com
    </p>
  </a>

  {/* Contact Us (Modal Trigger) */}
  <Link to="/contact_us">
  <div  className="flex flex-col cursor-pointer">
    <div className="flex items-center md:text-xl text-sm font-[Quicksand] font-medium text-[#0F0F0F] mb-1">
      <p className="mr-2">Contact Us</p>
      <MdArrowOutward className="text-2xl text-[#0F0F0F]" />
    </div>
    <p className="text-[#949494] text-sm md:text-lg font-[Poppins] font-light">
      Our Address
    </p>
  </div>
  </Link>

  {/* Return Policy */}
  <Link to="/returnpolicy" className="flex flex-col">
    <div className="flex items-center md:text-xl text-sm font-[Quicksand] font-medium text-[#0F0F0F] mb-1">
      <p className="mr-2">Return Policy</p>
      <MdArrowOutward className="text-2xl text-[#0F0F0F]" />
    </div>
    <p className="text-[#949494] text-sm md:text-lg font-[Poppins] font-light">
      Complete description of our return policy.
    </p>
  </Link>

  {/* Terms and Conditions */}
  <Link to="/termsandconditions" className="flex flex-col">
    <div className="flex items-center md:text-xl text-sm font-[Quicksand] font-medium text-[#0F0F0F] mb-1">
      <p className="mr-2">Terms and Conditions</p>
      <MdArrowOutward className="text-2xl text-[#0F0F0F]" />
    </div>
    <p className="text-[#949494] text-sm md:text-lg font-[Poppins] font-light">
      Complete description of Terms and Conditions.
    </p>
  </Link>
  {/* Shopping Policies */}

  <Link to="/shopping_policies" className="flex flex-col">
    <div className="flex items-center md:text-xl text-sm font-[Quicksand] font-medium text-[#0F0F0F] mb-1">
      <p className="mr-2">Shopping policies</p>
      <MdArrowOutward className="text-2xl text-[#0F0F0F]" />
    </div>
    <p className="text-[#949494] text-sm md:text-lg font-[Poppins] font-light">
      Complete description of Shopping policies.
    </p>
  </Link>

  {/* Cancellations and Refunds */}
  <Link to="/cancellation_refund" className="flex flex-col">
    <div className="flex items-center md:text-xl text-sm font-[Quicksand] font-medium text-[#0F0F0F] mb-1">
      <p className="mr-2">Cancellations and Refunds</p>
      <MdArrowOutward className="text-2xl text-[#0F0F0F]" />
    </div>
    <p className="text-[#949494] text-sm md:text-lg font-[Poppins] font-light">
      Complete description of our cancellations and refunds.
    </p>
  </Link>
</div>

{/* Modal for Contact Information */}
<Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  contentLabel="Contact Information"
  className="bg-white w-11/12 md:w-1/2 mx-auto my-20 p-6 rounded-lg shadow-lg outline-none"
  overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
>
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
  <p className="text-gray-600 mb-2">
    <strong>Merchant Legal Entity Name:</strong> VRADAKART PRIVATE LIMITED
  </p>
  <p className="text-gray-600 mb-2">
    <strong>Registered Address:</strong> #78/1 BEEMANENI TOWERS NAGAWARA MAIN ROAD HEBBAL Bengaluru KARNATAKA 560045
  </p>
  <p className="text-gray-600 mb-2">
    <strong>Operational Address:</strong> #78/1 BEEMANENI TOWERS NAGAWARA MAIN ROAD HEBBAL Bengaluru KARNATAKA 560045
  </p>
  <p className="text-gray-600 mb-2">
    <strong>Telephone No:</strong> 7899542105
  </p>
  <p className="text-gray-600 mb-2">
    <strong>E-Mail ID:</strong> huvoofficial@gmail.com
  </p>
  <button
    onClick={closeModal}
    className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
  >
    Close
  </button>
</Modal>


    </footer>
  );
}
