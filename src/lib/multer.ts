// lib/multer.ts
import multer from "multer";
import { GridFSBucket } from "mongodb";
import { NextRequest as Request } from "next/server";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadFile = upload.single("file");

export const saveFileToGridFS = (req: Request, bucket: GridFSBucket) => {
  return new Promise(async (resolve, reject) => {
    const { file } = await req.json();
    if (!file) return reject(new Error("No file provided"));

    const uploadStream = bucket.openUploadStream(file.originalname);
    uploadStream.end(file.buffer);

    uploadStream.on("finish", () => {
      resolve(uploadStream.id);
    });

    uploadStream.on("error", (error) => {
      reject(error);
    });
  });
};
