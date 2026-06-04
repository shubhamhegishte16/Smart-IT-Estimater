import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createFeature,
  getFeatures,
  updateFeature,
  deleteFeature
} from "../controllers/featureController.js";

const router = express.Router();

router.get("/", getFeatures);

router.post("/", authMiddleware, createFeature);

router.put("/:id", authMiddleware, updateFeature);

router.delete("/:id", authMiddleware, deleteFeature);

export default router;