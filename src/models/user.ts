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
    json: {
      type: [
        {
          endTime: { type: String, required: true },
          artistName: { type: String, required: true },
          trackName: { type: String, required: true },
          msPlayed: { type: Number, required: true },
        },
      ],
      default: [],
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
