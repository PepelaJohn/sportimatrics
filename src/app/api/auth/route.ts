import { connectDB } from "@/lib/connectToDb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export const POST = async (request: NextRequest) => {
  try {
    connectDB();
    const body = await request.json();
    console.log(body);

    let user = await User.findOne({ email: body.email });
    if (!!user) {
      user.refresh_token = body.refresh_token;
      await user.save();
      return NextResponse.json({ status: 200 });
    }

    user = await new User(body);
    await user.save();
    cookies().set("_gtPaotwcsR", user.refresh_token, {
      expires: 60 * 60 * 24 * 10,
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      path: "/refresh",
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    // throw new Error(error as string);
  }
};
