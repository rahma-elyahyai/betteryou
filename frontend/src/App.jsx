// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AiNutritionGeneratorPage from './pages/AiNutritionGeneratorPage';
import AiNutritionGeneratingPage from './pages/AiNutritionGeneratingPage';
import AiNutritionResultPage from './pages/AiNutritionResultPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Page d’accueil marketing */}
        <Route path="/" element={<LandingPage />} />

        {/* Page profile avec sidebar (tu as déjà ce composant) */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/ai-nutrition" element={<AiNutritionGeneratorPage />} />
<Route path="/ai-nutrition/generating" element={<AiNutritionGeneratingPage />} />
<Route path="/ai-nutrition/result/:planId" element={<AiNutritionResultPage />} />
      </Routes>
    </Router>
  );
}
