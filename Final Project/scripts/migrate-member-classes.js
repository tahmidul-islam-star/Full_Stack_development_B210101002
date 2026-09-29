import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { isExecutiveDesignation } from "../src/lib/memberClasses.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").trim();
      if (key && value && !process.env[key.trim()]) process.env[key.trim()] = value;
    }
  });
}

const MONGODB_URL =
  process.env.MONGODB_URL || process.env.MONGODB_URI || "mongodb://localhost:27017/cpc";

const userCollection = mongoose.connection.collection("users");
const applicationCollection = mongoose.connection.collection("joinapplications");

async function migrateCollection(collection, label) {
  const records = await collection.find({}).toArray();
  let executiveCount = 0;
  let defaultCount = 0;

  for (const record of records) {
    const isExecutive = isExecutiveDesignation(record.designation);

    if (isExecutive && record.memberClass !== "EXECUTIVE_MEMBER") {
      await collection.updateOne({ _id: record._id }, { $set: { memberClass: "EXECUTIVE_MEMBER" } });
      executiveCount += 1;
    }
  }

  const defaultResult = await collection.updateMany(
    { memberClass: { $exists: false } },
    { $set: { memberClass: "MEMBER" } }
  );
  defaultCount = defaultResult.modifiedCount;

  console.log(
    `${label}: ${executiveCount} executive, ${defaultCount} default member records updated.`
  );
}

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URL);
    await migrateCollection(userCollection, "Users");
    await migrateCollection(applicationCollection, "Join applications");
  } catch (error) {
    console.error("Member class migration failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

migrate();