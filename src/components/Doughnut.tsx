import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MinutesPlayedDoughnutChartProps {
  data: { month: string; minutesPlayed: number }[];
}

const MinutesPlayedDoughnutChart: React.FC<MinutesPlayedDoughnutChartProps> = ({ data }) => {
  const sortedData = data.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  const labels = sortedData.map(d => d.month);
  const minutesPlayed = sortedData.map(d => d.minutesPlayed);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Minutes Played',
        data: minutesPlayed,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(99, 255, 132, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(99, 255, 132, 1)',
        ],
        borderWidth: 1,
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
        text: 'Minutes Played Per Month',
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default MinutesPlayedDoughnutChart;
