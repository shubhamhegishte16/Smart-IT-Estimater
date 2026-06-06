import { Routes, Route, useNavigate } from "react-router-dom";

import BeaconLanding from "./pages/BeaconLanding";

import Login from "./pages/admin/Login";
import Signup from "./pages/admin/Signup";

import Dashboard from "./pages/admin/Dashboard";
import Features from "./pages/admin/Features";
import ProjectTypes from "./pages/admin/ProjectTypes";
import Estimations from "./pages/admin/Estimations";
import Settings from "./pages/admin/Settings";
import Pricing from "./pages/admin/Pricing";

import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import ClientRoute from "./components/ClientRoute.jsx";

/* ✅ ADD THESE TWO IMPORTS */
import EstimationPage from "./pages/main/Estimation";
import ResultsPage from "./pages/main/Results.jsx";

function LandingWrapper() {
  const navigate = useNavigate();

  return (
    <BeaconLanding
      onEnterApp={() => navigate("/login")}
    />
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingWrapper />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/features" element={<Features />} />
      <Route path="/admin/project-types" element={<ProjectTypes />} />
      <Route path="/admin/estimations" element={<Estimations />} />
      <Route path="/admin/settings" element={<Settings />} />
      <Route path="/admin/pricing" element={<Pricing />} />

      {/* ✅ NEW ROUTES ADDED */}
      <Route path="/estimations" element={<EstimationPage />} />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  );
}

export default App;