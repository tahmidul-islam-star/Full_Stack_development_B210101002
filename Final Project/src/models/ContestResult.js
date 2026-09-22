import mongoose from "mongoose";

const ContestResultSchema = new mongoose.Schema(
  {
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemsSolved: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 1000,
    },
    rank: {
      type: Number,
      default: 0,
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.ContestResult || mongoose.model("ContestResult", ContestResultSchema);
