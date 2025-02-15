import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";
import Superadminheader from "../../../components/superadminheader";
import { CiSearch } from "react-icons/ci";
import { HttpClient } from "../../../server/client/http";
import Loader from "../../../components/loader";
import {
    Tab,
    TabGroup,
    TabList,
    TabPanels,
    TabPanel,
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
  } from "@headlessui/react";
  import { toast } from "react-toastify";
  import { LogOut,setUserData, getUserData  } from "../../../server/user";
  import { useForm } from "react-hook-form";

export default function   ProfileAdmin() {

    const [userDetails, setUserDetails] = useState(null);


    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const { register, handleSubmit, setValue } = useForm({
      defaultValues: userDetails,
    });
    const {
      register: addressRegister,
      handleSubmit: addressHandleSubmit,
      formState: { errors: addressErrors },
      reset: addressReset,
    } = useForm({
      defaultValues: formData,
    });
  
    const logout = async () => {
        try {
          const { message } = await HttpClient.post("/users/logout");
          toast.success(message);
          navigate("/login");
          LogOut();
        } catch (error) {
          console.error(error);
        }
      };

      
      const onSubmit = async (data) => {
        try {
          const response = await HttpClient.put(`/users/update`, data);
          setUserData(response?.userData);
          setUserDetails(response?.userData);
          console.log("updateduserdata", response?.userData)
          toast.success(response?.message || "Profile updated successfully");
        } catch (error) {
          console.error(error);
          toast.error(error?.response?.data?.message);
        }
      };
 
      const fetchProfileData = async () => {
        try {
          const { userData } = await HttpClient.get("/users/me");
          setUserDetails(userData);
          console.log("userDetails",userDetails)
        } catch (error) {
          console.error(error);
          toast.error(error?.response?.data?.message);
        }
      };
 
      useEffect(() => {
        if (userDetails) {
          Object.keys(userDetails).forEach((key) => {
            setValue(key, userDetails[key]);
          });
        }
      }, [userDetails, setValue]);
    
      useEffect(() => {
        fetchProfileData();
      
      }, []);
  return (
    <div className="flex">
      <div className="bg-[#E7EFFA] h-screen">
        <SuperAdminNav />
      </div>
      <div className="w-full">
        <Superadminheader />
        <div className="mx-2">
          <div className="flex items-center justify-between">
            <ul>
              <li className="mx-3 font-poppins font-medium text-[#46484D]">
                Profile Details 
              </li>
            </ul>
         
          </div>
        </div>
        <hr className="mx-2 mt-2"></hr>
       <div>
        
       <section className="p-3 font-[Quicksand]">
  <TabGroup>
          <div className="sm:flex gap-6">
           
            <TabPanels className="w-full">
              <TabPanel className="bg-[#F2F2F2] h-full">
                {/* <div className="border-b-[1px] border-b-solid border-b-[#D6D6D6] py-5 px-5 md:px-[50px]">
                    <p className="text-[#626262] font-bold text-lg mb-2 ml-2">
                      Edit Profile
                    </p>
                  </div> */}
                <div className="py-5">
                  <div className="px-5 md:px-12 border-b border-solid border-[#D6D6D6]">
                    <p className="text-[#2F2F2F] font-semibold text-lg mb-2">
                      General information
                    </p>
                  </div>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="px-5 md:px-12 my-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                      <div>
                        <label className="block text-[#626262] font-medium mb-2 ml-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px] "
                          {...register("firstName", {
                            // required: "*First Name is required.",
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-[#626262] font-medium mb-2 ml-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px]"
                          {...register("lastName", {
                            // required: "*Last Name is required.",
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-[#626262] font-medium mb-2 ml-2">
                          E-Mail
                        </label>
                        <input
                          type="email"
                          disabled={userDetails?.email}
                          {...register("email", {
                            // required: "*E-Mail is required.",
                          })}
                          className="w-full border-[#CBCBCB] border-solid border rounded-[12px] text-[#717171] font-normal p-3 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#626262] font-medium mb-2 ml-2">
                          Mobile Number
                        </label>
                        <input
                          type="text"
                          disabled={userDetails?.mobileNumber}
                          className="w-full p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px] "
                          {...register("mobileNumber", {
                            // required: "*Mobile Number is required.",
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-[#626262] font-medium mb-2 ml-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          className="w-full p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px] "
                          {...register("dob", {
                            // required: "*DOB is required.",
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-[#626262] font-medium mb-2 ml-2">
                          Gender
                        </label>
                        <div className="flex items-center gap-5">
                          <div>
                            <input
                              type="radio"
                              id="male"
                              name="gender"
                              value="male"
                              {...register("gender")}
                              className="ml-2 p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px] accent-[#FF0000]"
                            />
                            <label
                              className="text-[#626262] font-medium ml-2"
                              htmlFor="male"
                            >
                              Male
                            </label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              id="female"
                              {...register("gender")}
                              className="ml-2 p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px] accent-[#FF0000]"
                            />
                            <label
                              className="text-[#626262] font-medium ml-2"
                              htmlFor="female"
                            >
                              Female
                            </label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id="other"
                              name="gender"
                              value="other"
                              {...register("gender")}
                              className="ml-2 p-3 outline-none border border-solid border-[#CBCBCB] rounded-[12px] accent-[#FF0000]"
                            />
                            <label
                              className="ml-2 text-[#626262] font-medium"
                              htmlFor="other"
                            >
                              Other
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="bg-[#011F4B] text-[#FFFFFF] font-bold rounded-md px-8 py-3 mx-auto block my-12"
                      type="submit"
                    >
                      SAVE
                    </button>
                  </form>
                </div>
              </TabPanel>
              
            
        
        
            </TabPanels>

          </div>
        </TabGroup>
        </section>
        </div>        


      </div>
    </div>
  );
}
