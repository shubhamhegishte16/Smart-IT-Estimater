import express from "express";

import {
    createEstimation,
    getEstimations
}
from "../controllers/estimateController.js";

const router = express.Router();

router.post("/", createEstimation);

router.get("/", getEstimations);

export default router;