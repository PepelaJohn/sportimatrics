"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";

// Components
import ActiveStatsTable from "@/components/ProfileTable";
import LoaderSpinner from "@/components/LoaderSpinner";

// API and Utilities
import { getFormDB, getProfile, Logout } from "@/api";
import { getInitials } from "@/lib/utils";
import { processData, processListeningData } from "@/lib/utilsqueue";

// Constants
import { ERROR, SIGN_IN } from "@/constants";
import Link from "next/link";

// Types
interface ActiveTimeOfDay {
  hour: number; // Hour 0 is the hour between 0000hrs to 0100hrs
  minutesPlayed: number;
}

interface ActiveMonthOfYear {
  month: string; // Example "2024-06"
  minutesPlayed: number;
}

interface TrackData {
  trackName: string;
  artistName: string;
  minutesPlayed: number;
}

interface ArtistData {
  artistName: string;
  minutesPlayed: number;
  segment: string;
}

interface ListeningData {
  activeTimes: ActiveTimeOfDay[];
  activeMonths: ActiveMonthOfYear[];
  artistData: ArtistData[];
  trackData: TrackData[];
}

interface ProfileStats {
  mostActiveHour: string;
  mostActiveMonth: string;
  mostListenedArtist: string;
  mostListenedTrack: string;
  totalMinutes: number;
}

/**
 * Analyzes user listening data to find most active times and most listened content
 */
function getMostActiveAndListened(data: ListeningData) {
  // Guard against empty data
  if (!data.activeTimes.length || !data.activeMonths.length || 
      !data.artistData.length || !data.trackData.length) {
    return {
      mostActiveHour: "N/A",
      mostActiveMonth: "N/A",
      mostListenedArtist: "N/A",
      mostListenedTrack: "N/A",
    };
  }

  // Most Active Hour
  const mostActiveHour = data.activeTimes
    .reduce((max, curr) => curr.minutesPlayed > max.minutesPlayed ? curr : max)
    .hour.toString();

  // Most Active Month
  const mostActiveMonthData = data.activeMonths
    .reduce((max, curr) => curr.minutesPlayed > max.minutesPlayed ? curr : max);
  
  const mostActiveMonth = new Date(
    mostActiveMonthData.month + "-01"
  ).toLocaleString("default", { month: "long" });

  // Most Listened Artist
  const mostListenedArtist = data.artistData
    .reduce((max, curr) => curr.minutesPlayed > max.minutesPlayed ? curr : max)
    .artistName;

  // Most Listened Track
  const mostListenedTrack = data.trackData
    .reduce((max, curr) => curr.minutesPlayed > max.minutesPlayed ? curr : max);

  return {
    mostActiveHour,
    mostActiveMonth,
    mostListenedArtist,
    mostListenedTrack: `${mostListenedTrack.trackName} by ${mostListenedTrack.artistName}`,
  };
}

