import { connectDB } from "@/lib/connectToDb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    const req = await request.json();

    let user = await User.findOne({ email: req.email });
    console.log(user)
    if (!user)
      return NextResponse.json({ message: "Bad Request", status: 400 });

    user.refresh_token = "";
    await user.save();

    // cookies()
    return NextResponse.json(
      {},
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({error:error.message}, { status: 500 });
  }
};
