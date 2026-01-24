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