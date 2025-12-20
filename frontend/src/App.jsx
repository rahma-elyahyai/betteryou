// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NutritionPage from "./features/Nutrition/components/NutritionPage";
import MyPrograms from "./features/Nutrition/components/MyPrograms";
import CreateNutritionPlan from "./features/Nutrition/components/CreateNutritionPlan";
import AddMeals from "./features/Nutrition/components/AddMeals";
import { NutritionProvider } from "./features/Nutrition/store/NutritionContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

// 🔐 Auth pages
import Login from "./components/auth/Login.jsx";
import RegisterWizard from "./components/auth/RegisterWizard.jsx";
import Welcome from "./components/auth/Welcome.jsx";

// 🔐 Guard
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
    <NutritionProvider>
      <Routes>
        {/* Page d’accueil marketing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterWizard />} />
        <Route path="/welcome" element={<Welcome />} />

        {/* Page protégée */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* PAGE NUTRITION */}
        <Route path="/nutrition" element={<NutritionPage />} />

        <Route path="*" element={<div>404 Not Found</div>} />

        <Route path="/myprograms" element={<MyPrograms/>} />


        <Route path="/create-nutrition-plan" element={<CreateNutritionPlan />} />
        <Route path="/nutrition-plans/:planId/add-meals" element={<AddMeals />} />

      </Routes>
      </NutritionProvider>
    </BrowserRouter>
  );
}

export default App;
