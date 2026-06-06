import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "Core",
    },

    cost: {
      type: Number,
      required: true,
    },

    weeks: {
      type: Number,
      default: 1,
    },

    complexity: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Feature", featureSchema);