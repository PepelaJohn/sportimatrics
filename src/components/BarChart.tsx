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
import { FC, useMemo } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useRouter } from "next/navigation";

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
  } | null;
  trackOrArtist?: "tracks" | "artists";

  height?: number;
}

const BarChart: FC<BarChartProps> = ({ 
  data, 
  trackOrArtist, 

  height
}) => {
  const isDesktop = useMediaQuery("(min-width: 1060px)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const router = useRouter();
  console.log(data, 'barchart')
  // Spotify colors
  const spotifyGreen = "#1DB954";
  const spotifyLightGreen = "#1ED760";
  const spotifyDarkGreen = "#14883E";
  
  // Create gradient for bars
  const createGradient = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, spotifyGreen + "CC"); // Semi-transparent green at top
    gradient.addColorStop(1, spotifyDarkGreen + "99"); // Darker green at bottom
    return gradient;
  };

  const chartData = useMemo(() => {
    return {
      labels: data?.labels || [],
      datasets: [
        {
          label: "Minutes Played",
          data: data?.values || [],
          backgroundColor: function(context: any) {
            const chart = context.chart;
            const {ctx, chartArea} = chart;
            if (!chartArea) {
              // This is called when the chart is not yet created
              return spotifyGreen + "99";
            }
            return createGradient(ctx);
          },
          borderColor: spotifyDarkGreen,
          borderWidth: 1,
          borderRadius: 4,
          hoverBackgroundColor: spotifyLightGreen,
        },
      ],
    };
  }, [data]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: height ? false : true,
      layout: {
        padding: {
          top: 10,
          bottom: 10,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      
        tooltip: {
          enabled: true,
          backgroundColor: "#000000DD",
          titleColor: "#FFFFFF",
          bodyColor: "#1DB954",
          titleFont: {
            size: 14,
            family: "'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          },
          bodyFont: {
            size: 12,
            family: "'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          },
          padding: 10,
          cornerRadius: 4,
          displayColors: false,
          callbacks: {
            title: (tooltipItems: any) => {
              return tooltipItems[0].label;
            },
            label: (context: any) => {
              const value = context.raw;
              const hours = Math.floor(value / 60);
              const minutes = value % 60;
              
              if (hours > 0) {
                return `${hours}h ${minutes}m played`;
              } else {
                return `${minutes} minutes played`;
              }
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#A7A7A7",
            display:isDesktop,
            font: {
              size: isMobile ? 8 : (isDesktop ? 12 : 10),
              family: "'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            },
            maxRotation: isMobile ? 45 : 0,
            minRotation: isMobile ? 45 : 0,
            autoSkip: true,
            maxTicksLimit: isMobile ? 8 : (isDesktop ? 25 : 15),
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: "#A7A7A7",
            font: {
              size: isMobile ? 10 : 12,
              family: "'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            },
            callback: (value: any) => {
              if (value >= 60) {
                return `${Math.floor(value / 60)}h`;
              }
              return value;
            },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
            drawBorder: false,
          },
          border: {
            display: false,
          },
        },
      },
      onHover: (event: any, elements: any) => {
        if (event.native) {
          event.native.target.style.cursor = elements.length ? "pointer" : "default";
        }
      },
      onClick: (event: any, elements: any) => {
        if (elements.length > 0 && trackOrArtist) {
          const clickedIndex = elements[0].index;
          const label = chartData.labels[clickedIndex];
          const type = trackOrArtist.substring(0, trackOrArtist.length - 1);
          
          router.push(`/insights/${type}/${encodeURIComponent(label)}`);
        }
      },
    };
  }, [isDesktop, isMobile, chartData.labels, trackOrArtist,  height,]);

  return (
    <div className="w-full bg-zinc-900 p-4 rounded-lg border border-zinc-800">
      <div className={height ? `h-${height}` : ''}>
        <Bar data={chartData} options={options as any} height={height} />
      </div>
      
      {trackOrArtist && (
        <div className="mt-2 text-center text-xs text-zinc-400">
          Click on a bar to view detailed stats
        </div>
      )}
    </div>
  );
};

export default BarChart;