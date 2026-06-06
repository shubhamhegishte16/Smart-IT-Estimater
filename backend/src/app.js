import express from 'express';
import cors from 'cors';
import featureRoutes from "./routes/featureRoutes.js";
import ProjectType from './routes/projectTypeRoutes.js';
import dashboardRoutes from './routes/dashbooardRoutes.js';
import authRoutes from './routes/authRoutes.js';
import estimationRoutes from "./routes/estimationRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);
app.use(express.json());

app.use("/api/features", featureRoutes);
app.use("/api/project-types", ProjectType);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/estimations", estimationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

export default app;