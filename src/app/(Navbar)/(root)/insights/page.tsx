"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Info,
  Loader,
  Calendar,
  BarChart as BarChartIcon,
  Music,
  Disc,
  Clock,
  Filter,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ERROR, SUCCESS } from "@/constants";

// Components
import BarChart from "@/components/BarChart";
import MinutesPlayedLineChart from "@/components/LIneChart";
import MinutesPlayedDoughnutChart from "@/components/Doughnut";

import { ComboboxDemo } from "@/components/ComboBOx";
import CustomDatePicker from "@/components/DatePicker";
import { ComboboxDemo as Combobox } from "@/components/ComboBox2";

// Utilities and API
import { ArtistData, TrackData, processData } from "@/lib/utilsqueue";
import { getFormDB } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

// Types
export type TimeRange = "months" | "days" | "years" | "custom";
export type ContentType = "artists" | "tracks";
export type NumRange =
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;

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

// Memoize the InsightCard component to prevent unnecessary re-renders
const InsightCard = React.memo(
  ({
    title,
    infoTitle,
    infoText,
    children,
    className = "",
    icon = <Info size={16} className="text-green-400" />,
  }: InsightCardProps) => {
    const [infoOpen, setInfoOpen] = useState(false);

    return (
      <div
        className={`bg-black/90 border border-gray-800 rounded-xl overflow-hidden transition-all 
      hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 w-full ${className}`}
      >
        <div className="p-2 sm:py-4 md:p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/10 p-2 rounded-md flex items-center justify-center">
                {icon}
              </div>
              <h2 className="font-bold text-sm md:text-base text-white-1  tracking-wide">
                {title}
              </h2>
              <button
                onClick={() => setInfoOpen(true)}
                className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer p-1 rounded-full hover:bg-green-500/10"
                aria-label="More information"
              >
                <Info size={16} />
              </button>
            </div>
          </div>

          <div className="w-full">{children}</div>
        </div>

        <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
          <DialogContent className="bg-gray-900 border border-gray-800 text-white-1  rounded-sm max-sm:w-[350px] sm:w-full sm:py-2">
            <DialogHeader>
              <DialogTitle className="text-green-400 font-bold">
                {infoTitle}
              </DialogTitle>
            </DialogHeader>
            <div className="text-gray-300 text-sm mt-2">{infoText}</div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);

InsightCard.displayName = "InsightCard";

// Memoize the ChartSkeleton component
const ChartSkeleton = React.memo(() => (
  <div className="animate-pulse w-full h-[300px] flex flex-col items-center justify-center">
    <div className="w-12 h-12 rounded-full bg-gray-800 mb-4 flex items-center justify-center">
      <Loader className="animate-spin text-green-400/30" size={24} />
    </div>
    <div className="h-2 bg-gray-800 rounded w-1/2 mb-2"></div>
    <div className="h-2 bg-gray-800 rounded w-1/3"></div>
  </div>
));

ChartSkeleton.displayName = "ChartSkeleton";

// Main component
export default function Insights({ searchParams }: { searchParams: any }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  const [noData, setNoData] = useState(false);
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [contentType, setContentType] = useState<ContentType>(
    searchParams?.t === "tracks" ? "tracks" : "artists"
  );
  const [timeRange, setTimeRange] = useState<TimeRange>("months");
  const [numItems, setNumItems] = useState<NumRange>(10);
  const [customDate, setCustomDate] = useState<CustomDateRange | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(
    null
  );
  const [artistsChart, setArtistsChart] = useState<ChartData | null>(null);
  const [tracksChart, setTracksChart] = useState<ChartData | null>(null);

  // Validate URL parameters - memoized with useCallback
  const updateUrl = useCallback(() => {
    if (contentType !== searchParams?.t) {
      router.push(`/insights?t=${contentType}`);
    }
  }, [contentType, searchParams?.t, router]);

  // Prepare chart data - memoized with useCallback
  const prepareChartData = useCallback(
    (items: ArtistData[] | TrackData[], num: NumRange): ChartData => {
      const slicedItems = items.slice(0, num);
      const labels: string[] = [];
      const values: number[] = [];

      slicedItems.forEach((item: any, i) => {
        labels[i] =
          contentType === "artists" ? item.artistName : item.trackName;
        values[i] = Math.floor(item.minutesPlayed);
      });

      return { labels, values };
    },
    [contentType]
  );

  // Save data to session storage - memoized with useCallback
  const saveToSessionStorage = useCallback(
    (processedData: ProcessedData, numItems: NumRange) => {
      if (typeof window !== "undefined") {
        const artistData = processedData.artistData.slice(0, numItems);
        const trackData = processedData.trackData.slice(0, numItems);

        window.sessionStorage.setItem("artistData", JSON.stringify(artistData));
        window.sessionStorage.setItem("trackData", JSON.stringify(trackData));
      }
    },
    []
  );

  // Fetch data function - memoized with useCallback
  const fetchInsightsData = useCallback(async () => {
    if (Object.keys(user).length === 0 || !user) {
      return;
    }

    if (
      timeRange === "custom" &&
      (!customDate?.customStartDate || !customDate?.customEndDate)
    ) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await getFormDB();
      console.log(response);
      if (!response.ok) {
        dispatch({
          type: ERROR,
          payload: "Please upload your listening data from spotify.",
        });

        setNoData(true)
        return;
      }

      const { marquee: artistsArray, music_history: tracksArray } = response;

      const processedResult = processData(
        artistsArray,
        tracksArray,
        timeRange,
        customDate?.customStartDate,
        customDate?.customEndDate
      );

      setProcessedData(processedResult);
    } catch (error) {
      console.error("Error fetching insights data:", error);
      dispatch({ type: ERROR, payload: "Failed to load insights" });
      setProcessedData(null);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, customDate, user, dispatch]);

  // Update URL when contentType changes
  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  // Check authentication
  useEffect(() => {
    if (!Object.keys(user).length) {
      dispatch({ type: ERROR, payload: "Please login first" });
      router.replace("/auth");
    }
  }, [user, router, dispatch]);

  // Handle custom date range
  useEffect(() => {
    if (timeRange !== "custom") {
      setCustomDate(null);
    } else if (!customDate?.customStartDate || !customDate?.customEndDate) {
      dispatch({
        type: SUCCESS,
        payload: "Please select both start and end dates",
      });
    }
  }, [timeRange, customDate, dispatch]);

  // Fetch data
  useEffect(() => {
    !noData && fetchInsightsData();
 
  }, [fetchInsightsData, noData]);

  // Process chart data when processed data changes
  useEffect(() => {
    if (!processedData) return;

    // Save to session storage
    saveToSessionStorage(processedData, numItems);

    // Update chart data
    setArtistsChart(prepareChartData(processedData.artistData, numItems));
    setTracksChart(prepareChartData(processedData.trackData, numItems));
  }, [processedData, numItems, prepareChartData, saveToSessionStorage]);

  // Generate info text for time periods
  const timeRangeInfo = useMemo(() => {
    switch (timeRange) {
      case "months":
        return "for the last 12 months";
      case "days":
        return "for the last 30 days";
      case "years":
        return "for the last 5 years";
      case "custom":
        return "for the selected period";
    }
  }, [timeRange]);

  // Memoize filter section to prevent re-renders
  const filtersSection = useMemo(
    () => (
      <section className="mb-6 p-4 md:p-6 bg-black/90 backdrop-blur-lg border border-gray-800 rounded-xl hover:border-green-500/20 transition-all shadow-lg shadow-black/40">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-gray-300 text-sm font-medium">Filters</span>
          {isOpen ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
        <div
          className={`transition-all duration-300 overflow-hidden ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-5 md:space-y-0 md:flex-row md:items-center md:justify-between mt-4">
            {/* Time Period & Show Filters */}
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-6 w-full md:w-auto">
              {/* Time Period Filter */}
              <div className="flex flex-col space-y-2 sm:flex-1">
                <div className="flex items-center gap-2">
                  <div className="bg-green-500/10 p-1.5 rounded flex items-center justify-center">
                    <Clock size={14} className="text-green-400" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Time Period
                  </span>
                </div>
                <ComboboxDemo value={timeRange} setValue={setTimeRange} />
              </div>

              {/* Number of Items Filter */}
              <div className="flex flex-col space-y-2 sm:flex-1">
                <div className="flex items-center gap-2">
                  <div className="bg-green-500/10 p-1.5 rounded flex items-center justify-center">
                    <Filter size={14} className="text-green-400" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Show
                  </span>
                </div>
                <Combobox num={numItems} setNum={setNumItems} />
              </div>
            </div>

            {/* Custom Date Range */}
            <div
              className={`transition-all duration-300 ${
                timeRange === "custom"
                  ? "opacity-100 max-h-40"
                  : "opacity-50 pointer-events-none max-h-40 md:max-h-16"
              }`}
            >
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <div className="bg-green-500/10 p-1.5 rounded flex items-center justify-center">
                    <Calendar size={14} className="text-green-400" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Custom Range
                  </span>
                </div>
                <CustomDatePicker
                  disabled={timeRange !== "custom"}
                  customDate={customDate}
                  setCustomDate={setCustomDate}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
    [isOpen, timeRange, numItems, customDate]
  );

  // Memoize content type toggle to prevent re-renders
  const contentTypeToggle = useMemo(
    () => (
      <div className="flex justify-center mb-8">
        <div className="flex gap-2 p-1 bg-gray-900 rounded-full border border-gray-800">
          <button
            onClick={() => setContentType("artists")}
            className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
            ${
              contentType === "artists"
                ? "bg-green-400 text-gray-900 shadow-md"
                : "text-gray-300 hover:text-white-1 "
            }
          `}
          >
            <Music size={16} />
            Artists
          </button>
          <button
            onClick={() => setContentType("tracks")}
            className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
            ${
              contentType === "tracks"
                ? "bg-green-400 text-gray-900 shadow-md"
                : "text-gray-300 hover:text-white-1 "
            }
          `}
          >
            <Disc size={16} />
            Tracks
          </button>
        </div>
      </div>
    ),
    [contentType]
  );

  // Memoize the charts grid to prevent re-renders
  const chartsGrid = useMemo(
    () => (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top artists/tracks chart */}
        <InsightCard
          title={`Top ${numItems} ${contentType}`}
          infoTitle={`Top ${numItems} ${contentType}`}
          infoText={`This chart displays your top ${numItems} ${contentType} ${timeRangeInfo} based on minutes played. Hover or click on the bars to view more details.`}
          icon={<BarChartIcon size={16} className="text-green-400" />}
          className="lg:col-span-2"
        >
          {isLoading || !(artistsChart && tracksChart) ? (
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
          {isLoading || !processedData?.activeTimes ? (
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
            {isLoading || !processedData?.activeMonths ? (
              <ChartSkeleton />
            ) : (
              <MinutesPlayedDoughnutChart
                data={processedData?.activeMonths || []}
              />
            )}
          </InsightCard>
        )}
      </div>
    ),
    [
      numItems,
      contentType,
      timeRangeInfo,
      isLoading,
      artistsChart,
      tracksChart,
      processedData,
      timeRange,
    ]
  );

  return (
    <div className="flex flex-col nav-height w-full h-full">
      <div className=" py-6 text-white-1 -2  px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
         

          {noData ? (
            <div className="bg-gray-900 rounded-xl p-6 text-center shadow-xl border border-zinc-800">
              <svg
                className="w-16 h-16 text-zinc-700 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <p className="text- my-6">
                No listening data available. Please upload your listening data
              </p>
              <Link
                href="/upload"
                className="mt-4 bg-green-500 hover:bg-green-600 text-black font-medium py-2 px-6 rounded-full transition-colors"
              >
                Upload
              </Link>
            </div>
          ) : (
            <>
             {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white-1  mb-2">
              Your Listening Insights
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Explore your music listening habits {timeRangeInfo}
            </p>
          </header>
              {filtersSection}

              {contentTypeToggle}

              {chartsGrid}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
