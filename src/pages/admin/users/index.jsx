import React, { useState, useEffect } from "react";
import { HttpClient } from "../../../server/client/http";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getUserData } from "../../../server/user";
import Loader from "../../../components/loader";

function UserList() {
  const [allUsers, setAllusers] = useState([]);
  const [loader,setLoader]=useState(false);

  const getAllUsers = async () => {
    try {
      setLoader(true)
      const { users } = await HttpClient.get("/users/");
      if(users){
        setLoader(false);
      }
      setAllusers(users);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const deActiveUser = async (_id) => {
    try {
      const { message } = await HttpClient.patch("/users/de-active", { _id });
      toast.success(message);
      getAllUsers();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const activeUser = async (_id) => {
    try {
      const { message } = await HttpClient.patch("/users/active", { _id });
      toast.success(message);
      getAllUsers();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const changeRole = async (role, _id) => {
    try {
      const { message } = await HttpClient.patch("/users/update-role", {
        role,
        _id,
      });
      toast.success(message);
      getAllUsers();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="px-6 mx-auto my-8">
      <h1 className="text-4xl font-bold mb-4 text-center capitalize">
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
      <h2 className="text-2xl font-bold mb-4">Users List</h2>
      {
            allUsers.length ? (

      <div className="relative h-[62vh] overflow-auto shadow-md sm:rounded-lg">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] p-4 pl-8 font-medium text-black border-y border-[#eee]">
                Name
              </th>
              <th className="min-w-[150px] p-4 pl-8 font-medium text-black border-y border-[#eee]">
                E-Mail
              </th>
              <th className="min-w-[150px] p-4 pl-8 font-medium text-black border-y border-[#eee]">
                Role
              </th>
              <th className="min-w-[150px] p-4 pl-8 font-medium text-black border-y border-[#eee]">
                Active
              </th>
              <th className="p-4 pl-8 font-medium text-black border-y border-[#eee]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {
              allUsers.map((item, key) => (
                <tr key={key}>
                  <td className="border-y border-[#eee] p-4 pl-8 dark:border-strokedark">
                    <h5 className="font-medium text-black">
                      {item?.firstName} {item?.firstName}
                    </h5>
                  </td>
                  <td className="border-y border-[#eee] p-4 pl-8 dark:border-strokedark">
                    <h5 className="font-medium text-black">{item?.email}</h5>
                  </td>
                  <td className="border-y border-[#eee] p-4 pl-8 dark:border-strokedark">
                    <div className="flex gap-3 items-center">
                      <h5 className="font-medium text-black">{item?.role}</h5>
                      <form>
                        <select
                          className="py-2 px-3 border border-gray-300 rounded-md outline-none"
                          defaultValue="Change Role"
                          onChange={(e) =>
                            changeRole(e.target.value, item?._id)
                          }
                        >
                          <option value={"Change Role"} disabled>
                            Change Role
                          </option>
                          {["SELLER", "USER"].map((role, i) => (
                            <option
                              disabled={role === item?.role}
                              value={role}
                              key={i}
                            >
                              {role}
                            </option>
                          ))}
                        </select>
                      </form>
                    </div>
                  </td>
                  <td className="border-y border-[#eee] p-4 pl-8 dark:border-strokedark">
                    <h5 className="font-medium text-black">
                      {JSON.stringify(item?.isActive)}
                    </h5>
                  </td>
                  <td className="border-y border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button
                        className="hover:text-primary hover:underline"
                        onClick={() =>
                          item?.isActive
                            ? deActiveUser(item?._id)
                            : activeUser(item?._id)
                        }
                      >
                        {item?.isActive ? "De-Active" : "Active"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            // ) 
            // : (
            //   <tr>
            //     <td className="text-center p-3 text-lg" colSpan="5">
            //     {loader===true?<Loader/>:"No Users Available"}
            //     </td>
            //   </tr>
            // )
            
            }
          </tbody>
        </table>
      </div>)
      :
      (
        <div
        className="h-[62vh]"
          style={{
             
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loader === true ? <Loader /> : "No Users Available"}
        </div>
      )
      }
    </div>
  );
}

export default UserList;
