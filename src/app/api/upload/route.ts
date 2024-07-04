import multer from "multer";
import { Readable } from "stream";
import { connectDB } from "@/lib/connectToDb";
import Track, { ITrack } from "@/models/Track"; // Your Mongoose model
import User from "@/models/user";
// pages/api/upload.ts
import { PathOrFileDescriptor } from "fs";
import formidable from "formidable";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

// Connect to MongoDB

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, let formidable handle it
  },
};

export const POST = async (request: NextRequest) => {
  connectDB();
  console.log('starting')
  const form = new formidable.IncomingForm();

  const req = await request.json();
  // Parse form data
  form.parse(req, async (err, fields, files) => {
    console.log(files);

    if (err) {
      console.error("Error parsing form data:", err);
      return NextResponse.json({
        status: 500,
        message: "Error parsing form data",
        error: err.message,
      });
    }

    try {
      // Read file contents
      const fileList = Array.isArray(files.file) ? files.file : [files.file];
      let fileContents = "";

      if (fileList === undefined)
        return NextResponse.json({ status: 400, message: "BAD REQUEST" });

      for (const file of fileList) {
        // Read file contents
        fileContents = fs.readFileSync(
          file as unknown as PathOrFileDescriptor,
          "utf-8"
        );
        const jsonData = JSON.parse(fileContents);

        // Example: Insert data into MongoDB using Mongoose
        // const insertedData = await Track.insertMany(jsonData);

        console.log("Data from file:", jsonData);
      }
      const jsonData: ITrack = JSON.parse(fileContents);

      // Example: Insert data into MongoDB using Mongoose
      const insertedData = await Track.insertMany(jsonData);

      NextResponse.json({
        status: 200,
        message: "Data inserted successfully",
        data: insertedData,
      });
    } catch (error: any) {
      console.error("Error handling file upload:", error);
      NextResponse.json({
        status: 500,
        message: error.message,
      });
    }
  });
};
