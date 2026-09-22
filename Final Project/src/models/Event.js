import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
    },
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    coverImage: {
      type: String,
      default: "",
    },
    registrationLink: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
