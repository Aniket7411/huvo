
import SuperAdminNav from '../../../components/superadminNavbar/superadminnav';
import Superadminheader from '../../../components/superadminheader';
import { PiArrowArcLeft } from "react-icons/pi"
import { CiSearch } from "react-icons/ci";
import { React, useState, useEffect } from "react";
import { HttpClient } from "../../../server/client/http";
import Loader from "../../../components/loader";
import { useNavigate } from 'react-router-dom';

export default function Approval() {

  const [documnet, setDocument] = useState("");
  const [approvalList, setApprovalList] = useState([]);

  const [loading, setloading] = useState(false);

    
  const navigate = useNavigate();

  const getDocuments = async () => {
    setloading(true);

    try {
      const response = await HttpClient.post("/verify/documents");
      console.log("Full Response:", response);
      setDocument(response);

      if (response) {
        setloading(false);
      }
    } catch (error) {
      console.error(error.response);
    }
    
  };

  const getApprovalList = async () => {
    setloading(true);

    try {
      const response = await HttpClient.get("/approval/requests");
      console.log("Full Response:", response);
      setApprovalList(response);

      if (response) {
        setloading(false);
      }
    } catch (error) {
      console.error(error.response);
    }
   
  };

  const handleNavigate = (approvalId) => {
    navigate(`/admin/approval/slip/${approvalId}`); 
    console.log(approvalId)
  };


  useEffect(() => {
    getApprovalList();
  }, []);

  useEffect(() => {
    getDocuments();
  }, [])

  return (
    <div>
      <div className='flex'>
        <div className='bg-[#E7EFFA] h-screen' >
          <SuperAdminNav />
        </div>
        <div className="w-full">

          <Superadminheader />
          <div className='mx-2'>
            <div className='flex items-center justify-between'>
              <ul>
                <li className='font-pooppins font-medium text-[#46484D]'>
                  Approval
                </li>
              </ul>
              <ul className='flex items-center gap-10'>
                <li>
                  <select className="p-1 border  rounded-lg" >
                    <option value="" disabled selected hidden>Sort By</option>
                    <option value="">Approved</option>
                    <option value="">Not Approved</option>

                  </select>
                </li>
                <li>
                  <div className="border  flex items-center justify-between p-1 bg-[#FFFFFF] rounded-lg top-[-12px]">
                    <button className="mr-5"
                    //  onClick={handleClick}
                    >
                      <CiSearch className=" text-[#000000]" />
                    </button>
                    <input
                      placeholder="search"
                      className="border-0 w-full gap-10 outline-none"
                    ></input>
                  </div></li>
              </ul>
            </div>
          </div>
          <hr className='mx-2 mt-2'></hr>
          <div className=''>
            <table className='w-full table-auto'>
              <thead>
                <tr className="">
                  <th className="min-w-[150px] p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px] text-[#6C757D]">
                    Approval Id
                  </th>
                  <th className="min-w-[150px] p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D]">
                    Vendor Name
                  </th>


                  <th className="p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D]">
                    Status
                  </th>
                  <th className="p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D] ">
                    View Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {approvalList.map((item, key) => (
                  <tr key={key}>
                    <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">                      
                          {item?._id}
                      </h5>
                    </td>
                    <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                        {item?.createdBy}
                      </h5>
                    </td>
                    <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                        <button
                          className={`rounded-[20px] h-[29px] w-[64px] text-center font-poppins text-[14px] leading-[21px] 
                  ${item.status === 'draft' ? 'bg-[#E0E0E0] text-[#828282]' :
                              item.status === 'pending' ? 'bg-[#FFF3CD] text-[#FFC107]' :
                                item.status === 'approved' ? 'bg-[#CCEED7] text-[#18B348]' :
                                  item.status === 'rejected' ? 'bg-[#FFD9DB] text-[#FF0000]' : ''
                            }`}
                        >
                          {item.status}
                        </button>

                      </h5>
                    </td>

                    <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                      <button onClick={() => handleNavigate(item?.createdBy)}>
                          <a>View Details</a>
                        </button>
                      </h5>
                    </td>

                    {/* <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center text-[#253B80]">
                        <button onClick={() => handleNavigate(item?._id)}>
                          <a>View Details</a>
                        </button>
                      </h5>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

        </div>
      </div>

    </div>

  )
}
