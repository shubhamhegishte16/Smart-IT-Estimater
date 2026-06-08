import express from "express";
import {
    getProjectTypes,
    getProjectTypeById,
    createProjectType,
    updateProjectType,
    deleteProjectType
} from "../controllers/projectTypeController.js";

const router = express.Router();

router.get("/", getProjectTypes);
router.get("/:id", getProjectTypeById);
router.post("/", createProjectType);
router.put("/:id", updateProjectType);
router.delete("/:id", deleteProjectType);

export default router;