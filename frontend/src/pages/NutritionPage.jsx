import React, { Suspense } from "react";
import NutritionCatalog from "./../features/Nutrition/components/NutritionCatalog";
import { useAuth } from "../features/Nutrition/store/AuthContext.jsx";

export default function NutritionPage() {
  const { user, loadingUser } = useAuth();

  // Afficher un loading skeleton pendant le chargement
  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Si pas d'utilisateur, rediriger ou afficher message
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access nutrition features.</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <NutritionCatalog userId={user.idUser} limit={4} />
    </Suspense>
  );
}