"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { motion } from "framer-motion";
import { AppDispatch } from "@/redux/store/StoreProvider";
import { getuserTopItems } from "@/api";
import Spinner from "@/components/LoaderSpinner";
import { RiRefreshLine } from "react-icons/ri";
import Image from "next/image";

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
    if (loggedIn) {
      fetchTopArtists();
    }
  }, [loggedIn, fetchTopArtists]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.6,
      },
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.8,
        delay: 0.2,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.5 },
    },
   
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white-1 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-green-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 pt-24 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row gap-12 items-center"
        >
          {/* Left content section */}
          <motion.div variants={itemVariants} className="flex-1 space-y-8">
            <div className="h-full">
              <motion.p
                variants={itemVariants}
                className="text-green-400 text-sm tracking-widest uppercase font-medium mb-2"
              >
                Your Music Analytics
              </motion.p>

              <motion.h1
                variants={titleVariants}
                className="text-5xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-500"
              >
                MUSIMETER
              </motion.h1>

              <motion.div
                variants={itemVariants}
                className="mt-6 text-gray-300 max-w-lg space-y-4"
              >
                <p className="text-lg sm:text-xl">
                  Uncover your listening patterns and discover your musical
                  identity with our advanced analytics.
                </p>
                <p className="text-gray-400">
                  Visualize your favorite artists, tracks, and genres. Relive
                  your music moments and explore your personalized musical
                  journey.
                </p>
              </motion.div>
            </div>

            {!loggedIn && (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/auth"
                  className="inline-block bg-green-500 hover:bg-green-400 text-white-1 px-8 py-3 rounded-lg font-medium tracking-wide shadow-lg shadow-green-500/20 transition-all duration-300"
                >
                  START EXPLORING
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Right visualization section */}
          <motion.div
            variants={itemVariants}
            className="flex-1 w-full max-w-xl"
          >
            {loggedIn ? (
              loading ? (
                <div className="h-80 flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <div className="space-y-6">
                  {topArtists.length > 0 ? (
                    <>
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center justify-between"
                      >
                        <p className="text-gray-300 font-medium">
                          Your All-Time Top Artists
                        </p>
                        <Link
                          href="/top-artists?range=long_term"
                          className="text-green-400 text-sm hover:underline flex items-center gap-1"
                        >
                          View all
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </motion.div>

                      <div className="grid grid-cols-1 gap-5">
                        {topArtists.map((artist, index) => (
                          <motion.div
                            key={artist.id}
                            variants={imageVariants}
                            whileHover="hover"
                            className="group relative overflow-hidden rounded-xl shadow-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                          >
                            <Link href={`/artist/${artist.id}`} className="block">
                              <div className="relative overflow-hidden rounded-xl aspect-[16/5]">
                                {artist.images[0]?.url && (
                                  <div className="absolute inset-0 w-full h-full">
                                    <div className="relative w-full h-full">
                                      <Image
                                        src={artist.images[0].url}
                                        alt={artist.name}
                                        fill
                                        className="object-cover object-center opacity-70 group-hover:opacity-80 transition-opacity duration-300 rounded-xl"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      />
                                    </div>
                                  </div>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10"></div>
                                
                                <div className="absolute inset-0 z-20 flex items-center p-6">
                                  <div className="max-w-xs">
                                    <div className="flex items-center space-x-3 sm:mb-3">
                                      <span className="bg-green-500/90 text-white-1 text-xs max-[400px]:text-[10px] max-[400px]:px-2 max-[400px]:py-0 px-3 py-1 rounded-full font-bold">
                                        #{index + 1}
                                      </span>
                                      {/* <div className="h-0.5 w-12 bg-green-400/50 rounded-full"></div> */}
                                    </div>
                                    <h3 className="max-[400px]:text-sm   text-xl sm:text-3xl font-bold text-white-1 drop-shadow-md md:mb-2">
                                      {artist.name}
                                    </h3>
                                    <div className="opacity-0 max-sm:hidden group-hover:opacity-100 transition-opacity duration-300">
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-400/20 text-green-300 border border-green-500/30">
                                        View Details
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <motion.div
                      variants={itemVariants}
                      className="h-80 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                    >
                      <p className="text-gray-400 mb-6">
                        No top artists found. This might be because your account
                        is new or we need to refresh the data.
                      </p>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={fetchTopArtists}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-400 transition-all duration-300 px-6 py-3 rounded-lg text-white-1 font-medium"
                      >
                        <RiRefreshLine className="text-xl" />
                        Refresh Data
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              )
            ) : (
              <motion.div
                variants={itemVariants}
                className="h-80 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="mb-6">
                  <svg
                    className="w-20 h-20 mx-auto text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 mb-6">
                  Connect with Spotify to explore your personalized music
                  journey
                </p>
                <Link
                  href="/auth"
                  className="bg-green-500 hover:bg-green-400 transition-all duration-300 px-8 py-3 rounded-lg text-white-1 font-medium"
                >
                  Connect Now
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Features section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-32 text-center"
        >
          <h2 className="text-3xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            Discover Your Music Identity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                ),
                title: "Artist Insights",
                description: "Discover your most listened artists across different time periods"
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                ),
                title: "Track Analysis",
                description: "Explore your top tracks and understand your listening patterns"
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                    />
                  </svg>
                ),
                title: "Genre Breakdown",
                description: "Visualize your music taste across different genres and categories"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + (index * 0.2), duration: 0.6 }}
                className="p-6 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 group"
              >
                <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-green-400 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;