export default function Profile() {
  // State
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  

  // Redux
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  
  // Router
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    if (!Object.keys(user).length) {
      dispatch({ type: ERROR, payload: "Please login first" });
      router.replace("/auth");
    }
  }, [user, dispatch, router]);

  // Fetch user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!Object.keys(user).length) return;
        
        setIsLoading(true);
        
        // Get listening history data
        const userData = await getFormDB();
        
        if (!userData) {
          dispatch({type:ERROR, payload:"Please upload your listening stats from spotify"})
        }
        
        const {
          marquee: artistsArray,
          music_history: tracksArray,
          podcast_history: podcastArray,
        } = userData;
        
        // Process data
        const listeningData = processData(artistsArray, tracksArray, "months");
        const listeningMetrics = processListeningData(tracksArray, podcastArray, "years");
        const activityStats = getMostActiveAndListened(listeningData);
        
        // Set profile stats
        setProfileStats({ 
          ...activityStats, 
          totalMinutes: listeningMetrics[0]?.minutesPlayed || 0 
        });
        
      } catch (err) {
        console.error("Error fetching user data:", err);
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Verify user profile and refresh token
  useEffect(() => {
    const verifyUserProfile = async () => {
      if (!user) return;
      
      try {
        const refreshedUser = await getProfile(dispatch as any);
        
        if (refreshedUser?.display_name) {
          dispatch({ type: SIGN_IN, payload: refreshedUser });
        } else {
          Logout(dispatch as any, user.email);
          router.push("/auth?next=profile");
        }
      } catch (err) {
        console.error("Error verifying user profile:", err);
        Logout(dispatch as any, user.email);
        router.push("/auth?next=profile");
      }
    };

    verifyUserProfile();
  }, []);

  // Calculate total hours from minutes for display
  const totalHours = profileStats ? Math.floor(profileStats.totalMinutes / 60) : 0;
  const remainingMinutes = profileStats ? profileStats.totalMinutes % 60 : 0;

  return (
    <div className="min-h-screen w-full flex flex-col items-center text-white-1">
      <Head>
        <title>Profile - SpotiMetrics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-5xl w-full nav-height px-4 sm:px-6 py-10">
        
      

        {/* Profile Header Section */}
        <div className="bg-gray-900 rounded-2xl p-8 mb-8 shadow-xl border border-gray-800">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* User Avatar */}
            <div className="relative flex-shrink-0">
              {user?.images?.length ? (
                <div className="rounded-full border-2 border-green-500 p-1">
                  <img
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                    src={user.images[0]?.url || user.images[1]?.url || user.images[2]?.url}
                    alt={user.display_name || "User profile"}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-800 flex items-center justify-center border-2 border-green-500 p-1">
                  <span className="text-3xl font-bold text-green-500">
                    {user?.display_name ? getInitials(user.display_name) : ""}
                  </span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex flex-col flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-bold">{user?.display_name}</h1>
                <span className={`
                  px-4 py-1.5 rounded-full text-sm font-semibold 
                  ${user?.product === "premium" 
                    ? "bg-green-500 text-black" 
                    : "bg-zinc-700 text-zinc-300"}
                `}>
                  {user?.product?.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center mt-3 text-zinc-400">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-sm truncate">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoaderSpinner />
          </div>
        ) : profileStats ? (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Listening Time */}
              <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl group     duration-300      border border-zinc-800">
                <div className="h-2 bg-green-500"></div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    <h3 className="text-zinc-400 text-sm font-medium">Total Listening</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    {totalHours}h {Math.round(remainingMinutes)}m
                  </p>
                </div>
              </div>
              
              {/* Most Active Hour */}
              <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl group     duration-300      border border-zinc-800">
                <div className="h-2 bg-green-500"></div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    <h3 className="text-zinc-400 text-sm font-medium">Peak Hour</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    {profileStats.mostActiveHour}:00
                  </p>
                </div>
              </div>
              
              {/* Most Active Month */}
              <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl group     duration-300      border border-zinc-800">
                <div className="h-2 bg-green-500"></div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                    </svg>
                    <h3 className="text-zinc-400 text-sm font-medium">Peak Month</h3>
                  </div>
                  <p className="text-2xl font-bold">{profileStats.mostActiveMonth}</p>
                </div>
              </div>
              
              {/* Most Listened Artist */}
              <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl group     duration-300      border border-zinc-800">
                <div className="h-2 bg-green-500"></div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"></path>
                    </svg>
                    <h3 className="text-zinc-400 text-sm font-medium">Top Artist</h3>
                  </div>
                  <p className="text-2xl font-bold truncate">{profileStats.mostListenedArtist}</p>
                </div>
              </div>
            </div>
            
            {/* Top Track Card */}
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-zinc-800">
              <div className="h-1 bg-green-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"></path>
                  </svg>
                  Top Track
                </h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 mr-4 rounded-full bg-gray-800 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{profileStats.mostListenedTrack.split(" by ")[0]}</p>
                    <p className="text-zinc-400">{profileStats.mostListenedTrack.split(" by ")[1]}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Detailed Stats Table */}
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-zinc-800">
              <div className="h-1 bg-green-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Detailed Statistics
                </h3>
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <ActiveStatsTable {...profileStats} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl p-6 text-center shadow-xl border border-zinc-800">
            <svg className="w-16 h-16 text-zinc-700 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
            </svg>
            <p className="text- my-6">No listening data available. Please upload your listening data</p>
            <Link href='/upload' className="mt-4 bg-green-500 hover:bg-green-600 text-black font-medium py-2 px-6 rounded-full transition-colors">
              Upload
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}