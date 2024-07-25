interface ProcessedData {
  artistData: ArtistDatum[];
  trackData: TrackDatum[];
  activeTimes: ActiveTime[];
  activeDays: ActiveDay[];
  activeMonths: ActiveMonth[];
}

interface ActiveMonth {
  month: string;
  minutesPlayed: number;
}

interface ActiveDay {
  day: string;
  minutesPlayed: number;
}

interface ActiveTime {
  hour: number;
  minutesPlayed: number;
}

interface TrackDatum {
  trackName: string;
  artistName: string;
  minutesPlayed: number;
  periods: Period[];
}

interface Period {
  period: string;
  minutesPlayed: number;
}

interface ArtistDatum {
  artistName: string;
  minutesPlayed: number;
  segment: string;
}