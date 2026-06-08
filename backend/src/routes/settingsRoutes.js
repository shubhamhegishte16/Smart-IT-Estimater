// routes/settingsRoutes.js
import express from "express";
import { 
    getSettings, 
    updateSettings,
    updateCompanyInfo,
    updateEstimationRules
} from "../controllers/settingsController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only routes
router.get("/", authMiddleware, adminMiddleware, getSettings);
router.put("/", authMiddleware, adminMiddleware, updateSettings);
router.put("/company", authMiddleware, adminMiddleware, updateCompanyInfo);
router.put("/estimation-rules", authMiddleware, adminMiddleware, updateEstimationRules);

export default router;