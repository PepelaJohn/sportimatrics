import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: String,
  height: Number,
  width: Number,
});

const userSchema = new mongoose.Schema(
  {
    display_name: String,
    email: {
      type: String,
      required: true,
    },

    follow: {
      type: {
        followerCount: Number,
        followingUsersCount: Number,
        dismissingUsersCount: Number,
      },
      default: {},
    },

    uploads: {
      processed: Boolean,
      rawData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RawData",
      },
      processedData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProcessedData",
      },
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    uri: String,
    premium: {
      type: Boolean,
      default: false,
    },

    refresh_token: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
