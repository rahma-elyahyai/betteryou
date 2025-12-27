// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { NutritionProvider } from "./features/Nutrition/store/NutritionContext";

// Pages publiques
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./components/auth/Login.jsx";
import RegisterWizard from "./components/auth/RegisterWizard.jsx";
import Welcome from "./components/auth/Welcome.jsx";

// Pages protégées
import ProfilePage from "./pages/ProfilePage.jsx";
import Dashboard from "@/components/dashboard/DashboardPage.jsx";
import NutritionPage from "./features/Nutrition/components/NutritionPage";
import MyPrograms from "./features/Nutrition/components/MyPrograms";
import CreateNutritionPlan from "./features/Nutrition/components/CreateNutritionPlan";
import AddMeals from "./features/Nutrition/components/AddMeals";

// Guard
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <NutritionProvider>
        <Routes>
          {/* 🌍 PUBLIC */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterWizard />} />
          <Route path="/welcome" element={<Welcome />} />

          {/* 🔐 TOUT CE QUI EST ICI EST PROTÉGÉ */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/nutrition" element={<NutritionPage />} />
            <Route path="/myprograms" element={<MyPrograms />} />
            <Route path="/create-nutrition-plan" element={<CreateNutritionPlan />} />
            <Route
              path="/nutrition-plans/:planId/add-meals"
              element={<AddMeals />}
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </NutritionProvider>
    </BrowserRouter>
  );
}

export default App;
