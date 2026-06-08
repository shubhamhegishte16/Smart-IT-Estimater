// routes/userRoutes.js
import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import { 
    getUserProfile, 
    updateUserProfile, 
    getUserSettings, 
    updateUserSettings,
    changePassword,
    getAllUsers,
    deleteUser
} from "../controllers/userController.js";

const router = express.Router();

// Public routes (no auth required for testing)
router.get("/profile/:email", getUserProfile);
router.put("/profile/:email", updateUserProfile);
router.get("/settings/:email", getUserSettings);
router.put("/settings/:email", updateUserSettings);
router.post("/change-password", changePassword);

// Admin only routes
router.get("/all", getAllUsers);
router.delete("/:id", deleteUser);

export default router;