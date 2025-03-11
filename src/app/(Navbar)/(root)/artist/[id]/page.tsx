"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/lib/utils";
import Image from "next/image";

interface Artist {
  external_urls: Externalurls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

interface Image {
  url: string;
  height: number;
  width: number;
}

interface Followers {
  href: null;
  total: number;
}

interface Externalurls {
  spotify: string;
}

interface Tracks {
  album: Album;
  artists: ArtistType[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: Externalids;
  external_urls: Externalurls;
  href: string;
  id: string;
  is_local: boolean;
  is_playable: boolean;
  name: string;
  popularity: number;
  preview_url: null;
  track_number: number;
  type: string;
  uri: string;
}

interface Externalids {
  isrc: string;
}

interface Album {
  album_type: string;
  artists: Artist[];
  external_urls: Externalurls;
  href: string;
  id: string;
  images: Image[];
  is_playable: boolean;
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

interface ArtistType {
  external_urls: Externalurls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export default function ArtistPage() {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topTracks, setTopTracks] = useState<Tracks[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tracksLoading, setTracksLoading] = useState(false);
  const [tracksError, setTracksError] = useState<string | null>(null);
  
  const locationSplit = typeof window !== 'undefined' ? window.location.href.split('/') : [];
  const artistId = locationSplit[locationSplit.length - 1];
  const SPOTIFY_ACCESS_TOKEN = getCookie('_gtPaotwcsA');

