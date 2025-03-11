"use client";

import { getuserTopItems } from "@/api";
import { motion } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ERROR } from "@/constants";
import { formatNumberWithCommas } from "@/lib/utils";
import { Music, Users, TrendingUp, ChevronDown } from "lucide-react";
import PopularityIndicator from "@/components/PopularityIndicator";
import TrackCardSkeleton from "@/components/TrackCardSkeleton";
import Link from "next/link";

// Types
interface Artist {
  id: string; // Adding id field
  name: string;
  popularity: number;
  uri: string;
  followers: {
    total: number;
  };
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
}

interface TimeRange {
  id: "short_term" | "medium_term" | "long_term";
  label: string;
  description: string;
}

export default function TopArtists({
  searchParams,
}: {
  searchParams: { range: string };
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  const animRef = useRef<HTMLDivElement>(null);
  const [topArtists, setTopArtists] = useState<Artist[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [animateCards, setAnimateCards] = useState<boolean>(false);
  const [selected, setSelected] = useState<"Card"|"List">("Card");
  const [open, setOpen] = useState(false);

  const options = ["List", "Card"];
  // Define time ranges with more descriptive labels
  const timeRanges: TimeRange[] = [
    { id: "short_term", label: "Recent", description: "Last 4 Weeks" },
    { id: "medium_term", label: "Mid-term", description: "Last 6 Months" },
    { id: "long_term", label: "Long-term", description: "Last 1 Year  " },
  ];

  // Determine selected time range
  const getSelectedIndex = (): number => {
    if (searchParams.range === "medium_term") return 1;
    if (searchParams.range === "long_term") return 2;
    return 0; // Default to short_term
  };

  const [selectedRange, setSelectedRange] = useState<number>(
    getSelectedIndex()
  );

  // Check authentication
  useEffect(() => {
    if (!Object.keys(user).length) {
      dispatch({
        type: ERROR,
        payload: "Please login to view your top artists",
      });
      router.replace("/auth");
    }
  }, [user, dispatch, router]);

  // Handle URL validation
  useEffect(() => {
    const validRanges = ["short_term", "medium_term", "long_term"];
    if (!searchParams.range || !validRanges.includes(searchParams.range)) {
      router.replace("/top-artists?range=short_term");
    }
  }, [searchParams.range, router]);

  // Fetch top artists based on selected time range
  useEffect(() => {
    const fetchTopArtists = async () => {
      setLoading(true);
      const term = timeRanges[selectedRange].id;

      try {
        const data = await getuserTopItems(
          "artists",
          term,
          dispatch as React.Dispatch<any>,
          20,
          0
        );

        setTopArtists(data);
        router.push(`/top-artists?range=${term}`, { scroll: false });

        // Small delay before triggering animation
        setTimeout(() => setAnimateCards(true), 100);
      } catch (error) {
        console.error("Failed to fetch top artists:", error);
        dispatch({
          type: ERROR,
          payload: "Failed to load your top artists. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTopArtists();
  }, [selectedRange, dispatch, router]);

  // Reset animation state when changing time range
  useEffect(() => {
    setAnimateCards(false);
  }, [selectedRange]);

  // Helper to get optimal image
  const getOptimalImage = (images: Artist["images"]) => {
    if (!images || images.length === 0) return "/placeholder-artist.jpg";

    // Try to get medium size image
    const mediumImage = images.find(
      (img) => img.width >= 200 && img.width <= 300
    );
    if (mediumImage) return mediumImage.url;

    // Fallback to second-to-last (usually good size) or first image
    return images.length > 1 ? images[images.length - 2].url : images[0].url;
  };

  // Handler for navigating to artist page
  const handleArtistNameClick = (e: React.MouseEvent, artistId: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/artist/${artistId}`);
  };

  return (
    <div className="nav-height flex w-full flex-col text-white-2 ">
      <div className="min-h-screen px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8 mt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center w-full justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white-1 flex items-center gap-2">
                  <Music className="h-7 w-7 text-green-400" />
                  Your Top Artists
                </h1>
                <p className="text-gray-400 mt-1">
                  Discover your most listened artists on Spotify
                </p>
              </div>

              {/* Time range selector */}
              <div className="bg-gray-900 p-1 max-sm:w-full rounded-full border border-gray-800 shadow-lg">
                <div className="flex gap-1">
                  {timeRanges.map((range, index) => (
                    <button
                      key={range.id}
                      onClick={() => setSelectedRange(index)}
                      className={`
                        px-4 py-2 ${index===0?"rounded-l-full":index===2 ?"rounded-r-full":"rounded-none"} text-sm font-medium transition-all duration-300
                        ${
                          selectedRange === index
                            ? "bg-green-600 text-white-1 shadow-md"
                            : "bg-transparent text-gray-400 hover:text-white-1 hover:bg-gray-800"
                        }
                      `}
                    >
                      <span className="hidden sm:inline">{range.label}</span>
                      <span className="sm:hidden">{range.label.charAt(0)}</span>
                      <span className="text-xs ml-1 opacity-70 hidden md:inline">
                        ({range.description})
                      </span>
                    </button>
                  ))}

                  {/* list style selector */}
                  <div className="relative w-36 z-10 ml-auto sm:hidden">
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
                            className="w-full px-4 py-2 text-left text-white-1 hover:bg-gray-800 transition"
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

            {/* Current range indicator */}
            <div className="flex items-center gap-2 text-gray-400 mb-6">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">
                Showing your top artists from the{" "}
                <span className="text-green-400 font-medium">
                  {timeRanges[selectedRange].description}
                </span>
              </span>
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
                animate={{ width: loading ? "90%" : "100%" }}
                transition={{
                  duration: loading ? 2 : 0.5,
                  ease: "easeInOut",
                  onComplete: () => {
                    if(animRef.current){
                      (animRef.current as any).style.opacity = "0";
                    }
                  },
                }}
              />
            </motion.div>
          </header>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
              {Array.from({ length: 10 }).map((_, index) => (
                <TrackCardSkeleton key={index} listtype={selected}/>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
              {topArtists?.map((artist, index) => (
                <div
                  key={artist.uri}
                  className={`group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg hover:shadow-green-900/20 hover:border-gray-700 transition-all duration-300 transform
                    ${
                      animateCards
                        ? `animate-fade-slide-up opacity-100`
                        : "opacity-0"
                    }
                  `}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  {/* Artist image - link to Spotify */}
                  <a
                    href={artist.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block ${selected === "List"?"":"aspect-square "} sm:aspect-square overflow-hidden relative`}
                  >
                    <img
                      src={getOptimalImage(artist.images)}
                      alt={artist.name}
                      className={`w-full object-cover transition-transform duration-500  easeinOut ${selected === "List" ? "h-0" : "h-full"} sm:h-full`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <div className="absolute bottom-2 left-2 right-2 text-white-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-xs font-medium flex gap-1">
                        <span className="bg-black/50 backdrop-blur-sm px-2 py-1 bg-green-400 rounded-full">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                  </a>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      {/* Artist name - link to internal artist page */}
                      <h2 
                        onClick={(e) => handleArtistNameClick(e, artist.id)}
                        className="text-white-1 font-bold text-lg truncate pr-2 cursor-pointer hover:text-green-400 transition-colors"
                      >
                       <span className={`text-gray-1 ${selected === "List" ? "inline" : "hidden"}`}>{index + 1} - </span> {artist.name}
                      </h2>
                      <span className="text-xs text-green-400 font-semibold bg-green-400/10 px-2 py-0.5 rounded-full">
                        {artist.popularity}%
                      </span>
                    </div>

                    <PopularityIndicator value={artist.popularity} />

                    <div className="flex items-center gap-1 text-gray-400 mt-3">
                      <Users className="h-3.5 w-3.5" />
                      <span className="text-sm">
                        {formatNumberWithCommas(artist.followers.total)}{" "}
                        followers
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results state */}
          {!loading && (!topArtists || topArtists.length === 0) && (
            <div className="text-center py-16">
              <div className="inline-flex justify-center items-center w-16 h-16 mb-4 rounded-full bg-gray-800 text-gray-400">
                <Music className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-white-1 mb-2">
                No artists found
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                We couldn&apos;t find any artists for this time range. Try listening
                to more music or switch to a different time period.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}