import mongoose from "mongoose";

interface Period {
    period: string;
    minutesPlayed: number;
  }

const ArtistDatum = new mongoose.Schema({
    artistName: String,
    minutesPlayed: Number,
    segment: String,
  
  });
const Period = new mongoose.Schema({
    period: String,
    minutesPlayed: Number,
   
  
  });
const TrackDatum = new mongoose.Schema({
    trackName: String,
    artistName: String,
    minutesPlayed: Number,
    segment: String,
    periods: [Period]
  
  });
const ActiveTime = new mongoose.Schema({
    hour: String,
    minutesPlayed: Number,
  
  });
const ActiveDay = new mongoose.Schema({
    day: String,
    minutesPlayed: Number,
  
  });
const ActiveMonth = new mongoose.Schema({
    month: String,
    minutesPlayed: Number,
    
  
  });
const processedData = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    artistData:{
        type:[],
        default:[]
    },
    trackData:{
        type:[],
        default:[]
    },
    activeTimes:{
        type:[],
        default:[]
    },
    activeDays:{
        type:[],
        default:[]
    },
    activeMonths:{
        type:[],
        default:[]
    },
  },
  { timestamps: true }
);

const ProcessedData =
  mongoose.models.ProcessedData ||
  mongoose.model("ProcessedData", processedData);
export default ProcessedData;

export interface ITrack {
  endTime: string;
  artistName: string;
  trackName: string;
  msPlayed: number;
}
