import mongoose from "mongoose";

const TrackItem = new mongoose.Schema(
  {
    endTime: { type: String, required: true },
    artistName: { type: String, required: true },
    trackName: { type: String, required: true },
    msPlayed: { type: Number, required: true },
  },
  { timestamps: true }
);

const Track = mongoose.models.Track || mongoose.model("Track", TrackItem);
export default Track;

export interface ITrack {
  endTime: string;
  artistName: string;
  trackName: string;
  msPlayed: number;
}
