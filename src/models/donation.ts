import mongoose, { Model, Schema } from  'mongoose';
interface IDonation extends Document {
    user: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    transactionId: string;
    status: "pending" | "completed" | "failed";
    createdAt: Date;
  }
  
  const DonationSchema = new Schema<IDonation>(
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      amount: { type: Number, required: true },
      currency: { type: String, default: "USD" },
      transactionId: { type: String, required: true, unique: true },
      status: { type: String, enum: ["pending", "completed", "failed", "refunded"], default: "pending" },
    },
    { timestamps: true }
  );
  
  const DonationModel: Model<IDonation> =
    mongoose.models.Donation || mongoose.model<IDonation>("Donation", DonationSchema);
  export default DonationModel;
  