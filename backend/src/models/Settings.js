import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    personal: {
        fullName: String,
        company: String,
        email: String,
        phone: String,
        website: String,
        industry: String,
        address: String,
    },
    notifications: {
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
    twoFactor: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model("Settings", settingsSchema);