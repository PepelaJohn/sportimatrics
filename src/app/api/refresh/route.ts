import { connectDB } from "@/lib/connectToDb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async (request: any) => {
  try {
    connectDB();
    const req = await request.json();
    let refresh_token = cookies().get("_gtPaotwcsR");
    if (!refresh_token) {
      let user = await User.findOne({ email: req.email });
      refresh_token = user.refresh_token;
    }
    return NextResponse.json({
      refresh_token: "refresh_token",
    });
  } catch (error: any) {
    console.log(error);
  }
};
