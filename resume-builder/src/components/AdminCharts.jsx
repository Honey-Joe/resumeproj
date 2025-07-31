// src/pages/AdminCharts.jsx
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export const BarChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Users',
        data: data.map(item => item.users),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderRadius: 6,
      },
      {
        label: 'Resumes',
        data: data.map(item => item.resumes),
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export const PieChart = ({ data }) => {
  const backgroundColors = [
    'rgba(99, 102, 241, 0.7)',
    'rgba(139, 92, 246, 0.7)',
    'rgba(14, 165, 233, 0.7)',
    'rgba(20, 184, 166, 0.7)',
    'rgba(245, 158, 11, 0.7)',
  ];

  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    }
  };

  return <Pie data={chartData} options={options} />;
};