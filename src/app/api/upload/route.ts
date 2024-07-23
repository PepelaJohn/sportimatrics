import { connectDB } from "@/lib/connectToDb";
import User from "@/models/user";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  connectDB();
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

  try {
    let user = await User.findOne({ email: req.email });

    user.follow = follow;
    user.music_history = music_history;
    user.podcast_history = podcast_history;
    user.marquee = marquee;
    user.identity = identity;
    user.identifiers = identifiers;
    user.userdata = userdata;
    user.playlists = playlists;
    user.yourlibrary = yourlibrary;
    await user.save()
    return NextResponse.json({
      status: 200,
      message: "User Updated succesfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: error.message || "Internal Server Error",
    });

    console.log(error, "upload post");
  }
};
