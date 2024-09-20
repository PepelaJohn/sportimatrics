"use client";




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
  periods: { period: string; minutesPlayed: number }[];
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

function extractDay(endTime: string): string {
  const date = new Date(endTime);
  return date.toISOString().split("T")[0]; // Format as "YYYY-MM-DD"
}

function extractMonth(endTime: string): string {
  const date = new Date(endTime);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // Format as "YYYY-MM"
}

function extractPeriod(
  endTime: string,
  periodType: "days" | "months" | "years" | "custom"
): string {
  const date = new Date(endTime);

  if (periodType === "days") {
    return date.toISOString().split("T")[0]; // Format date as "YYYY-MM-DD"
  } else if (periodType === "months") {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // Format month as "YYYY-MM"
  } else if (periodType === "years") {
    return `${date.getFullYear()}`; // Format year as "YYYY"
  } else if (periodType === "custom") {
    return date.toISOString().split("T")[0]; // For custom, return "YYYY-MM-DD"
  }

  throw new Error("Invalid period type");
}


{
//   function extractPeriod(
//   endTime: string,
//   periodType: "days" | "months" | "years"
// ): string {
//   const date = new Date(endTime);
//   if (periodType === "days") {
//     return date.toISOString().split("T")[0]; // Format date as "YYYY-MM-DD"
//   } else if (periodType === "months") {
//     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
//       2,
//       "0"
//     )}`; // Format month as "YYYY-MM"
//   } else if (periodType === "years") {
//     return `${date.getFullYear()}`; // Format year as "YYYY"
//   }
//   throw new Error("Invalid period type");
// }
}

