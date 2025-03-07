"use client";
import { Info, Loader } from "lucide-react";
import {
  ArtistData,
  processData,
  processListeningData,
  TrackData,
} from "@/lib/utilsqueue";

import { useEffect, useState } from "react";
export type numRange = 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

import BarChart from "@/components/BarChart";
import { getFormDB } from "@/api";
import MinutesPlayedLineChart from "@/components/LIneChart";
import MinutesPlayedDoughnutChart from "@/components/Doughnut";
import DialogCloseButton from "@/components/Dialog";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ERROR, SUCCESS } from "@/constants";
import { ComboboxDemo } from "@/components/ComboBOx";
import CustomDatePicker from "../../../../components/DatePicker";
import { ComboboxDemo as Combobox } from "@/components/ComboBox2";

export default function Profile({ searchParams }: { searchParams: string }) {
  const router = useRouter();
  const dispatch = useDispatch();
  console.log(Object(searchParams).t);

  if (
    Object(searchParams)?.t !== "artists" &&
    Object(searchParams)?.t !== "tracks"
  ) {
    router.replace("/insights?t=artists");
  }

 

  const [customDate, setCustomDate] = useState<{
    customStartDate?: Date;
    customEndDate?: Date;
  } | null>(null);

  const [value, setValue] = useState<"months" | "days" | "years" | "custom">(
    "months"
  );
  const user = useSelector((state: any) => state.user);

  const [tracksOrArtists, setTracksOrArtists] = useState<"tracks" | "artists">(
    Object(searchParams).t
  );

  useEffect(()=>{
    router.push(`/insights?t=${tracksOrArtists}`)
  },[tracksOrArtists])

  const arr: ["artists", "tracks"] = ["artists", "tracks"];
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
    console.log(value, "insights");
    if (!Object.keys(user).length) {
      dispatch({ type: ERROR, payload: "Please Login first" });
      router.replace("/auth");
    }
    const getDataFromDB = async () => {
      const dataz = await getFormDB();
      const {
        marquee: artistsArray,
        music_history: tracksArray,
        podcast_history: podcastArray,
        processed,
      } = dataz;

      const dt = processData(
        artistsArray,
        tracksArray,
        value,
        customDate!?.customStartDate,
        customDate!?.customEndDate
      );
      const dtx = processListeningData(tracksArray, podcastArray, "years");
      console.log(dtx);

      // localStorage.setItem("processed", processed.toString());
      setData(dt);
      console.log(dt);
    };

    if (value === "custom") {
      if (customDate?.customEndDate && customDate.customStartDate) {
        !!Object.keys(user).length && getDataFromDB();
      } else {
        dispatch({
          type: SUCCESS,
          payload: "Please select the start and end dates",
        });
      }
    } else {
      !!Object.keys(user).length && getDataFromDB();
    }
  }, [value, customDate?.customEndDate, customDate?.customStartDate]);
  

