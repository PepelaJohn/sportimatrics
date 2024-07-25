"use client";
import { Loader } from "lucide-react";
import {
  ArtistData,
  artistsArray,
  processData,
  TrackData,
  tracksArray,
} from "@/lib/utilsqueue";

import { useEffect, useState } from "react";
interface MinutesPlayedLineChartProps {
  data: { hour: number; minutesPlayed: number }[];
}
import BarChart from "@/components/BarChart";
import { getFormDB } from "@/api";
import { getDifferenceInSecondsAndMinutes } from "@/lib/utils";
import MinutesPlayedLineChart from "@/components/LIneChart";
import MinutesPlayedDoughnutChart from "@/components/Doughnut";

export default function Profile() {
  const datap = [
    { month: "2024-06", minutesPlayed: 20080.85668333357 },
    { month: "2024-02", minutesPlayed: 17952.89651666661 },
    { month: "2024-05", minutesPlayed: 17825.754966666747 },
    { month: "2024-04", minutesPlayed: 12639.85274999999 },
    { month: "2024-03", minutesPlayed: 11155.954316666655 },
    { month: "2024-01", minutesPlayed: 9605.204916666771 },
    { month: "2024-07", minutesPlayed: 5421.837100000004 },
  ];
  const [processedData, setProcessed] = useState<boolean>(false);
  const [data1, setData1] = useState<{
    labels: string[];
    values: number[];
  } | null>(null);

  const [data2, setData2] = useState<{
    labels: string[];
    values: number[];
  } | null>(null);

  interface ActiveMonth {
    month: string;
    minutesPlayed: number;
  }

  interface ActiveDay {
    day: string;
    minutesPlayed: number;
  }

  interface ActiveTime {
    hour: number;
    minutesPlayed: number;
  }

  const [data, setData] = useState<{
    artistData: ArtistData[];
    trackData: TrackData[];

    activeTimes: ActiveTime[];
    activeDays: ActiveDay[];
    activeMonths: ActiveMonth[];
  } | null>(null);
  useEffect(() => {
    const getDataFromDB = async () => {
      const start = new Date();
      const dataz = await getFormDB();
      const {
        marquee: artistsArray,
        music_history: tracksArray,
        processed,
      } = dataz;
      const dt = processData(artistsArray, tracksArray, "months");
      setProcessed(processed);
      localStorage.setItem("processed", processed.toString());
      setData(dt);
      console.log(dt);

      const end = new Date();
      console.log(
        getDifferenceInSecondsAndMinutes(
          start as unknown as string,
          end as unknown as string
        )
      );
    };
    getDataFromDB();
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
    setData2({ labels: lbls2, values: vals2 });
    setData1({ labels: lbls, values: vals });
  }, [data]);

  return (
    <div className="min-h-screen h-full  w-full max-w-full gap-5 flex mb-5 flex-col items-center  text-gray-100">
      <div className="max-w-5xl  nav-height"></div>
      <div className=" border border-gray-800  lg:max-w-[800px]  w-full  lg:p-10 flex flex-col items-center justify-center ">
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
        <h1 className="font-semibold uppercase mb-10 text-lg">Top 10 Tracks</h1>
        {data2 === null ? (
          <Loader className="animate-spin text-green-400" size={30} />
        ) : (
          <BarChart data={data2} />
        )}
      </div>
      <div className=" border border-gray-800  lg:max-w-[800px]  w-full   lg:p-10 flex flex-col items-center justify-center ">
        <h1 className="font-semibold uppercase mb-10 text-lg">
          Active Periods
        </h1>
        {data === null ? (
          <Loader className="animate-spin text-green-400" size={30} />
        ) : (
          <MinutesPlayedLineChart data={data?.activeTimes} />
        )}
      </div>
      <div className=" border border-gray-800  lg:max-w-[800px]  w-full   lg:p-10 flex flex-col items-center justify-center ">
        <h1 className="font-semibold uppercase mb-10 text-lg">
          Active Periods
        </h1>
        {datap === null ? (
          <Loader className="animate-spin text-green-400" size={30} />
        ) : (
          <MinutesPlayedDoughnutChart data={datap} />
        )}
      </div>
    </div>
  );
}
