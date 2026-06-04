import express from "express";

import {
  createProjectType,
  getProjectType,
  updateProjectType,
  deleteProjectType
} from "../controllers/projectTypeController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProjectType);

router.post("/", authMiddleware, createProjectType);

router.put("/:id", authMiddleware, updateProjectType);

router.delete("/:id", authMiddleware, deleteProjectType);

export default router;