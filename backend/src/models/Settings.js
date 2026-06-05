import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({

    companyName: {
        type: String,
        default: "EstiMo Solutions"
    },

    companyEmail: {
        type: String,
        default: "info@estimo.com"
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
        default: "INR"
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
    }

}, {
    timestamps: true
});

export default mongoose.model(
    "Setting",
    settingsSchema,
    "Settings"
);