import multer from "multer";
import { Readable } from "stream";
import { connectDB } from "@/lib/connectToDb";
import Track, { ITrack } from "@/models/Track"; // Your Mongoose model
import User from "@/models/user";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  connectDB();
  const req = await request.json();
  try {
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: error.message || "Internal Server Error",
    });

    console.log(error, "upload post");
  }
};
