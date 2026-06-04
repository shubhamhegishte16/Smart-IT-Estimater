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

    totalCost: Number,

    totalDays: Number,

    complexity: String

}, {
    timestamps: true
});

export default mongoose.model(
    "Estimation",
    estimationSchema
);