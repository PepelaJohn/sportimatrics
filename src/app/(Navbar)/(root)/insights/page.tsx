"use client";

import { useEffect, useState, useMemo } from "react";
import { Info, Loader, Calendar, BarChart as BarChartIcon, Music, Disc, Clock, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ERROR, SUCCESS } from "@/constants";

// Components
import BarChart from "@/components/BarChart";
import MinutesPlayedLineChart from "@/components/LIneChart";
import MinutesPlayedDoughnutChart from "@/components/Doughnut";
import DialogCloseButton from "@/components/Dialog";
import { ComboboxDemo } from "@/components/ComboBOx";
import CustomDatePicker from "@/components/DatePicker";
import { ComboboxDemo as Combobox } from "@/components/ComboBox2";

// Utilities and API
import { 
  ArtistData, 
  TrackData, 
  processData, 
  processListeningData
} from "@/lib/utilsqueue";
import { getFormDB } from "@/api";

// Types
export type TimeRange = "months" | "days" | "years" | "custom";
export type ContentType = "artists" | "tracks";
export type NumRange = 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

interface ChartData {
  labels: string[];
  values: number[];
}

interface ActiveTime {
  hour: number;
  minutesPlayed: number;
}

interface ActiveDay {
  day: string;
  minutesPlayed: number;
}

interface ActiveMonth {
  month: string;
  minutesPlayed: number;
}

interface ProcessedData {
  artistData: ArtistData[];
  trackData: TrackData[];
  activeTimes: ActiveTime[];
  activeDays: ActiveDay[];
  activeMonths: ActiveMonth[];
}

interface CustomDateRange {
  customStartDate?: Date;
  customEndDate?: Date;
}

// Card component for charts
interface InsightCardProps {
  title: string;
  infoTitle: string;
  infoText: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  title, 
  infoTitle,
  infoText,
  children,
  className = "",
  icon = <Info size={16} />
}) => (
  <div className={`bg-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:shadow-green-400/5 w-full ${className}`}>
    <div className="p-4 md:p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-semibold text-sm md:text-lg uppercase text-white">{title}</h2>
          <DialogCloseButton heading={infoTitle} text={infoText}>
            <span className="text-green-400/80 hover:text-green-400 transition-colors cursor-pointer">
              <Info size={16} />
            </span>
          </DialogCloseButton>
        </div>
      </div>
      
      <div className="w-full">
        {children}
      </div>
    </div>
  </div>
);

// Loading skeleton component
const ChartSkeleton = () => (
  <div className="animate-pulse w-full h-[300px] flex flex-col items-center justify-center">
    <div className="w-12 h-12 rounded-full bg-gray-800 mb-4 flex items-center justify-center">
      <Loader className="animate-spin text-green-400/30" size={24} />
    </div>
    <div className="h-2 bg-gray-800 rounded w-1/2 mb-2"></div>
    <div className="h-2 bg-gray-800 rounded w-1/3"></div>
  </div>
);

