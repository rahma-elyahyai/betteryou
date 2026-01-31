import { Routes, Route } from "react-router-dom";

import DashboardPage from "@/components/dashboard/DashboardPage";
import NutritionAiWizard from "@/pages/NutritionAiWizard.jsx";


export default function DashboardRoutes() {
  return (
    <Routes>
      {/* route principale */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* sous-routes */}
      <Route path="/dashboard/stats" element={<DashboardStatsPage />} />
      <Route path="/dashboard/nutrition" element={<DashboardNutritionPage />} />
      <Route path="/ai-nutrition" element={<NutritionAiWizard />} />
    </Routes>
  );
}
