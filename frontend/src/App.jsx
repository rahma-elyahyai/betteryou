// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

// 🔐 Auth pages
import Login from "./components/auth/Login.jsx";
import RegisterWizard from "./components/auth/RegisterWizard.jsx";
import Welcome from "./components/auth/Welcome.jsx";

// 🔐 Guard
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

export default function App() {
  return (
    <Router>
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
      </Routes>
    </Router>
  );
}
