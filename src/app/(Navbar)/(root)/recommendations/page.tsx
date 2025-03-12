'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getCookie } from "@/lib/utils";
import { Music, RefreshCw, ExternalLink, Headphones } from "lucide-react";

interface Song {
  name: string;
  playcount: number;
  mbid: string;
  match: number;
  url: string;
  streamable: Streamable;
  duration: number;
  artist: Artist;
  image: Image[];
}

interface Image {
  '#text': string;
  size: string;
}

interface Artist {
  name: string;
  mbid: string;
  url: string;
}

interface Streamable {
  '#text': string;
  fulltrack: string;
}

const PersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const accessToken = getCookie('_gtPaotwcsA');

  const fetchTopTracks = async () => {
    const res = await fetch("https://api.spotify.com/v1/me/top/tracks", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    return data.items;
  };

  const fetchRecommendationsFromBackend = async (topTracks:any) => {
    // Send top tracks to our Next.js API endpoint
    const res = await fetch("/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tracks: topTracks.map((track:any) => ({
          artist: track.artists[0].name,
          name: track.name
        }))
      }),
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch recommendations from API");
    }
    
    return await res.json();
  };

  const getRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      if (!accessToken) {
        throw new Error("No Spotify access token found.");
      }

      // 1. Get top tracks from Spotify
      const topTracks = await fetchTopTracks();
      
      // 2. Send top tracks to backend API and get recommendations
      const { recommendations: allRecommendations } = await fetchRecommendationsFromBackend(topTracks);
      
      // 3. Set recommendations to state
      setRecommendations(allRecommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError('Failed to load recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRecommendations();
  }, []);

  return (
    <div className="max-w-5xl w-full nav-height mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg md:text-3xl font-bold text-white-1 flex items-center">
          <Music className="mr-2 h-8 w-8 max-md:h-6 max-md:w-6 text-green-500" />
          <span className="max-sm:hidden">Your Personalized Recommendations</span>
        </h1>
        <Button 
          onClick={getRecommendations} 
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full max-md:py-0 max-md:px-3 px-4 py-2"
        >
          <RefreshCw className={`h-4 w-4 mr-2 `} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
              <RefreshCw className="h-6 w-6 text-white-1 animate-spin" />
            </div>
            <p className="mt-4 text-gray-300">Discovering new music for you...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.length > 0 ? (
            recommendations.map((track, index) => (
              <div 
                key={`${track.name}-${index}`} 
                className="bg-gray-800/60 backdrop-blur-lg rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-700 hover:border-green-500/50 group"
              >
                <div className="relative h-32 bg-gradient-to-r from-green-900 to-green-800 flex items-center justify-center overflow-hidden">
                  <Headphones className="h-16 w-16 text-white-1/20 absolute" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <h3 className="text-lg font-bold text-white-1 truncate">
                      {track.name}
                    </h3>
                    <p className="text-gray-300 truncate text-sm">
                      {track.artist.name}
                    </p>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Match</span>
                      <span className="text-green-400 font-medium">{Math.round(track.match * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full w-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400" 
                        style={{ width: `${Math.min(track.match * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <a 
                    href={track.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-2 bg-green-500 text-white-1 rounded-lg transition-colors duration-300 text-sm font-medium group-hover:bg-green-600"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Listen on Lastfm
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center h-64 bg-gray-800/40 rounded-xl border border-gray-700">
              <div className="text-center p-6">
                <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white-1">No recommendations available</h3>
                <p className="text-gray-400 mt-2">Try refreshing or check your Spotify listening history.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalizedRecommendations;