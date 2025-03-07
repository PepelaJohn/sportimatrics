'use client'
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FC } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useRouter } from "next/navigation"; // Import useRouter

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    labels: string[];
    values: number[];
  } |null;
  trackOrArtist?:"tracks" | "artists";
}

const BarChart: FC<BarChartProps> = ({ data, trackOrArtist }) => {
  const isAbove = useMediaQuery("(min-width: 1060px)");
  const router = useRouter(); // Initialize useRouter
  // console.log(data, trackOrArtist)
  // alert()
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Total Minutes Played",
        data: data?.values || [],
        backgroundColor: "rgba(39, 83, 52, 0.6)", // Adjust for dark mode
        borderColor: "#0f2711f0",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: "#a3a3a3",
          opacity: 0, // Hide the legend text
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${context.raw} minutes`,
        },
        backgroundColor: "#000000", // Tooltip background color
        titleColor: "#888888", // Tooltip title color
        bodyColor: "#7c7c7c", // Tooltip body color
        borderColor: "#091408",
      },
    },
    scales: {
      x: {
        
        max: 25,
        ticks: {
          color: "#6e6d6d",
          fontSize: 5, // X-axis labels color
          display: isAbove,
        },
        grid: {
          color: "#2e2e2e", // X-axis grid lines color
          drawBorder: false,
          drawOnChartArea: true,
          drawTicks: true,
          lineWidth: 1,
        },
      },
      y: {
        
        ticks: {
          color: "#6b6b6b",
        },
        grid: {
          color: "#2e2e2e",
          drawBorder: false,
          drawOnChartArea: true,
          drawTicks: true,
          lineWidth: 1,
          borderDash: [10, 10], // Style of the grid lines
          tickLength: 1, // Y-axis grid lines color
        },
      },
    },
    onHover: (event: any, elements: any) => {
      event.native.target.style.cursor = elements.length ? "pointer" : "default";
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0 && trackOrArtist) {
        const clickedIndex = elements[0].index; // Get the index of the clicked bar
        const label = chartData.labels[clickedIndex]; // Get the label of the clicked bar
        console.log(data)
        
        router.push(`insights/${trackOrArtist.substring(0, trackOrArtist.length - 1)}/${label}`); // Redirect to the new page with the label
      }
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
