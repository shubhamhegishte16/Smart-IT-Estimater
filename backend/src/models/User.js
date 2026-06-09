import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "client"],
      default: "client",
    },
    company: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    // Settings fields
    website: {
      type: String,
      default: ""
    },
    industry: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      default: ""
    },
    preferredCurrency: {
      type: String,
      default: "USD"
    },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      approvals: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      productUpdates: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    regional: {
      currency: { type: String, default: "USD" },
      timezone: { type: String, default: "UTC +5:30" },
      language: { type: String, default: "English" },
      dateFormat: { type: String, default: "DD/MM/YYYY" }
    },
    preferences: {
      defaultProjectType: { type: String, default: "" },
      defaultTechStack: { type: String, default: "" },
      autoSave: { type: Boolean, default: true },
      autoGeneratePDF: { type: Boolean, default: false }
    },
    twoFactor: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema, "Users");

export default User;