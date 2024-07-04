"use client";

import LoaderSpinner from "@/components/LoaderSpinner";
import { useEffect, useState } from "react";

import { searchSpotify } from "@/api";
import Card from "@/components/Card";
import { useDispatch } from "react-redux";

export default function TopSongs({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const dispatch = useDispatch();

  const [searchData, setsearchData] = useState<{ [key: string]: any }>({
    name: "",
  });
  useEffect(() => {
    searchSpotify(
      searchParams.q!,
      setsearchData,
      dispatch as React.Dispatch<UnknownAction>
    );
  }, [searchParams]);

  if (!Object.keys(searchData).length) return <LoaderSpinner />;
  return (
    <div className="mt-9 flex nav-height !max-w-[100vw] items-center flex-col gap-9 md:overflow-hidden">
      <section className="flex  w-full   mx-width flex-col gap-5">
        <h1 className="text-lg  font-bold text-white-1">Top Tracks</h1>

        <div className="flex-wrap justify-center flex gap-5 mb-10">
          {searchData?.tracks?.items?.map(
            (item: { [key: string]: any }, index: number) => (
              <Card key={index} props={item} />
            )
          )}
        </div>
      </section>
    </div>
  );
}
