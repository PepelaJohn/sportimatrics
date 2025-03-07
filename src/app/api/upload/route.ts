import { connectDB } from "@/lib/connectToDb";
import User from "@/models/user";
import RawData from "@/models/rawData";
import ProcessedData from "@/models/processedData";
import { NextRequest, NextResponse } from "next/server";
import { processData } from "@/lib/utilsq.backup";

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();

    const req = await request.json();

    const follow = req.follow || {};
    const music_history = req.music_history || [];
    const podcast_history = req.podcast_history || [];
    const marquee = req.marquee || [];
    const identity = req.identity || {};
    const identifiers = req.identifiers || {};
    const userdata = req.userdata || {};
    const yourlibrary = req.yourlibrary || {
      tracks: [],
      albums: [],
      shows: [],
      episodes: [],
      bannedTracks: [],
      artists: [],
      bannedArtists: [],
      other: [],
    };
    const playlists = req.playlists || [];

    const email = req.email;
    if (!email) {
      return NextResponse.error();
    }

    let user = await User.findOne({ email: req.email });

    if (!user) {
      return NextResponse.json({ message: "Unknown User" }, { status: 404 });
    }

    const uploadedDataId = user?.uploads?.rawData?.toString();

    let rawData: any;
    if (!uploadedDataId) {
      rawData = new RawData();
    } else {
      rawData = await RawData.findById(uploadedDataId);
    }

    if (!rawData) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    // if (uploadedDataId) {
    //   // Clear data in the specific document
    //   await RawData.findByIdAndUpdate(uploadedDataId, {
    //     $unset: {
    //       music_history: 1,
    //       podcast_history: 1,
    //       marquee: 1,
    //       identity: 1,
    //       identifiers: 1,
    //       userdata: 1,
    //       playlists: 1,
    //       yourlibrary: 1,
    //     },
    //   });
    // }

    user.follow = follow;
    rawData.userId = user._id;
    rawData.music_history = music_history;
    rawData.podcast_history = podcast_history;
    rawData.marquee = marquee;
    rawData.identity = identity;
    rawData.identifiers = identifiers;
    rawData.userdata = userdata;
    rawData.playlists = playlists;
    rawData.yourlibrary = yourlibrary;

    user.uploads.processed = false;
    user.uploads.rawData = rawData._id;

    await user.save();
    await rawData.save();

    return NextResponse.json(
      { message: "User Updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("upload post", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const GET = async (request: NextRequest) => {
  try {
    await connectDB()
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);

    let email = params.get("email");
    if (!email) {
      // return NextResponse.error();
      email = "pepelajohn18@students.ku.ac.ke";
    }

    let user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "Unknown User" }, { status: 404 });
    }

    const uploadedDataId = user?.uploads?.rawData?.toString();

    const rawData = await RawData.findById(uploadedDataId).select([
      "music_history",
      "podcast_history",
      "marquee",
    ]);
    if (!rawData)
      return NextResponse.json({ message: "Data not found" }, { status: 404 });

    return NextResponse.json(
      { ...rawData._doc, processed: user.uploads.processed },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("getuploads", error.message);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};

// export const PATCH = async (request: NextRequest) => {
//   try {
//     await connectDB();
//     const req = await request.json();
//     const userId = req.userId;
//     const artistData = req.artistData;
//     const trackData = req.trackData;
//     const activeTimes = req.activeTimes;
//     const activeDays = req.activeDays;
//     const activeMonths = req.activeMonths;

//     if (
//       !userId ||
//       !artistData ||
//       !trackData ||
//       !activeTimes ||
//       !activeDays ||
//       !activeMonths
//     )
//       return NextResponse.json({ message: "Bad request" }, { status: 400 });

//     const user = await User.findById(userId);
//     if (!user)
//       return NextResponse.json(
//         { message: "Not found" },
//         { status: 404, statusText: "User not found" }
//       );

//     let processedData = await ProcessedData.findOne({ userId });
//     if (!processedData) {
//       processedData = new ProcessedData();
//     }

//     processedData.userId;
//     processedData.artistData;
//     processedData.trackData;
//     processedData.activeTimes;
//     processedData.activeDays;
//     processedData.activeMonths;

//     await processedData.save();
//     user.uploads.processedData = processedData._id;
//     user.uploads.processed = true;
//     await user.save();
//     return NextResponse.json({ message: "Success" }, { status: 200 });
//   } catch (error: any) {
//     console.log("patch upload", error.message);
//     return NextResponse.json(
//       {
//         message: error.message || "Internal server error",
//       },
//       { status: 500 }
//     );
//   }
// };
