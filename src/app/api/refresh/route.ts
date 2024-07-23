import { connectDB } from "@/lib/connectToDb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async (request: NextRequest) => {
  try {
    connectDB();
    const req = await request.json();
    console.log(req.email);

    let refresh_token = cookies().get("_gtPaotwcsR");
    if (!refresh_token) {
      let user = await User.findOne({ email: req.email });
      refresh_token = user.refresh_token;
    }
    return NextResponse.json({
      refresh_token,
    });
  } catch (error: any) {
    console.log(error);
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    connectDB();
    const req = await request.json();
    if (!req.refresh_token) return NextResponse.json({ status: 400 });
    const user = await User.findOne({ email: req.email });
    if (!user ) return NextResponse.json({ status: 404 });
    user.refresh_token = req.refresh_token;
    await user.save();
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
  }
};
