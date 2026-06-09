import express from 'express';
import cors from 'cors';
import featureRoutes from "./routes/featureRoutes.js";
import ProjectType from './routes/projectTypeRoutes.js';
import dashboardRoutes from './routes/dashbooardRoutes.js';
import authRoutes from './routes/authRoutes.js';
import estimationRoutes from "./routes/estimationRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const allowedOrigins = (
  process.env.CLIENT_ORIGIN ||
  "http://localhost:5173,https://beacon-smart-estimation.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/features", featureRoutes);
app.use("/api/project-types", ProjectType);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/estimations", estimationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend healthy",
    uptime: process.uptime(),
  });
});

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

export default app;
