// models/Settings.js
import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    companyName: {
        type: String,
        default: ""
    },
    companyEmail: {
        type: String,
        default: ""
    },
    companyPhone: {
        type: String,
        default: ""
    },
    companyAddress: {
        type: String,
        default: ""
    },
    currency: {
        type: String,
        enum: ["INR", "USD", "EUR", "GBP"],
        default: "INR"
    },
    currencySymbol: {
        type: String,
        default: "₹"
    },
    quotationPrefix: {
        type: String,
        default: "EST"
    },
    lowComplexityLimit: {
        type: Number,
        default: 50000
    },
    mediumComplexityLimit: {
        type: Number,
        default: 100000
    },
    highComplexityLimit: {
        type: Number,
        default: 200000
    },
    taxRate: {
        type: Number,
        default: 18
    },
    enableTax: {
        type: Boolean,
        default: true
    },
    enableNotifications: {
        type: Boolean,
        default: true
    },
    smtpHost: {
        type: String,
        default: ""
    },
    smtpPort: {
        type: Number,
        default: 587
    },
    smtpUser: {
        type: String,
        default: ""
    },
    smtpPass: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

// Singleton pattern - only one settings document
settingsSchema.statics.getInstance = async function() {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

export default mongoose.model("Settings", settingsSchema, "Settings");