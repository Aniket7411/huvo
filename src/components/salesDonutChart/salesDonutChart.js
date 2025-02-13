import {React, useEffect, useState } from 'react'
import Chart from "react-apexcharts";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";


const SalesDonutChart = () => {

  const [dashboardData,setDashboardData] =useState('')
  const [pieData,setPieData] =useState([])
  const [chartLabels,setChartLabels] =useState([])
  const [chartPercent,setChartPrecent] =useState([])

  const getDashboardData = async () => {
    try {
      const response = await HttpClient.get("/dashboard")
      console.log(response)
       const data = response.report.topOrders;
       setDashboardData(data);
       console.log(data)
       

const processedLabels =data.map(item => item.name);
setChartLabels(processedLabels);
  
const processedPercentData =data.map(item => item.orderPlaceData); 
setChartPrecent(processedPercentData);
 
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

    const chartData = [44, 36, 20 ];

    // Options for the chart
    const chartOptions = {
      labels: chartLabels,
      legend: {
        show: true, 
      },
      plotOptions: {
        pie: {
          donut: {
            size: '35%', // Set the size of the donut hole
          },
          labels: {
            show: false
        }
        }
      },
      title: {
        text: "Sales",
        align: "left",
        style: {
          fontSize: '20px',     // Set the font size
          fontWeight: 500,   // Set the font weight
          color: '#000',        // Set the font color
          fontFamily: 'Poppins' // Set the font family
        }
      },
    };
  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart w-[100%] flex items-center">
          <Chart
            options={chartOptions}
            series={chartPercent}
            type="donut"
            width="390"
            height="360"
          />
        </div>
      </div>
    </div>
  )
}

export default SalesDonutChart