// Main component
export default function Insights({ searchParams }: { searchParams: any }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  
  // State
  const [contentType, setContentType] = useState<ContentType>(
    searchParams?.t === "tracks" ? "tracks" : "artists"
  );
  const [timeRange, setTimeRange] = useState<TimeRange>("months");
  const [numItems, setNumItems] = useState<NumRange>(10);
  const [customDate, setCustomDate] = useState<CustomDateRange | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [artistsChart, setArtistsChart] = useState<ChartData | null>(null);
  const [tracksChart, setTracksChart] = useState<ChartData | null>(null);

  // Validate URL parameters
  useEffect(() => {
    if (contentType !== searchParams?.t) {
      router.push(`/insights?t=${contentType}`);
    }
  }, [contentType, searchParams?.t, router]);

  // Check authentication
  useEffect(() => {
    if (!Object.keys(user).length) {
      dispatch({ type: ERROR, payload: "Please login first" });
      router.replace("/auth");
    }
  }, [user, dispatch, router]);

  // Handle custom date range
  useEffect(() => {
    if (timeRange !== "custom") {
      setCustomDate(null);
    } else if (!customDate?.customStartDate || !customDate?.customEndDate) {
      dispatch({
        type: SUCCESS,
        payload: "Please select both start and end dates"
      });
    }
  }, [timeRange, customDate, dispatch]);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      if (!Object.keys(user).length) return;
      
      try {
        setIsLoading(true);
        
        // Check if custom date range is complete
        if (timeRange === "custom" && (!customDate?.customStartDate || !customDate?.customEndDate)) {
          return;
        }
        
        const response = await getFormDB();
        const {
          marquee: artistsArray,
          music_history: tracksArray,
          podcast_history: podcastArray
        } = response;
        
        const processedResult = processData(
          artistsArray,
          tracksArray,
          timeRange,
          customDate?.customStartDate,
          customDate?.customEndDate
        );
        
        // Also process listening data
        processListeningData(tracksArray, podcastArray, "years");
        
        setProcessedData(processedResult);
      } catch (error) {
        console.error("Error fetching insights data:", error);
        dispatch({ type: ERROR, payload: "Failed to load insights" });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [timeRange, customDate, user, dispatch]);

  // Process chart data when processed data changes
  useEffect(() => {
    if (!processedData) return;

    function prepareChartData(items: ArtistData[] | TrackData[], num: NumRange): ChartData {
      const slicedItems = items.slice(0, num);
      const labels: string[] = [];
      const values: number[] = [];
      
      slicedItems.forEach((item: any, i) => {
        labels[i] = item.artistName || item.trackName;
        values[i] = Math.floor(item.minutesPlayed);
      });
      
      return { labels, values };
    }
    
    // Save to session storage
    if (typeof window !== "undefined") {
      const artistData = processedData.artistData.slice(0, numItems);
      const trackData = processedData.trackData.slice(0, numItems);
      
      window.sessionStorage.setItem("artistData", JSON.stringify(artistData));
      window.sessionStorage.setItem("trackData", JSON.stringify(trackData));
    }
    
    // Update chart data
    setArtistsChart(prepareChartData(processedData.artistData, numItems));
    setTracksChart(prepareChartData(processedData.trackData, numItems));
  }, [processedData, numItems]);

  // Generate info text for time periods
  const timeRangeInfo = useMemo(() => {
    switch (timeRange) {
      case "months": return "for the last 12 months";
      case "days": return "for the last 30 days";
      case "years": return "for the last 5 years";
      case "custom": return "for the selected period";
    }
  }, [timeRange]);

  return (
    <div className="flex flex-col nav-height w-full h-full">
      <div className="bg-gray-950 py-6 text-white-2  px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Your Listening Insights</h1>
          <p className="text-gray-400 text-sm md:text-base">
            Explore your music listening habits {timeRangeInfo}
          </p>
        </header>
        
        {/* Filters section */}
        <section className="mb-8 p-4 md:p-6 bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-green-400" />
                <span className="text-sm text-gray-300">Time Period:</span>
              </div>
              <ComboboxDemo value={timeRange} setValue={setTimeRange} />
              
              <div className="flex items-center gap-2 ml-2">
                <Filter size={16} className="text-green-400" />
                <span className="text-sm text-gray-300">Show:</span>
              </div>
              <Combobox num={numItems} setNum={setNumItems} />
            </div>
            
            <div className={`transition-all ${timeRange === "custom" ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-green-400" />
                <span className="text-sm text-gray-300">Custom Range:</span>
              </div>
              <CustomDatePicker 
                disabled={timeRange !== "custom"}
                customDate={customDate}
                setCustomDate={setCustomDate}
              />
            </div>
          </div>
        </section>
        
        {/* Content type toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-1 bg-gray-900 rounded-full border border-gray-800">
            <button
              onClick={() => setContentType("artists")}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
                ${contentType === "artists" 
                  ? "bg-green-400 text-gray-900 shadow-md" 
                  : "text-gray-300 hover:text-white"}
              `}
            >
              <Music size={16} />
              Artists
            </button>
            <button
              onClick={() => setContentType("tracks")}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
                ${contentType === "tracks" 
                  ? "bg-green-400 text-gray-900 shadow-md" 
                  : "text-gray-300 hover:text-white"}
              `}
            >
              <Disc size={16} />
              Tracks
            </button>
          </div>
        </div>
        
        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top artists/tracks chart */}
          <InsightCard
            title={`Top ${numItems} ${contentType}`}
            infoTitle={`Top ${numItems} ${contentType}`}
            infoText={`This chart displays your top ${numItems} ${contentType} ${timeRangeInfo} based on minutes played. Hover or click on the bars to view more details.`}
            icon={<BarChartIcon size={16} className="text-green-400" />}
            className="lg:col-span-2"
          >
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <BarChart 
                data={contentType === "artists" ? artistsChart : tracksChart} 
                trackOrArtist={contentType}
              />
            )}
          </InsightCard>
          
          {/* Hourly activity chart */}
          <InsightCard
            title="Hourly Activity"
            infoTitle="Active Hours Rankings"
            infoText={`This chart shows which hours of the day you listen to music most frequently ${timeRangeInfo}. Each point represents the total minutes played during that hour.`}
            icon={<Clock size={16} className="text-green-400" />}
          >
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <MinutesPlayedLineChart data={processedData?.activeTimes || []} />
            )}
          </InsightCard>
          
          {/* Monthly activity chart (not shown for daily view) */}
          {timeRange !== "days" && (
            <InsightCard
              title="Monthly Activity"
              infoTitle="Activity by Periods"
              infoText={`This chart shows your listening activity distribution by month ${timeRangeInfo}. Click or hover on segments to see details.`}
              icon={<Calendar size={16} className="text-green-400" />}
            >
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <MinutesPlayedDoughnutChart data={processedData?.activeMonths || []} />
              )}
            </InsightCard>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}