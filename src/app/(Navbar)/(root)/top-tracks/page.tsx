"use client";

import { getuserTopItems } from "@/api";
import React, { useEffect, useState } from "react";
import LoaderSpinner from "@/components/LoaderSpinner";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ERROR } from "@/constants";

export default function TopSongs({
  searchParams,
}: {
  searchParams: { range: string };
}) {
  const dispatch = useDispatch()
  const router = useRouter()

  const user = useSelector((state:any)=>state.user)
  if (!Object.keys(user).length){
    dispatch({type:ERROR, payload:"Please Login first"})
    router.replace('/auth')
  }
  const [topTracks, setTopTracks] = useState<TracksType[] | null>(null);



  if (!searchParams.range) {
    router.push("/top-tracks?range=short_term");
  }
  if (
    searchParams.range !== "short_term" &&
    searchParams.range !== "medium_term" &&
    searchParams.range !== "long_term"
  ) {
    router.push("/top-tracks?range=short_term");
  }
  const [loading, setLoading] = useState<boolean>(true);

  
  const [selected, setSelected] = useState<0 | 1 | 2>(
    searchParams.range === "short_term"
      ? 0
      : searchParams.range === "medium_term"
      ? 1
      : searchParams.range === "long_term"
      ? 2
      : 0
  );
  const sortTime = ["4 Weeks", "6 Months", "Lifetime"];

  useEffect(() => {
    const getTopTracks = async () => {
      setLoading(true);
      let term;
      switch (selected) {
        case 0:
          term = "short_term";
          break;
        case 1:
          term = "medium_term";
          break;
        case 2:
          term = "long_term";

          break;

        default:
          term = "short_term";
      }

      if (searchParams.range) {
        const promiseData = await getuserTopItems("tracks", term,dispatch as React.Dispatch<UnknownAction>, 20, 0);
        router.push(`/top-tracks?range=${term}`);

        setTopTracks(promiseData);
        setLoading(false);
      }
    };

    getTopTracks();
  }, [selected]);

  return (
    <div className="mt-9 flex nav-height !max-w-[100vw] items-center flex-col gap-9 md:overflow-hidden">
      {!loading ? (
        <section className="flex  w-full   mx-width flex-col gap-5">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-lg  font-bold text-white-1">Top Tracks</h1>
            <div className="gap-2 flex">
              {sortTime.map((sort, index) => (
                <span
                  onClick={() => setSelected(index as 0 | 1 | 2)}
                  className={`flex items-center justify-center px-1 easeinOut shadow rounded-xl border border-gray-800 text-xs max-[400px]:text-[10px] min-w-[65px] cursor-pointer h-[25px] ${
                    selected === index
                      ? "bg-green-400 text-white"
                      : "bg-black-3 text-white-3 "
                  }`}
                  key={index}
                >
                  {sort}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-wrap justify-center flex gap-5  mb-10">
            {topTracks !== null &&
              topTracks?.map(({ name, popularity, uri, album, artists }, i) => (
                <a
                  key={name}
                  href={uri}
                  target="_blank"
                  className="cursor-pointer easeinOut sm:max-w-[200px] border border-gray-800 p-2  overflow-hidden rounded-xl max-sm:h-[120px] max-sm:border-none max-h-[200px] h-full   w-full"
                >
                  <h1 className="text-16 max-md:text-14 w-full text-center mb-2 truncate font-bold  text-white-1">
                    <span className="text-white-4">{i + 1}</span>. {name}
                  </h1>
                  <figure className="flex flex-col max-sm:flex-row  max-sm:p-1 items-center   max-sm:border gap-2">
                    <div className="md:w-[80px] mt-1  easeinOut md:h-[80px] flex-shrink-0 h-[50px] w-[50px] rounded-full  flex items-center justify-center overflow-hidden ">
                      <img
                        alt={name}
                        src={
                          album.images.length - 2 >= 0
                            ? album.images[album.images.length - 2].url
                            : album.images[0].url
                        }
                        className="object-fit easeinOut object-center min-h-full object-cover md:w-[80px]  max-sm:w-[50px] max-sm:h-[50px] md:h-[80px] h-[50px] w-[50px] "
                      ></img>
                    </div>
                    <div className="flex flex-col max-sm:flex-row  py-3 w-full  ">
                      <h2 className="flex-1 flex items-center justify-center text-12 truncate font-normal capitalize text-white-4">
                        <span className="font-semibold text-white-1">
                          {popularity} %
                        </span>
                        &nbsp; Popularity
                      </h2>
                      <h2 className="flex-1 flex items-center justify-center text-12  font-normal  text-white-4">
                        <span className="font-semibold whitespace-nowrap gap=2 truncate text-sm flex flex-col text-white-1">
                          {artists.map((artist, i) => (
                            <React.Fragment key={artist.name}>
                              {" "}
                              {artist.name}
                              {i < artists.length - 1 ? "," : ""}{" "}
                            </React.Fragment>
                          ))}
                        </span>{" "}
                      </h2>
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
