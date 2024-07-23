import mongoose from "mongoose";
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
      type: [],
      default: [],
    },
    podcast_history: {
      type: [],
      default: [],
    },
    marquee: {
      type: [
        {
          artistName: String,
          segment: String,
        },
      ],
      default: [],
    },
    identity: {
      displayName: String,
      firstName: String,
      lastName: String,
      imageUrl: String,
      largeImageUrl: String,
      tasteMaker: Boolean,
      verified: Boolean,
    },

    identifiers: {
      type: {
        identifierType: String,
        identifierValue: String,
      },

      default: {},
    },

    userdata: {
      type: {
        username: String,
        email: String,
        country: String,
        createdFromFacebook: Boolean,
        facebookUid: String,
        birthdate: String || Date,
        gender: String,
        postalCode: String,
        mobileNumber: String || Number,
        mobileOperator: String,
        mobileBrand: String || Number,
        creationTime: String || Date,
      },

      default: {},
    },
    yourlibrary: {
      type: {
        tracks: {
          type: [
            {
              artist: String,
              album: String,
              track: String,
              uri: String,
            },
          ],
          default: [],
        },

        albums: {
          type: [
            {
              artist: String,
              album: String,
              uri: String,
            },
          ],
          default: [],
        },
        shows: {
          type: [
            {
              artist: String,
              publisher: String,
              uri: String,
            },
          ],
          default: [],
        },
        episodes: {
          type: [
            {
              artist: String,
              show: String,
              uri: String,
            },
          ],
          default: [],
        },
        bannedTracks: {
          type: [
            {
              artist: String,
              show: String,
              uri: String,
            },
          ],
          default: [],
        },
        bannedArtists: {
          type: [
            {
              artist: String,
              show: String,
              uri: String,
            },
          ],
          default: [],
        },

        other: {
          type: [String || Number],
          default: [],
        },
      },

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
    images: [
      {
        url: String,
        height: Number,
        width: Number,
      },
    ],
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
