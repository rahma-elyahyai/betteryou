import { Routes, Route } from "react-router-dom";

import DashboardPage from "@/components/dashboard/DashboardPage";


export default function DashboardRoutes() {
  return (
    <Routes>
      {/* route principale */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* sous-routes */}
      <Route path="/dashboard/stats" element={<DashboardStatsPage />} />
      <Route path="/dashboard/nutrition" element={<DashboardNutritionPage />} />
    </Routes>
  );
}
