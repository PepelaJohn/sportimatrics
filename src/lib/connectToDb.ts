import { Grid } from "gridfs-stream";
import mongoose from "mongoose";

const connection = { isConnected: false };

let gfs: Grid | null = null;
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI!;
  try {
    if (connection.isConnected) {
      console.log("Using existing connection");
      return;
    }
    console.log("Connecting to ", mongoURI);
    const db = await mongoose.connect(mongoURI);
    if (!gfs) {
      const conn = mongoose.connection;
      conn.once("open", () => {
        gfs = new Grid();

        gfs.collection("uploads");
      });
    }
    connection.isConnected = !!db.connections[0].readyState;
  } catch (error: any) {
    throw new Error(error);
  }
};
export { connectDB, gfs };
