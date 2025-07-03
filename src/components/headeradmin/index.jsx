import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoReorderThree, IoCloseCircleOutline } from "react-icons/io5";
import { BsPerson, BsReceipt, BsWallet2 } from "react-icons/bs";
import { FiTruck } from "react-icons/fi";
import { MdArrowOutward, MdSignalCellularAlt } from "react-icons/md";
import { toast } from "react-toastify";
import Modal from 'react-modal';
import { format } from "date-fns";
import { HttpClient } from "../../server/client/http";
import "./headeradmin.css";
import { IoIosNotificationsOutline } from "react-icons/io";

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userDetails, setUserDetails] = useState(null);

  // Navigation items with icons and paths
  const navItems = [
    { path: "/", name: "Home", icon: <MdSignalCellularAlt size={21} /> },
    { path: "/seller", name: "Dashboard", icon: <MdSignalCellularAlt size={21} /> },
    { path: "/seller/orders", name: "Orders", icon: <FiTruck size={21} /> },
    { path: "/seller/products", name: "Products", icon: <BsReceipt size={21} /> },
    { path: "/seller/users", name: "Users", icon: <BsWallet2 size={21} /> },
    { path: "/seller/category", name: "Category", icon: <BsReceipt size={21} /> },
    { path: "/seller/brands", name: "Brands", icon: <BsReceipt size={21} /> },
    { path: "/seller/profile", name: "Profile", icon: <BsPerson size={21} /> },
  ];

  // Get current page title based on path
  const getPageTitle = () => {
    const pathMap = {
      "/seller": "Dashboard",
      "/seller/products": "Products",
      "/seller/orders": "Orders",
      "/seller/invoice": "Invoice",
      "/seller/profile": "Profile",
      "/seller/category": "Category",
      "/seller/brands": "Brands",
    };
    return pathMap[location.pathname] || "Dashboard";
  };

  // Format date for notifications
  const formatNotificationDate = (dateString) => {
    return format(new Date(dateString), 'MMMM dd, yyyy');
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await HttpClient.get("/notification");
      setNotifications(response);
      setUnreadCount(response?.filter(item => !item?.isRead)?.length);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load notifications");
    }
  };

  // Mark notifications as read
  const markNotificationsAsRead = async () => {
    try {
      await HttpClient.put("/notification");
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const { userData } = await HttpClient.get("/users/me");
      setUserDetails(userData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const { message } = await HttpClient.post("/users/logout");
      toast.success(message);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
     // navigate('/login')
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchProfile();
  }, []);

  return (
    <>
      {/* Main Header */}
      <header className="bg-[#E7EFFA] text-white px-3 py-3 shadow-bottom flex flex-col md:flex-row justify-between items-center">
  <div className="flex items-center justify-between w-full ">
    {/* Hamburger Menu Icon for Small Screens */}
    <IoReorderThree
      onClick={() => setIsSubmenuOpen(true)}
      className="text-3xl lg:hidden text-blue-700 cursor-pointer"
      aria-label="Open Menu"
      title="Open Menu"
    />

    {/* Page Title */}
    <div>
      <h1 className="hidden md:block font-bold text-[#011F4B]">{getPageTitle()}</h1>
    </div>

    {/* Right-side Actions */}
    <div className="flex items-center gap-4">
      {/* Notification Icon with Badge */}
      <div
        className="relative cursor-pointer"
        onClick={() => setIsModalOpen(true)}
        aria-label="Notifications"
        title="View Notifications"
      >
        <div className="h-10 w-10 flex items-center justify-center text-black">
          <IoIosNotificationsOutline size={24} />
        </div>
        {unreadCount > 0 && (
          <span
            className="absolute top-0 right-0 bg-[#011F4B] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount}
          </span>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-[#011F4B] text-white rounded-md px-4 py-2 hover:bg-[#011F4B]/90 transition"
        aria-label="Logout"
        title="Logout"
      >
        Logout
      </button>
    </div>
  </div>
</header>


      {/* Mobile Sidebar Menu */}
      {isSubmenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsSubmenuOpen(false)}
          />
          <div className="relative w-3/4 max-w-xs h-full bg-white">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-[#011F4B] font-bold">
                {userDetails?.firstName?.toUpperCase() || "ADMIN"}
              </h3>
              <button
                onClick={() => setIsSubmenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoCloseCircleOutline size={24} />
              </button>
            </div>

            <nav className="p-2">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-[#011F4B] hover:text-white transition"
                      onClick={() => setIsSubmenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#011F4B] group-hover:text-white">
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                      </div>
                      <MdArrowOutward  className="opacity-60" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          markNotificationsAsRead();
        }}
        ariaHideApp={false}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="bg-white rounded-lg max-h-[80vh] flex flex-col">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
            <button
              onClick={() => {
                setIsModalOpen(false);
                markNotificationsAsRead();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoCloseCircleOutline size={24} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {notifications?.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow transition"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                      <p className="font-medium">
                        Product:{" "}
                        <span className="text-blue-600">
                          {Array.isArray(notification.productName)
                            ? notification.productName.join(", ")
                            : notification.productName || "N/A"}
                        </span>
                      </p>
                      <p className="text-sm">
                        Order ID:{" "}
                        <span className="text-gray-600">
                          {notification.OrderId || "N/A"}
                        </span>
                      </p>
                    </div>
                    <p className="text-sm mb-1">
                      Status:{" "}
                      <span className="text-green-600">
                        {notification.message || "N/A"}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Date: {formatNotificationDate(notification.createdAt)}
                    </p>
                    {notification.OrderId && (
                      <Link
                        to={`/order_details/${notification.OrderId}`}
                        className="block text-blue-600 text-xs mt-2 hover:underline"
                      >
                        View details →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <svg
                  className="w-12 h-12 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <p>No notifications available</p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t flex justify-end">
            <button
              onClick={() => {
                setIsModalOpen(false);
                markNotificationsAsRead();
              }}
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* CSS for modal (can be moved to your CSS file) */}
      <style jsx global>{`
        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 600px;
          outline: none;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }
      `}</style>
    </>
  );
};

export default AdminHeader;