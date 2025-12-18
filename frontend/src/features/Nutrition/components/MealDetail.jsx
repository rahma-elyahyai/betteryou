import React, { useEffect, useState } from "react";

// MealDetailModal Component
export default function MealDetailModal({ meal, onClose }) {
  if (!meal) return null;


  // ✅ Helper functions pour parser les données JSON
  const formatFoodPreferences = (preferences) => {
    if (!preferences) return "N/A";
    
    // Si c'est déjà un array
    if (Array.isArray(preferences)) return preferences.join(", ");
    
    // Si c'est une string, essayer de parser
    if (typeof preferences === "string") {
      try {
        const parsed = JSON.parse(preferences);
        return Array.isArray(parsed) ? parsed.join(", ") : preferences;
      } catch {
        return preferences; // Retourner la string originale si parsing échoue
      }
    }
    
    return "N/A";
  };

  const parsePreparationSteps = (steps) => {
    if (!steps) return [];
    
    // Si c'est déjà un array
    if (Array.isArray(steps)) return steps;
    
    // Si c'est une string JSON, parser
    if (typeof steps === "string") {
      try {
        const parsed = JSON.parse(steps);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // Si le parsing échoue, retourner un array avec la string
        return [steps];
      }
    }
    
    return [];
  };

  // Parser les steps
  const preparationSteps = parsePreparationSteps(meal.preparationSteps);


  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
      {/* Container avec padding pour l'espace */}
      <div className="min-h-screen flex items-center justify-center p-4">
        
        <div className="relative w-full max-w-5xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl my-8">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="sticky top-6 left-full -ml-6 z-10 bg-lime-400 hover:bg-lime-500 text-gray-900 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-lime-400 text-4xl font-bold mb-2">DETAIL</h2>
            </div>

          {/* Image */}
          <div className="relative h-80 rounded-xl overflow-hidden mb-8">
            <img
              src={meal.imageUrl || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"}
              alt={meal.mealName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          </div>

          {/* Meal Overview */}
          <div className="mb-8">
            <h3 className="text-lime-400 text-2xl font-bold mb-4">Meal Overview</h3>
            <h4 className="text-white text-xl font-semibold mb-3">{meal.mealName}</h4>
            <p className="text-gray-400 leading-relaxed mb-4">
              {meal.description || "A nutritious meal designed to help you achieve your fitness goals."}
            </p>

            {/* Meal Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-gray-500 text-xs uppercase mb-1">Type</div>
                <div className="text-white font-semibold">{meal.mealType || "N/A"}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-gray-500 text-xs uppercase mb-1">Goal</div>
                <div className="text-white font-semibold">{meal.goal || "N/A"}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-gray-500 text-xs uppercase mb-1">Calories</div>
                <div className="text-lime-400 font-bold text-xl">{meal.calories || 0}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-gray-500 text-xs uppercase mb-1">Preferences</div>
                <div className="text-white font-semibold text-sm">
                    {/* Food Preferences - Utiliser la fonction helper */}
                    <div className="text-white font-semibold text-sm">
                        {formatFoodPreferences(meal.foodPreferences)}
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Macros */}
          <div className="mb-8">
            <h3 className="text-lime-400 text-2xl font-bold mb-4">Nutritional Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-500/30 rounded-xl p-6 text-center">
                <div className="text-lime-400 text-3xl font-bold mb-1">{meal.proteins || 0}g</div>
                <div className="text-gray-400 text-sm uppercase">Protein</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-500/30 rounded-xl p-6 text-center">
                <div className="text-lime-400 text-3xl font-bold mb-1">{meal.carbs || 0}g</div>
                <div className="text-gray-400 text-sm uppercase">Carbs</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-500/30 rounded-xl p-6 text-center">
                <div className="text-lime-400 text-3xl font-bold mb-1">{meal.fats || 0}g</div>
                <div className="text-gray-400 text-sm uppercase">Fats</div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          {meal.ingredients && meal.ingredients.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lime-400 text-2xl font-bold mb-4">Ingredients</h3>
              <div className="space-y-3">
                {meal.ingredients.map((ingredient, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="text-white font-semibold">{ingredient.foodName}</div>
                      {ingredient.description && (
                        <div className="text-gray-500 text-sm">{ingredient.description}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lime-400 font-bold">{(ingredient.quantity_grams ?? ingredient.quantityGrams ?? 0)}g</div>
                      <div className="text-gray-500 text-xs">
                        {ingredient.caloriesPer100g ?? ingredient.calories_per_100g  ?? 0} cal/100g
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

                {/* Preparation Steps - Utiliser le array parsé */}
      {preparationSteps.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lime-400 text-2xl font-bold mb-4">Step-by-Step Instructions</h3>
          <div className="space-y-4">
            {preparationSteps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-lime-400 text-gray-900 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 bg-gray-800/30 rounded-lg p-4">
                  <p className="text-gray-300 leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

          
        </div>
      </div>
    </div>
    </div>
  );
}
