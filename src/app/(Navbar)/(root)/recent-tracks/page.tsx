"use client";

import { fetchRecentTracks } from "@/api";
import { useEffect, useState, useCallback } from "react";
import LoaderSpinner from "@/components/LoaderSpinner";
import { timeSince } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { ERROR } from "@/constants";
import { motion } from "framer-motion";
import { History, Users } from "lucide-react";

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
        payload: "Failed to load your recent tracks. Please try again.",
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
    const mediumImage = album.images.find(
      (img) => img.width >= 200 && img.width <= 300
    );
    if (mediumImage) return mediumImage.url;

    // Fallback to the second-to-last image, or the first if there's only one
    return album.images.length > 1
      ? album.images[album.images.length - 2].url
      : album.images[0].url;
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
                <h1 className="text-2xl md:text-3xl font-bold text-white-1 flex items-center gap-2">
                  <History className="h-7 w-7 text-green-400" />
                  Recently Played
                </h1>
                <p className="text-gray-400 mt-1">
                  Your listening history on Spotify
                </p>
              </motion.div>

              <button
                className="px-4 py-2 rounded-full bg-green-600 text-white-1 text-sm font-medium transition-all duration-300 hover:bg-green-500 shadow-md"
                onClick={fetchData}
              >
                Refresh
              </button>
            </div>
          </header>

          <main>
            {loading ? (
              <div className="flex justify-center items-center h-[60vh]">
                <LoaderSpinner />
              </div>
            ) : (
              <div>
                {recentTracks?.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-400 text-lg">
                      No recent tracks found. Start listening to see your
                      history!
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
                  {recentTracks?.map(({ track, played_at }, index) => (
                    <motion.a
                      key={`${track.uri}-${played_at}`}
                      href={track.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg hover:shadow-green-900/20 hover:border-gray-700 transition-all duration-300 transform"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="aspect-square sm:aspect-square overflow-hidden relative">
                        <img
                          src={getAlbumImage(track.album)}
                          alt={track.name}
                          className="w-full h-full object-cover transition-transform duration-500  easeinOut"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

                        <div className="absolute bottom-2 left-2 right-2 text-white-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="text-xs font-medium flex gap-1">
                            <span className="bg-black/50 backdrop-blur-sm px-2 py-1 bg-green-400 rounded-full">
                              {timeSince(played_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h2 className="text-white-1 font-bold text-lg truncate pr-2">
                            {track.name}
                          </h2>
                        </div>

                        <div className="flex items-center gap-1 text-gray-400 mt-3">
                          <Users className="h-3.5 w-3.5" />
                          <p className="text-white-4 text-xs text-center mt-1 line-clamp-2">
                            {track.artists.map((artist, i) => (
                              <span key={artist.name} className="inline">
                                {artist.name}
                                {i < track.artists.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 truncate">
                          {track.album.name}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
          </main>
        </motion.div>
      </div>
    </div>
  );
}
