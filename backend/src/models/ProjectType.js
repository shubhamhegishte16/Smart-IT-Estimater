import mongoose from "mongoose";

const projectTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    baseCost: {
        type: Number,
        default: 0
    },
    baseDays: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model("ProjectType", projectTypeSchema, "ProjectTypes");