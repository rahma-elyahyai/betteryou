// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Page d’accueil marketing */}
        <Route path="/" element={<LandingPage />} />

        {/* Page profile avec sidebar (tu as déjà ce composant) */}
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}
