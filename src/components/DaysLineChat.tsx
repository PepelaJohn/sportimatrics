import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title
);

interface MinutesPlayedLineChartProps {
  data: { day: string; minutesPlayed: number }[];
}

const DaysMinutesPlayedLineChart: React.FC<MinutesPlayedLineChartProps> = ({
  data,
}) => {
  const sortedData = data
    .slice(0, 15)
    .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
  const labels = sortedData.map((d) => d.day);
  const minutesPlayed = sortedData.map((d) => d.minutesPlayed);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Minutes Played",
        data: minutesPlayed,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3, // Increase tension for smoother lines
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Minutes Played Per Month",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            return `Minutes Played: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Minutes Played",
        },
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default DaysMinutesPlayedLineChart;
