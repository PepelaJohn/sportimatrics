import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
  followerCount: {
    type: Number,
    default: 0,
  },
  followingUsersCount: {
    type: Number,
    default: 0,
  },
  dismissingUsersCount: {
    type: Number,
    default: 0,
  },
});

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

const identifierSchema = new mongoose.Schema({
  identifierType: String,
  identifierValue: String,
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

const imageSchema = new mongoose.Schema({
  url: String,
  height: Number,
  width: Number,
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
      type: followSchema,
      default: {},
    },
    music_history: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    podcast_history: {
      type: [mongoose.Schema.Types.Mixed],
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
      type: identifierSchema,
      default: {},
    },
    userdata: {
      type: userdataSchema,
      default: {},
    },
    yourlibrary: {
      type: yourLibrarySchema,
      default: {
        tracks: [],
        albums: [],
        shows: [],
        episodes: [],
        bannedTracks: [],
        bannedArtists: [],
        other: [],
      },
    },
    playlists: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    images: {
      type: [imageSchema],
      default: [],
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




// 88888888888888888888888888888888888888888888888888888888888888888
import { connectDB } from "@/lib/connectToDb";
import User from "@/models/user";
import Userdata from "@/models/userdata";
import YourLibrary from "@/models/yourlibrary";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  connectDB();
  const req = await request.json();

  const {
    follow = {},
    music_history = [],
    podcast_history = [],
    marquee = [],
    identity = {},
    identifiers = {},
    userdata: userdataPayload = {},
    yourlibrary: yourlibraryPayload = {
      tracks: [],
      albums: [],
      shows: [],
      episodes: [],
      bannedTracks: [],
      bannedArtists: [],
      other: [],
    },
    playlists = [],
    email,
  } = req;

  if (!email) {
    return NextResponse.json({
      status: 400,
      message: "Email is required",
    });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email });
    }

    user.follow = follow;
    user.music_history = music_history;
    user.podcast_history = podcast_history;
    user.marquee = marquee;
    user.identity = identity;
    user.identifiers = identifiers;
    user.playlists = playlists;

    // Handle userdata sub-document
    let userdata;
    if (user.userdata) {
      userdata = await Userdata.findById(user.userdata);
      Object.assign(userdata, userdataPayload);
      await userdata.save();
    } else {
      userdata = new Userdata(userdataPayload);
      await userdata.save();
      user.userdata = userdata._id;
    }

    // Handle yourlibrary sub-document
    let yourlibrary;
    if (user.yourlibrary) {
      yourlibrary = await YourLibrary.findById(user.yourlibrary);
      Object.assign(yourlibrary, yourlibraryPayload);
      await yourlibrary.save();
    } else {
      yourlibrary = new YourLibrary(yourlibraryPayload);
      await yourlibrary.save();
      user.yourlibrary = yourlibrary._id;
    }

    await user.save();

    return NextResponse.json({
      status: 200,
      message: "User updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json({
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
};



