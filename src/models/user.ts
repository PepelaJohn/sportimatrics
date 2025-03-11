import mongoose, { Schema, Document, Model } from "mongoose";

interface IImage {
  url: string;
  height: number;
  width: number;
}

interface IDonation {
  amount: number;
  currency: string;
  transactionId: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

interface IUser extends Document {
  display_name: string;
  email: string;
  follow: {
    followerCount: number;
    followingUsersCount: number;
    dismissingUsersCount: number;
  };
  uploads: {
    processed: boolean;
    rawData?: mongoose.Types.ObjectId;
    processedData?: mongoose.Types.ObjectId;
  };
  images: IImage[];
  uri: string;
  premium: boolean;
  refresh_token: string;
  donations: IDonation[];
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>({
  url: { type: String, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
});

const DonationSchema = new Schema<IDonation>({
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  transactionId: { type: String, required: true, unique: true },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new Schema<IUser>(
  {
    display_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    follow: {
      type: {
        followerCount: { type: Number, default: 0 },
        followingUsersCount: { type: Number, default: 0 },
        dismissingUsersCount: { type: Number, default: 0 },
      },
      default: () => ({}),
    },
    uploads: {
      processed: { type: Boolean, default: false },
      rawData: { type: mongoose.Schema.Types.ObjectId, ref: "RawData" },
      processedData: { type: mongoose.Schema.Types.ObjectId, ref: "ProcessedData" },
    },
    images: { type: [ImageSchema], default: [] },
    uri: { type: String, required: true },
    premium: { type: Boolean, default: false },
    refresh_token: { type: String, default: "" },
    donations: { type: [DonationSchema], default: [] },
  },
  { timestamps: true }
);



const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
