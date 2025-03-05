import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import SuperAdminNav from '../../../components/superadminNavbar/superadminnav'
import Superadminheader from '../../../components/superadminheader'
import Select from "react-dropdown-select";
import { HttpClient } from "../../../server/client/http";
import { CiSearch } from "react-icons/ci";
import { Link } from 'react-router-dom';
import Loader from '../../../components/loader';
import { MdOutlineArrowOutward } from 'react-icons/md';

export default function Vendors() {
  const [vendorList, setVendorList] = useState([]);
  const [loading, setloading] = useState(false);
  const [allVenderList,setAllVenderList] = useState([])
  const [venderToSearch,setVenderToSearch] = useState("")
    
  const navigate = useNavigate();

  const getVendorsList = async () => {
    setloading(true);
   
    try {
      const response = await HttpClient.get("/dashboard/vendors/");
      console.log("Full Response:", response.vendors);
      setVendorList(response.vendors);
      setAllVenderList(response.vendors)
      if(response){
        setloading(false)
      }

    } catch (error) {
      console.error(error.response);

    }
    //getVendorsList();
  };

  
  const handleNavigate = (vendorId) => {
    navigate(`/admin/vendors/details/${vendorId}`); 
    console.log(vendorId)
  };

  useEffect(() => {
    getVendorsList();
  }, []);

  const searchVender = (event) => {
    setVenderToSearch(event.target.value)
    const filteredList = allVenderList.filter(item => item.firstName.toLowerCase().includes(event.target.value.toLowerCase()));
    setVendorList(filteredList)
  }

  
  return (

    <div className='flex'>
      <div className='bg-[#E7EFFA] h-screen' >
        <SuperAdminNav />
      </div>
      <div className="w-full">

        <Superadminheader />
        <div className='mx-4'>
          <div className=' flex items-center justify-between'>
            <ul>
              <li className='font-pooppins font-medium text-[#46484D]'>
                Vendors
              </li>
            </ul>
            <ul className='flex items-center gap-10'>
              <li>
                <select className="p-1 border  rounded-lg" >
                  <option value="" disabled selected hidden>Sort By</option>
                  <option value="">price low to high</option>
                  <option value="">price high to low</option>
                  <option value=""> Alphabets</option>
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
                    placeholder="Search vender"
                    className="border-0 w-full gap-10 outline-none"
                    onChange={searchVender}
                    value={venderToSearch}
                  ></input>
                </div></li>
            </ul>
          </div>
        </div>
        <hr className='mx-2 mt-2'></hr>
        <div className='py-5 overflow-auto h-[80vh]'>
          {vendorList.length ? (
            <table className="w-full table-auto overflow-auto">
              <thead>
                <tr className="">
                  <th className="min-w-[150px] p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px] text-[#6C757D]">
                    Id
                  </th>
                  <th className="min-w-[150px] p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D]">
                    Name
                  </th>
                  <th className="min-w-[150px] p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D]">
                    E-mail
                  </th>
                  <th className="min-w-[120px] p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D]">
                    Status
                  </th>
                  <th className="p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D]">
                    Total Products
                  </th>
                </tr>
              </thead>
              <tbody>
                {vendorList.map((item, key) => (
                  <tr key={key}>
                    <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                        {/* <Link>
                        {item?.vendorId}
                        </Link> */}
                      <button
  onClick={() => handleNavigate(item?.vendorId)}
  className="flex items-center gap-2 text-blue-500 hover:underline"
>
  {item?.vendorId}
  <MdOutlineArrowOutward className="text-lg" />
</button>

                      </h5>
                    </td>
                    <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                        {item?.firstName}
                      </h5>
                    </td>
                    <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                        {item?.email}
                      </h5>
                    </td>
                    <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                        <button
                          className={`rounded-[20px] h-[29px] w-[64px] text-center font-poppins text-[#18B348] font-normal text-[14px] leading-[21px]  ${item.status ? 'bg-[#CCEED7]' : 'bg-[#FFD9DB]'
                            }`}
                        >
                          {item.status ? 'Active' : 'Inactive'}
                        </button>
                      </h5>
                    </td>
                    <td className="p-4 pl-8">
                      
                        <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                          {item?.totalProduct}
                        </h5>

                     
                    </td>


                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
            className="h-[62vh]"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading === true ? <Loader /> : "No Products Available"}
          </div>
          )}
        </div>

      </div>
    </div>
  )
}