  const fetchArtistTopSongs = async (): Promise<void> => {
    setTracksLoading(true);
    setTracksError(null);
    
    try {
      if (!SPOTIFY_ACCESS_TOKEN) {
        throw new Error("Please Login or refresh the page");
      }
    
      const url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`;
    
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${SPOTIFY_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
    
      if (!response.ok) {
       return
      }
    
      const data = await response.json();
      setTopTracks(data.tracks);
      setIsPopupOpen(true);
    } catch (err: any) {
      console.error("Error fetching top tracks:", err);
      setTracksError(err.message);
    } finally {
      setTracksLoading(false);
    }
  };
  
  useEffect(() => {
    async function fetchArtistData() {
      if (!artistId) {
        setLoading(false);
        return;
      }
      
      try {
        const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
          headers: { Authorization: `Bearer ${SPOTIFY_ACCESS_TOKEN}` },
        });
        
        if (!artistRes.ok) return 
        const data = await artistRes.json();
        
        setArtist(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching artist:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchArtistData();
  }, [artistId, SPOTIFY_ACCESS_TOKEN]);
  
  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format milliseconds to minutes:seconds
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
  };
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center  text-white-1">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 border-t-2 border-l-2 border-green-400  rounded-full animate-spin mb-4"></div>
        <p className="text-lg">Loading artist data...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center  text-white-1 p-4">
      <div className="max-w-md w-full bg-zinc-900 p-6 rounded-lg shadow-xl">
        <h1 className="text-xl font-bold text-green-400  mb-2">Error</h1>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-green-400  text-black font-bold py-2 px-4 rounded hover:bg-opacity-90 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
  
  if (!artist) return (
    <div className="min-h-screen nav-heght flex items-center justify-center bg-black-1 text-white-1 p-4">
      <div className="max-w-md w-full bg-zinc-900 p-6 rounded-lg shadow-xl">
        <h1 className="text-xl font-bold text-green-400  mb-2">Artist Not Found</h1>
        <p>We couldn&apos;t find the artist you&apos;re looking for.</p>
        <button 
          onClick={() => window.history.back()} 
          className="mt-4 bg-green-400  text-black font-bold py-2 px-4 rounded hover:bg-opacity-90 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
  
  // Create a popularity meter component
  const PopularityMeter = ({ value }: { value: number }) => {
    return (
      <div className=" h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-400" 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    );
  };

  // Tracks Popup Component
  const TracksPopup = () => {
    if (!isPopupOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 rounded-lg shadow-xl max-w-2xl w-full max-h-full overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-white">
              {artist?.name}&apos;s Top Tracks
            </h2>
            <button 
              onClick={() => setIsPopupOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="overflow-y-auto flex-grow p-4">
            {tracksLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-t-2 border-l-2 border-green-400  rounded-full animate-spin"></div>
              </div>
            ) : tracksError ? (
              <div className="text-center p-6 text-red-400">
                <p>Error loading tracks: {tracksError}</p>
                <button 
                  onClick={fetchArtistTopSongs}
                  className="mt-4 bg-green-400  text-black px-4 py-2 rounded-full font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : topTracks.length === 0 ? (
              <p className="text-center p-6 text-gray-400">No tracks found for this artist.</p>
            ) : (
              <ul className="divide-y divide-zinc-800">
                {topTracks.map((track, index) => (
                  <li key={track.id} className="py-3 hover:bg-zinc-800 rounded-md transition px-2">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4 text-gray-400 w-5 text-center">
                        {index + 1}
                      </div>
                      {track.album.images && track.album.images.length > 0 && (
                        <div className="flex-shrink-0 mr-3">
                          <img 
                            src={track.album.images[track.album.images.length - 1].url}
                            alt={track.album.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </div>
                      )}
                      <div className="flex-grow min-w-0">
                        <p className="truncate font-medium">{track.name}</p>
                        <p className="text-sm text-gray-400 truncate">
                          {track.album.name} • {new Date(track.album.release_date).getFullYear()}
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex items-center">
                        {track.explicit && (
                          <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-600 text-white text-xs rounded mr-3">
                            E
                          </span>
                        )}
                        <span className="text-gray-400 text-sm">
                          {formatDuration(track.duration_ms)}
                        </span>
                        <a 
                          href={track.external_urls.spotify} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-4 text-gray-400 hover:text-green-400 "
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-4 border-t border-zinc-800 flex justify-end">
            <button 
              onClick={() => setIsPopupOpen(false)}
              className="bg-green-400  text-black font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen nav-eight  text-white-1">
      {/* Hero section with artist image and name */}
      <div className="relative w-full h-64 md:h-96 lg:h-[450px] overflow-hidden">
        {artist.images && artist.images.length > 0 ? (
          <div className="absolute inset-0">
            <img
              src={artist.images[0].url}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black-1 bg-opacity-10"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-zinc-900"></div>
        )}

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            {artist.name}
          </h1>
          <div className="flex items-center text-sm text-gray-300">
            <span className="mr-2">
              {formatNumber(artist.followers?.total || 0)} followers
            </span>
            <span className="mx-2">•</span>
            <a
              href={artist.external_urls?.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400  hover:underline"
            >
              Open in Spotify
            </a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Artist info */}
          <div className="p-6  col-span-1 rounded-lg shadow-lg">
            <div className=" ">
              <h2 className="text-xl font-bold mb-4">Artist Info</h2>

              <div className="mb-4">
                <h3 className="text-sm uppercase text-gray-400 mb-1">
                  Popularity
                </h3>
                <div className="flex items-center ">
                  <span className="mr-3 font-medium">{artist.popularity}</span>
                  <div className="flex-grow bg-gray-900 w-full">
                    <PopularityMeter value={artist.popularity} />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm uppercase text-gray-400 mb-1">
                  Followers
                </h3>
                <p className="text-lg font-medium">
                  {formatNumber(artist.followers?.total || 0)}
                </p>
              </div>

              {artist.genres && artist.genres.length > 0 && (
                <div>
                  <h3 className="text-sm uppercase text-gray-400 mb-2">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {artist.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 bg-zinc-800 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="my-6">
              <a
                href={artist.external_urls?.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-400  text-black text-center font-bold py-3 rounded-full hover:bg-opacity-90 transition"
              >
                Listen on Spotify
              </a>
            </div>
          </div>

          {/* Right column - Could contain top tracks, albums, etc. */}
          <div className="col-span-1 md:col-span-2">
            <div className=" p-6 rounded-lg shadow-lg h-full">
              <h2 className="text-xl font-bold mb-4">About {artist.name}</h2>

              <div className="mb-6">
                {artist.images && artist.images.length > 0 && (
                  <div className="float-right ml-4 mb-2 w-32 h-32 md:w-40 md:h-40 max-[sm]::hidden rounded-lg overflow-hidden">
                    <img
                      src={artist.images[1].url}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <p className="text-gray-300 max-sm:text-sm">
                  {artist.name} is an artist on Spotify with{" "}
                  {formatNumber(artist.followers?.total || 0)} followers.
                  {artist.genres &&
                    artist.genres.length > 0 &&
                    ` Their music spans genres like ${artist.genres
                      .slice(0, 3)
                      .join(", ")}${
                      artist.genres.length > 3 ? ", and more" : ""
                    }.`}
                  With a popularity score of {artist.popularity} out of 100,
                  {artist.popularity >= 80
                    ? " they are one of the most popular artists on the platform."
                    : artist.popularity >= 60
                    ? " they have a strong following on the platform."
                    : artist.popularity >= 40
                    ? " they have a solid presence on the platform."
                    : " they are building their audience on the platform."}
                </p>
              </div>

              <div className="text- mt-8  border-zinc-800 rounded-lg">
                <p className="text-lg sm:text-sm text-gray-400 mb-3">
                  Want to see more from this artist?
                </p>
                <button 
                  onClick={fetchArtistTopSongs} 
                  className="bg-green-400 text-black max-sm:text-sm font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition"
                  disabled={tracksLoading}
                >
                  {tracksLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : <span>Load Top Tracks</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks Popup */}
      <TracksPopup />
    </div>
  );
}