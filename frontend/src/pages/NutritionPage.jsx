import React from "react";
import NutritionCatalog from "../features/Nutrition/components/NutritionCatalog";
import { useAuth } from "../features/Nutrition/store/AuthContext.jsx";

export default function NutritionPage() {
  const { user, loadingUser } = useAuth();

  if (loadingUser) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">Not logged in</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <NutritionCatalog userId={user.idUser} limit={4} />
    </div>
  );
}
