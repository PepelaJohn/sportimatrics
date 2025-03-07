"use client";

import { getuserTopItems } from "@/api";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ERROR } from "@/constants";
import { motion } from "framer-motion";
import { ChevronDown, Music, Users } from "lucide-react";
import PopularityIndicator from "@/components/PopularityIndicator";
import { formatNumberWithCommas } from "@/lib/utils";
import TrackCardSkeleton from "@/components/TrackCardSkeleton";

// Types
type TimeRange = "short_term" | "medium_term" | "long_term";
type TimeRangeIndex = 0 | 1 | 2;
type Artist = { name: string; uri: string };
type Image = { url: string; height: number; width: number };
type Album = { images: Image[]; name: string; uri: string };
type TrackType = {
  name: string;
  popularity: number;
  uri: string;
  album: Album;
  artists: Artist[];
};

const TimeRangeOptions = [
  { value: "short_term", label: "Recent", index: 0 as TimeRangeIndex , description:"Last 4 Weeks"},
  { value: "medium_term", label: "Mid-term", index: 1 as TimeRangeIndex, description:"Last 6 Months" },
  { value: "long_term", label: "Long-time ", index: 2 as TimeRangeIndex, description:"Last 1 Year" },
];

// Skeleton loader for track cards


// Track card component
const TrackCard = ({ track, index, selected }: { track: TrackType; index: number, selected:"List"|"Card"  }) => {
  const thumbnailUrl =
    track.album.images.length > 1
      ? track.album.images[1].url
      : track.album.images[0]?.url;

  return (
    <motion.a
      href={track.uri}
      target="_blank"
      className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg hover:shadow-green-900/20 hover:border-gray-700 transition-all duration-300 transform"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className={`${selected === "List"?"":"aspect-square "} sm:aspect-square overflow-hidden relative`}>
        <img
          src={thumbnailUrl}
          alt={track.name}
          className={`w-full  object-cover transition-transform duration-500 group-hover:scale-110 easeinOut ${selected === "List" ? "h-0" : "h-full"} sm:h-full`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-xs font-medium flex gap-1">
            <span className="bg-black/50 backdrop-blur-sm px-2 py-1 bg-green-400 rounded-full">
              #{index + 1}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-white font-bold text-lg truncate pr-2">
            <span className={` text-gray-1 ${selected === "List" ? "inline" : "hidden"} max-sm:inline`}>{index + 1} - </span> {track.name}
          </h2>
          <span className="text-xs text-green-400 font-semibold bg-green-400/10 px-2 py-0.5 rounded-full">
            {track.popularity}%
          </span>
        </div>
        <PopularityIndicator value={track.popularity} />
        <div className="flex items-center gap-1 text-gray-400 mt-3">
          <Users className="h-3.5 w-3.5" />

          <p className="text-white-4 text-xs text-center mt-1 line-clamp-2">
            {track.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
      </div>
    </motion.a>
  );
};

export default function TopSongs({
  searchParams,
}: {
  searchParams: { range?: string };
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: any) => state.user);

  const animRef = useRef(null);
  const [topTracks, setTopTracks] = useState<TrackType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState<TimeRangeIndex>(
    getTimeRangeIndex(searchParams.range)
  );
  const [selected, setSelected] = useState<"List"|"Card">("Card");
  const [open, setOpen] = useState(false);

  const options = ["List", "Card"];
  // Check authentication
  useEffect(() => {
    if (!Object.keys(user).length) {
      dispatch({ type: ERROR, payload: "Please login first" });
      router.replace("/auth");
    }
  }, [user, dispatch, router]);

  // Validate and normalize range parameter
  useEffect(() => {
    const validRange = getValidRangeParam(searchParams.range);
    if (validRange !== searchParams.range) {
      router.push(`/top-tracks?range=${validRange}`);
    }
  }, [searchParams.range, router]);

  // Fetch data
  useEffect(() => {
    const fetchTopTracks = async () => {
      setIsLoading(true);
      const timeRange = TimeRangeOptions[selectedRange].value;

      try {
        const tracks = await getuserTopItems(
          "tracks",
          timeRange,
          dispatch as any,
          20,
          0
        );
        setTopTracks(tracks);
        router.push(`/top-tracks?range=${timeRange}`);
      } catch (error) {
        console.error("Failed to fetch top tracks:", error);
        dispatch({ type: ERROR, payload: "Failed to load your top tracks" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopTracks();
  }, [selectedRange, dispatch, router]);

  // Handle range selection
  const handleRangeChange = (index: TimeRangeIndex) => {
    setSelectedRange(index);
  };

  return (
    <div className="nav-height flex w-full flex-col text-white-2">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className="mb-8 mt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <motion.div
                className="text-2xl md:text-3xl font-bold text-white-1 relative"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  <Music className="h-7 w-7 text-green-400" />
                  Your Top Tracks
                </h1>
                <p className="text-gray-400 mt-1">
                  Discover your most listened tracks on Spotify
                </p>
              </motion.div>
              {/* Time range selector */}
              <div className="bg-gray-900 p-1 max-sm:w-full  rounded-full border border-gray-800 shadow-lg">
                <div className="flex gap-1">
                  {TimeRangeOptions.map((option, index) => (
                    <motion.button
                      key={option.value}
                      onClick={() => handleRangeChange(option.index)}
                      className={`
                    px-4 py-2 ${index===0?"rounded-l-full":index===2 ?"rounded-r-full":"rounded-none"}  text-sm font-medium transition-all duration-300
                    ${
                      selectedRange === option.index
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-800"
                    }
                  `}
                      // whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                    <span className="hidden sm:inline">{option.label}</span>
                      <span className="sm:hidden">{option.label.charAt(0)}</span>
                      <span className="text-xs ml-1 opacity-70 hidden md:inline">
                        ({option.description})
                      </span>
                    </motion.button>
                  ))}

                  {/* list sytle selector */}
                  <div className="relative w-36 z-10 ml-auto sm:hidden ">
                    {/* Selected Option */}
                    <button
                      className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg p-2 text-sm w-full flex justify-between items-center"
                      onClick={() => setOpen(!open)}
                    >
                      {selected}
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>

                    {/* Dropdown Options */}
                    {open && (
                      <div className="absolute mt-2 w-full overflow-hidden bg-gray-900 border border-gray-800 rounded-xl shadow-lg">
                        {options.map((option:any) => (
                          <button
                            key={option}
                            className="w-full px-4 py-2 text-left text-white hover:bg-gray-800 transition"
                            onClick={() => {
                              setSelected(option);
                              setOpen(false);
                            }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <motion.div
            ref={animRef}
              className="h-1 w-full bg-gray-800 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.1 }}
            >
              <motion.div
              
                className="h-full bg-green-400"
                initial={{ width: "0%" }}
                animate={{ width: isLoading ? "90%" : "100%" }}
                transition={{
                  duration: isLoading ? 2 : 0.5,
                  ease: "easeInOut",
                  onComplete: () => {
                     if(animRef.current){
                     ( animRef.current as any).style.opacity = "0";
                     }
                  },
                }}
              />
            </motion.div>
          </header>

          <main>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
                {Array.from({ length: 10 }).map((_, index) => (
                  <TrackCardSkeleton key={index} listtype={selected} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
                {topTracks?.map((track, index) => (
                  <TrackCard
                    key={`${track.name}-${index}`}
                    track={track}
                    index={index}
                    selected={selected}
                  />
                ))}
              </div>
            )}
          </main>
        </motion.div>
      </div>
    </div>
  );
}

// Helper functions
function getTimeRangeIndex(range?: string): TimeRangeIndex {
  switch (range) {
    case "short_term":
      return 0;
    case "medium_term":
      return 1;
    case "long_term":
      return 2;
    default:
      return 0;
  }
}

function getValidRangeParam(range?: string): TimeRange {
  if (
    range === "short_term" ||
    range === "medium_term" ||
    range === "long_term"
  ) {
    return range;
  }
  return "short_term";
}
