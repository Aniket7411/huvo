import React from 'react';
import ReactApexChart from 'react-apexcharts';

const WeeklyLineChart = () => {
  const [series] = React.useState([
    {
      name: "Desktops",
      data: [10, 41, 35, 51, 49, 62, 69]
    }
  ]);

  const [options] = React.useState({
    chart: {
      height: 200,
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      color: '#000000',
      width:1,
    },
    colors: ['#000000'],
    // title: {
    //   text: 'Product Trends by Month',
    //   align: 'left'
    // },
    // grid: {
    //   row: {
    //     colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
    //     opacity: 0.5
    //   },
    // },
    xaxis: {
      categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    }
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="line" height={180}  />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default  WeeklyLineChart ;
