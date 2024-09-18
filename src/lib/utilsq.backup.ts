"use client";
import artistsArray from "./Marquee.json";
import itracksArray from "./StreamingHistory_music_0.json";
import itracksArray2 from "./StreamingHistory_music_0.json";
import podcastArray from "./StreamingHistory_podcast_0.json";

const tracksArray: Track[] = [...itracksArray, ...itracksArray2];

export { tracksArray, artistsArray, podcastArray };

// Interface definitions
interface Artist {
  artistName: string;
  segment: string;
}

interface Track {
  endTime: string;
  artistName: string;
  trackName: string;
  msPlayed: number;
}

export interface ArtistData {
  artistName: string;
  minutesPlayed: number;
  segment: string;
}

export interface TrackData {
  trackName: string;
  artistName: string;
  minutesPlayed: number;
  periods: PeriodData[];
}

interface PeriodData {
  period: string;
  minutesPlayed: number;
}

interface TrackPeriodMap {
  [trackName: string]: {
    [period: string]: number;
  };
}

interface TrackPeriodsData {
  [trackName: string]: PeriodData[];
}

// Function to convert milliseconds to minutes
function msToMinutes(ms: number): number {
  return ms / 60000;
}
function extractHour(endTime: string): number {
  const date = new Date(endTime);
  return date.getHours();
}

function filterTracks(tracks: any[], period: string, startDate?: string, endDate?: string): any[] {
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  return tracks.filter(track => {
      const trackDate = new Date(track.endTime);

      if (period === 'days') {
          return now.getTime() - trackDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
      } else if (period === 'months') {
          return now.getTime() - trackDate.getTime() <= 12 * 30 * 24 * 60 * 60 * 1000;
      } else if (period === 'years') {
          return now.getTime() - trackDate.getTime() <= 5 * 12 * 30 * 24 * 60 * 60 * 1000;
      } else if (period === 'custom' && start && end) {
          return trackDate >= start && trackDate <= end;
      }
      return false;
  });
}

