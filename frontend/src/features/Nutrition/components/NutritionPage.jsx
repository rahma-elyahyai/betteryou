import React from "react";
import NutritionCatalog from "./NutritionCatalog";

export default function NutritionPage() {
  // Plus tard tu prendras l'id de l'utilisateur connecté depuis le contexte / auth
  const userId = 2;

  return (
    <div className="min-h-screen bg-gray-50">
      <NutritionCatalog userId={userId} limit={4} />
    </div>
  );
}
