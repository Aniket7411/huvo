import React, { useState, useEffect } from "react";
import { HttpClient } from "../../../server/client/http";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import IndiaTime from "../../../components/getIndiaTime";
import { getUserData } from "../../../server/user";
import Loader from "../../../components/loader";
import { CiSearch } from "react-icons/ci";

function OrderList() {
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [notification, setNotification] = useState([]);
  const [loader, setLoader] = useState(false);
  const [productId, setProductId] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const getNotifications = async () => {
    try {
      const { message } = await HttpClient.get("/notification");
      setNotification(message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const getAllOrders = async () => {
    try {
      setLoader(true);
      const { data } = await HttpClient.get("/order");
      if (data) {
        setLoader(false);
      }
      setAllOrders(data);
      setFilteredOrders(data);
      setProductId(data?.product?.productId);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const deleteOrder = async (_id) => {
    try {
      const { message } = await HttpClient.delete(`/order/${_id}`);
      toast.success(message);
      getAllOrders();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const changeStatus = async (status, orderId, productId) => {
    try {
      const { message } = await HttpClient.put(`/order/${orderId}`, {
        status,
        productId,
      });
      toast.success(message);
      getAllOrders();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    let filtered = allOrders;

    // Apply status filter first
    if (statusFilter !== "All") {
      filtered = filtered.filter((order) => {
        const lastStatus = order?.orderStatus[order?.orderStatus.length - 1]?.status;
        return lastStatus?.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    // Then apply search term filter
    if (term) {
      filtered = filtered.filter((order) => {
        return (
          order?.orderId?.toLowerCase().includes(term) ||
          order?.shippingDetails?.name?.toLowerCase().includes(term)
        );
      });
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, statusFilter, allOrders]);

  useEffect(() => {
    getAllOrders();
  }, []);

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div className="px-6 mx-auto">
      <h1 className="text-4xl font-bold text-center capitalize">
        <Link to="/seller" className="text-2xl font-bold mb-4 hover:underline">
          {getUserData()?.role.toLowerCase()} Dashboard
        </Link>
        <Link
          to="/"
          target="_blank"
          className="text-base font-bold mb-4 hover:underline ml-3"
        >
          (Website)
        </Link>
      </h1>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Orders List</h2>
        <Link
          to="/seller/orders"
          className="text-2xl font-bold mb-4 hover:underline"
        >
          Add Orders
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex items-center w-full md:w-[50%] bg-white rounded-lg shadow-md p-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <CiSearch className="text-gray-600 text-xl" />
          </button>
          <input
            placeholder="Search by Order ID or Name"
            className="border-0 text-gray-800 text-sm px-2 outline-none placeholder-gray-400 flex-grow"
            value={searchTerm}
            
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="py-2 px-3 border border-gray-300 rounded-md outline-none bg-white shadow-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          {["Delivered", "Pending", "On the Way", "Dispatched"].map((status, i) => (
            <option value={status} key={i}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {filteredOrders.length ? (
        <div className="relative h-[62vh] -shadow-md sm:rounded-lg">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] p-4 pl-8 font-medium text-black border-y border-[#eee] hidden lg:block">
                  Order Id
                </th>
                <th className="min-w-[150px] p-4 pl-8 font-medium text-black border-y border-[#eee]">
                  Name
                </th>
                <th className="min-w-[150px] p-4 pl-8 font-medium text-black border-y border-[#eee]">
                  Order Date
                </th>
                <th className="min-w-[120px] p-4 pl-8 font-medium text-black border-y border-[#eee]">
                  Price
                </th>
                <th className="min-w-[120px] p-4 pl-8 font-medium text-black border-y border-[#eee]">
                  Status
                </th>
                <th className="p-4 pl-8 font-medium text-black border-y border-[#eee]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((item, key) => (
                <tr key={key}>
                  <td className="border-y border-[#eee] p-4 pl-8 dark:border-strokedark hidden lg:block">
                    <h5 className="font-medium text-black">{item?.orderId}</h5>
                  </td>
                  <td className="border-y border-[#eee] p-4 pl-8 dark:border-strokedark">
                    <h5 className="font-medium text-black">
                      {item?.shippingDetails.name}
                    </h5>
                  </td>
                  <td className="border-y border-[#eee] p-4 pl-8 dark:border-strokedark">
                    <h5 className="font-medium text-black">
                      <IndiaTime data={item.createdAt} />
                    </h5>
                  </td>
                  <td className="border-y border-[#eee] p-4 pl-8 dark:border-strokedark">
                    <h5 className="font-medium text-black">
                      {"₹ " + item?.product?.price}
                    </h5>
                  </td>
                  <td className="border-y border-[#eee] p-4 pl-8 dark:border-strokedark">
                    <div className="flex gap-3 items-center">
                      <h5 className="font-medium text-black">
                        {item?.orderStatus[item?.orderStatus.length - 1].status}
                      </h5>
                      <form>
                        <select
                          className="py-2 px-3 border border-gray-300 rounded-md outline-none "
                          defaultValue="Change Role"
                          onChange={(e) => {
                            changeStatus(
                              e.target.value,
                              item?.orderId,
                              item?.product[0].productId
                            );
                          }}
                        >
                          <option value={"Change Status"} disabled>
                            Change Status
                          </option>
                          {[
                            "Delivered",
                            "Pending",
                            "On the Way",
                            "Dispatched",
                          ].map((status, i) => (
                            <option
                              disabled={status === item?.status}
                              value={status}
                              key={i}
                            >
                              {status}
                            </option>
                          ))}
                        </select>
                      </form>
                    </div>
                  </td>
                  <td className="border-y border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button
                        className="hover:text-primary"
                        onClick={() =>
                          navigate(`/seller/orders/edit/${item?.orderId}`)
                        }
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="hover:text-primary"
                        onClick={() => deleteOrder(item?.orderId)}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                            fill=""
                          />
                          <path
                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                            fill=""
                          />
                          <path
                            d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                            fill=""
                          />
                          <path
                            d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className="h-[62vh]"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loader === true ? <Loader /> : "No Orders Available"}
        </div>
      )}
    </div>
  );
}

export default OrderList;