function extractPeriod(
  endTime: string,
  periodType: "days" | "months" | "years"
): string {
  const date = new Date(endTime);
  if (periodType === "days") {
    return date.toISOString().split("T")[0]; // Format date as "YYYY-MM-DD"
  } else if (periodType === "months") {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`; // Format month as "YYYY-MM"
  } else if (periodType === "years") {
    return `${date.getFullYear()}`; // Format year as "YYYY"
  }
  throw new Error("Invalid period type");
}

// Function to extract the relevant period based on the type

// Main function to process the data
export function processData(
  artistsArray: Artist[],
  tracksArray: Track[],
  periodType: "days" | "months" | "years",
  startDate?:string, endDate?:string
) {
  const now = new Date();
  let filterStartDate: Date;
  if (periodType === "days") {
    filterStartDate = new Date(now.setMonth(now.getMonth() - 1)); // Last 1 month
  } else if (periodType === "months") {
    filterStartDate = new Date(now.setFullYear(now.getFullYear() - 1)); // Last 1 year
  } else if (periodType === "years") {
    filterStartDate = new Date(now.setFullYear(now.getFullYear() - 5)); // Last 5 years
  } else {
    throw new Error("Invalid period type");
  }

  // Create a map to quickly lookup the segment of an artist
  const artistSegmentMap: { [artistName: string]: string } = {};
  artistsArray.forEach((artist) => {
    artistSegmentMap[artist.artistName] = artist.segment;
  });

  // Aggregate track data
  const trackDataMap: { [trackName: string]: TrackData } = {};
  const trackPeriodMap: TrackPeriodMap = {};
  tracksArray.forEach((track) => {
    const endTime = new Date(track.endTime);
    if (endTime < filterStartDate) return; // Filter out old data

    const trackName = track.trackName;
    const artistName = track.artistName;
    const period = extractPeriod(track.endTime, periodType);
    const minutesPlayed = msToMinutes(track.msPlayed);

    if (!trackDataMap[trackName]) {
      trackDataMap[trackName] = {
        trackName: trackName,
        artistName: artistName,
        minutesPlayed: 0,
        periods: [],
      };
    }
    trackDataMap[trackName].minutesPlayed += minutesPlayed;

    if (!trackDataMap[trackName].periods.some((p) => p.period === period)) {
      trackDataMap[trackName].periods.push({ period, minutesPlayed });
    } else {
      const periodData = trackDataMap[trackName].periods.find(
        (p) => p.period === period
      )!;
      periodData.minutesPlayed += minutesPlayed;
    }

    if (!trackPeriodMap[trackName]) {
      trackPeriodMap[trackName] = {};
    }
    if (!trackPeriodMap[trackName][period]) {
      trackPeriodMap[trackName][period] = 0;
    }
    trackPeriodMap[trackName][period] += minutesPlayed;
  });

  // Aggregate artist data
  const artistDataMap: { [artistName: string]: ArtistData } = {};
  tracksArray.forEach((track) => {
    const endTime = new Date(track.endTime);
    if (endTime < filterStartDate) return; // Filter out old data

    const artist = track.artistName;
    const minutesPlayed = msToMinutes(track.msPlayed);
    const segment = artistSegmentMap[artist] || "Unknown Segment";

    if (!artistDataMap[artist]) {
      artistDataMap[artist] = {
        artistName: artist,
        minutesPlayed: 0,
        segment: segment,
      };
    }
    artistDataMap[artist].minutesPlayed += minutesPlayed;
  });

  // Convert maps to arrays
  const artistData: ArtistData[] = Object.values(artistDataMap);
  const trackData: TrackData[] = Object.values(trackDataMap);

  // Convert trackPeriodMap to a more readable format
  const trackPeriodsData: TrackPeriodsData = {};
  for (const [trackName, periods] of Object.entries(trackPeriodMap)) {
    const sortedPeriods = Object.entries(periods)
      .map(([period, minutes]) => ({ period, minutesPlayed: minutes }))
      .sort((a, b) => b.minutesPlayed - a.minutesPlayed);

    trackPeriodsData[trackName] = sortedPeriods;
  }

  // Integrate trackPeriodsData into trackData
  trackData.forEach((track) => {
    track.periods = trackPeriodsData[track.trackName] || [];
  });

    artistData.sort((a,b)=>(b.minutesPlayed - a.minutesPlayed))
    trackData.sort((a,b)=>(b.minutesPlayed - a.minutesPlayed))



  
    // Aggregate active times
    const activeTimesMap: { [key: number]: number } = {};
    const filteredTracks = filterTracks(tracksArray, 'months', startDate, endDate);
    filteredTracks.forEach(track => {
        const hour = extractHour(track.endTime);
        const minutesPlayed = msToMinutes(track.msPlayed);

        if (!activeTimesMap[hour]) {
            activeTimesMap[hour] = 0;
        }
        activeTimesMap[hour] += minutesPlayed;
    });

    // Convert maps to arrays
    
    const activeTimes = Object.entries(activeTimesMap)
        .map(([hour, minutes]) => ({ hour: parseInt(hour), minutesPlayed: minutes }))
        .sort((a, b) => b.minutesPlayed - a.minutesPlayed);

  return { artistData, trackData, activeTimes};
}



//////////////////////////////////////////////////////////////////

/* listening time stuff */

// Define types for input data
interface Track {
  endTime: string;
  artistName: string;
  trackName: string;
  msPlayed: number;
}

interface Podcast {
  endTime: string;
  podcastName: string;
  episodeName: string;
  msPlayed: number;
}

// Define type for aggregated data
interface PeriodData {
  period: string;
  minutesPlayed: number;
}

// Function to convert milliseconds to minutes

// Function to process data for a given period type or date range
function processListeningData(
  tracksArray: Track[],
  podcastArray: Podcast[],
  periodType: "days" | "months" | "years" | "custom",
  startDate?: string,
  endDate?: string
): PeriodData[] {
  const now = new Date();
  let filterStartDate: Date;
  let filterEndDate: Date;

  if (periodType === "custom") {
    if (!startDate || !endDate) {
      throw new Error(
        "For custom period, both startDate and endDate must be provided"
      );
    }
    filterStartDate = new Date(startDate);
    filterEndDate = new Date(endDate);
  } else {
    if (periodType === "days") {
      filterStartDate = new Date(now.setMonth(now.getMonth() - 1)); // Last 1 month
      filterEndDate = new Date(); // Up to current date
    } else if (periodType === "months") {
      filterStartDate = new Date(now.setFullYear(now.getFullYear() - 1)); // Last 1 year
      filterEndDate = new Date(); // Up to current date
    } else if (periodType === "years") {
      filterStartDate = new Date(now.setFullYear(now.getFullYear() - 5)); // Last 5 years
      filterEndDate = new Date(); // Up to current date
    } else {
      throw new Error("Invalid period type");
    }
  }

  // Combine tracks and podcasts into a single array
  const combinedArray = [
    ...tracksArray.map((track) => ({
      endTime: track.endTime,
      name: track.trackName,
      artistName: track.artistName,
      msPlayed: track.msPlayed,
      type: "track",
    })),
    ...podcastArray.map((podcast) => ({
      endTime: podcast.endTime,
      name: podcast.episodeName,
      artistName: podcast.podcastName,
      msPlayed: podcast.msPlayed,
      type: "podcast",
    })),
  ];

  // Aggregate listening data
  const periodDataMap: { [key: string]: { minutesPlayed: number } } = {};
  combinedArray.forEach((item) => {
    const endTime = new Date(item.endTime);
    if (endTime < filterStartDate || endTime > filterEndDate) return; // Filter out data outside the range

    const period =
      periodType === "custom"
        ? `${item.endTime}` // Custom periods don't need special formatting
        : extractPeriod(item.endTime, periodType);

    const minutesPlayed = msToMinutes(item.msPlayed);

    if (!periodDataMap[period]) {
      periodDataMap[period] = { minutesPlayed: 0 };
    }
    periodDataMap[period].minutesPlayed += minutesPlayed;
  });

  // Convert periodDataMap to an array
  const periodData: PeriodData[] = Object.entries(periodDataMap)
    .map(([period, data]) => ({
      period,
      minutesPlayed: data.minutesPlayed,
    }))
    .sort((a, b) => b.minutesPlayed - a.minutesPlayed);

  return periodData;
}

// Example usage

// Process data for different periods and write to files

// const resultMonths = processListeningData(tracksArray, podcastArray, "months");
// writeResultsToFile("listening_data_months.json", resultMonths);

// const resultYears = processListeningData(tracksArray, podcastArray, "years");
// writeResultsToFile("listening_data_years.json", resultYears);

// // Process data for a custom period and write to file
// const startDate = "2024-01-01";
// const endDate = "2024-01-31";
// const resultCustomPeriod = processListeningData(
//   tracksArray,
//   podcastArray,
//   "custom",
//   startDate,
//   endDate
// );
// writeResultsToFile("listening_data_custom.json", resultCustomPeriod);

// 
