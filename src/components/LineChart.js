import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Paper, Box } from '@mui/material';

// Registering required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ data, smallestMADColumn }) => {
  const datasets = [
    {
      label: `${smallestMADColumn} Forecast`,
      data: data.map(item => item[smallestMADColumn]),
      borderColor: '#4bc0c0', // Higher quality color
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: false,
      borderWidth: 3, // Increase line width
      pointRadius: 5, // Add points on the line
      pointBackgroundColor: '#4bc0c0',
      tension: 0.4, // Adding tension for curved lines
    },
    {
      label: '2022 Sales',
      data: data.map(item => item['2022']),
      borderColor: '#ff6384', // Higher quality color
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      fill: false,
      borderWidth: 3, // Increase line width
      pointRadius: 5, // Add points on the line
      pointBackgroundColor: '#ff6384',
      tension: 0.4, // Adding tension for curved lines
    },
    {
      label: '2023 Sales',
      data: data.map(item => item['2023']),
      borderColor: '#9966ff', // Higher quality color
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      fill: false,
      borderWidth: 3, // Increase line width
      pointRadius: 5, // Add points on the line
      pointBackgroundColor: '#9966ff',
      tension: 0.4, // Adding tension for curved lines
    }
  ];

  const allData = datasets.flatMap(dataset => dataset.data);
  const minY = Math.min(...allData) - 10; // Adding buffer
  const maxY = Math.max(...allData) + 10; // Adding buffer

  const chartData = {
    labels: data.map(item => item.MONTH),
    datasets: datasets,
  };

  const options = {
    maintainAspectRatio: false, // Disable the default aspect ratio
    aspectRatio: 2, // Increase the aspect ratio to lengthen the horizontal line
    scales: {
      y: {
        min: minY,
        max: maxY,
        ticks: {
          stepSize: (maxY - minY) / 10, // Adjust the step size for more details
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#000', // Legend text color
          font: {
            size: 14, // Legend text size
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 14,
        },
        footerFont: {
          size: 12,
        },
      },
    },
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: '20px',
        marginTop: '20px',
        borderRadius: '12px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
      }}
    >
      <Box sx={{ height: '400px', width: '100%' }}> {/* Adjust the height as needed */}
        <Line data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default LineChart;
