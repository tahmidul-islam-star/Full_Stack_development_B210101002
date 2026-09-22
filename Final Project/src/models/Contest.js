import mongoose from "mongoose";

const ContestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    platform: {
      type: String,
      default: "VJudge",
    },
    contestUrl: {
      type: String,
      default: "",
    },
    contestDate: {
      type: Date,
      required: [true, "Contest date is required"],
    },
    registrationDeadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["UPCOMING", "RUNNING", "COMPLETED"],
      default: "UPCOMING",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Contest || mongoose.model("Contest", ContestSchema);
