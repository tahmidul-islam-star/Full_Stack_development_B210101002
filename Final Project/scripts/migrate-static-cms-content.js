import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Advisor from "../src/models/Advisor.js";
import GalleryItem from "../src/models/GalleryItem.js";
import advisors from "../src/data/advisors.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const envPath = path.join(projectDirectory, ".env");
const galleryPath = path.join(projectDirectory, "src", "data", "gallery.json");

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  envConfig.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const separator = trimmed.indexOf("=");
    if (separator < 0) return;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (key && value && !process.env[key]) process.env[key] = value;
  });
}

const databaseUrl =
  process.env.MONGODB_URL ||
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/cpc";

async function migrate() {
  const galleryEntries = JSON.parse(fs.readFileSync(galleryPath, "utf8"));
  let advisorsAdded = 0;
  let galleryItemsAdded = 0;

  try {
    await mongoose.connect(databaseUrl);

    for (const [index, advisor] of advisors.entries()) {
      const exists = await Advisor.exists({ name: advisor.name });
      if (exists) continue;

      await Advisor.create({
        name: advisor.name,
        title: advisor.title,
        designation: advisor.designation,
        department: advisor.department || "",
        institution: advisor.institution,
        bio: advisor.bio,
        email: advisor.email || "",
        avatarUrl: advisor.imageUrl || "",
        displayOrder: index,
        isActive: true,
        isPublished: true,
      });
      advisorsAdded += 1;
    }

    for (const [index, item] of galleryEntries.entries()) {
      const exists = await GalleryItem.exists({ title: item.title });
      if (exists) continue;

      const imagePath = path.join(projectDirectory, "public", item.img.replace(/^\//, ""));
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Legacy gallery image is missing: ${item.img}`);
      }

      await GalleryItem.create({
        title: item.title,
        description: item.description,
        imageUrl: item.img,
        category: "ARCHIVE",
        displayOrder: index,
        isPublished: true,
      });
      galleryItemsAdded += 1;
    }

    console.log(
      `Static CMS content migration complete: ${advisorsAdded} advisors and ${galleryItemsAdded} gallery items added; existing matching records were preserved.`
    );
  } finally {
    await mongoose.disconnect();
  }
}

migrate().catch((error) => {
  console.error("Static CMS content migration failed:", error);
  process.exitCode = 1;
});
