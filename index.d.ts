type ArtistType = {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: Item[];
}

interface Item {
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
  href: string;
  total: number;
}

interface Externalurls {
  spotify: string;
}

/** ==================================================== */
declare interface streamDataType {
  endTime: string;
  artistName: string;
  trackName: string;
  msPlayed: number;
}
declare type sortDirectionType = "up" | "down";
declare interface artistDataType {
  name: any;
  plays: number;
  msPlayed: number;
  i?: number;
  sortdirection?: sortDirectionType;
}

declare interface TrackItem {
  track: {
    name: string;
    artists: { name: string }[];
  };
}

declare interface ArtistItem {
  name: string;
}

declare interface Track {
  played_at: string;
  track: { name: string };
}

declare interface TopTrack {
  id: string;
  name: string;
}

declare interface TracksDtype {
  trackName: any;
  msPlayed: number;
  artistName: any;
  plays: number;
}

declare interface UserStats {
  progress_ms: number;
}

declare interface Data {
  recentTracks: Track[];
  topTracks: TopTrack[];
  userStats: UserStats;
}

declare type ImageWidthType = {
  image1: { width: string };
  image2: { width: string };
  image3: { width: string };
};

declare type radarData = {
  labels: any[];
  datasets: {
    label: any;
    data: number[];
    fill: boolean;
    backgroundColor: string;
    borderColor: string;
    pointBackgroundColor: string;
    pointBorderColor: string;
    pointHoverBackgroundColor: string;
    pointHoverBorderColor: string;
  }[];
};

{
}
declare interface userType {
  display_name: string;
  email: string;

  images: [
    {
      url: string;
      height: Number;
      width: Number;
    }
  ];
  uri: string;
  refresh_token: string;
}

declare type promiseUser = {
  display_name: string;
  external_urls: { [key: string | number]: string };
  href: string;
  id: string;
  images: [
    {
      url: string;
      height: Number;
      width: Number;
    }
  ];
  product: string;
  type: string;
  uri: string;
  country: string;
  email: string;
  explicit_content: { filter_enabled: boolean; filter_locked: boolean };
  external_urls: { [key: string | number]: string };
  followers: { [key: string | number]: string | number };
};

 declare interface Dispatch<A extends Action = UnknownAction> {
  <T extends A>(action: T, ...extraArgs: any[]): T;
}

declare interface UnknownAction extends Action {
  [extraProps: string]: unknown;
}

declare type actionProp = {
  payload: { [key: string | number | symbol]: any };
  type: string;
};

