import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    getEstimations,
    getEstimationById,
    getEstimationsByClient,
    createEstimation,
    updateEstimation,
    deleteEstimation,
    generateEstimationReport
} from "../controllers/estimateController.js";

const router = express.Router();

// Routes (with optional auth)
router.get("/", getEstimations);
router.get("/client/:email", getEstimationsByClient);
router.get("/:id", getEstimationById);
router.post("/", createEstimation);
router.put("/:id", updateEstimation);
router.delete("/:id", deleteEstimation);
router.post("/:id/generate-report", generateEstimationReport);

export default router;