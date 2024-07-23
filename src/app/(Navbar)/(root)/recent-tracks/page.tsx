"use client";

import { fetchRecentTracks } from "@/api";
import React, { useEffect, useState } from "react";
import LoaderSpinner from "@/components/LoaderSpinner";
import { formatDateTime } from "@/lib/utils";

export default function TopSongs() {
  const [topTracks, setTopTracks] = useState<RTrackType[] | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTopTracks = async () => {
      setLoading(true);

      const promiseData = await fetchRecentTracks();

      setTopTracks(promiseData);
      setLoading(false);
    };

    getTopTracks();
  }, []);

  return (
    <div className="mt-9 flex nav-height !max-w-[100vw] items-center flex-col gap-9 md:overflow-hidden">
      {!loading ? (
        <section className="flex  w-full   mx-width flex-col gap-5">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-lg  font-bold text-white-1">Recent Tracks</h1>
          </div>

          <div className="flex-wrap justify-center flex gap-5  mb-10">
            {topTracks !== null &&
              topTracks?.map(({ track, played_at }) => (
                <a
                  key={track.name}
                  href={track.uri}
                  target="_blank"
                  className="cursor-pointer easeinOut sm:max-w-[200px] border border-gray-800 p-2  overflow-hidden rounded-xl max-sm:h-[120px] max-sm:border-none max-h-[200px] h-full   w-full"
                >
                  <h1 className="text-16 max-md:text-14 w-full text-center mb-2 truncate font-bold  text-white-1">
                    {track.name}
                  </h1>
                  <figure className="flex flex-col max-sm:flex-row  max-sm:p-1 items-center   max-sm:border gap-2">
                    <div className="md:w-[80px] mt-1  easeinOut md:h-[80px] flex-shrink-0 h-[50px] w-[50px] rounded-full  flex items-center justify-center overflow-hidden ">
                      <img
                        alt={track.name}
                        src={
                          track.album.images.length - 2 >= 0
                            ? track.album.images[track.album.images.length - 2]
                                .url
                            : track.album.images[0].url
                        }
                        className="object-fit easeinOut object-center min-h-full object-cover md:w-[80px]  max-sm:w-[50px] max-sm:h-[50px] md:h-[80px] h-[50px] w-[50px] "
                      ></img>
                    </div>
                    <div className="flex flex-col max-sm:flex-row i   py-3 w-full  ">
                      <h2 className="flex-1 flex items-center justify-center text-12  font-normal  text-white-4">
                        <span className="font-semibold whitespace-nowrap gap=2 truncate text-sm flex flex-col text-white-1">
                          {track.artists.map((artist, i) => (
                            <React.Fragment key={artist.name}>
                              {" "}
                              {artist.name}
                              {i < track.artists.length - 1 ? "," : ""}{" "}
                            </React.Fragment>
                          ))}
                        </span>{" "}
                      </h2>
                      <p className="text-sm w-full flex justify-center text-gray-1">
                        {formatDateTime(played_at)}
                      </p>
                    </div>
                  </figure>
                </a>
              ))}
          </div>
        </section>
      ) : (
        <LoaderSpinner></LoaderSpinner>
      )}
    </div>
  );
}
