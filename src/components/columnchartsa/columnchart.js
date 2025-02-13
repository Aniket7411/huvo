import { useState ,useEffect} from 'react';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { HttpClient } from '../../server/client/http';

const ColumnChart = () => {
  const [options, setOptions] = useState({
    chart: {
      height: 300,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 3,
        columnWidth: "50%",
      },
      fill: {
        colors: "#71DD37",
      },
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [], // Dynamically updated
      position: "bottom",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
  });

  const [series, setSeries] = useState([
    {
      name: "Profit",
      data: [], // Dynamically updated
    },
  ]);

  const getDashboardData = async () => {
    try {
      const response = await HttpClient.get("/dashboard");
      console.log("Full Response:", response);

      // Extract profit data
      if (response && response.profit) {
        const months = ["C Month", "P Month"];
        const profits = [response.profit.currentProfit, response.profit.previousProfit];

        // Update chart options and series
        setOptions((prevOptions) => ({
          ...prevOptions,
          xaxis: {
            ...prevOptions.xaxis,
            categories: months, // Set months dynamically
          },
        }));

        setSeries([
          {
            name: "Profit",
            data: profits, // Set profit data dynamically
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error.response);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="bar" height="100%" width="100%" />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ColumnChart;
