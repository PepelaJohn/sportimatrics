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
  if (!artistData.length) return <LoaderSpinner />;

  return (
    <div className="mt-9 flex nav-height !max-w-[100vw] items-center flex-col gap-9 md:overflow-hidden">
      <section className="flex  w-full -mt-12 items-center mx-width flex-col gap-">
        <h1 className="text-20   font-bold text-white-1 mb-8">Top Artists</h1>

        <div className="podcast_gri flex-wrap justify-center flex gap-5 mb-10">
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
