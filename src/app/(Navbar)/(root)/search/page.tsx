"use client";

import LoaderSpinner from "@/components/LoaderSpinner";
import { useEffect, useState } from "react";
import { searchSpotify } from "@/api";
import Card from "@/components/Card";
import { useDispatch, useSelector } from "react-redux";
import { formatNumberWithCommas } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ERROR } from "@/constants";

export default function TopSongs({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const dispatch = useDispatch();

  const router = useRouter()

  const user = useSelector((state:any)=>state.user)
  if (!Object.keys(user).length){
    dispatch({type:ERROR, payload:"Please Login first"})
    router.replace('/auth')
  }

  const [searchData, setSearchData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    searchSpotify(
      searchParams.q!,
      setSearchData,
      dispatch as React.Dispatch<UnknownAction>
    );
  }, [searchParams]);

  if (!Object.keys(searchData).length) return <LoaderSpinner />;

  return (
    <div className="mt-9 flex nav-height !max-w-[100vw] items-center flex-col gap-9 md:overflow-hidden">
      <section className="flex w-full mx-width flex-col gap-5">
        <h1 className="text-lg f font-bold w-full text-center">
          {"You searched for" + ' "' + searchParams.q + '"'}
        </h1>

        <h1 className="font-semibold   uppercase text-lg mb-5 w-full text-center">
          Tracks
        </h1>
        <div className="flex-wrap justify-center flex gap-5 mb-10 tracks">
          {searchData?.tracks?.items?.map((item: any) => (
            <Card
              key={item.id}
              name={item.name}
              uri={item.uri}
              imageUrl={item.album.images[1]?.url || item.album.images[0]?.url}
              durationMs={item.duration_ms}
              subtitle={item.artists
                .map((artist: any) => artist.name)
                .join(", ")}
            />
          ))}
        </div>

        <h1 className="font-semibold  underline uppercase text-lg mb-5 w-full text-center">
          Albums / Playlists
        </h1>
        <div className="flex-wrap justify-center flex gap-5 mb-10 albums">
          {searchData?.albums?.items?.map((item: any) => (
            <Card
              key={item.id}
              name={item.name}
              uri={item.uri}
              imageUrl={item.images[1]?.url || item.images[0]?.url}
              subtitle={`by ${item.artists
                .map((artist: any) => artist.name)
                .join(", ")}`}
            />
          ))}
        </div>

        <h1 className="font-semibold   uppercase text-lg mb-5 w-full text-center">
          Artists
        </h1>
        <div className="flex-wrap justify-center flex gap-5 mb-10 artists">
          {searchData?.artists?.items?.map((item: any) => (
            <Card
              key={item.id}
              name={item.name}
              uri={item.uri}
              imageUrl={item.images[1]?.url || item.images[0]?.url}
              // subtitle={`${item.followers.total} followers`}
              subtitle={`${formatNumberWithCommas(item.followers.total)} followers`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
