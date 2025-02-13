import React, { useState } from "react";
import Chart from "react-apexcharts";
import { Select } from "antd";

const SalesChart = () => {
    const [month, setMonth] = useState("jan")
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "line",
      height: 300,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false, // Disable the toolbar (which includes the menu icon)
      },
    },
    stroke: {
      curve: "smooth", // Makes the line smooth (spline)
      width: 2
    },
    title: {
      text: "Sales Chart",
      align: "left",
      style: {
        fontSize: '20px',     // Set the font size
        fontWeight: 500,   // Set the font weight
        color: '#000',        // Set the font color
        fontFamily: 'Poppins' // Set the font family
      }
    },
    xaxis: {
      categories: [
        "01 May",
        "02 May",
        "03 May",
        "04 May",
        "05 May",
        "06 May",
        "07 May",
        "08 May",
        "09 May",
        "10 May",
        "11 May",
        "12 May",
      ],
      labels: {
        style: {
          fontSize: '12px',     // Set the font size
          fontWeight: 'light',   // Set the font weight
          fontFamily: 'poppins', // Set the font family
          colors: '#B8B8B8',        // Set the font color
        }
      },
      tickAmount:12
    },
    yaxis: {
      title: {
        text: "Values",
      },
      tickAmount: 5,
      labels: {
        style: {
          fontSize: '14px',     // Set the font size
          fontWeight: 'light',   // Set the font weight
          fontFamily: 'poppins', // Set the font family
          colors: '#000000',        // Set the font color
        }
      }
    },
    colors: ['#4A6CF7', '#5FCF7F'], // Custom colors for series
  });

  const handleChangeMonth = (value) => {
    setMonth(value);
  };

  const [chartSeries, setChartSeries] = useState([
    {
      name: "Sales",
      data: [0, 150, 200, 220, 350, 360, 900,740, 910, 780, 800, 1000],
    },
    {
      name: "Order",
      data: [0, 90, 200, 500, 400, 150, 210, 700, 830, 780, 350, 480],
    },
  ]);
  return (
    <div style={{position:'relative'}}>
        <Select
                    value={month}
                    style={{ width: 120, margin: "10px", position:'absolute', right:'30px', zIndex:'2' }}
                    placeholder={"Select Month"}
                    onChange={handleChangeMonth}
                    // className={`${styles.selector}`}
                    options={[
                      { value: "jan", label: "Jan" },
                      { value: "feb", label: "Feb" },
                      { value: "mar", label: "Mar" },
                      { value: "april", label: "Apr" },
                      { value: "may", label: "May" },
                      { value: "jun", label: "Jun" },
                      { value: "jul", label: "Jul" },
                      { value: "aug", label: "Aug" },
                      { value: "sep", label: "Sep" },
                      { value: "oct", label: "Oct" },
                      { value: "nov", label: "Nov" },
                      { value: "dec", label: "Dec" },

                    ]}
                  />
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="line"
        height={300}
      />
    </div>
  );
};

export default SalesChart;
