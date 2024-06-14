"use client";

import { streamdata, getTopTracks } from "@/lib/utils";
import LoaderSpinner from "@/components/LoaderSpinner";
import { useEffect, useState } from "react";
import PodcastCard from "@/components/PodcastCard";
import RadarComponent from "@/components/Radar";
import PolarComponent from "@/components/PolarComponent";

export default function TopSongs() {



const [radarData, setRadarData] = useState<any>();
 
  const [topTracks, setTopTracks] = useState<TracksDtype[]>([]);
  useEffect(() => {
    let data = getTopTracks(streamdata);
    data.splice(20);
    setTopTracks(data);

    data.splice(10);

    let radarData = {
      labels: data.map((dt) => dt.artistName),
      datasets: data.map((dt) => ({
        label: dt.artistName,
        data: data.map((dt) => dt.plays),

        backgroundColor: data.map((_)=>(`rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.random()})`)),
        
      })),
    };

    setRadarData(radarData)

  }, []);

  if (!topTracks.length) return <LoaderSpinner />;
  return (
    <div className="mt-9 flex nav-height !max-w-[100vw] items-center flex-col gap-9 md:overflow-hidden">
      <section className="flex  w-full   mx-width flex-col gap-5">
        <div className="w-full flex justify-start min-h-[400px] h-full items-start">
          <div className="h-full w-full">
            {/* <RadarComponent data={radarData} options={options} /> */}
            <PolarComponent data={radarData}/>
          </div>
        </div>
        <h1 className="text-lg  font-bold text-white-1">Top Artists</h1>

        <div className="podcast_grid mb-10">
          {topTracks?.map(({ msPlayed, trackName: name, plays }, index) => (
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
