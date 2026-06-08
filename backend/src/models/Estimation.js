import mongoose from "mongoose";

const estimationSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    clientEmail: {
        type: String,
        required: true
    },
    projectType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProjectType",
        required: true
    },
    features: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feature"
    }],
    totalCost: {
        type: Number,
        default: 0
    },
    totalDays: {
        type: Number,
        default: 0
    },
    complexity: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },
    recommendedStack: [{
        type: String
    }],
    status: {
        type: String,
        enum: ["draft", "pending", "approved", "rejected", "completed"],
        default: "draft"
    },
    lastReportGenerated: {
        type: Date
    },
    reportFormat: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model("Estimation", estimationSchema, "Estimations");