"use client";
import { getProfile, Logout } from "@/api";
import { getCookie, getInitials } from "@/lib/utils";
import { Loader } from "lucide-react";
import {
  ArtistData,
  artistsArray,
  processData,
  TrackData,
  tracksArray,
} from "@/lib/utilsqueue";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import BarChart from "@/components/BarChart";

export default function Profile() {
  const [data1, setData1] = useState<{
    labels: string[];
    values: number[];
  } | null>(null);
  const [data2, setData2] = useState<{
    labels: string[];
    values: number[];
  } | null>(null);

  const [data, setData] = useState<{
    artistData: ArtistData[];
    trackData: TrackData[];
  } | null>(null);
  useEffect(() => {
    const dt = processData(artistsArray, tracksArray, "months");

    setData(dt);
  }, []);

  useEffect(() => {
    const dt1 = data!?.artistData.slice(0, 10);
    const dt2 = data!?.trackData.slice(0, 10);
    const lbls: string[] = [];
    const vals: number[] = [];
    const lbls2: string[] = [];
    const vals2: number[] = [];

    dt1?.map((a, i) => {
      lbls[i] = a.artistName;
      vals[i] = Math.floor(a.minutesPlayed);
    });
    dt2?.map((a, i) => {
      lbls2[i] = a.trackName;
      vals2[i] = Math.floor(a.minutesPlayed);
    });
    setData2({ labels: lbls2, values: vals2 })
    setData1({ labels: lbls, values: vals });
  }, [data]);

  return (
    <div className="min-h-screen h-full  w-full max-w-full gap-5 flex mb-5 flex-col items-center  text-gray-100">
      <div className="max-w-5xl  nav-height"></div>
      <div className=" border border-gray-800  lg:max-w-[800px]  w-full   lg:p-10 flex flex-col items-center justify-center ">
        <h1 className="font-semibold uppercase mb-10 text-lg">
          Top 10 Artists
        </h1>
        {data1 === null ? (
          <Loader className="animate-spin text-green-400" size={30} />
        ) : (
          <BarChart data={data1} />
        )}
      </div>
      <div className=" border border-gray-800  lg:max-w-[800px]  w-full   lg:p-10 flex flex-col items-center justify-center ">
        <h1 className="font-semibold uppercase mb-10 text-lg">
          Top 10 Tracks
        </h1>
        {data2 === null ? (
          <Loader className="animate-spin text-green-400" size={30} />
        ) : (
          <BarChart data={data2} />
        )}
      </div>
    </div>
  );
}
