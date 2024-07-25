import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MinutesPlayedLineChartProps {
  data: { hour: number; minutesPlayed: number }[];
}

const MinutesPlayedLineChart: React.FC<MinutesPlayedLineChartProps> = ({ data }) => {
  const sortedData = data.sort((a, b) => a.hour - b.hour);
  const labels = sortedData.map(d => d.hour);
  const minutesPlayed = sortedData.map(d => d.minutesPlayed);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Minutes Played',
        data: minutesPlayed,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 0.6)',
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        tension: 0.1
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Minutes Played Per Hour',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hour of the Day',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Minutes Played',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default MinutesPlayedLineChart;
