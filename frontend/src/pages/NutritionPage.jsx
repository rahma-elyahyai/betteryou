import React, { useEffect, useState, Suspense } from "react";
import NutritionCatalog from "./../features/Nutrition/components/NutritionCatalog";
//import { useAuth } from "../features/Nutrition/store/AuthContext.jsx";
import { getCurrentUserId } from "@/utils/authUtils.js";
//const userId = await getCurrentUserId(); 

export default function NutritionPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userId = await getCurrentUserId();
        setUser(userId);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // 🔥 CORRECTION ESSENTIELLE : Vérifier user ET loadingUser
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-lime-400 rounded-full animate-spin"></div>
          <p className="mt-4 text-lime-400 font-semibold">Loading nutrition...</p>
        </div>
      </div>
    );
  }

  // 🔥 Vérification supplémentaire de idUser
  if (!user) {
    console.error("User object exists but idUser is missing:", user); //  Debug
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-semibold text-xl mb-4"> User ID not found</p>
          <p className="text-gray-400 mb-6">Please try logging in again</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-lime-400 text-gray-900 font-semibold rounded-xl hover:bg-lime-500 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  console.log("Rendering NutritionCatalog with userId:", user); // Debug

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-lime-400 rounded-full animate-spin"></div>
          <p className="mt-4 text-lime-400 font-semibold">Loading catalog...</p>
        </div>
      </div>
    }>
      <NutritionCatalog userId={user} limit={4} />
    </Suspense>
  );
}
