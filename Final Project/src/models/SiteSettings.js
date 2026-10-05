import mongoose from "mongoose";

const SiteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "main",
      unique: true,
      required: true,
    },
    clubName: {
      type: String,
      default: "CSTU Computer & Programming Club",
      trim: true,
    },
    tagline: {
      type: String,
      default: "Code • Learn • Build • Lead",
      trim: true,
    },
    clubDescription: {
      type: String,
      default:
        "The official hub for competitive programmers, software developers, and tech innovators at Chandpur Science and Technology University.",
    },
    email: {
      type: String,
      default: "cpc@org.cstu.ac.bd",
      trim: true,
      lowercase: true,
    },
    facebookUrl: {
      type: String,
      default: "https://www.facebook.com/share/1Dte5ctzFB/",
    },
    universityUrl: {
      type: String,
      default: "https://cstu.ac.bd/pages/cstu-computer-and-programming-club",
    },
    constitutionUrl: {
      type: String,
      default: "https://drive.google.com/file/d/1BQzvrV79zSwGQtjq3doPpi5-jXqdmh4m",
    },
    copyrightText: {
      type: String,
      default: "© 2026 CSTU Computer & Programming Club | All Rights Reserved",
    },
    heroTitle: {
      type: String,
      default: "Code • Learn • Build • Lead",
    },
    heroSubtitle: {
      type: String,
      default:
        "The official hub for competitive programmers, software developers, and tech innovators at Chandpur Science and Technology University.",
    },
    membershipCtaText: {
      type: String,
      default: "Apply for Club Membership",
    },
    membershipCtaUrl: {
      type: String,
      default: "/join",
    },
    constitutionCtaText: {
      type: String,
      default: "Club Constitution",
    },
    statistics: {
      type: [
        new mongoose.Schema(
          {
            label: { type: String, required: true, trim: true },
            value: { type: String, required: true, trim: true },
            icon: {
              type: String,
              enum: ["Users", "Trophy", "Zap", "Award"],
              default: "Users",
            },
            usesMemberCount: { type: Boolean, default: false },
          },
          { _id: false }
        ),
      ],
      default: [
        { label: "Active Members", value: "120+", icon: "Users", usesMemberCount: true },
        { label: "Contests Conducted", value: "25+", icon: "Trophy" },
        { label: "Workshops & Events", value: "40+", icon: "Zap" },
        { label: "Department Support", value: "CSE & ICT", icon: "Award" },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", SiteSettingsSchema);
