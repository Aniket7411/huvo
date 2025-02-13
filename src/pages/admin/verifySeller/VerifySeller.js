// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Loader from "../../../components/loader";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import { HttpClient } from "../../../server/client/http";

// const   = () => {
//   const [loader, setLoader] = useState(false);
//   const [pan, setPan] = useState("");
//   const [gst, setGst] = useState("");

//   const navigate = useNavigate();

//   const verifyPan = async (data) => {
//     setLoader(true);
//     try {
//       const response = await HttpClient.post("/verify/pan", data);
//       if (response) {
//         setLoader(false);
//         toast.success(response.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error?.response?.data?.message);
//       setLoader(false);
//     }
//   };
//   const verifyGst = async (data) => {
//     setLoader(true);
//     try {
//       const response = await HttpClient.post("/verify/gst", data);
//       if (response) {
//         setLoader(false);
//         toast.success(response.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error?.response?.data?.message);
//       setLoader(false);
//     }
//   };

//   return (
//     <section
//       className="h-screen"
//       style={{
//         backgroundColor: "#E9E8E7",
//       }}
//     >
//       <div className="go-home absolute right-[30px] top-[20px] z-[1]">
//         <Link
//           className="text-end text-[#011f4b] font-[Quicksand] font-medium"
//           to="/"
//         >
//           Back to Home
//         </Link>
//         <div className="h-[2px] bg-[#011f4b] w-[0px] transition-all duration-300"></div>
//       </div>
//       <div className="absolute z-[1] w-full sm:w-[80%] md:w-[45%] px-5 sm:px-0 right-0 top-[15vh] font-[Quicksand]">
//         <p className="font-semibold text-xl md:2xl xl:text-3xl text-black mb-2 w-full sm:w-3/4 text-center">
//           verify seller
//         </p>
//         {loader === false && (
//           <>
//             <div className="form-control mb-3">
//               <label className="block mb-1" htmlFor="firstName">
//                 PAN Number
//               </label>
//               <input
//                 className="text-[#5A5A5A] pl-2 font-medium text-lg  border-2 border-black border-solid bg-transparent outline-none w-full sm:w-3/4 "
//                 id="pan"
//                 name="pan"
//                 type="text"
//                 required
//                 value={pan}
//                 onChange={(e) => setPan(e.target.value)}
//               />

//               <p onClick={() => verifyPan(pan)}>Verify</p>
//             </div>
//             <div className="form-control mb-3">
//               <label className="block mb-1" htmlFor="lastName">
//                 GST Number
//               </label>
//               <input
//                 className="text-[#5A5A5A] pl-2 font-medium text-lg  border-2 border-black border-solid bg-transparent outline-none w-full sm:w-3/4"
//                 type="text"
//                 id="gstNumber"
//                 name="gstNumber"
//                 required
//                 value={gst}
//                 onChange={(e) => setGst(e.target.value)}
//               />
//               <p onClick={() => verifyGst(gst)}>Verify</p>
//             </div>

//             <div className="w-full sm:w-3/4 text-center mb-4">
//               <input
//                 className="font-normal text-[#5A5A5A] bg-[#B1B1B1]"
//                 type="checkbox"
//                 required
//               />{" "}
//               <span className="text-[#5A5A5A] font-[Poppins]">
//                 YOU AGREE <span className="text-[#011F4B]">THE TERMS</span>{" "}
//                 SERVICES AND{" "}
//                 <span className="text-[#011F4B]">PRIVACY POLICIES</span>{" "}
//               </span>
//             </div>
//             <button className="bg-[#011F4B] text-white font-medium w-full sm:w-3/4 radius-[3px] text-lg p-3  ">
//               Get Started
//             </button>
//           </>
//         )}
//         {loader === true && <Loader />}
//       </div>
//     </section>
//   );
// };

// export default VerifySeller;
