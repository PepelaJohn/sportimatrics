"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { searchSpotify } from "@/api";
import { formatNumberWithCommas } from "@/lib/utils";
import { ERROR } from "@/constants";

// Components
import LoaderSpinner from "@/components/LoaderSpinner";

const ResultCard = ({ 
  name, 
  imageUrl, 
  subtitle, 
  uri, 
  durationMs = null 
}: { 
  name: string; 
  imageUrl: string; 
  subtitle: string; 
  uri: string; 
  durationMs?: number | null;
}) => {
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <motion.div 
      className="bg-zinc-900 hover:bg-zinc-800 transition-all duration-300 rounded-lg overflow-hidden shadow-lg flex flex-col"
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={name} 
            fill 
            className="object-cover transition-transform duration-500 hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <svg className="w-1/3 h-1/3 text-zinc-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4a8 8 0 100 16 8 8 0 000-16zM2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm10-2c.55 0 1 .45 1 1v3c0 .55-.45 1-1 1s-1-.45-1-1v-3c0-.55.45-1 1-1zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
          <button 
            className="m-4 p-3 bg-green-500 hover:bg-green-400 rounded-full shadow-lg transition-transform duration-300 hover:scale-110"
            onClick={() => window.open(`spotify:${uri}`, '_blank')}
          >
            <svg className="h-6 w-6 text-white-1 " fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-white-1 font-bold text-lg truncate">{name}</h3>
        <p className="text-zinc-400 text-sm truncate">{subtitle}</p>
        {durationMs && (
          <p className="text-zinc-500 text-xs mt-2">{formatDuration(durationMs)}</p>
        )}
      </div>
    </motion.div>
  );
};

const ResultSection = ({ title, items, renderItem }: { title: string; items: any[]; renderItem: (item: any) => JSX.Element }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <section className="w-full mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white-1 ">{title}</h2>
        <div className="h-px bg-zinc-700 flex-grow ml-4 mr-2"></div>
        <span className="text-zinc-400 text-sm">{items.length} results</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {items.map(renderItem)}
      </div>
    </section>
  );
};

export default function TopSongs({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchData, setSearchData] = useState<{ [key: string]: any }>({});

  const user = useSelector((state: any) => state.user);
  
  useEffect(() => {
    if (!Object.keys(user).length) {
      dispatch({ type: ERROR, payload: "Please login first" });
      router.replace('/auth');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await searchSpotify(
          searchParams.q,
          setSearchData,
          dispatch as React.Dispatch<any>
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (searchParams.q) {
      fetchData();
    }
  }, [searchParams.q,]);

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <LoaderSpinner />
      </div>
    );
  }

  const hasResults = 
    (searchData?.tracks?.items?.length > 0) || 
    (searchData?.albums?.items?.length > 0) || 
    (searchData?.artists?.items?.length > 0);
    
  if (!hasResults) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <Image 
          src="/no-results.svg" 
          alt="No results" 
          width={200} 
          height={200} 
          className="mb-6 opacity-70"
        />
        <h2 className="text-2xl font-bold text-white-1 mb-2">No results found</h2>
        <p className="text-zinc-400 text-center max-w-md">
          We couldn&apos;t find anything for &quot;{searchParams.q}&quot;. 
          Try different keywords or check spelling.
        </p>
        <button 
          onClick={() => router.push('/')} 
          className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-400 rounded-full transition-colors font-medium"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-full nav-height max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white-1 mb-2">
          Search Results
        </h1>
        <p className="text-zinc-400">
          for &quot;<span className="text-green-500 font-medium">{searchParams.q}</span>&quot;
        </p>
      </motion.div>

      <ResultSection 
        title="Tracks" 
        items={searchData?.tracks?.items || []}
        renderItem={(item) => (
          <ResultCard
            key={item.id}
            name={item.name}
            uri={item.uri}
            imageUrl={item.album.images[1]?.url || item.album.images[0]?.url}
            durationMs={item.duration_ms}
            subtitle={item.artists.map((artist: any) => artist.name).join(", ")}
          />
        )}
      />

      <ResultSection 
        title="Albums" 
        items={searchData?.albums?.items || []}
        renderItem={(item) => (
          <ResultCard
            key={item.id}
            name={item.name}
            uri={item.uri}
            imageUrl={item.images[1]?.url || item.images[0]?.url}
            subtitle={`by ${item.artists.map((artist: any) => artist.name).join(", ")}`}
          />
        )}
      />

      <ResultSection 
        title="Artists" 
        items={searchData?.artists?.items || []}
        renderItem={(item) => (
          <ResultCard
            key={item.id}
            name={item.name}
            uri={item.uri}
            imageUrl={item.images[1]?.url || item.images[0]?.url}
            subtitle={`${formatNumberWithCommas(item.followers.total)} followers`}
          />
        )}
      />
    </div>
  );
}