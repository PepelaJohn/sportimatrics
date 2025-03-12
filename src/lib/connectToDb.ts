import Grid, { Grid as GridType } from "gridfs-stream";
import mongoose from "mongoose";
import { ConnectOptions } from "mongoose";

const connection = { isConnected: false };

async function connectDB() {
  console.log('tryiung to connect')
  try {
    if (connection.isConnected) {
      console.log("Using existing connection");
      return;
    }
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    const db = await mongoose.connect(process.env.MONGO_URI !);
    await mongoose.connection.db.admin().command({ ping: 1 });
    connection.isConnected = !!db.connections[0].readyState;
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error: any) {
    console.log(error?.message);
    // throw new Error(error);
  }
}
{
  // const connectDB = async () => {
  //   const mongoURI = process.env.MONGO_URI_MAIN!;
  //   try {
  //     if (connection.isConnected) {
  //       console.log("Using existing connection");
  //       return;
  //     }
  //     console.log("Connecting to ", mongoURI);
  //     const db = await mongoose.connect(mongoURI);
  //     await mongoose.connection.db.admin().command({ ping: 1 });
  //     connection.isConnected = !!db.connections[0].readyState;
  //   } catch (error: any) {
  //     console.log(error?.message)
  //     // throw new Error(error);
  //   }
  // };
}
export { connectDB };
