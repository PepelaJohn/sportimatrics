"use client";
import BarChart from "@/components/BarChart";
import DialogCloseButton from "@/components/Dialog";
import { Info, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type PeriodT = {
  period: string;
  minutesPlayed: number;
};
type ArtistDataT = {
  artistName: string;
  minutesPlayed: number;
  segment: string;
  periods: PeriodT[];
};

type TrackDataT = {
  artistName: string;
  minutesPlayed: number;
  trackName:string;
  periods: PeriodT[];
}

const page = () => {
  const router = useRouter();
  const link = window.location.href.split("/");

  let location = link[link.length - 1];
  location = location.split("%20").join(" ")
  const [data, setData] = useState([]);

  const [processedData, setProcessedData] = useState<TrackDataT[] | null>(
    null
  );

  const [chartData, setChartData] = useState<{
    labels: string[] ;
    values: number[] ;
  } | null>(null);
  const searchArtistByName = (name: string) => {
    const artist = processedData!?.find(
      (track) => track?.trackName?.toLowerCase() === name.toLowerCase()
    );

    if (artist) {
      return artist;
    } else {
      return null;
    }
  };
  useEffect(() => {
    if (typeof window !== undefined) {
      const dt = window?.sessionStorage.getItem("trackData");
      let dt2;
      
      
      if (dt !== null) {
        dt2 = JSON.parse(dt);
      }
      
      
      setProcessedData(dt2);
    }
  }, []);

  useEffect(() => {
    
    const ArtistProcessed = searchArtistByName(location);


    const labels =
      ArtistProcessed !== null
        ? ArtistProcessed?.periods?.map((d) =>
          new Date(d.period + "-01").toLocaleString("default", { month: "long" }).slice(0,3))
        : null;
    const minutesPlayed =
      ArtistProcessed !== null
        ? ArtistProcessed?.periods?.map((p) => p.minutesPlayed)
        : null;

    if (labels === null || minutesPlayed === null) {
      setChartData(null);
    } else {
      setChartData({ labels, values: minutesPlayed });
    }

 
  }, [processedData]);

  return (
    <div className="min-h-screen h-full  w-full max-w-full gap-5 flex mb-5 flex-col items-center px-2  text-gray-100">
      <div className="nav-height w-full"></div>
      
      <div className=" border border-gray-800 bg-gray-900  lg:max-w-[800px]  w-full  lg:p-10 py-3 flex flex-col overflow-hidden items-center justify-center ">
        <div className="flex   items-center justify-center gap-5 w-full h-full my-4">
     

          <DialogCloseButton
            heading={`${location}`}
            text={`These are the periods you listened to ${location} and the minutes corresponding to the periods.`}
          >
            <span className="text-green-400 cursor-pointer">
              <Info className="w-4"></Info>
            </span>
          </DialogCloseButton>
        
        </div>
        { 
          <>
            {chartData === null ? (
              <Loader className="animate-spin text-green-400" size={30} />
            ) : (
              <BarChart data={chartData}  />
            )}
          </>
        }
    
      </div>
    </div>
  );
};

export default page;
