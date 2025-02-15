import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";
import Superadminheader from "../../../components/superadminheader";
import { CiSearch } from "react-icons/ci";
import { HttpClient } from "../../../server/client/http";
import Loader from "../../../components/loader";

export default function InvoiceAdmin() {
  const [invoiceList, setInvoiceList] = useState([]);
  const [filterList, setFilterList] = useState([])
  const [loading, setloading] = useState(false);
  const [searchVender, setSearchVender] = useState("")

  const navigate = useNavigate();

  const getInvoiceList = async () => {
    setloading(true);

    try {
      const response = await HttpClient.get("/invoice");
      console.log("Full Response:", response.allInvoices);
      setInvoiceList(response.allInvoices);
      console.log(response.allInvoices.invoiceNumber);
      if (response) {
        setloading(false);
      }
    } catch (error) {
      console.error(error.response);
    }
    //getVendorsList();
  };

  const handleNavigate = (invoiceId) => {
    navigate(`/admin/invoice/details/${invoiceId}`);
    console.log(invoiceId);
  };
  useEffect(() => {
    getInvoiceList();
  }, []);

  const findVender = event => {
    setSearchVender(event.target.value)
    console.log(invoiceList)
    console.log(event.target.value)

    const filterdList = invoiceList.filter(item => item.customer.name.toLowerCase().includes(event.target.value.toLowerCase()));
    setFilterList(filterdList)
  }

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
                Invoice
              </li>
            </ul>
            <ul className="flex items-center gap-10">
              <li>
                <select className="p-1 border  rounded-lg">
                  <option value="" disabled selected hidden>
                    Sort By
                  </option>
                  <option value="">price low to high</option>
                  <option value="">price high to low</option>
                  <option value=""> Alphabets</option>
                </select>
              </li>
              <li>
                <div className="border  flex items-center justify-between p-1 bg-[#FFFFFF] rounded-lg top-[-12px]">
                  <button
                    className="mr-5"
                    //  onClick={handleClick}
                  >
                    <CiSearch className=" text-[#000000]" />
                  </button>
                  <input
                    placeholder="Search customer"
                    className="border-0 w-full gap-10 outline-none"
                    onChange={findVender}
                    value={searchVender}
                  ></input>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <hr className="mx-2 mt-2"></hr>

        <div className="py-5" style={{
          height:'76vh',
          overflowY:'auto'
        }}>
          {invoiceList.length ? (
            <table className="w-full table-auto">
              <thead>
                <tr className="">
                  <th className="min-w-[150px] p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px] text-[#6C757D]">
                    Invoice Number
                  </th>
                  <th className="min-w-[150px] p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D]">
                    Vendor Name
                  </th>
                  <th className="min-w-[150px] p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D]">
                    Customer Name
                  </th>
                  <th className="min-w-[120px] p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D]">
                  Date
                  </th>
                
                  <th className="p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D] ">
                    View Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceList?.map((item, key) => (
                  <tr key={key}>
                    <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                    
                        {item?.invoiceNumber}
                      </h5>
                    </td>
                    <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                     {item?.seller?.vendorId}
                      </h5>
                    </td>
                    <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                        {item?.customer?.name}
                      </h5>
                    </td>

                    <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                      {item?.orderSummary?.orderDate}
                      </h5>
                    </td>
                  
                    <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center text-[#253B80]">
                        <button onClick={() => handleNavigate(item?._id)}>
                          <a>View Details</a>
                        </button>
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
  );
}
