import React, { useState } from "react";
import axios from "axios";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";

export default function Footer() {
  const [mailToSubscribe, setMailToSubscribe] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

      <div className="flex flex-wrap justify-between gap-6">
        <div className="flex-shrink-0">
          <Link to="/">
            <img src="/assets/newlogo.png" alt="logo" className="h-16" />
          </Link>
        </div>

        <div className="flex-1 ">

          <Link to="/">


            <div className="flex items-center font-[Quicksand] font-medium text-xl text-[#0F0F0F] mb-4">
              <p className="mr-2">Online shopping</p>
              <MdArrowOutward className="text-[#0F0F0F] text-2xl" />
            </div>
            <p className="text-[#949494] font-light font-[Poppins]">
              Visit our wide range of products.
            </p>
          </Link>

        </div>


        <div className="flex flex-col items-center ">
          <Link to="/privacy">

            <div className="flex items-center font-[Quicksand] font-medium text-xl text-[#0F0F0F] mb-4">
              <p className="mr-2">Privacy Policy</p>
              <MdArrowOutward className="text-[#0F0F0F] text-2xl" />
            </div>

            <p className="text-[#949494] font-light font-[Poppins]">
              Complete description of our privacy policy.
            </p>
          </Link>

        </div>

        <div className="flex flex-col items-center ">
          <Link to="/returnpolicy">
            <div className="flex items-center font-[Quicksand] font-medium text-xl text-[#0F0F0F] mb-4">
              <p className="mr-2">Return Policy</p>
              <MdArrowOutward className="text-[#0F0F0F] text-2xl" />
            </div>


            <p className="text-[#949494] font-light font-[Poppins]">
              Complete description of our return policy.
            </p>
          </Link>
        </div>

        <div className="flex flex-col items-center ">
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
        </div>
      </div>
    </footer>
  );
}
