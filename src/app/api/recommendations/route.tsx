// /app/api/recommendations/route.js
import { NextRequest, NextResponse } from 'next/server';

const LASTFM_API_KEY = process.env.LAST_FM_API_KEY;

export async function POST(request:NextRequest) {
  try {
    const { tracks } = await request.json();
    
    if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
      return NextResponse.json({ error: "Invalid tracks data" }, { status: 400 });
    }
    
    let allRecommendations:any = [];
    
    // Process each track to get recommendations
    for (const track of tracks) {
      if (!track.artist || !track.name) continue;
      
      const similarTracks = await fetchSimilarTracks(track.artist, track.name);
      allRecommendations = [...allRecommendations, ...similarTracks];
    }
    
    // Remove duplicates by track name
    const uniqueRecommendations = Array.from(
      new Map(allRecommendations.map((track:any) => [track.name, track])).values()
    );
    
    return NextResponse.json({ 
      recommendations: uniqueRecommendations,
      count: uniqueRecommendations.length 
    },{status:200});
    
  } catch (error) {
    console.error("Error processing recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" }, 
      { status: 500 }
    );
  }
}

async function fetchSimilarTracks(artist:any, track:any) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&api_key=${LASTFM_API_KEY}&format=json`;
  
  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`LastFM API responded with status: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Check if we have similar tracks and return the first 15
    if (data.similartracks && data.similartracks.track) {
      return data.similartracks.track.slice(0, 10);
    }
    
    return [];
  } catch (error) {
    console.error(`Error fetching similar tracks for "${track}" by "${artist}":`, error);
    return [];
  }
}