import connectToDatabase from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export const DEFAULT_SITE_SETTINGS = {
  clubName: "CSTU Computer & Programming Club",
  tagline: "Code • Learn • Build • Lead",
  clubDescription:
    "The official hub for competitive programmers, software developers, and tech innovators at Chandpur Science and Technology University.",
  email: "cpc@org.cstu.ac.bd",
  facebookUrl: "https://www.facebook.com/share/1Dte5ctzFB/",
  universityUrl: "https://cstu.ac.bd/pages/cstu-computer-and-programming-club",
  constitutionUrl: "https://drive.google.com/file/d/1BQzvrV79zSwGQtjq3doPpi5-jXqdmh4m",
  copyrightText: "© 2026 CSTU Computer & Programming Club | All Rights Reserved",
  heroTitle: "Code • Learn • Build • Lead",
  heroSubtitle:
    "The official hub for competitive programmers, software developers, and tech innovators at Chandpur Science and Technology University.",
  membershipCtaText: "Apply for Club Membership",
  membershipCtaUrl: "/join",
  constitutionCtaText: "Club Constitution",
  statistics: [
    { label: "Active Members", value: "120+", icon: "Users", usesMemberCount: true },
    { label: "Contests Conducted", value: "25+", icon: "Trophy" },
    { label: "Workshops & Events", value: "40+", icon: "Zap" },
    { label: "Department Support", value: "CSE & ICT", icon: "Award" },
  ],
};

export async function getSiteSettings() {
  await connectToDatabase();
  const storedSettings = await SiteSettings.findOne({ key: "main" }).lean();

  return {
    ...DEFAULT_SITE_SETTINGS,
    ...storedSettings,
    statistics: storedSettings?.statistics ?? DEFAULT_SITE_SETTINGS.statistics,
  };
}
