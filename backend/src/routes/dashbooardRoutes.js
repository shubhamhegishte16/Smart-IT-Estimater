import express from "express";
import { 
  getDashboardOverview,
  getClientDashboard  // Make sure this is imported
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/overview", getDashboardOverview);
router.get("/client/:clientId", getClientDashboard);  // This route must exist

export default router;