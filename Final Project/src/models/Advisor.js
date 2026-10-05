import mongoose from "mongoose";

const AdvisorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    title: {
      type: String,
      default: "Advisor, CSTU CPC",
      trim: true,
    },
    designation: {
      type: String,
      default: "",
      trim: true,
    },
    department: {
      type: String,
      default: "",
      trim: true,
    },
    institution: {
      type: String,
      default: "Chandpur Science and Technology University",
      trim: true,
    },
    bio: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    websiteUrl: {
      type: String,
      default: "",
    },
    linkedinUrl: {
      type: String,
      default: "",
    },
    facebookUrl: {
      type: String,
      default: "",
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Advisor || mongoose.model("Advisor", AdvisorSchema);
