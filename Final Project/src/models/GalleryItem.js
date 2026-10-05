import mongoose from "mongoose";

const GalleryItemSchema = new mongoose.Schema(
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
    imageUrl: {
      type: String,
      required: [true, "Image is required"],
    },
    category: {
      type: String,
      default: "GENERAL",
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.GalleryItem ||
  mongoose.model("GalleryItem", GalleryItemSchema);
