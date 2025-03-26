import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminNav from "../../../components/superadminNavbar/superadminnav";
import Superadminheader from "../../../components/superadminheader";
import { CiSearch } from "react-icons/ci";
import { HttpClient } from "../../../server/client/http";
import Loader from "../../../components/loader";

export default function InvoiceAdmin() {
  const [invoiceList, setInvoiceList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchVender, setSearchVender] = useState("");

  const navigate = useNavigate();

  const getInvoiceList = async () => {
    setLoading(true);

    try {
      const response = await HttpClient.get("/invoice");
      setInvoiceList(response.allInvoices);
      setFilterList(response.allInvoices);
      setLoading(false);
    } catch (error) {
      console.error(error.response);
      setLoading(false);
    }
  };

  const handleNavigate = (invoiceId) => {
    navigate(`/admin/invoice/details/${invoiceId}`);
  };

  useEffect(() => {
    getInvoiceList();
  }, []);

  const findVendor = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchVender(searchValue);
    const filteredList = invoiceList.filter((item) =>
      item.customer.name.toLowerCase().includes(searchValue)
    );
    setFilterList(filteredList);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <aside className="bg-[#E7EFFA] md:h-screen w-full md:w-1/4">
        <SuperAdminNav />
      </aside>
      <main className="flex-1">
        <Superadminheader />
        <div className="p-4">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-xl font-semibold text-[#46484D]">Invoices</h1>
            <div className="flex flex-wrap items-center gap-4">
              <select className="p-2 border rounded-lg">
                <option value="" disabled selected hidden>
                  Sort By
                </option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="alphabets">Alphabetical Order</option>
              </select>
              <div className="flex items-center bg-white border rounded-lg px-2 py-1 w-full md:w-auto">
                <CiSearch className="text-gray-500" />
                <input
                  className="flex-grow p-1 outline-none"
                  placeholder="Search customer"
                  value={searchVender}
                  onChange={findVendor}
                />
              </div>
            </div>
          </div>
          <hr className="my-4" />

          {/* Table Section */}
          <div className="overflow-x-auto">
            {filterList.length > 0 ? (
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">
                      Invoice Number
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">
                      Vendor Name
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">
                      Customer Name
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">
                      Date
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filterList.map((item, key) => (
                    <tr key={key} className="border-t">
                      <td className="p-4 text-sm">{item.invoiceNumber}</td>
                      <td className="p-4 text-sm">{item.seller?.vendorId}</td>
                      <td className="p-4 text-sm">{item.customer?.name}</td>
                      <td className="p-4 text-sm">
                        {item.orderSummary?.orderDate}
                      </td>
                      <td className="p-4 text-sm">
                        <button
                          onClick={() => handleNavigate(item._id)}
                          className="text-blue-600 hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-64">
                {loading ? <Loader /> : "No invoices available"}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
