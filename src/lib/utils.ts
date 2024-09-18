"use client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeSince(isoDateString: string): string {
  const now = new Date();
  const past = new Date(isoDateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const units = [
      { name: "year", seconds: 31536000 },
      { name: "month", seconds: 2592000 },
      { name: "day", seconds: 86400 },
      { name: "hour", seconds: 3600 },
      { name: "minute", seconds: 60 },
      { name: "second", seconds: 1 }
  ];

  for (const unit of units) {
      const count = Math.floor(diffInSeconds / unit.seconds);
      if (count >= 1) {
          return `${count} ${unit.name}${count > 1 ? "s" : ""} ago`;
      }
  }

  return "just now"; // If the difference is less than a second
}


export const getNextHour = (hour:string)=>{
  return parseInt(hour) === 0o0 ? 0o1 : parseInt(hour) + 1
}

// utils/formatDateTime.ts
export function formatDateTime(isoDateString: string): string {
  // Create a Date object
  const date = new Date(isoDateString);

  // Define the formatting options
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  // Format the date and time using Intl.DateTimeFormat
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

// utils/formatNumber.ts
export function formatNumberWithCommas(number: number | string): string {
  // Convert the input to a string in case it's a number
  const numStr = number.toString();

  // Use a regular expression to format the number with commas
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const animateHomepage = () => {};

import streamdata from "@/assets/StreamingHistory_music_1.json";
import { ERROR } from "@/constants";
export { streamdata };

export const streamData = [
  {
    endTime: "2024-01-09 18:51",
    artistName: "Zerb",
    trackName: "Mwaki",
    msPlayed: 208135,
  },
  {
    endTime: "2024-01-09 18:54",
    artistName: "Spada",
    trackName: "Be Strong",
    msPlayed: 192605,
  },
  {
    endTime: "2024-01-09 18:58",
    artistName: "Elderbrook",
    trackName: "Numb",
    msPlayed: 230040,
  },
  {
    endTime: "2024-01-09 19:01",
    artistName: "PALASTIC",
    trackName: "Price",
    msPlayed: 154000,
  },
  {
    endTime: "2024-01-09 19:04",
    artistName: "iñigo quintero",
    trackName: "Si No Estás",
    msPlayed: 154013,
  },
  {
    endTime: "2024-01-09 19:04",
    artistName: "Maes",
    trackName: "Fetty Wap",
    msPlayed: 26513,
  },
  {
    endTime: "2024-01-09 19:05",
    artistName: "SDM",
    trackName: "Passat",
    msPlayed: 32166,
  },
  {
    endTime: "2024-01-09 19:30",
    artistName: "Maes",
    trackName: "Akatsuki",
    msPlayed: 144043,
  },
  {
    endTime: "2024-01-09 19:33",
    artistName: "TRVPHVRD",
    trackName: "Quavious",
    msPlayed: 134238,
  },
  {
    endTime: "2024-01-09 19:36",
    artistName: "TRVPHVRD",
    trackName: "Dimm",
    msPlayed: 228021,
  },
];

export function getDifferenceInSecondsAndMinutes(date1: string, date2: string): { seconds: number; minutes: number } {
  // Parse the ISO date strings into Date objects
  const startDate = new Date(date1);
  const endDate = new Date(date2);

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = Math.abs(endDate.getTime() - startDate.getTime());

  // Convert milliseconds to seconds and minutes
  const seconds = Math.floor(differenceInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);

  return {
    seconds,
    minutes
  };
}

// Example usage

export function getInitials(name: string): string {
  // Split the name by spaces to get individual words
  const words = name.trim().split(" ");

  // Initialize an empty string to hold the initials
  let initials = "";

  // Loop through the words and add the first character of each word to the initials
  for (let i = 0; i < words.length && initials.length < 2; i++) {
    if (words[i].length > 0) {
      initials += words[i][0].toUpperCase();
    }
  }

  // Return the initials
  return initials;
}
export function getCookie(cname: string) {
  let name = cname + "=";

  if (typeof window === "undefined" || typeof window === undefined) {
    return "";
  }
  let decodedCookie = decodeURIComponent(window.document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const isaVailable = (arr: artistDataType[], k: string) => {
  for (const artist of arr) {
    if (artist.name === k) return true;
  }
  return false;
};

export const processImage = (
  e: any,
  setFormData: React.SetStateAction<any>,
  formData: any,

  dispatch: Dispatch<UnknownAction>
) => {
  // get the files
  let files = e.target.files;

  for (var i = 0; i < files.length; i++) {
    let file = files[i];

    let reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load somthing...
    reader.readAsDataURL(file);

    reader.onload = async () => {
      // Make a fileInfo Object
      let fileInfo = {
        name: file.name,
        type: file.type,
        size: Math.round(file.size / 1000) + " kB",
        base64: reader.result,
        file: file,
      };
      
      if (fileInfo.type !== "application/json") {
        dispatch({ type: ERROR, payload: "Invalid File Type" });
        return;
      }

      // setFormData({ ...formData, file: fileInfo.base64 });
      // setProgress(100);
      // await uploadToDB({ file: fileInfo.base64 });
     
    };
  }
};

const getSingleListeningTime = (
  artistData: artistDataType[],
  stream: streamDataType
) => {
  if (isaVailable(artistData, stream.artistName)) {
    let data = artistData.map((art) =>
      art.name === stream.artistName
        ? {
            ...art,
            plays: art.plays + 1,
            msPlayed: art.msPlayed + stream.msPlayed,
          }
        : art
    );
    artistData = data;
  } else {
    let played = {
      name: stream.artistName,
      plays: 1,
      msPlayed: stream.msPlayed,
    };
    artistData.push(played);
  }

  return artistData;
};

export const getTotalArtistListeningTime = (
  data: streamDataType[],
  sort: "msPlayed" | "plays" = "msPlayed"
): artistDataType[] => {
  let artistData: artistDataType[] = [];
  for (const stream of data) {
    artistData = getSingleListeningTime(artistData, stream);
  }
  artistData.sort(
    (a: artistDataType, b: artistDataType) =>
      b[sort as keyof artistDataType] - a[sort as keyof artistDataType]
  );
  return artistData;
};

export const getTotalListeningTime = (data: streamDataType[]): number => {
  let listened_ms = 0;
  for (let stream of data) {
    listened_ms += stream.msPlayed;
  }
  return listened_ms;
};

const isTrackAvailable = (tracksData: TracksDtype[], key: string) => {
  for (let track of tracksData) {
    if (track.artistName === key) return true;
  }
  return false;
};
export const getTopTracks = (
  data: streamDataType[],
  sort = "plays"
): TracksDtype[] => {
  let tracksData: TracksDtype[] = [];
  for (let stream of data) {
    if (isTrackAvailable(tracksData, stream.artistName)) {
      let dt = tracksData.map((track) => {
        return track.trackName === stream.trackName
          ? {
              ...track,
              msPlayed: track.msPlayed + stream.msPlayed,
              plays: track.plays + 1,
            }
          : track;
      });

      tracksData = dt;
    } else {
      let dt = {
        trackName: stream.trackName,
        msPlayed: stream.msPlayed,
        artistName: stream.artistName,
        plays: 1,
      };
      tracksData.push(dt);
    }
  }
  tracksData.sort(
    (a: TracksDtype, b: TracksDtype) =>
      b[sort as keyof TracksDtype] - a[sort as keyof TracksDtype]
  );
  return tracksData;
};

// =============================Functions to fetch recent tracks from Spotify API======================================