const [num, setNum] = useState<numRange>(10);

  useEffect(() => {
    const dt1 = data!?.artistData.slice(0, num);
    const dt2 = data!?.trackData.slice(0, num);
    const lbls: string[] = [];
    const vals: number[] = [];
    const lbls2: string[] = [];
    const vals2: number[] = [];

    !!dt1?.length &&
      typeof window !== undefined &&
      window.sessionStorage.setItem("artistData", JSON.stringify(dt1));
    !!dt1?.length &&
      typeof window !== undefined &&
      window.sessionStorage.setItem("trackData", JSON.stringify(dt2));

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
  }, [data, value, num]);

  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    if (value !== "custom") {
      setDisabled(true);
      setCustomDate(null);
    } else {
      setDisabled(false);
    }
  }, [value]);
  return (
    <div className="min-h-screen h-full  w-full max-w-full gap-5 flex mb-5 flex-col items-center px-2  text-gray-100">
      <div className="max-w-5xl  nav-height"></div>
      <div className="border-gray-800 bg-gray-900  lg:max-w-[800px] flex items-center justify-between w-full lg:px-5 px-1 lg:py-6  py-3">
        <div className="gap-2 flex">
          <ComboboxDemo value={value} setValue={setValue} />
          <Combobox num={num} setNum={setNum} />
        </div>
        <CustomDatePicker
          disabled={disabled}
          customDate={customDate}
          setCustomDate={setCustomDate}
        />
      </div>

      <div className=" border border-gray-800 bg-gray-900  lg:max-w-[800px]  w-full  lg:p-10 py-3 flex flex-col overflow-hidden items-center justify-center ">
        <div className="flex  px-2 items-center justify-start gap-5 w-full">
          <h1 className="font-semibold uppercase    text-xs md:text-lg ">
            Top {num} {tracksOrArtists}
          </h1>

          <DialogCloseButton
            heading={`Top 10 ${tracksOrArtists}`}
            text={`This chart displays the top 10 ${tracksOrArtists} ${
              value === "months"
                ? "for the last 12 months."
                : value === "days"
                ? " for the last 30 days."
                : value === "custom"
                ? "for the selected period."
                : "for the last 5 years."
            } based on your data.
            Hover or click the bar to view more details.`}
          >
            <span className="text-green-400 cursor-pointer">
              <Info className="w-4"></Info>
            </span>
          </DialogCloseButton>
          <div className="flex items-center gap-3 justify-end flex-1  ">
            {arr.map((dt, i) => (
              <span
                onClick={() => setTracksOrArtists(dt)}
                key={i}
                className={`h-6 uppercase cursor-pointer  flex text-[10px] ${
                  tracksOrArtists === dt
                    ? "bg-green-400"
                    : "bg-gray-800 border border-gray-700"
                } items-center px-3 rounded-full`}
              >
                {dt}
              </span>
            ))}
          </div>
        </div>
        {tracksOrArtists === "artists" ? (
          <>
            {data === null ? (
              <Loader className="animate-spin text-green-400" size={30} />
            ) : (
              <BarChart data={data1} trackOrArtist={tracksOrArtists} />
            )}
          </>
        ) : (
          <>
            {data2 === null ? (
              <Loader className="animate-spin text-green-400" size={30} />
            ) : (
              <BarChart data={data2} trackOrArtist={tracksOrArtists} />
            )}
          </>
        )}
        {/* {data1 === null || data2 === null ? (
          <Loader className="animate-spin text-green-400" size={30} />
        ) : (
          <BarChart
            data={tracksOrArtists === "artists" ? data1 : data2}
            trackOrArtist={tracksOrArtists}
          />
        )} */}
      </div>

      <div className=" border border-gray-800 bg-gray-900  lg:max-w-[800px]  w-full   lg:p-10 py-3  flex flex-col items-center justify-center ">
        <div className="flex   items-center gap-5">
          <h1 className="font-semibold uppercase    text-xs md:text-lg ">
            Hourly Activity
          </h1>

          <DialogCloseButton
            heading="Active hours rankings"
            text={`These represent the active hours ${
              value === "months"
                ? "for the last 12 months"
                : value === "days"
                ? " for the last 30 days"
                : "for the last 5 years"
            } based on your data.
            Hover or click the bar to view more details.`}
          >
            <span className="text-green-400 cursor-pointer">
              <Info className="w-4"></Info>
            </span>
          </DialogCloseButton>
        </div>
        {data === null ? (
          <Loader className="animate-spin text-green-400" size={30} />
        ) : (
          <MinutesPlayedLineChart data={data?.activeTimes} />
        )}
      </div>
      {value !== "days" && (
        <div className=" border border-gray-800 bg-gray-900  lg:max-w-[800px]  w-full h-fit  lg:p-10 py-3 flex flex-col items-center justify-center ">
          <div className="flex   items-center gap-5">
            <h1 className="font-semibold uppercase    text-xs md:text-lg ">
              MONTHLY ACTIVITY
            </h1>

            <DialogCloseButton
              heading="Activity by periods"
              text="This chart shows user activity by month/yeas/days.Click or hover on the datapoint to view what it represents. "
            >
              <span className="text-green-400 cursor-pointer">
                <Info className="w-4"></Info>
              </span>
            </DialogCloseButton>
          </div>
          {data === null ? (
            <Loader className="animate-spin text-green-400" size={30} />
          ) : (
            <MinutesPlayedDoughnutChart data={data?.activeMonths} />
          )}
        </div>
      )}
    </div>
  );
}
