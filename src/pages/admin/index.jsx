import { Link, useNavigate } from "react-router-dom";
import { getUserData } from "../../server/user";
import SalesChart from "../../components/salesChart/SalesChart";
import SalesDonutChart from "../../components/salesDonutChart/salesDonutChart";
import "./admindashboard.css";
import StocksTable from "../../components/Tables/stocksTable";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/loader";
import { HttpClient } from "../../server/client/http";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import Modal from 'react-modal';
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";


function Admin() {

  const [dashboardData, setDashboardData] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  let subtitle;

  const getdashboardData = async () => {
    setIsLoading(true)
    try {
      const response = await HttpClient.get("/dashboard")
      const data = response
      setDashboardData(data);
      setIsLoading(false)

    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {

    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }





  useEffect(() => {
    getdashboardData();
  }, []);
  return (

    <>

    {
      isLoading ? <div className="h-screen">  <Loader /> </div>:  <div className="container-fluid" style={{ overflowY: "auto" }}>
      <div className="flex flex-wrap mt-6 p-2 h-[100vh]" style={{ overflowY: "auto" }}>
        <div className="sm:w-full shadow-bottom rounded-md lg:w-1/2  sm:mb-2 lg:mb-0">
          <SalesChart />
          {/* {dashboardData} */}
        </div>
        <div className="sm:w-full shadow-bottom rounded-md lg:w-1/2 " style={{ overflowY: "y" }}>
          <SalesDonutChart />
          {/* {dashboardData} */}
        </div>

        <div className="w-full md:w-1/3 mt-2 cardsMain shadow-bottom">


          <div className="max-w-sm rounded overflow-hidden">
            <div className="shadow p-3">
              <img src="/assets/orders.svg" alt="orders" className="mb-3" />
              <h5 className="text-xl mb-2 pb-0 cardHeading">Orders</h5>
              <h5 className="numbersSpan mb-2 pb-0">{dashboardData?.report?.totalOrders}</h5>
              <div className="flex align-center">
                <span className="text-base raiseFallSpan">
                  Over last month 1.4%
                </span>
                <span className="flex align-center">
                  <img src="/assets/riseFall.svg" alt="" />
                </span>
              </div>
            </div>

          </div>
        </div>
        <div className="w-full md:w-1/3 mt-2 cardsMain shadow-bottom">
          <div className="max-w-sm rounded overflow-hidden">
            <div className="m-2 p-2">
              <img src="/assets/sales.svg" alt="orders" className="mb-3" />
              <h5 className="text-xl mb-2 pb-0 cardHeading">Sales</h5>
              <h5 className="flex items-center numbersSpan mb-2 pb-0">{dashboardData?.report?.sales}
                <MdOutlineCurrencyRupee className="rupeeIcon" />
              </h5>
              <div className="flex align-center">
                <span className="text-base raiseFallSpan">
                  Over last month 1.4%
                </span>
                <span className="flex align-center">
                  <img src="/assets/riseFall.svg" alt="" />
                </span>
              </div>
            </div>
          </div>


        </div>
        <div className="w-full mt-2 md:w-1/3 cardsMain">
          <div className="shadow-bottom rounded-md cardSub">
            <div className="max-w-sm rounded overflow-hidden">
              <div className="px-3 py-4">
                <div className="flex justify-between">
                  <div className="text-xl mb-2 pb-0 cardHeading">
                    Recent Reviews
                  </div>
                  <div className="text-sm viewLink">
                    <button onClick={openModal}>  View All
                    </button>
                    <div>
                      <Modal
                        isOpen={modalIsOpen}
                        ariaHideApp={false}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        // style={customStyles}
                        contentLabel="Example Modal"
                        className="custom-modal-content-review "
                        overlayClassName="custom-modal-overlay-review"
                      >
                        <h2 ref={(_subtitle) => (subtitle = _subtitle)}></h2>
                        <div className="flex justify-end">
                          <button onClick={closeModal}>
                            <IoCloseCircleOutline className="h-6 w-6" />
                          </button>
                        </div>
                        <div>
                          {dashboardData?.report?.reviews?.map((review, index) => (
                            <div className="flex mb-2" key="index">
                              <div className="flex justify-center items-center">
                                <div style={{
                                  fontSize: '20px',
                                  fontWeight: '600',
                                  backgroundColor: '#8C4CF5'
                                }} className="w-12 h-12 mr-2 rounded-full overflow-hidden flex justify-center items-center">
                                </div>
                              </div>
                              <div>
                                <div className="mb-2 pb-0 reviewName" >
                                  {review
                                    .name}
                                </div>
                                <div className="flex items-center gap-2">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <span key={i}>
                                      {i < Math.floor(review.rating) ? (
                                        <FaStar style={{ color: '#FFD700' }} />
                                      ) : i < review.rating ? (
                                        <FaStarHalfAlt style={{ color: '#FFD700' }} />
                                      ) : (
                                        <FaRegStar style={{ color: '#FFD700' }} />
                                      )}
                                    </span>

                                  ))}
                                  <span>({review.rating})</span>
                                </div>
                                <div className="pb-0">
                                  <div className="flex align-center">
                                    <span className="text-base reviewSpan">
                                      {review
                                        .desc}
                                    </span>
                                    <span className="flex align-center">
                                      <img src="/assets/riseFall.svg" alt="" />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                      </Modal>
                    </div>
                  </div>
                </div>
                <div className="flex mb-2">
                  <div className="flex justify-center items-center">
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      backgroundColor: '#8C4CF5'
                    }} className="w-12 h-12 mr-2 rounded-full overflow-hidden flex justify-center items-center">
                      {/* <img
                      src="/assets/orders.svg"
                      alt="orders"
                      className="w-full h-full object-cover"
                    /> */}

                    </div>
                  </div>
                  <div>
                    {/* <div className="mb-2 pb-0 reviewName" >
                    {dashboardData?.report?.
                      recentReview
                      .name}
                  </div> */}
                    <div className="pb-0">

                    </div>
                    {/* <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i}>
                        {i < Math.floor(dashboardData?.report?.
                          recentReview
                          .rating) ? (
                          <FaStar style={{ color: '#FFD700' }} />
                        ) : i < dashboardData?.report?.
                          recentReview
                          .rating ? (
                          <FaStarHalfAlt style={{ color: '#FFD700' }} />
                        ) : (
                          <FaRegStar style={{ color: '#FFD700' }} />
                        )}
                      </span>
                    ))}
                    <span className="
                    ">({dashboardData?.report?.
                          recentReview
                          .rating})</span>
                  </div> */}
                  </div>

                </div>

                <div className="flex align-center">
                  {/* <span className="text-base reviewSpan">
                  {dashboardData?.report?.
                    recentReview
                    .desc}
                </span> */}
                  <span className="flex align-center">
                    <img src="/assets/riseFall.svg" alt="" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="w-full md:w-1/3 cardsMain shadow-bottom">
          <div className="max-w-sm rounded overflow-hidden">
            <div className="p-3 activityOverview shadow">
              <h5 className="text-xl mb-4 pb-0 cardHeading">Activity Overview</h5>

              <div className="flex justify-between mb-4 px-4">
                <div className="flex flex-col justify-center items-center text-center">
                  <img src="/assets/delivered.svg" alt="orders" className="" height={35} width={35} />
                  <h5>Dispatched</h5>
                  {/* <p>{dashboardData?.report?.dispatched}</p> */}
                </div>
                <div className="flex flex-col justify-center items-center text-center">
                  <img src="/assets/ordered.svg" alt="orders" className="" height={35} width={35} />
                  <h5>Confirm</h5>
                  {/* <p>{dashboardData?.report?.confirm}</p> */}
                </div>
              </div>
              <div className="flex justify-between px-4">
                <div className="flex flex-col justify-center items-center text-center">
                  <img src="/assets/reported.svg" alt="orders" className="" height={35} width={35} />
                  <h5>Pending</h5>
                  {/* <p>{dashboardData?.report?.pending}</p> */}
                </div>
                <div className="flex flex-col justify-center items-center text-center">
                  <img src="/assets/arrived.svg" alt="orders" className="" height={35} width={35} />
                  <h5>Delivered</h5>
                  {/* <p>{dashboardData?.report?.delivered}</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Button to trigger the condition check */}


        {/* Modal */}
        <Modal
          isOpen={!dashboardData?.sellerDetails?.verificationStatus}
          contentLabel="Upload Document Prompt"
          className="bg-white p-6 w-[400px] mx-auto rounded-lg shadow-lg"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <h2 className="text-xl font-bold mb-4">Document Upload Required</h2>
          <p className="text-gray-700 mb-6">
            A document upload is required to proceed. Do you want to upload it now?
          </p>
         
            <button
                  onClick={() => navigate("/seller/profile")}

              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Upload Document
            </button>
        </Modal>

      </div>
      <div className="w-full md:w-2/3 ">
        <div className="shadow-bottom rounded-md mb-2" style={{
          height: '270px',
          overflowY: 'auto',
        }}>
          <StocksTable />
        </div>
      </div>

    </div>
    }


     
    </>


  );
}

export default Admin;
