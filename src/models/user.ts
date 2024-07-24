import mongoose from "mongoose";

const marqueeSchema = new mongoose.Schema({
  artistName: String,
  segment: String,
});

const identitySchema = new mongoose.Schema({
  displayName: String,
  firstName: String,
  lastName: String,
  imageUrl: String,
  largeImageUrl: String,
  tasteMaker: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const imageSchema = new mongoose.Schema({
  url: String,
  height: Number,
  width: Number,
});

const userdataSchema = new mongoose.Schema({
  username: String,
  email: String,
  country: String,
  createdFromFacebook: {
    type: Boolean,
    default: false,
  },
  facebookUid: String,
  birthdate: mongoose.Schema.Types.Mixed, // To support both String and Date
  gender: String,
  postalCode: String,
  mobileNumber: mongoose.Schema.Types.Mixed, // To support both String and Number
  mobileOperator: String,
  mobileBrand: mongoose.Schema.Types.Mixed, // To support both String and Number
  creationTime: mongoose.Schema.Types.Mixed, // To support both String and Date
});

const trackSchema = new mongoose.Schema({
  artist: String,
  album: String,
  track: String,
  uri: String,
});

const albumSchema = new mongoose.Schema({
  artist: String,
  album: String,
  uri: String,
});

const showSchema = new mongoose.Schema({
  artist: String,
  publisher: String,
  uri: String,
});

const episodeSchema = new mongoose.Schema({
  artist: String,
  show: String,
  uri: String,
});

const bannedTrackSchema = new mongoose.Schema({
  artist: String,
  show: String,
  uri: String,
});

const musicHistory = new mongoose.Schema({
  endTime: { type: mongoose.Schema.Types.Mixed, required: true },
  artistName: { type: String, required: true },
  trackName: { type: String, required: true },
  msPlayed: { type: Number, required: true },
});
const podcastHistory = new mongoose.Schema({
  endTime: { type: mongoose.Schema.Types.Mixed, required: true },
  podcastName: { type: String, required: true },
  episodeName: { type: String, required: true },
  msPlayed: { type: Number, required: true },
});

const yourLibrarySchema = new mongoose.Schema({
  tracks: {
    type: [trackSchema],
    default: [],
  },
  albums: {
    type: [albumSchema],
    default: [],
  },
  shows: {
    type: [showSchema],
    default: [],
  },
  episodes: {
    type: [episodeSchema],
    default: [],
  },
  bannedTracks: {
    type: [bannedTrackSchema],
    default: [],
  },
  bannedArtists: {
    type: [bannedTrackSchema], // Assuming same schema as bannedTracks
    default: [],
  },
  other: {
    type: [mongoose.Schema.Types.Mixed], // To support both String and Number
    default: [],
  },
});
const userSchema = new mongoose.Schema(
  {
    display_name: String,
    email: {
      type: String,
      required: true,
    },

    follow: {
      type: {
        followerCount: Number,
        followingUsersCount: Number,
        dismissingUsersCount: Number,
      },
      default: {},
    },

    music_history: {
      type: [musicHistory],
      default: [],
    },
    podcast_history: {
      type: [podcastHistory],
      default: [],
    },
    marquee: {
      type: [marqueeSchema],
      default: [],
    },
    identity: {
      type: identitySchema,
      default: {},
    },

    identifiers: {
      type: {
        identifierType: String,
        identifierValue: String,
      },

      default: {},
    },

    userdata: {
      type: userdataSchema,

      default: {},
    },
    yourlibrary: {
      type:yourLibrarySchema,

      default: {
        tracks: [],
        albums: [],
        shows: [],
        episodes: [],
        bannedTracks: [],
        artists: [],
        bannedArtists: [],
        other: [],
      },
    },

    playlists: {
      type: [],
      default: [],
    },
    images: {
      type:[imageSchema],
      default:[]
    },
    uri: String,
    premium: {
      type: Boolean,
      default: false,
    },

    refresh_token: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
