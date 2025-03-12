import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface MinutesPlayedLineChartProps {
  data: { hour: number; minutesPlayed: number }[];
  height?: number;
}

const MinutesPlayedLineChart: React.FC<MinutesPlayedLineChartProps> = ({ data, height = 300 }) => {
  const sortedData = data.sort((a, b) => a.hour - b.hour);
  const labels = sortedData.map(d => `${d.hour}:00`);
  const minutesPlayed = sortedData.map(d => d.minutesPlayed);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Minutes Played',
        data: minutesPlayed,
        fill: true,
        borderColor: '#1DB954', // Spotify green
        backgroundColor: 'rgba(29, 185, 84, 0.1)', // Spotify green with opacity
        borderWidth: 2,
        pointBackgroundColor: '#1DB954',
        pointBorderColor: '#000',
        pointBorderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#1ED760', // Slightly lighter green for hover
        pointHoverBorderColor: '#fff',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend for cleaner look
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#1DB954',
        bodyFont: {
          weight: 'bold',
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y} minutes`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10,
          },
        },
        title: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10,
          },
          padding: 8,
        },
        title: {
          display: false,
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      duration: 1000,
    },
    elements: {
      line: {
        borderJoinStyle: 'round',
      },
    },
  };

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <Line data={chartData} options={options as any} />
    </div>
  );
};

export default MinutesPlayedLineChart;