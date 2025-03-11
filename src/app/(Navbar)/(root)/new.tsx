"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { motion } from "framer-motion";
import { AppDispatch } from "@/redux/store/StoreProvider";
import { getuserTopItems } from "@/api";
import Spinner from "@/components/LoaderSpinner";
import { RiRefreshLine } from "react-icons/ri";

// Types
interface Artist {
  name: string;
  images: Array<{ url: string }>;
  id: string;
}

interface UserState {
  [key: string]: any;
}

interface RootState {
  user: UserState;
}

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const loggedIn = !!Object.keys(user).length;

  const [loading, setLoading] = useState(false);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Mark as hydrated after mount
  useEffect(() => {
    setHydrated(true);
  }, []);

  const fetchTopArtists = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getuserTopItems(
        "artists",
        "long_term",
        dispatch,
        3,
        0
      );
      if (response) {
        setTopArtists(response);
      }
    } catch (error) {
      console.error("Failed to fetch top artists:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (loggedIn && hydrated) {
      fetchTopArtists();
    }
  }, [loggedIn, hydrated, fetchTopArtists]);

  if (!hydrated) {
    return null; // Prevent rendering until hydration is complete
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white-1 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col lg:flex-row gap-16 items-center"
        >
          <motion.div className="flex-1 space-y-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              MUSIMETER
            </h1>
            <p className="text-gray-300 text-lg">
              Uncover your listening patterns and discover your musical identity.
            </p>

            {!loggedIn && (
              <Link
                href="/auth"
                className="inline-block bg-green-500 text-white-1 px-8 py-3 rounded-lg font-medium shadow-lg"
              >
                START EXPLORING
              </Link>
            )}
          </motion.div>

          <motion.div className="flex-1 w-full max-w-xl">
            {loggedIn ? (
              loading ? (
                <div className="h-80 flex items-center justify-center">
                  <Spinner />
                </div>
              ) : topArtists.length > 0 ? (
                <div>
                  <p className="text-gray-300 font-medium">
                    Your All-Time Top Artists
                  </p>
                  <div className="grid grid-cols-1 gap-6">
                    {topArtists.map((artist, index) => (
                      <div key={artist.id} className="group relative">
                        <div className="cursor-pointer">
                          <div className="relative overflow-hidden rounded-xl easeInOut aspect-[3/1] bg-gradient-to-r from-gray-800 to-gray-900">
                            <div className="absolute inset-0 flex items-center">
                              <div className="flex-0.3 bg-gradient-to-r from-green-300 to-green-500 h-full p-8">
                                <span className="bg-green-500/90 text-white-1 text-xs px-2 py-1 rounded-full">
                                  #{index + 1}
                                </span>
                                <h3 className="text-xl font-bold mt-3 text-white-1">
                                  {artist.name}
                                </h3>
                              </div>
                              <div
                                className="flex-1 w-full h-full group"
                                style={{
                                  backgroundImage: `url(${artist.images[1]?.url})`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-80 rounded-xl border border-gray-800 bg-gray-900/50 flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-gray-400 mb-6">
                    No top artists found. Try refreshing the data.
                  </p>
                  <button
                    onClick={fetchTopArtists}
                    className="flex items-center gap-2 bg-green-500 px-6 py-3 rounded-lg text-white-1"
                  >
                    <RiRefreshLine className="text-xl" />
                    Refresh Data
                  </button>
                </div>
              )
            ) : (
              <div className="h-80 rounded-xl border border-gray-800 bg-gray-900/50 flex flex-col items-center justify-center p-8 text-center">
                <p className="text-gray-400">Please log in to see your data.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
