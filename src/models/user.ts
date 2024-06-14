import mongoose from "mongoose";
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
