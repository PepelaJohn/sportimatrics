// Types
interface UserPreferenceData {
    topTracks: string[]; // Track IDs
    topArtists: string[]; // Artist IDs
    favoriteGenres: string[]; // Genre names
  }
  
  interface RecommendationSeed {
    seed_tracks?: string[];
    seed_artists?: string[];
    seed_genres?: string[];
    target_energy?: number;
    target_danceability?: number;
    target_popularity?: number;
    min_popularity?: number;
  }
  
  // 1. Fetch and process user data from MongoDB
  async function getUserPreferenceData(userId: string): Promise<UserPreferenceData> {
    // Fetch from MongoDB
    const user = await db.collection('users').findOne({ _id: userId });
    
    // Process raw user data into preference data
    return {
      topTracks: user.topTracks.slice(0, 5).map(track => track.id),
      topArtists: user.topArtists.slice(0, 5).map(artist => artist.id),
      favoriteGenres: extractTopGenres(user.topArtists, 5)
    };
  }
  
  // Helper to extract genres from artists
  function extractTopGenres(artists: any[], limit: number): string[] {
    // Count genre occurrences
    const genreCounts: Record<string, number> = {};
    
    artists.forEach(artist => {
      artist.genres.forEach((genre: string) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
    
    // Sort and return top genres
    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([genre]) => genre);
  }
  
  // 2. Build recommendation seed based on user preferences and filters
  function buildSeedData(
    userData: UserPreferenceData,
    filter?: { genre?: string }
  ): RecommendationSeed {
    const seed: RecommendationSeed = {};
    
    // If specific genre is requested
    if (filter?.genre) {
      seed.seed_genres = [filter.genre];
      // Mix in some familiar elements
      seed.seed_artists = userData.topArtists.slice(0, 2);
    } else {
      // Use a mix of tracks, artists and genres for balanced recommendations
      seed.seed_tracks = userData.topTracks.slice(0, 2);
      seed.seed_artists = userData.topArtists.slice(0, 2);
      seed.seed_genres = userData.favoriteGenres.slice(0, 1);
    }
    
    // Set some reasonable targets for good recommendations
    seed.target_popularity = 70; // Somewhat popular but not too mainstream
    seed.min_popularity = 20;    // Avoid extremely obscure tracks
    
    return seed;
  }
  
  // 3. Fetch recommendations from Spotify API
  async function fetchSpotifyRecommendations(seed: RecommendationSeed): Promise<any[]> {
    try {
      const accessToken = await getSpotifyAccessToken();
      
      // Convert seed data to URL parameters
      const params = new URLSearchParams();
      if (seed.seed_tracks) params.append('seed_tracks', seed.seed_tracks.join(','));
      if (seed.seed_artists) params.append('seed_artists', seed.seed_artists.join(','));
      if (seed.seed_genres) params.append('seed_genres', seed.seed_genres.join(','));
      if (seed.target_energy) params.append('target_energy', seed.target_energy.toString());
      if (seed.target_danceability) params.append('target_danceability', seed.target_danceability.toString());
      if (seed.target_popularity) params.append('target_popularity', seed.target_popularity.toString());
      if (seed.min_popularity) params.append('min_popularity', seed.min_popularity.toString());
      params.append('limit', '30'); // Return 30 recommendations
      
      // Make request to Spotify API
      const response = await fetch(`https://api.spotify.com/v1/recommendations?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      const data = await response.json();
      return data.tracks || [];
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }
  
  // API endpoint to expose in your Next.js API routes
 