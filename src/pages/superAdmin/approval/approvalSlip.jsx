import React from 'react'
import { useState, useEffect } from "react"
import SuperAdminNav from '../../../components/superadminNavbar/superadminnav';
import Superadminheader from '../../../components/superadminheader';
import { PiArrowArcLeft } from "react-icons/pi"
import { Button } from 'antd'
import { useNavigate, useParams } from 'react-router-dom';
import Loader from "../../../components/loader";
import { HttpClient } from "../../../server/client/http";
import { toast } from "react-toastify";

export default function ApprovalSlip() {

  const [approvalDetails, setApprovalDetails] = useState([])
  const [loading, setloading] = useState(false);
  const [userId,setUserId] =useState("")

  const { id } = useParams();

  const getApprovalDetails = async (_id) => {
    // debugger
    if (!_id) {
      console.error("id", _id);
      return;
    }
    setloading(true);

    try {
      const response = await HttpClient.get("/approval/requests",{sellerId : _id});
      console.log("Full Response:", response);

      const formattedSellerDetails = () => response.map((each)=> ({
        gstInNumber : each.GSTIN,
        panNumber : each.PAN,
        gstDocument :each.gstDoc,



      }))

      console.log(formattedSellerDetails)
      setApprovalDetails(response
      );
      setUserId(response?.message?.pan?.userId)
      console.log(response?.message?.pan?.userId)
      if (response) {
        setloading(false);
      }
    } catch (error) {
      console.error(error.response);
      setloading(false);
    }
  
  };
  console.log("fetched details:", approvalDetails);
  
  const handleApproval = async () => {
    try{
      const response = await HttpClient.post(`/verify/documents`,{
      
          userId: userId  
    });
      toast.success(response?.message);
      
    } 
    catch(error){
      console.error(error);
    }
  }




  useEffect(() => {
    getApprovalDetails(id);
  }, [id]);


  return (


    <div>
      <div className='flex h-screen'>

        <div className='bg-[#E7EFFA] h-full'>
          <SuperAdminNav />
        </div>


        <div className="flex flex-col w-full flex-1 overflow-auto">


          <div className='px-5'>
            <div className='flex items-center'>
              <div className='h-14 w-14  bg-[#E7EFFA] rounded-full flex items-center justify-center'
              >
                <PiArrowArcLeft className='text-[#000000]' />
              </div>

              <div className='w-full'>
                <Superadminheader />
              </div>
            </div>
            <div className='flex justify-between mx-2  items-center'>
              <div className='flex gap-2 items-center'>
                <div className='h-[100px] w-[100px] bg-[#D9D9D9] rounded-full flex items-center justify-center m-2'> image</div>

              </div>
              <div className='flex flex-col space-y-10 w-[300px]'>
                <div className='ml-20'>
                  <div className='flex font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Registration Date:
                    <div className='  font-poppins font-normal ml-1 break-words text-[#000000]' >15-09-2024</div>
                  </div>
                  <div className='flex font-poppins font-medium text-[14px] leading-[21px]  text-[#6B6B6B]'> Status:
                    <div >

                    </div>
                  </div>
                  <div className='flex font-poppins font-medium text-[14px] leading-[21px]  text-[#6B6B6B]'>Valid Upto:
                    <div className=' font-poppins font-normal text-[14px] leading-[21px] ml-1 break-words text-[#000000]'>15-11-2024</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <hr className='mx-2 border-t-[1px] border-[#B9B9B9]'></hr>

          <div className='mx-2 mt-2' >
            <p className="font-poppins font-medium text-[20px] leading-[21px] py-4 mx-2">
              Personal Information
            </p>
            <div className='flex gap-10 mx-2 py-4 '>
              <div className='flex flex-col space-y-6 pr-2 w-1/3'>
                <div className='flex flex-col space-y-2 '>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Business Name</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>Static Data</p>
                </div>
                <div className='flex flex-col space-y-2 '>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Email:</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>this data is static</p>
                </div>
                <div className='flex flex-col  space-y-2'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Address:</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>static data</p>
                </div>
              </div>


              <div className='flex flex-col space-y-6 w-2/3'>

                <div className='flex flex-col space-y-2 w-2/3'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Business Description:</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>this data is  staticthis data is  staticthis data is  staticthis data is  staticthis data is  staticthis data is  static </p>
                </div>
                <div className='flex flex-col space-y-2'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Contact Number:</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>this number is static</p>
                </div>
                <div className='flex flex-col space-y-2'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>website</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>static data</p>
                </div>
              </div>
            </div>
          </div>

          <hr className='mx-2 border-t-[1px] border-[#B9B9B9]'></hr>

          <div className='mx-2 mt-2' >

            <p className="font-poppins font-medium text-[20px] leading-[21px] py-4 mx-2">
              Gstn Information
            </p>
            <div className='flex gap-10 mx-2 py-4 '>
              <div className='flex flex-col space-y-6 pr-2 w-1/3'>
                <div className='flex flex-col space-y-2 '>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>GST Number</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>{approvalDetails?.message?.gst?.gstin}</p>
                </div>
                <div className='flex flex-col space-y-2 '>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>GSTN Status</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>
                  approvalDetails?.message?.gst?.gstinStatus
                  </p>
                </div>
                <div className='flex flex-col  space-y-2'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Center Jurisdiction</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>pprovalDetails?.message?.gst?.centreJurisdiction
                  </p>
                </div>
                <div className='flex flex-col  space-y-2 w-2/3'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Center Jurisdiction Code</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>approvalDetails?.message?.gst?.centreJurisdictionCode</p>
                </div>
                <div className='flex flex-col  space-y-2'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Legal Name Of Business</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>
                  approvalDetails?.message?.gst?.legalNameOfBusiness
                    
                  </p>
                </div>
              </div>


              <div className='flex flex-col space-y-6 '>

                <div className='flex flex-col space-y-2 w-2/3'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>State Jurisdiction</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>
                    approvalDetails?.message?.gst?.stateJurisdiction

                    
                  </p>
                </div>
                <div className='flex flex-col space-y-2'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>State Jurisdiction Code</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>
                    approvalDetails?.message?.gst?.stateJurisdictionCode

                    
                  </p>
                </div>
                <div className='flex flex-col space-y-2'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Tax Payer Type</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>  approvalDetails?.message?.gst?.taxpayerType


                  </p>
                </div>
                <div className='flex flex-col space-y-2'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Reference Id</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>
                  approvalDetails?.message?.gst?.
                      referenceId
                    
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className='mx-2 border-t-[1px] border-[#B9B9B9]'></hr>
          <div className='mx-2 mt-2' >

            <p className="font-poppins font-medium text-[20px] leading-[21px] py-4 mx-2">
              PAN Information
            </p>
            <div className='flex gap-10 mx-2 py-4 '>
              <div className='flex flex-col space-y-6 pr-2 w-1/3'>
                <div className='flex flex-col space-y-2 '>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>PAN Number</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>approvalDetails?.message?.pan?.
                     pan
                    </p>
                </div>
                <div className='flex flex-col space-y-2 '>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>First Name</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>
                  {approvalDetails?.message?.pan?.
                   firstName
                    }
                  </p>
                </div>
                <div className='flex flex-col  space-y-2'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Last Name</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'> approvalDetails?.message?.pan?.    lastName</p>
                </div>
                <div className='flex flex-col  space-y-2'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Gender</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'> approvalDetails?.message?.pan?.    gender</p>
                </div>
                <div className='flex flex-col  space-y-2'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Dob</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>approvalDetails?.message?.pan?.   dob</p>
                </div>
              </div>


              <div className='flex flex-col space-y-6 w-2/3'>

                <div className='flex flex-col space-y-2'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Aadhar Link Status</h1>
                  <p className={`font-poppins font-normal text-[16px] leading-[21px] ${
      approvalDetails?.message?.pan?.aadhaarLinked ? 'text-green-600' : 'text-red-600'
    }`}>approvalDetails?.message?.pan?.   aadhaarLinked? "Already Linked" : "Aadhaar Not Linked"</p>
                </div>
                <div className='flex flex-col space-y-2'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Aadhar Number</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>approvalDetails?.message?.pan?.   maskedAadhaarNumber
                  </p>
                </div>
                <div className='flex flex-col space-y-2'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Nature Of Business</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>radhe@anand.com</p>
                </div>
                <div className='flex flex-col space-y-2'>
                  <h1 className='font-poppins font-medium text-[14px] leading-[21px] text-[#6B6B6B]'>Address</h1>
                  <p className='font-poppins font-normal text-[16px] leading-[21px]'>approvalDetails?.message?.pan?.   address
                  
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='flex py-10 gap-5 mx-2'>

            <Button className="w-[150px] h-[42px] px-[30px] py-[13px] gap-[10px] rounded-tl-[8px] bg-[#18B348] border-[#007D27] text-[#FFFFFF]"
             type="button"
           onClick={handleApproval}
            >Approve</Button>
          </div>
        </div>
      </div>
    </div>
  )


}
