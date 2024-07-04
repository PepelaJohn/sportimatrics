import  Grid , {Grid as GridType} from "gridfs-stream";
import mongoose from "mongoose";

const connection = { isConnected: false };


const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI!;
  try {
    if (connection.isConnected) {
      console.log("Using existing connection");
      return;
    }
    console.log("Connecting to ", mongoURI);
    const db = await mongoose.connect(mongoURI);
    
    connection.isConnected = !!db.connections[0].readyState;
  } catch (error: any) {
    throw new Error(error);
  }
};
export { connectDB };
