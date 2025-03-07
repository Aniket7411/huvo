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
    <footer className="bg-[#FAFAFA] px-10 py-[50px]">
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

      <div className="flex flex-wrap justify-between gap-2 md:gap-6">
        <Link to="/">
          <div className="flex items-center font-[Quicksand] font-medium text-xl text-[#0F0F0F] mb-1">
            <p className="mr-2">Online shopping</p>
            <MdArrowOutward className="text-[#0F0F0F] text-2xl" />
          </div>
          <p className="text-[#949494] font-light font-[Poppins]">
            Visit our wide range of products.
          </p>
        </Link>





        <div className="flex flex-col items-center ">
          <Link to="/privacy">

            <div className="flex items-center font-[Quicksand] font-medium text-xl text-[#0F0F0F] mb-1">
              <p className="mr-2">Privacy Policy</p>
              <MdArrowOutward className="text-[#0F0F0F] text-2xl" />
            </div>

            <p className="text-[#949494] font-light font-[Poppins]">
              Complete description of our privacy policy.
            </p>
          </Link>

        </div>

        <div className="flex flex-col items-center">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=huvoofficial@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
          >
            <div className="flex items-center font-[Quicksand] font-medium text-xl text-[#0F0F0F] mb-1">
              <p className="mr-2">Mail us</p>
              <MdArrowOutward className="text-[#0F0F0F] text-2xl" />
            </div>

            <p className="text-[#949494] font-light font-[Poppins]">
              huvoofficial@gmail.com
            </p>
          </a>
        </div>

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
            <strong>Registered Address:</strong>  #78/1 BEEMANENI TOWERS NAGAWARA MAIN ROAD HEBBAL Bengaluru KARNATAKA 560045
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Operational Address:</strong> #78/1 BEEMANENI TOWERS NAGAWARA MAIN ROAD HEBBAL Bengaluru KARNATAKA 560045
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Telephone No:</strong> 7899542105 
          </p>
          <p className="text-gray-600 mb-2">
            <strong>E-Mail ID:</strong>  huvoofficial@gmail.com 
          </p>
          <button
            onClick={closeModal}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Close
          </button>
        </Modal>

        <div onClick={openModal} className="flex cursor-pointer flex-col items-center">

          <div  className="flex items-center  font-[Quicksand] font-medium text-xl text-[#0F0F0F] mb-1">
            <p className="mr-2"
            >Contact US
            </p>
            <MdArrowOutward className="text-[#0F0F0F] text-2xl" />
          
          </div>
          <p className="text-[#949494] font-light font-[Poppins]">
              Our Address
            </p>

        </div>


        <div className="flex flex-col items-center ">
          <Link to="/returnpolicy">
            <div className="flex items-center font-[Quicksand] font-medium text-xl text-[#0F0F0F] mb-1">
              <p className="mr-2">Return Policy</p>
              <MdArrowOutward className="text-[#0F0F0F] text-2xl" />
            </div>


            <p className="text-[#949494] font-light font-[Poppins]">
              Complete description of our return policy.
            </p>
          </Link>
        </div>

        <div className="flex flex-col items-center ">
          <Link to="/termsandconditions">
            <div className="flex items-center font-[Quicksand] font-medium text-xl text-[#0F0F0F] mb-1">
              <p className="mr-2">Terms and conditions
              </p>
              <MdArrowOutward className="text-[#0F0F0F] text-2xl" />
            </div>


            <p className="text-[#949494] font-light font-[Poppins]">
              Complete description of Terms and conditions.
            </p>
          </Link>
        </div>


        <div className="flex flex-col items-center ">
          <Link to="/cancellation_refund">
            <div className="flex items-center font-[Quicksand] font-medium text-xl text-[#0F0F0F] mb-1">
              <p className="mr-2">Cancellations and refunds</p>
              <MdArrowOutward className="text-[#0F0F0F] text-2xl" />
            </div>


            <p className="text-[#949494] font-light font-[Poppins]">
              Complete description of our cancellations and refunds.
            </p>
          </Link>
        </div>

        {/* <div className="flex items-center ">
          <p className="font-[Quicksand] font-medium text-xl text-[#0F0F0F] mb-4">
            Stay connected
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-[#949494] font-[Quicksand]">
              <FaInstagram /> Instagram
            </li>
            <li className="flex items-center gap-2 text-[#949494] font-[Quicksand]">
              <FaFacebook /> Facebook
            </li>
            <li className="flex items-center gap-2 text-[#949494] font-[Quicksand]">
              <FaWhatsapp /> Whatsapp
            </li>
          </ul>
        </div> */}
      </div>
    </footer>
  );
}
