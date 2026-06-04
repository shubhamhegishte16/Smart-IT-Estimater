import mongoose from "mongoose";

const projectTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: String,

  baseCost: {
    type: Number,
    required: true
  },

  baseDays: {
    type: Number,
    required: true
  }
});

export default mongoose.model(
  "ProjectType",
  projectTypeSchema,
  "ProjectTypes"
);