export function processData(
  artistsArray: Artist[],
  tracksArray: Track[],
  periodType: "days" | "months" | "years" | "custom",
  customStartDate?: Date | null,
  customEndDate?: Date | null
) {
  const now = new Date();
  let filterStartDate: Date;
  let filterEndDate: Date;

  switch (periodType) {
    case "days":
      filterStartDate = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
      filterEndDate = now;
      break;
    case "months":
      filterStartDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      filterEndDate = now;
      break;
    case "years":
      filterStartDate = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
      filterEndDate = now;
      break;
    case "custom":
      if (!customStartDate || !customEndDate) {
        throw new Error("Custom period type requires both customStartDate and customEndDate.");
      }
      filterStartDate = customStartDate;
      filterEndDate = customEndDate;
      break;
    default:
      throw new Error("Invalid period type");
  }

  const artistSegmentMap: { [artistName: string]: string } = {};
  artistsArray.forEach((artist) => {
    artistSegmentMap[artist.artistName] = artist.segment;
  });

  const trackDataMap: { [trackName: string]: TrackData } = {};
  const trackPeriodMap: TrackPeriodMap = {};
  const activeTimesMap: { [hour: number]: number } = {};
  const activeDaysMap: { [day: string]: number } = {};
  const activeMonthsMap: { [month: string]: number } = {};
  const artistPeriodMap: { [artistName: string]: { [period: string]: number } } = {};

  tracksArray.forEach((track) => {
    const endTime = new Date(track.endTime);
    if (endTime < filterStartDate || endTime > filterEndDate) return; // Filter out old data

    const trackName = track.trackName;
    const artistName = track.artistName;
    const period = extractPeriod(track.endTime, periodType);
    const minutesPlayed = msToMinutes(track.msPlayed);
    const hour = extractHour(track.endTime);
    const day = extractDay(track.endTime);
    const month = extractMonth(track.endTime);

    // Track data processing
    if (!trackDataMap[trackName]) {
      trackDataMap[trackName] = {
        trackName: trackName,
        artistName: artistName,
        minutesPlayed: 0,
        periods: [],
      };
    }
    trackDataMap[trackName].minutesPlayed += minutesPlayed;

    const periodEntry = trackDataMap[trackName].periods.find(p => p.period === period);
    if (periodEntry) {
      periodEntry.minutesPlayed += minutesPlayed;
    } else {
      trackDataMap[trackName].periods.push({ period, minutesPlayed });
    }

    if (!trackPeriodMap[trackName]) {
      trackPeriodMap[trackName] = {};
    }
    trackPeriodMap[trackName][period] = (trackPeriodMap[trackName][period] || 0) + minutesPlayed;

    activeTimesMap[hour] = (activeTimesMap[hour] || 0) + minutesPlayed;
    activeDaysMap[day] = (activeDaysMap[day] || 0) + minutesPlayed;
    activeMonthsMap[month] = (activeMonthsMap[month] || 0) + minutesPlayed;

    // Artist data processing
    if (!artistPeriodMap[artistName]) {
      artistPeriodMap[artistName] = {};
    }
    artistPeriodMap[artistName][period] = (artistPeriodMap[artistName][period] || 0) + minutesPlayed;
  });

  const artistDataMap: { [artistName: string]: ArtistData } = {};
  tracksArray.forEach((track) => {
    const endTime = new Date(track.endTime);
    if (endTime < filterStartDate || endTime > filterEndDate) return; // Filter out old data

    const artist = track.artistName;
    const minutesPlayed = msToMinutes(track.msPlayed);
    const segment = artistSegmentMap[artist] || "Unknown Segment";

    if (!artistDataMap[artist]) {
      artistDataMap[artist] = {
        artistName: artist,
        minutesPlayed: 0,
        segment: segment,
        periods: [],
      };
    }
    artistDataMap[artist].minutesPlayed += minutesPlayed;
  });

  // Process artist periods
  for (const [artistName, periods] of Object.entries(artistPeriodMap)) {
    const sortedPeriods = Object.entries(periods)
      .map(([period, minutes]) => ({ period, minutesPlayed: minutes }))
      .sort((a, b) => b.minutesPlayed - a.minutesPlayed);

    if (artistDataMap[artistName]) {
      artistDataMap[artistName].periods = sortedPeriods;
    }
  }

  const artistData: ArtistData[] = Object.values(artistDataMap);
  const trackData: TrackData[] = Object.values(trackDataMap);

  const trackPeriodsData: TrackPeriodsData = {};
  for (const [trackName, periods] of Object.entries(trackPeriodMap)) {
    const sortedPeriods = Object.entries(periods)
      .map(([period, minutes]) => ({ period, minutesPlayed: minutes }))
      .sort((a, b) => b.minutesPlayed - a.minutesPlayed);

    trackPeriodsData[trackName] = sortedPeriods;
  }

  trackData.forEach((track) => {
    track.periods = trackPeriodsData[track.trackName] || [];
  });

  artistData.sort((a, b) => b.minutesPlayed - a.minutesPlayed);
  trackData.sort((a, b) => b.minutesPlayed - a.minutesPlayed);

  const activeTimes = Object.entries(activeTimesMap)
    .map(([hour, minutes]) => ({ hour: parseInt(hour), minutesPlayed: minutes }))
    .sort((a, b) => b.minutesPlayed - a.minutesPlayed);

  const activeDays = Object.entries(activeDaysMap)
    .map(([day, minutes]) => ({ day, minutesPlayed: minutes }))
    .sort((a, b) => b.minutesPlayed - a.minutesPlayed);

  const activeMonths = Object.entries(activeMonthsMap)
    .map(([month, minutes]) => ({ month, minutesPlayed: minutes }))
    .sort((a, b) => b.minutesPlayed - a.minutesPlayed);

  return { artistData, trackData, activeTimes, activeDays, activeMonths };
}


// // export function processData(
// //   artistsArray: Artist[],
// //   tracksArray: Track[],
// //   periodType: "days" | "months" | "years" | "custom",
// // ) {
// //   const now = new Date();
// //   const filterStartDate = (() => {
// //     switch (periodType) {
// //       case "days":
// //         return new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
// //       case "months":
// //         return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
// //       case "years":
// //         return new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
// //       default:
// //         throw new Error("Invalid period type");
// //     }
// //   })();

// //   const artistSegmentMap: { [artistName: string]: string } = {};
// //   artistsArray.forEach((artist) => {
// //     artistSegmentMap[artist.artistName] = artist.segment;
// //   });

// //   const trackDataMap: { [trackName: string]: TrackData } = {};
// //   const trackPeriodMap: TrackPeriodMap = {};
// //   const activeTimesMap: { [hour: number]: number } = {};
// //   const activeDaysMap: { [day: string]: number } = {};
// //   const activeMonthsMap: { [month: string]: number } = {};
// //   const artistPeriodMap: { [artistName: string]: { [period: string]: number } } = {};

// //   tracksArray.forEach((track) => {
// //     const endTime = new Date(track.endTime);
// //     if (endTime < filterStartDate) return; // Filter out old data

// //     const trackName = track.trackName;
// //     const artistName = track.artistName;
// //     const period = extractPeriod(track.endTime, periodType);
// //     const minutesPlayed = msToMinutes(track.msPlayed);
// //     const hour = extractHour(track.endTime);
// //     const day = extractDay(track.endTime);
// //     const month = extractMonth(track.endTime);

