import express from "express";
import { getDashboardOverview, getClientDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/overview", getDashboardOverview);
router.get("/client/:clientId", getClientDashboard);

export default router;