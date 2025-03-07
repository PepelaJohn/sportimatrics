'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCookie } from '@/lib/utils';


// Types
interface Track {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: { images: { url: string; height: number; width: number }[] };
  external_urls: { spotify: string };
}

interface Artist {
  id: string;
  name: string;
  genres: string[];
}

// Custom color classes
const colors = {
  bg: {
    primary: 'bg-black',
    secondary: 'bg-gray-900',
    card: 'bg-gradient-to-br from-gray-900 to-gray-800',
    hover: 'hover:bg-gradient-to-br hover:from-gray-800 hover:to-gray-700',
  },
  text: {
    primary: 'text-gray-50',
    secondary: 'text-gray-300',
    tertiary: 'text-gray-400',
    accent: 'text-green-400',
  },
  border: {
    default: 'border border-gray-800',
    hover: 'hover:border-green-500',
    accent: 'border-green-500',
  },
  button: {
    primary: 'bg-green-500 text-gray-900 font-medium',
    secondary: 'bg-gray-800 text-gray-200 hover:bg-gray-700',
    hover: 'hover:bg-green-400 hover:text-gray-900',
  }
};

const RecommendationsPage: React.FC = () => {
const accessToken = getCookie("_gtPaotwcsA")
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Step 1: Fetch user's top data when component mounts
  useEffect(() => {
    async function fetchUserTopData() {
      if (!accessToken) return;
      
      setIsLoading(true);
      try {
        // Fetch top tracks
        const tracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const tracksData = await tracksResponse.json();
        setTopTracks(tracksData.items || []);
        
        // Fetch top artists
        const artistsResponse = await fetch('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const artistsData = await artistsResponse.json();
        setTopArtists(artistsData.items || []);
        
        // Extract favorite genres from top artists
        const genres = extractTopGenres(artistsData.items || []);
        setFavoriteGenres(genres);
        
        // Now that we have the user data, fetch initial recommendations
        await fetchRecommendations(tracksData.items, artistsData.items, genres);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserTopData();
  }, []);
  
  // Step 2: React to genre filter changes
  useEffect(() => {
    if (topTracks.length && topArtists.length && !isLoading) {
      fetchRecommendations(topTracks, topArtists, favoriteGenres, selectedGenre);
    }
  }, [selectedGenre]);
  
  // Helper: Extract top genres from artists
  function extractTopGenres(artists: Artist[]): string[] {
    const genreCounts: Record<string, number> = {};
    
    artists.forEach(artist => {
      artist.genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
    
    // Sort and get top 10 genres
    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([genre]) => genre);
  }
  
  // Main function to fetch recommendations from Spotify
  async function fetchRecommendations(
    tracks: Track[], 
    artists: Artist[], 
    genres: string[],
    specificGenre: string | null = null
  ) {
    if (!accessToken) return;
    
    setIsLoading(true);
    try {
      // Build seed data based on user preferences
      const params = new URLSearchParams();
      
      if (specificGenre) {
        // If filtering by genre, prioritize that genre
        params.append('seed_genres', specificGenre);
        
        // Add just 2 top artists to stay within the 5 seed limit
        if (artists.length > 0) params.append('seed_artists', artists[0].id);
        if (artists.length > 1) params.append('seed_artists', artists[1].id);
        
        // Add top tracks to reach 5 seeds total (if needed)
        const remainingSeeds = 5 - 1 - Math.min(artists.length, 2);
        for (let i = 0; i < Math.min(remainingSeeds, tracks.length); i++) {
          params.append('seed_tracks', tracks[i].id);
        }
      } else {
        // For general recommendations, use a balanced mix
        if (tracks.length > 0) params.append('seed_tracks', tracks[0].id);
        if (tracks.length > 1) params.append('seed_tracks', tracks[1].id);
        
        if (artists.length > 0) params.append('seed_artists', artists[0].id);
        if (artists.length > 1) params.append('seed_artists', artists[1].id);
        
        if (genres.length > 0) params.append('seed_genres', genres[0]);
      }
      
      // Add additional parameters for better recommendations
      params.append('limit', '30');
      params.append('min_popularity', '20');
      
      // Call Spotify recommendations API
      const response = await fetch(`https://api.spotify.com/v1/recommendations?${params}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      const data = await response.json();
      setRecommendations(data.tracks || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  }
  
  // Handle genre selection
  const handleGenreChange = (genre: string | null) => {
    setSelectedGenre(genre);
  };
  
  // Get available genres for filter buttons
  const genreOptions = favoriteGenres.slice(0, 8);
  
  return (
    <div className={`nav-height flex flex-col ${colors.bg.primary}`}>
      {/* Stylish background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 to-black pointer-events-none"></div>
      
      <div className="relative container mx-auto px-4 py-8 z-10">
        {/* Header with animated gradient */}
        <div className="relative overflow-hidden rounded-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 animate-pulse-slow"></div>
          <div className="relative backdrop-blur-sm bg-black/50 p-8">
            <h1 className={`text-4xl md:text-5xl font-bold ${colors.text.primary}`}>
              Discover New Tracks
            </h1>
            <p className={`mt-2 text-lg ${colors.text.secondary}`}>
              Personalized recommendations based on your Spotify listening
            </p>
          </div>
        </div>
        
        {/* User Stats Summary Card */}
        <div className={`backdrop-blur-sm ${colors.bg.card} rounded-xl p-6 mb-8 ${colors.border.default} shadow-xl`}>
          <h2 className={`text-xl font-semibold mb-4 ${colors.text.primary}`}>Based on Your Listening</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group">
              <h3 className={`text-lg font-medium mb-2 ${colors.text.accent} group-hover:text-green-300 transition-colors`}>
                Top Artists
              </h3>
              <p className={`${colors.text.secondary}`}>
                {topArtists.slice(0, 3).map(a => a.name).join(', ')}
                {topArtists.length > 3 ? ' and more' : ''}
              </p>
            </div>
            <div className="group">
              <h3 className={`text-lg font-medium mb-2 ${colors.text.accent} group-hover:text-green-300 transition-colors`}>
                Top Tracks
              </h3>
              <p className={`${colors.text.secondary}`}>
                {topTracks.slice(0, 3).map(t => t.name).join(', ')}
                {topTracks.length > 3 ? ' and more' : ''}
              </p>
            </div>
            <div className="group">
              <h3 className={`text-lg font-medium mb-2 ${colors.text.accent} group-hover:text-green-300 transition-colors`}>
                Your Genres
              </h3>
              <p className={`${colors.text.secondary}`}>
                {favoriteGenres.slice(0, 3).map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(', ')}
                {favoriteGenres.length > 3 ? ' and more' : ''}
              </p>
            </div>
          </div>
        </div>
        
        {/* Genre filter with modern styling */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-semibold ${colors.text.primary}`}>Filter by Genre</h2>
            
            {/* View mode toggle */}
            <div className="flex space-x-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-gray-800/50 text-gray-400'}`}
                aria-label="Grid view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-gray-800/50 text-gray-400'}`}
                aria-label="List view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Genre pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleGenreChange(null)}
              className={`px-4 py-2 rounded-full backdrop-blur-sm transition-all transform hover:scale-105 ${
                selectedGenre === null 
                  ? 'bg-gradient-to-r from-green-500 to-green-400 text-gray-900 font-medium shadow-lg shadow-green-500/20' 
                  : 'bg-gray-800/50 text-gray-200 hover:bg-gray-700/70'
              }`}
            >
              All Genres
            </button>
            
            {genreOptions.map(genre => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`px-4 py-2 rounded-full backdrop-blur-sm transition-all transform hover:scale-105 ${
                  selectedGenre === genre 
                    ? 'bg-gradient-to-r from-green-500 to-green-400 text-gray-900 font-medium shadow-lg shadow-green-500/20' 
                    : 'bg-gray-800/50 text-gray-200 hover:bg-gray-700/70'
                }`}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Recommendations display */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-t-2 border-green-500 animate-spin"></div>
              <div className="absolute inset-0 rounded-full border-t-2 border-green-300 animate-spin animation-delay-150"></div>
              <div className="absolute inset-0 rounded-full border-t-2 border-green-100 animate-spin animation-delay-300"></div>
            </div>
            <p className={`mt-4 ${colors.text.secondary}`}>Finding the perfect tracks for you...</p>
          </div>
        ) : recommendations.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              // Grid view
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {recommendations.map(track => (
                  <div 
                    key={track.id}
                    className={`${colors.bg.card} rounded-xl overflow-hidden shadow-xl 
                    ${colors.border.default} ${colors.border.hover} transition-all duration-300 
                    hover:shadow-green-500/10 hover:shadow-lg hover:-translate-y-1`}
                  >
                    <div className="relative group">
                      <div className="relative h-40 w-full overflow-hidden">
                        <Image
                          src={track.album.images[0]?.url || '/placeholder-album.jpg'}
                          alt={track.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      
                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <a 
                          href={track.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500 text-black rounded-full p-3 transform scale-90 group-hover:scale-100 transition-all duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className={`font-semibold text-lg truncate ${colors.text.primary}`} title={track.name}>
                        {track.name}
                      </h3>
                      <p className={`${colors.text.tertiary} truncate`} title={track.artists.map(a => a.name).join(', ')}>
                        {track.artists.map(a => a.name).join(', ')}
                      </p>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <button 
                          className="text-gray-400 hover:text-green-400 transition-colors"
                          onClick={() => {/* Add to playlist logic */}}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                        
                        <div className="h-1 w-1 rounded-full bg-gray-600"></div>
                        
                        <button 
                          className="text-gray-400 hover:text-green-400 transition-colors"
                          onClick={() => {/* Like track logic */}}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List view
              <div className={`${colors.bg.card} rounded-xl overflow-hidden shadow-xl ${colors.border.default}`}>
                {recommendations.map((track, index) => (
                  <div 
                    key={track.id}
                    className={`flex items-center p-4 hover:bg-gray-800/50 transition-colors ${
                      index !== recommendations.length - 1 ? 'border-b border-gray-800' : ''
                    }`}
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 mr-4 overflow-hidden rounded-md">
                      <Image
                        src={track.album.images[0]?.url || '/placeholder-album.jpg'}
                        alt={track.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <h3 className={`font-medium truncate ${colors.text.primary}`}>
                        {track.name}
                      </h3>
                      <p className={`${colors.text.tertiary} truncate text-sm`}>
                        {track.artists.map(a => a.name).join(', ')}
                      </p>
                    </div>
                    
                    <div className="flex space-x-4 ml-4">
                      <button 
                        className="text-gray-400 hover:text-green-400 transition-colors"
                        onClick={() => {/* Add to playlist logic */}}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                      
                      <button 
                        className="text-gray-400 hover:text-green-400 transition-colors"
                        onClick={() => {/* Like track logic */}}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                      </button>
                      
                      <a 
                        href={track.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-green-400 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className={`text-center py-20 ${colors.bg.card} rounded-xl shadow-xl ${colors.border.default}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-600 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className={`text-xl ${colors.text.secondary}`}>No recommendations found</p>
            <p className={`mt-2 ${colors.text.tertiary}`}>Try a different genre or check your Spotify connection</p>
          </div>
        )}
        
        {/* Footer with glass effect */}
        <div className="mt-12 backdrop-blur-sm bg-black/30 rounded-xl p-6 border border-gray-800/50">
          <p className={`text-center ${colors.text.tertiary} text-sm`}>
            Powered by Spotify API • Musimeter
          </p>
        </div>
      </div>
      
      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};

export default RecommendationsPage;