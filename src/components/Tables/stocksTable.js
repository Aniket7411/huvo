import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";

const StocksTable = () => {
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState([]);
  const [dashboardData,setDashboardData] =useState('')
  const [productList,setProductList] =useState([])

  const getAllOrders = async () => {
    try {
      const { data } = await HttpClient.get("/order");
      setAllOrders(data);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };
  const getDashboardData = async () => {
    try {
      const response = await HttpClient.get("/dashboard")
      console.log(response)
       const data = response
       setDashboardData(data);
     
       const tableData = response.report.products;
       setProductList(tableData)
console.log(tableData)

    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };
  // const deleteOrder = async (_id) => {
  //   try {
  //     const { message } = await HttpClient.delete(`/order/${_id}`);
  //     toast.success(message);
  //     getAllOrders();
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(error?.response?.data?.message);
  //   }
  // };

  useEffect(() => {
    getAllOrders();
  }, []);
  useEffect(() => {
    getDashboardData();
  }, []);
  return (
    <div className="relative border-0">
      <table className="w-full table-auto border-0 relative">
        <thead className="border-0  z-10">
          <tr className="bg-gray-2 text-left sticky dark:bg-meta-4 border-0">
            <th className="min-w-[100px] p-2 font-medium text-black">PHOTO</th>
            <th className="min-w-[150px] p-2 font-medium text-black">NAME</th>
            <th className="min-w-[120px] p-2 font-medium text-black">STOCK</th>
            <th className="p-2 font-medium text-black">PRICE</th>
          </tr>
        </thead>
        <tbody>
          {productList?.length > 0 ? (
            productList?.map((item, key) => (
              <tr key={key} className="">
                <td className="border-y border-[#eee] p-2 dark:border-strokedark">
                  {/* <h5 className="font-medium text-black">{item?.orderId}</h5> */}
                  <img src={item.bannerImage} alt="orders" className=""
                  height={30}
                  width={50} />
                </td>
                <td className="border-y border-[#eee] p-2 dark:border-strokedark">
                  <h5 className="font-medium text-black">
                    {item.name}
                  </h5>
                </td>
                <td className="border-y border-[#eee] p-2 dark:border-strokedark">
                  <h5 className="font-medium text-black"
                   style={{
                    color: item.sizes.some(size => parseInt(size.stock) > 0) ? 'green' : 'red',
                    fontWeight: 'normal',
                  }}>
                  {item.sizes.some(size => parseInt(size.stock) > 0)
              ? 'In Stock'
              : 'Out of Stock'}
                  </h5>
                </td>
                <td className="border-y border-[#eee] p-2 dark:border-strokedark">
                  <h5 className="font-medium text-black">
                    {item.price}
                  </h5>
                </td>
              
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center p-3 text-lg" colSpan="5">
                No Orders Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StocksTable;
