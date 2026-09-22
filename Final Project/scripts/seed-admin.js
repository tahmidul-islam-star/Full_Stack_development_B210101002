import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file manually if process.env is not populated
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").trim();
      if (key && value && !process.env[key.trim()]) {
        process.env[key.trim()] = value;
      }
    }
  });
}

const MONGODB_URL =
  process.env.MONGODB_URL ||
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/cpc";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "MEMBER"], default: "MEMBER" },
    studentId: { type: String, default: "" },
    department: { type: String, default: "Computer Science and Engineering" },
    session: { type: String, default: "2021-22" },
    designation: { type: String, default: "Executive Admin" },
    avatarUrl: { type: String, default: "" },
    phone: { type: String, default: "" },
    codeforcesHandle: { type: String, default: "" },
    vjudgeHandle: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seedAdmin() {
  console.log("🌱 Connecting to MongoDB database...");
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("✅ Connected to MongoDB successfully.");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@mail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    let adminUser = await User.findOne({ email: adminEmail.toLowerCase() });

    if (adminUser) {
      console.log(`ℹ️ Admin user (${adminEmail}) already exists. Updating credentials...`);
      adminUser.password = hashedPassword;
      adminUser.role = "ADMIN";
      adminUser.status = "ACTIVE";
      await adminUser.save();
      console.log("🔄 Admin user credentials updated!");
    } else {
      adminUser = await User.create({
        name: "Club System Admin",
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        role: "ADMIN",
        studentId: "ADMIN-001",
        department: "Computer Science and Engineering",
        session: "2021-22",
        designation: "Executive Admin",
        status: "ACTIVE",
      });
      console.log("✨ New Admin user created successfully!");
    }

    console.log("\n==============================================");
    console.log("🔑 ADMIN CREDENTIALS");
    console.log("==============================================");
    console.log(` Email    : ${adminEmail}`);
    console.log(` Password : ${adminPassword}`);
    console.log(` Role     : ADMIN`);
    console.log("==============================================\n");

  } catch (error) {
    console.error("❌ Error seeding admin credentials:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
}

seedAdmin();
