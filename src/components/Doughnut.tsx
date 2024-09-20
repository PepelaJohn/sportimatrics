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
import useMediaQuery from "@/hooks/useMediaQuery";

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
  data: { month: string; minutesPlayed: number; day?: string }[];
}

const MinutesPlayedLineChart: React.FC<MinutesPlayedLineChartProps> = ({
  data,
}) => {
  const sortedData = data.sort(
    (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
  );
  const labels = sortedData.map((d) =>
    new Date(d.month + "-01").toLocaleString("default", { month: "long" }).slice(0,3)
  );
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
        display: useMediaQuery('min-windth:1060px'),
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

export default MinutesPlayedLineChart;
