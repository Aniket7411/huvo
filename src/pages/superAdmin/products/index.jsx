import { React, useState, useEffect } from "react";
import SuperAdminNav from '../../../components/superadminNavbar/superadminnav'
import Superadminheader from '../../../components/superadminheader'
import { CiSearch } from "react-icons/ci";
import { HttpClient } from "../../../server/client/http";
import Loader from "../../../components/loader";
// import SuperAdminNav from '../../../components/superadminNavbar/superadminnav';

export default function ProductsAdmin() {
  const [productList, setProductList] = useState({});
  const [loading, setloading] = useState(false);
  const [filterList, setFilterList] = useState([])
  const [productToSearch, setProductToSearch] = useState("")

  const getProductList = async () => {
    setloading(true);

    try {
      const response = await HttpClient.get("/product");
      console.log("Full Response:", response);
      setProductList(response.products);
      console.log(productList)
      console.log();
      if (response) {
        setloading(false);
      }
    } catch (error) {
      console.error(error.response);
    };


  };
  const searchFunction = (event) => {
    setProductToSearch(event.target.value)
    const filteredList = productList.filter(item => item.name.toLowerCase().includes(event.target.value.toLowerCase()));
    setProductList(filteredList)
  }
  useEffect(() => {
    getProductList();

  }, []);

  return (
    <div className='flex'>
      <div className='bg-[#E7EFFA] h-screen' >
        <SuperAdminNav />
      </div>
      <div className="w-full">

        <Superadminheader />
        <div className='mx-2'>
          <div className='flex items-center justify-between'>
            <ul>
              <li className='mr-2'>
                Products
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
                    placeholder="search"
                    className="border-0 w-full gap-10 outline-none"
                    onChange={searchFunction}
                    value={productToSearch}

                  ></input>
                </div></li>
            </ul>
          </div>
        </div>
        <hr className='mx-2 mt-2'></hr>

        <div className="py-5" style={{
          height: '76vh',
          overflowY: 'auto'
        }}>
          {productList.length ? (
            <table className="w-full table-auto">
              <thead>
                <tr className="">
                  <th className="min-w-[150px] p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px] text-[#6C757D]">
                    Product Id
                  </th>
                  <th className="min-w-[150px] p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D]">
                    Name
                  </th>
                  <th className="min-w-[150px] p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D]">
                  Seller Id
                  </th>
                  <th className="min-w-[120px] p-4 pl-8 font-poppins font-normal text-[14px] leading-[18px]  text-[#6C757D]">
                    Price
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
                {productList.map((item, key) => (
                  <tr key={key}>
                    <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">

                        {item?.productId}
                      </h5>
                    </td>
                    <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                        {item?.name}
                      </h5>
                    </td>
                    <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                        {item?.seller}
                      </h5>
                    </td>

                    <td className="p-4 pl-8">
                      <h5 className="font-poppins font-normal text-[14px] leading-[21px] text-center">
                        {item?.price}
                      </h5>
                    </td>
                    <td className="p-4 pl-8">
                      <h5
                        className={`font-poppins font-normal text-[14px] leading-[21px] text-center ${item.isReturnable ? "text-[#18B348]" : "text-[#FF0000]"
                          }`}
                      >
                        {item.isReturnable ? "Returnable" : "Not Returnable"}
                      </h5>
                    </td>
                    <td className="p-4 pl-8">
                      <h5
                       
                      >
                         <img
                                    src={item.bannerImage}
                                    alt="bannerImage"
                                    className="h-20 w-20 rounded-md object-contain"
                                  />
                        
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

