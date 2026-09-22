import mongoose from "mongoose";

const JoinApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      default: "Computer Science & Engineering",
    },
    session: {
      type: String,
      required: [true, "Session is required"],
      default: "2022-23",
    },
    codeforcesHandle: {
      type: String,
      trim: true,
      default: "",
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      trim: true,
    },
    transactionNumber: {
      type: String,
      required: [true, "Transaction number is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

if (mongoose.models.JoinApplication) {
  delete mongoose.models.JoinApplication;
}

export default mongoose.model("JoinApplication", JoinApplicationSchema);
