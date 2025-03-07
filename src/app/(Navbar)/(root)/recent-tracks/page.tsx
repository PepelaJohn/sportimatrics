"use client";

import { fetchRecentTracks } from "@/api";
import { useEffect, useState, useCallback } from "react";
import LoaderSpinner from "@/components/LoaderSpinner";
import { timeSince } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { ERROR } from "@/constants";
import { motion } from "framer-motion";

// Define types properly
interface Artist {
  name: string;
  uri: string;
}

interface AlbumImage {
  url: string;
  height: number;
  width: number;
}

interface Album {
  images: AlbumImage[];
  name: string;
}

interface Track {
  name: string;
  uri: string;
  artists: Artist[];
  album: Album;
}

interface RecentTrack {
  track: Track;
  played_at: string;
}

export default function RecentTracks() {
  const [recentTracks, setRecentTracks] = useState<RecentTrack[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: any) => state.user);

  // Redirect to auth if not logged in - moved outside useEffect for immediate execution
  useEffect(() => {
    if (!Object.keys(user).length) {
      dispatch({ type: ERROR, payload: "Please login first" });
      router.replace("/auth");
    }
  }, [user, dispatch, router]);

  // Memoized data fetching function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchRecentTracks(dispatch as any);
      setRecentTracks(data);
    } catch (error) {
      console.error("Failed to fetch recent tracks:", error);
      dispatch({ 
        type: ERROR, 
        payload: "Failed to load your recent tracks. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(user).length) {
      fetchData();
    }
  }, [fetchData, user]);

  // Helper function to get the appropriate album image
  const getAlbumImage = (album: Album): string => {
    if (!album.images.length) return "";
    
    // Try to get a medium-sized image for better performance
    const mediumImage = album.images.find(img => img.width >= 200 && img.width <= 300);
    if (mediumImage) return mediumImage.url;
    
    // Fallback to the second-to-last image, or the first if there's only one
    return album.images.length > 1 
      ? album.images[album.images.length - 2].url 
      : album.images[0].url;
  };

  return (
   <div className="nav-height flex flex-col w-full">
     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <LoaderSpinner />
          </div>
        ) : (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center justify-between">
              <motion.h1 
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              >
                Recently Played
              </motion.h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition duration-300 ease-in-out"
                onClick={fetchData}
              >
                Refresh
              </motion.button>
            </div>

            {recentTracks?.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-400 text-lg">No recent tracks found. Start listening to see your history!</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {recentTracks?.map(({ track, played_at }, index) => (
                <motion.a
                  key={`${track.uri}-${played_at}`}
                  href={track.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-xl overflow-hidden bg-gray-800/30 backdrop-blur-sm hover:bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 h-full shadow-lg hover:shadow-purple-900/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative w-full pt-[100%] overflow-hidden bg-gray-900">
                    <img
                      alt={track.name}
                      src={getAlbumImage(track.album)}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-xs text-gray-300">{timeSince(played_at)}</p>
                    </div>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                          <path d="M8 5.14v14l11-7-11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col p-4">
                    <h2 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-purple-400 transition-colors">
                      {track.name}
                    </h2>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {track.artists.map((artist, i) => (
                        <span key={artist.name} className="inline">
                          {artist.name}
                          {i < track.artists.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">{track.album.name}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
   </div>
  );
}