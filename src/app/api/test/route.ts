import { connectDB } from "@/lib/connectToDb";
import FakeUser from "@/models/fakeUser";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async (request: NextRequest) => {
  connectDB();
  const req = await request.json()
  console.log(req);
  try {
    const user = new FakeUser({
      display_name: "peter",
      email: "peter@email.com",
    });

    await user.save();
    cookies().set('name', 'lee', { secure: true })
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
  }
};
export const config = {
  api: {
    bodyParser: true,
  },
};