// //     // Track data processing
// //     if (!trackDataMap[trackName]) {
// //       trackDataMap[trackName] = {
// //         trackName: trackName,
// //         artistName: artistName,
// //         minutesPlayed: 0,
// //         periods: [],
// //       };
// //     }
// //     trackDataMap[trackName].minutesPlayed += minutesPlayed;

// //     const periodEntry = trackDataMap[trackName].periods.find(p => p.period === period);
// //     if (periodEntry) {
// //       periodEntry.minutesPlayed += minutesPlayed;
// //     } else {
// //       trackDataMap[trackName].periods.push({ period, minutesPlayed });
// //     }

// //     if (!trackPeriodMap[trackName]) {
// //       trackPeriodMap[trackName] = {};
// //     }
// //     trackPeriodMap[trackName][period] = (trackPeriodMap[trackName][period] || 0) + minutesPlayed;

// //     activeTimesMap[hour] = (activeTimesMap[hour] || 0) + minutesPlayed;
// //     activeDaysMap[day] = (activeDaysMap[day] || 0) + minutesPlayed;
// //     activeMonthsMap[month] = (activeMonthsMap[month] || 0) + minutesPlayed;

// //     // Artist data processing
// //     if (!artistPeriodMap[artistName]) {
// //       artistPeriodMap[artistName] = {};
// //     }
// //     artistPeriodMap[artistName][period] = (artistPeriodMap[artistName][period] || 0) + minutesPlayed;
// //   });

// //   const artistDataMap: { [artistName: string]: ArtistData } = {};
// //   tracksArray.forEach((track) => {
// //     const endTime = new Date(track.endTime);
// //     if (endTime < filterStartDate) return; // Filter out old data

// //     const artist = track.artistName;
// //     const minutesPlayed = msToMinutes(track.msPlayed);
// //     const segment = artistSegmentMap[artist] || "Unknown Segment";

// //     if (!artistDataMap[artist]) {
// //       artistDataMap[artist] = {
// //         artistName: artist,
// //         minutesPlayed: 0,
// //         segment: segment,
// //         periods: [],
// //       };
// //     }
// //     artistDataMap[artist].minutesPlayed += minutesPlayed;
// //   });

// //   // Process artist periods
// //   for (const [artistName, periods] of Object.entries(artistPeriodMap)) {
// //     const sortedPeriods = Object.entries(periods)
// //       .map(([period, minutes]) => ({ period, minutesPlayed: minutes }))
// //       .sort((a, b) => b.minutesPlayed - a.minutesPlayed);

// //     if (artistDataMap[artistName]) {
// //       artistDataMap[artistName].periods = sortedPeriods;
// //     }
// //   }

// //   const artistData: ArtistData[] = Object.values(artistDataMap);
// //   const trackData: TrackData[] = Object.values(trackDataMap);

// //   const trackPeriodsData: TrackPeriodsData = {};
// //   for (const [trackName, periods] of Object.entries(trackPeriodMap)) {
// //     const sortedPeriods = Object.entries(periods)
// //       .map(([period, minutes]) => ({ period, minutesPlayed: minutes }))
// //       .sort((a, b) => b.minutesPlayed - a.minutesPlayed);

// //     trackPeriodsData[trackName] = sortedPeriods;
// //   }

// //   trackData.forEach((track) => {
// //     track.periods = trackPeriodsData[track.trackName] || [];
// //   });

// //   artistData.sort((a, b) => b.minutesPlayed - a.minutesPlayed);
// //   trackData.sort((a, b) => b.minutesPlayed - a.minutesPlayed);

// //   const activeTimes = Object.entries(activeTimesMap)
// //     .map(([hour, minutes]) => ({ hour: parseInt(hour), minutesPlayed: minutes }))
// //     .sort((a, b) => b.minutesPlayed - a.minutesPlayed);

// //   const activeDays = Object.entries(activeDaysMap)
// //     .map(([day, minutes]) => ({ day, minutesPlayed: minutes }))
// //     .sort((a, b) => b.minutesPlayed - a.minutesPlayed);

// //   const activeMonths = Object.entries(activeMonthsMap)
// //     .map(([month, minutes]) => ({ month, minutesPlayed: minutes }))
// //     .sort((a, b) => b.minutesPlayed - a.minutesPlayed);

// //   return { artistData, trackData, activeTimes, activeDays, activeMonths };
// // }





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
export function processListeningData(
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
