import mongoose from "mongoose";
import {GridFSBucket} from 'mongodb'
const userSchema = new mongoose.Schema(
  {
    display_name: String,
    email: {
      type: String,
      required: true,
      
    },

    images: [
      {
        url: String,
        height: Number,
        width: Number,
      },
    ],
    uri: "string",
    premium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);



const User =mongoose.models.FakeUser || mongoose.model('FakeUser', userSchema)
export default User