import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HttpClient } from "../../server/client/http";
import { LogIn } from "../../server/user";
import { FaEye, FaEyeSlash, FaUserLock } from "react-icons/fa";
import Loader from "../../components/loader";


export default function Login() {
  const navigate = useNavigate();
  const [forgetPassword, setForgetPassword] = useState(false);
  const [isShow, setisShow] = useState(false);
  const [loader, setLoader] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    register: resetPassword,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetError },
  } = useForm({ submitFocusError: true });
  const onResetSubmit = async (data) => {


    console.log("data")
    try {
      const { message } = await HttpClient.post("/users/forgetPassword", data);
      toast.success(message);

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  const onSubmit = async (data) => {
    try {
      setLoader(true);
      const response = await HttpClient.post("/users/login", data);
      console.log("response", response)

      if (response) {
        setLoader(false);
      }
      LogIn(response);
      toast.success("Login Successful");
      localStorage.setItem("role", response?.userData?.role)
      localStorage.setItem("role", response?.userData?.role)


      if (response?.userData?.role === "SELLER") {
        navigate("/seller/profile");
        if (response?.userData?.verificationStatus === false) {
          toast.info("Kindly go to profile and update it for furthur process.")
        }
      } else if (response?.userData?.role === "ADMIN") {
        navigate("/admin");


      }
      else if (response?.userData?.role === "USER") {
        navigate("/");

      }

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      setLoader(false)
    }
  };





  const [userEmail, setUserEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const handlePasswordResetSubmit = async (event) => {

    console.log("userEmail",userEmail)
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    // Email validation
    const emailValidationRegex = /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/;
    if (!userEmail) {
      setFormError("Email address is required.");
      return;
    } else if (!emailValidationRegex.test(userEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    try {
      setIsFormSubmitting(true);

      // Simulated POST API call
    const response = await HttpClient.post("/users/sendOtp", {email : userEmail})

      if (response.success) {
        toast.success(response.message)
        setUserEmail(""); // Clear the input field
      } else {
        const errorResponse = await response.json();
        setFormError(errorResponse.message || "Failed to send password reset email.");
      }
    } catch (apiError) {
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsFormSubmitting(false);
    }
  };
  return (
    <>
      {loader ? <Loader /> :
        <section className="login-bg bg-[#fff] h-screen">


          <div className="go-home absolute right-[30px] top-[20px] z-[1]">
            <Link
              className="text-end text-[#011f4b] font-[Quicksand] font-medium"
              to="/"
            >
              Back to Home
            </Link>
            <div className="h-[2px] bg-[#011f4b] w-[0px] transition-all duration-300"></div>
          </div>

          <div className="absolute z-[1] w-full md:w-[50%] px-5 sm:px-0 right-0 text-center top-[25vh] font-[Quicksand]">
            {forgetPassword && (
              <div
                id="popup-modal"
                tabIndex="-1"
                className="font-[QuickSand] overflow-y-auto overflow-x-hidden  z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
              >
                <div className="relative sm:p-4 w-full max-w-md max-h-full mx-auto">
                  <div className="text-end">
                    <button
                      onClick={() => setForgetPassword(false)}
                      type="button"
                      className="text-black bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-hide="popup-modal"
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-4 md:p-5 text-center">
                      <h3 className="mb-5 text-2xl font-semibold text-black font-[QuickSand]">
                        Forgot Password{" "}
                      </h3>


                      <form
                        onSubmit={handlePasswordResetSubmit}
                        className="password-reset-form-container max-w-md mx-auto p-6 bg-white shadow-lg rounded-md"
                      >
                        <h2 className="password-reset-heading text-xl font-bold text-gray-800 mb-2">
                          Reset Your Password
                        </h2>

                        <label htmlFor="user-email" className="password-reset-label block text-gray-700 font-medium mb-2">
                          Enter your email address to reset your password
                        </label>
                        <input
                          type="email"
                          id="user-email"
                          className={`password-reset-input w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formError ? "border-red-500" : "border-gray-300"
                            }`}
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="Enter your email"
                        />

                        {formError && <p className="password-reset-error text-red-500 text-sm mt-2">{formError}</p>}
                        {formSuccess && <p className="password-reset-success text-green-500 text-sm mt-2">{formSuccess}</p>}

                        <button
                          type="submit"
                          className={`password-reset-submit-btn w-full mt-2 p-3 text-white rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none ${isFormSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          disabled={isFormSubmitting}
                        >
                          {isFormSubmitting ? "Submitting..." : "Send Reset Link"}
                        </button>
                      </form>



                    </div>
                  </div>
                </div>
              </div>
            )}
            {!forgetPassword && (
              <>
                <div className="flex items-center justify-center">
                  <Link to="/">
                    <img
                      src="/assets/vardacartslogo.svg"
                      alt="Logo"
                      className="w-[180px] mb-3"
                    />
                  </Link>
                </div>

                <p className="text-lg text-gray-600 text-center mb-2">
                  Your one-stop shop for everything you love!
                </p>

                <p className="font-semibold text-3xl md:text-3xl xl:text-5xl text-black mb-2">
                  LOG IN
                </p>


                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-control mb-10">
                    <input
                      className="text-[#5A5A5A] pl-2 font-medium text-lg  border-b-2 border-black border-solid bg-transparent outline-none w-full sm:w-3/4 xl:w-1/2"
                      type="text"
                      name="email"
                      placeholder="Email"
                      {...register("email", {
                        required: "*username is required.",
                        pattern: {
                          value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                          message: "*username is not valid.",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="errorMsg text-[#E40606]">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="form-control relative">
                    <input
                      className="text-[#5A5A5A] pl-2 font-medium text-lg  border-b-2 border-black border-solid bg-transparent outline-none w-full sm:w-3/4 xl:w-1/2 my-3"
                      placeholder="Password"
                      type={isShow ? "text" : "password"}
                      name="password"
                      autoComplete="on"
                      {...register("password", {
                        required: "*Password is required.",
                        minLength: {
                          value: 8,
                          message: "*Password should be at-least 8 characters.",
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message: "*Password must contain one uppercase letter,one lowercase letter,one number,one special character.",
                          },
                        },
                      })}
                    />
                    {isShow ? (
                      <FaEyeSlash
                        onClick={() => setisShow(false)}
                        className="absolute bottom-[17px] right-[2%] sm:right-[15%] xl:right-[27%]"
                      />
                    ) : (
                      <FaEye
                        onClick={() => setisShow(true)}
                        className="absolute bottom-[17px] right-[2%] sm:right-[15%] xl:right-[27%]"
                      />
                    )}
                    {errors.password && (
                      <p className="errorMsg text-[#E40606]">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <p
                    onClick={() => setForgetPassword(true)}
                    className="text-[#011F4B] font-medium mt-2 mb-4 ml-[30%]"
                  >
                    <span className="cursor-pointer">FORGOT PASSWORD?</span>
                  </p>
                  <button className="font-medium text-[#011F4B] rounded-lg border-2 border-solid border-[#011F4B] py-2 px-6">
                    LOG IN
                  </button>
                  <p className="text-[#5A5A5A] font-medium my-3">OR</p>
                  <div className="text-[#011F4B] font-medium go-home">
                    <div>
                      <Link
                        className="hover:underline decoration-2 underline-offset-4"
                        to="/register/user"
                      >
                        CREATE AN ACCOUNT AS USER?
                      </Link>
                    </div>
                    <div>
                      <Link
                        className="hover:underline decoration-2 underline-offset-4"
                        to="/register/seller"
                      >
                        CREATE AN ACCOUNT AS SELLER?
                      </Link>
                    </div>

                  </div>
                </form>


              </>
            )}
          </div>
        </section>

      }

    </>
  );
}
