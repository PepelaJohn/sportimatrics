"use client";
import { getFormDB, getProfile, Logout } from "@/api";
import { getCookie, getInitials } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActiveStatsTable from "@/components/ProfileTable";
import { processData, processListeningData } from "@/lib/utilsqueue";
import LoaderSpinner from "@/components/LoaderSpinner";
import { ERROR, SIGN_IN } from "@/constants";
interface activeTimesofTHeDay {
  hour: number; // hour 0 is the hour between 0000hrs to 0100hrs
  minutesPlayed: number;
}

interface activeMonthsofTHeyear {
  month: string; // example "2024-06"
  minutesPlayed: number;
}

interface Period {
  start: string; // start time of the period
  end: string; // end time of the period
}

interface TrackDatum {
  trackName: string;
  artistName: string;
  minutesPlayed: number;
}

interface ArtistDatum {
  artistName: string;
  minutesPlayed: number;
  segment: string;
}

interface Arr {
  activeTimes: activeTimesofTHeDay[];
  activeMonths: activeMonthsofTHeyear[];
  artistData: ArtistDatum[];
  trackData: TrackDatum[];
}

function getMostActiveAndListened(arr: Arr) {
  // Most Active Hour
  const mostActiveHour = arr.activeTimes
    .reduce((max, curr) =>
      curr.minutesPlayed > max.minutesPlayed ? curr : max
    )
    .hour.toString();

  // Most Active Month
  const mostActiveMonthData = arr.activeMonths.reduce((max, curr) =>
    curr.minutesPlayed > max.minutesPlayed ? curr : max
  );
  const mostActiveMonth = new Date(
    mostActiveMonthData.month + "-01"
  ).toLocaleString("default", { month: "long" });

  // Most Listened Artist
  const mostListenedArtist = arr.artistData.reduce((max, curr) =>
    curr.minutesPlayed > max.minutesPlayed ? curr : max
  ).artistName;

  // Most Listened Track
  const mostListenedTrack = arr.trackData.reduce((max, curr) =>
    curr.minutesPlayed > max.minutesPlayed ? curr : max
  );

  return {
    mostActiveHour,
    mostActiveMonth,
    mostListenedArtist,
    mostListenedTrack: `${mostListenedTrack.trackName} by ${mostListenedTrack.artistName}`,
  };
}



export default function Profile() {
  const [data, setData] = useState<{
    mostActiveHour: string;
    mostActiveMonth: string;
    mostListenedArtist: string;
    mostListenedTrack: string;
    totalMinutes: number;
  }>();
 
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
 

  if (!Object.keys(user).length) {
    dispatch({ type: ERROR, payload: "Please Login first" });
    router.replace("/auth");
  }
  useEffect(() => {
    
    const getDataFromDB = async () => {

      const dataz = await getFormDB();
      const {
        marquee: artistsArray,
        music_history: tracksArray,
        podcast_history: podcastArray,
      } = dataz;
      const dt = processData(artistsArray, tracksArray, "months");
      const dtx = processListeningData(tracksArray, podcastArray, "years");
      const dty = getMostActiveAndListened(dt);

      setData({ ...dty, totalMinutes: dtx[0].minutesPlayed });
      
    };
    !!Object.keys(user).length && getDataFromDB();
  }, []);
  useEffect(() => {
    // alert()
    if (!!user) {
      let N_user = getProfile(dispatch as React.Dispatch<UnknownAction>);
      N_user.then(function (result: any) {
        if (!!result?.display_name) {
          dispatch({ type: SIGN_IN, payload: result });
        } else {
          Logout(dispatch as React.Dispatch<UnknownAction>, user.email);
          router.push("/auth?next=profile");
        }
      });
    }
  }, []);
  //; https://buymeacoffee.com/spotimetrics

  return (
    <div className="min-h-screen w-full  flex flex-col items-center  text-gray-100">
      <Head>
        <title>Profile - SpotiMetrics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl w-full nav-height">
        <div className="relative flex flex-col w-full items-center    ">
          <div className="px-9 max-lg:p-2  max-[400px]:w-[300px] flex-auto min-h-[70px] pb-0 bg-transparent">
            <div className="flex mb-6 md:w-[700px] xl:flex-nowrap">
              <div className="flex-shrink-0  mr-5">
                <div
                  className={`relative inline-block shrink-0  cursor-pointer  ${
                    user?.images?.length
                      ? ""
                      : "items-center justify-center flex w-[80px] h-[80px] lg:w-[160px] lg:h-[160px] bg-gray-800"
                  } rounded-2xl`}
                >
                  {!!user?.images?.length ? (
                    <img
                      className="inline-block shrink-0 rounded-2xl w-[80px] h-[80px] lg:w-[160px] lg:h-[160px]"
                      src={user?.images[1]?.url}
                      //src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/avatars/avatar1.jpg"
                      alt="image"
                    />
                  ) : (
                    <span className="text-gray-600 font-semibold text-[24px] ">
                      {!!user?.display_name
                        ? getInitials(user?.display_name!)
                        : ""}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-white-1">
                <div className="flex items-start justify-between ">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className=" text-[24px] max-lg:text-[18px] mr-1">
                        {user?.display_name}
                      </span>
                    </div>
                    <div className="flex pr-2 max-sm:flex-col  !text-gray-500  ">
                      <span className="flex items-center mb-2 mr-5 text-secondary- max-lg:text-xs text-sm hover:text-primary">
                        <span className="mr-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-3 h-3"
                          >
                            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                          </svg>
                        </span>{" "}
                        {user?.email}
                      </span>
                    </div>
                    <span
                      className={`${
                        user?.product === "premium"
                          ? "!bg-yellow-400 text-black-1"
                          : ""
                      } w-[100px] text-center cursor-pointer px-2 py-1 text-xs text-white-1 font-semibold uppercase rounded-lg`}
                    >
                      {user?.product}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between">
                  <div className="flex flex-wrap items-center"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {!!data ? <ActiveStatsTable {...data} /> : <LoaderSpinner />}
      </div>
    </div>
  );
}
