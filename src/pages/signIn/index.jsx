import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HttpClient } from "../../server/client/http";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import LoadSpinner from "../../components/LoadSpinner";
import Loader from "../../components/loader";
export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location, "ssloc");
  const path = location.pathname.split("/");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isShow, setisShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [userNameError, setUserNameError] = useState("");
  const [isError, setIsError] = useState(false);

  const onSubmit = async (data) => {
    console.log(data)
    setLoader(true);
    let datanew = { ...data, role: path[2].toUpperCase()  };
    console.log(datanew);
    try {
      const response = await HttpClient.post("/users/signup", datanew);
      if (response) {
        setLoader(false);
       
        toast.success(response.message);
        console.log(response)
        reset();
        navigate("/login");
      }
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.response?.data?.message);
      console.log(error?.response);
      setLoader(false);
      reset();
     
    }
  };
  
  const checkUsername = async (event) => {
    const username = event.target.value;
    if (!username) {
      setUserNameError("");
      setIsError(false); 
      return;
    }
  
    try {
      const response = await HttpClient.post(`/users/username`,{username});
    console.log(response)
    console.log(response.status)
    console.log(response.message)
      if (response.message === "Username is available") {
        setUserNameError("Username is available"); 
     
        console.log("Username is available");
      }
      console.log("b")
    }
     
     catch (error) {
        setIsError(true); 
     
        if (error.response && error.response.status === 400) {
       console.log(error.response)
       console.log(error.response.status)
          if (error.response.data.message === "Username not available") {
            setUserNameError("Username already exists. Please try another.");
          } else if (error.response.data.message === "Invalid username. It must start with a letter and can only contain letters, numbers, and underscores.") {
          
            setUserNameError("Invalid entry: can only contain letters, numbers, and underscores");
          } else {
           
            setUserNameError("An error occurred. Please try again.");
          }
        } else {
          
          setUserNameError("Something went wrong. Please try again later.");
        }
      
    
    
    } 
  };
  return (
    <>
      <section className="register-bg h-screen">
        <div className="go-home absolute right-[30px] top-[20px] z-[1]">
          <Link
            className="text-end text-[#011f4b] font-[Quicksand] font-medium"
            to="/"
          >
            Back to Home
          </Link>
          <div className="h-[2px] bg-[#011f4b] w-[0px] transition-all duration-300"></div>
        </div>
        <div className="absolute z-[1] w-full sm:w-[80%] md:w-[45%] px-5 sm:px-0 right-0 top-[15vh] font-[Quicksand]">
          <p className="font-semibold text-xl md:2xl xl:text-3xl text-black mb-2 w-full sm:w-3/4 text-center">
            Register
          </p>
          {loader === false && (
           
                <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control mb-3">
                <label className="block mb-1" htmlFor="firstName">
                  FIRST NAME
                </label>
                <input
                  className="text-[#5A5A5A] pl-2 font-medium text-lg  border-2 border-black border-solid bg-transparent outline-none w-full sm:w-3/4 "
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="Enter your first name"
                  {...register("firstName", {
                    required: "*First Name is required.",
                    pattern: {
                      value: /^[a-zA-Z\s]*$/,
                      message: "*Name field must be in alphabets.",
                    },
                  })}
                />
                {errors.firstName && (
                  <p className="errorMsg text-[#E40606]">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="form-control mb-3">
                <label className="block mb-1" htmlFor="lastName">
                  LAST NAME
                </label>
                <input
                  className="text-[#5A5A5A] pl-2 font-medium text-lg  border-2 border-black border-solid bg-transparent outline-none w-full sm:w-3/4 "
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  {...register("lastName", {
                    required: "*Last Name is required.",
                    pattern: {
                      value: /^[a-zA-Z\s]*$/,
                      message: "*Name field must be in alphabets.",
                    },
                  })}
                />
                {errors.lastName && (
                  <p className="errorMsg text-[#E40606]">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              {path[2].toUpperCase() === "SELLER" && (
              <div className="form-control mb-3">
                <label className="block mb-1" htmlFor="firstName">
                USER NAME
                </label>
                <input
                  className="text-[#5A5A5A] pl-2 font-medium text-lg  border-2 border-black border-solid bg-transparent outline-none w-full sm:w-3/4 "
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Enter your username"
                  {...register("username", {
                    required: "*User Name is required.",
                  
                  })}
                onKeyUp={checkUsername}
                />
                {errors.username && (
                  <p className="errorMsg text-[#E40606]">
                    {errors.username.message}
                  </p>
                )}
                {userNameError && (
                  <p className={`errorMsg ${isError ? "text-[#E40606]" : "text-[#28A745]"}`}>{userNameError}</p>
                  
                )}
              </div>
              )}
              <div className="form-control mb-3">
                <label className="block mb-1" htmlFor="email">
                  EMAIL ADDRESS
                </label>
                <input
                  className="text-[#5A5A5A] pl-2 font-medium text-lg  border-2 border-black border-solid bg-transparent outline-none w-full sm:w-3/4 "
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Enter your valid email id"
                  {...register("email", {
                    required: "*Email is required. ",
                    pattern: {
                      value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                      message: "*email not in proper format.",
                    },
                  })}
                />
                {errors.email && (
                  <p className="errorMsg text-[#E40606] ">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="form-control mb-3 relative">
                <label className="block mb-1" htmlFor="password">
                  PASSWORD
                </label>
                <div className="relative">
                  <div>
                    <div className=" flex justify-between">
                    <div className="border-2 border-black border-solid  w-full sm:w-3/4 ">
                    <input
                    className="text-[#5A5A5A] pl-2 font-medium text-lg  bg-transparent outline-none w-full sm:w-3/4"
                    type={isShow ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Password of min 8 characters"
                    {...register("password", {
                      required: "*Password is required.",
                      minLength: {
                        value: 8,
                        message: "*Password should be at-least 8 characters.",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,14}$/,
                        message: "*Password must contain one uppercase letter,one lowercase letter,one number,one special character",
                      },
                    })}
                  />
                  </div>
                  <div className="flex items-center">
                     {isShow ? (
                    <FaEyeSlash
                      onClick={() => setisShow(false)}
                      className={`absolute  right-[2%] md:right-[27%]`}
                    />
                  ) : (
                    <FaEye
                      onClick={() => setisShow(true)}
                      // className="absolute bottom-[7px] right-[2%] md:right-[27%]"
                      className={`absolute  right-[2%] md:right-[27%] `}
                    />
                  )}
                  </div>
                  </div>
                  </div>
                  
               
                  {errors.password && (
                    <div className="errorMsg text-[#E40606] break-words w-[450px] ">
                      {errors.password.message}
                    </div>
                  )}
                </div>
              </div>
             
              <div className="w-full sm:w-3/4 text-center mb-4">
                <input
                  className="font-normal text-[#5A5A5A] bg-[#B1B1B1]"
                  type="checkbox"
                  required
                />{" "}

                <span className="text-[#5A5A5A] font-[Poppins]">
                  YOU AGREE                 <Link to="/termsandconditions">
                  <span className="text-[#011F4B]">THE TERMS</span>                 </Link>
                  {" "}
                  SERVICES AND{" "}
                  <Link  to="/privacy_policy">
                  <span className="text-[#011F4B]">PRIVACY POLICIES</span>{" "}
                  </Link>
                </span>
              </div>
              <button className="bg-[#011F4B] text-white font-medium w-full sm:w-3/4 radius-[3px] text-lg p-3  ">
                Get Started
              </button>
              <p className="font-medium text-[#5A5A5A] text-lg my-3 w-full sm:w-3/4 text-center">
                or
              </p>
              <div className="flex gap-2 justify-center w-full sm:w-3/4">
                <p>Already Hava a account?</p>{" "}
                <div className="go-home">
                  <Link
                    className="text-[#011f4b] font-[Quicksand] font-medium"
                    to={"/login"}
                  >
                    Log In
                  </Link>
                  <div className="h-[2px] bg-[#011f4b] w-[0px] transition-all duration-300"></div>
                </div>
              </div>
              {/* <div className="flex gap-4 justify-center w-full sm:w-3/4">
              <div>
                <img
                  className="w-[30px] h-[30px]"
                  src="assets/google.png"
                  alt=""
                />
              </div>
              <div>
                <img className="w-[30px] h-[30px]" src="assets/fb.png" alt="" />
              </div>
            </div> */}
            </form>
            
          
          )}
          {loader === true && <Loader />}
        </div>
      </section>

     
    </>
  );
}
