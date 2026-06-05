import express from "express";

import {
    createEstimation,
    getEstimations,
    getEstimationById,
    deleteEstimation
} from "../controllers/estimateController.js";

const router = express.Router();

router.post("/", createEstimation);

router.get("/", getEstimations);

router.get("/:id", getEstimationById);

router.delete("/:id", deleteEstimation);

export default router;