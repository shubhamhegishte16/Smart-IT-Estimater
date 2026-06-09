import express from "express";
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

// User routes
router.get("/profile/:email", getUserProfile);
router.put("/profile/:email", updateUserProfile);
router.get("/settings/:email", getUserSettings);
router.put("/settings/:email", updateUserSettings);
router.post("/change-password", changePassword);

// Admin routes
router.get("/all", getAllUsers);
router.delete("/:id", deleteUser);

export default router;