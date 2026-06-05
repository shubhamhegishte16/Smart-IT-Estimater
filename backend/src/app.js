import express from 'express';
import cors from 'cors';
import featureRoutes from "./routes/featureRoutes.js";
import ProjectType from './routes/projectTypeRoutes.js';
import dashboardRoutes from './routes/dashbooardRoutes.js';
import authRoutes from './routes/authRoutes.js';
import estimationRoutes from "./routes/estimationRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/features", featureRoutes);
app.use("/api/project-types", ProjectType);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/estimations", estimationRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

export default app;