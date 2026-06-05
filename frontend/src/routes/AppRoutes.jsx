import { Routes, Route, useNavigate } from "react-router-dom";

import BeaconLanding from "../pages/BeaconLanding";
import Login from "../pages/admin/Login";
import Signup from "../pages/admin/Signup";
import Dashboard from "../pages/admin/Dashboard";
import Features from "../pages/admin/Features";
import Pricing from "../pages/admin/Pricing";
import ProjectTypes from "../pages/admin/ProjectTypes";
import Estimations from "../pages/admin/Estimations";
import Settings from "../pages/admin/Settings";

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={<BeaconLanding onEnterApp={() => navigate("/admin/login")} />}
      />
      <Route
        path="/landing"
        element={<BeaconLanding onEnterApp={() => navigate("/admin/login")} />}
      />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/signup" element={<Signup />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/features" element={<Features />} />
      <Route path="/admin/pricing" element={<Pricing />} />
      <Route path="/admin/project-types" element={<ProjectTypes />} />
      <Route path="/admin/estimations" element={<Estimations />} />
      <Route path="/admin/settings" element={<Settings />} />
    </Routes>
  );
}

export default AppRoutes;
