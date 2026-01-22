// Main NutritionCatalog Component
import { useEffect, useState } from "react";
import MealCard from "./MealCard.jsx";
import MealDetailModal from "./MealDetail.jsx";
import { useNutrition } from "../store/NutritionContext.jsx";
import Sidebar from "../../../layout/Sidebar"; // on dois remonté trois fichiers 


export default function NutritionCatalog({ userId , limit = 4 }) {
  if (!userId) return null; 
  const { 
    loadRecommendations, 
    loadMealDetails, 
    loading 
  } = useNutrition();
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // 🔥 Utiliser le context (avec cache automatique)
        const data = await loadRecommendations(userId, limit);
        setMeals(data);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommended meals.");
      }
    };

    fetchRecommendations();
  }, [userId, limit, loadRecommendations]);

  const handleViewDetails = async (meal) => {
    setLoadingDetail(true);
    try {
      // 🔥 Utiliser le context (avec cache automatique)
      const detailData = await loadMealDetails(userId, meal.idMeal || meal.id);
      setSelectedMeal(detailData);
    } catch (err) {
      console.error("Error fetching meal details:", err);
      alert("Failed to load meal details. Please try again.");
    } finally {
      setLoadingDetail(false);
    }
  };

  // ✅ CORRECTION: Utiliser isLoadingRecommendations au lieu de loading
  const isLoadingRecommendations = loading[`recommendations_${userId}_${limit}`];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a]">
      <Sidebar 
        active="nutrition"
        onLogout={() => {
          localStorage.removeItem("token");
          console.log("logout");
        }}
      />
      {/* 🎨 Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Header avec Navigation */}
        <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
  
                <div>
                  <h1 className="text-4xl font-bold text-white">NUTRITION CATALOG</h1>
                  <p className="text-gray-500 text-sm">Personalized Meal Recommendations</p>
                </div>
              </div>
              
              <button 
                onClick={() => window.location.href = '/myprograms'}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-lime-400 hover:text-lime-300 rounded-xl font-semibold transition-all border border-gray-700 hover:border-lime-400/30"
              >
                <span>My Programs</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-8 py-12">

            {/* Loading State */}
            {isLoadingRecommendations && (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-gray-800 border-t-lime-400 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-400 text-base mt-6 font-medium">Loading your personalized meals...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoadingRecommendations && (
              <div className="bg-red-900/20 border-2 border-red-500/50 rounded-2xl p-8 text-center backdrop-blur-sm">
                <div className="text-5xl mb-4">⚠️</div>
                <p className="text-red-400 text-lg font-semibold">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoadingRecommendations && !error && meals.length === 0 && (
              <div className="text-center py-32">
                <div className="text-8xl mb-6">🍽️</div>
                <p className="text-gray-300 text-2xl font-semibold mb-2">No Meals Available</p>
                <p className="text-gray-500 text-base">Check back later for personalized recommendations</p>
              </div>
            )}

            {/* Meals Grid */}
            {!isLoadingRecommendations && !error && meals.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                  {meals.map((meal) => (
                    <MealCard
                      key={meal.idMeal || meal.id}
                      meal={meal}
                      onClick={() => handleViewDetails(meal)}
                    />
                  ))}
                </div>

                {/* 🎯 Action Button - CENTRÉ */}
<div className="flex justify-center items-center py-12 border-t border-gray-800">
  <button 
    onClick={() => {
      // Message d'information générale
      const hasConfirmed = window.confirm(
        "⚠️ IMPORTANT\n\n" +
        "If you already have an active nutrition plan, creating a new one will automatically end it.\n\n" +
        "Do you want to continue?"
      );
      
      if (hasConfirmed) {
        window.location.href = '/create-nutrition-plan';
      }
    }}
    className="group relative px-12 py-5 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-500 hover:to-lime-600 text-gray-900 font-black text-xl uppercase tracking-wider rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-lime-500/40 transform hover:scale-105 hover:-translate-y-1"
  >
    <span className="relative z-10 flex items-center gap-3">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
      </svg>
      Create Custom Plan
      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
      </svg>
    </span>
  
                    
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Detail Modal */}
      {selectedMeal && (
        <MealDetailModal
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
        />
      )}

      {/* Loading Overlay for Detail */}
      {loadingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 border-4 border-gray-700 border-t-lime-400 rounded-full animate-spin"></div>
            <p className="text-gray-300 text-base mt-6 font-medium">Loading meal details...</p>
          </div>
        </div>
      )}
    </div>
  );
}