import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    cost: {
        type: Number,
        required: true
    },

    days: {
        type: Number,
        required: true
    },

    complexity: {
        type: Number,
        required: true
    }
});

export default mongoose.model("Feature", featureSchema, "Features");