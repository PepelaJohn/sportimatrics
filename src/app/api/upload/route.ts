// pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB as connect, gfs } from "@/lib/connectToDb";
import { uploadFile, saveFileToGridFS } from "@/lib/multer";
import mongoose, { Document } from "mongoose";
import AdmZip from "adm-zip";
import { GridFSBucket } from "mongodb";
import User from '@/models/user'
export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

interface UserDocument extends Document {
  username: string;
  file_id: mongoose.Types.ObjectId;
  userData: Record<string, any>;
}




const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connect();
const request = await req.body
  const bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });

  await new Promise((resolve, reject) => {
    uploadFile(req as any, res as any, (err: any) => {
      if (err) return reject(err);
      resolve(null);
    });
  });

  const userId = request.userId;
  const zip = new AdmZip(request.file.buffer);
  const zipEntries = zip.getEntries();
  let userData: Record<string, any> = {};

  zipEntries.forEach((entry:any) => {
    if (entry.entryName === "userdata.json") {
      const data = entry.getData().toString("utf8");
      userData = JSON.parse(data);
    }
  });

  try {
    const fileId = await saveFileToGridFS(req as any, bucket);

    const user = await User.findByIdAndUpdate(
      userId,
      { file_id: fileId, userData },
      { new: true, upsert: true }
    );

    res
      .status(200)
      .json({
        message: "File uploaded and user data extracted successfully",
        user,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
};

export default handler;
