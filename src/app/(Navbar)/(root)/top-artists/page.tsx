"use client";

import { getTotalArtistListeningTime, streamdata } from "@/lib/utils";
import { useEffect, useState } from "react";

import PodcastCard from "@/components/PodcastCard";
import LoaderSpinner from "@/components/LoaderSpinner";

export function TableDemo() {
  const [artistData, setArtistData] = useState<artistDataType[]>([]);
  useEffect(() => {
    let data = getTotalArtistListeningTime(streamdata, "plays");
    data.splice(20);
    setArtistData(data);
  }, []);

  const [selected, setSelected] = useState<0 | 1 | 2>(0);
  const sortTime = ["4 Weeks", "6 Months", "Lifetime"];
  if (!artistData.length) return <LoaderSpinner />;

  return (
    <div className="mt-9 flex nav-height !max-w-[100vw] items-center flex-col gap-9 md:overflow-hidden">
      <section className="flex  w-full -mt-12 items-center mx-width flex-col gap-">
        <div className="w-full mb-8 flex items-center max-[400px]:flex-col justify-between">
          <h1 className="text-20 flex max-[400px]:mb-4 max-[400px]:text-lg items-center font-bold text-white-1 ">Top Artists</h1>

          <div className="flex items-center gap-2">
            {sortTime.map((sort, index) => (
              <span
                onClick={() => setSelected(index as 0 | 1 | 2)}
                className={`flex items-center justify-center px-1 easeinOut shadow rounded-xl border border-gray-800 text-xs max-[400px]:text-[10px] min-w-[65px] cursor-pointer h-[25px] ${
                  selected === index ? "bg-green-400 text-white" : "bg-black-3 text-white-3 "
                }`}
                key={index}
              >
                {sort}
              </span>
            ))}
          </div>
        </div>

        <div className="podcast_gri flex-wrap justify-between flex gap-5 mb-10">
          {artistData?.map(({ msPlayed, name, plays }, index) => (
            <PodcastCard
              key={index}
              msPlayed={msPlayed}
              name={name}
              plays={plays}
              i={index}
              sortdirection={"up"}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
export default TableDemo;
