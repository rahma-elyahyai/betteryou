import React, { useEffect, useState } from "react";

// MealCard Component
export default function MealCard({ meal , onClick }) {
  if (!meal) return null;

  const {
    mealName,
    description,
    imageUrl,
    mealType,
    goal,
    foodPreferences,
    calories,
    proteins,
    proteines,
    carbs,
    fats
  } = meal;

    // Handle both "proteines" and "proteins" from backend
      const proteinValue = proteines || proteins;

  return (
    <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-lime-500/20 transition-all duration-500 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={
            imageUrl ||
            "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500"
          }
          alt={mealName}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-80" />
        
        {/* Meal Type Badge */}
        {mealType && (
          <div className="absolute top-4 right-4 bg-lime-400 text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
            {mealType}
          </div>
        )}

        {/* Goal Badge */}
        {goal && (
          <div className="absolute top-4 left-4 bg-purple-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold">
            {goal}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-white font-bold text-xl mb-3 group-hover:text-lime-400 transition-colors duration-300">
          {mealName}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {description || "A delicious and nutritious meal designed to help you reach your fitness goals."}
        </p>

        {/* Macro Nutrients */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {calories && (
            <div className="text-center">
              <div className="text-lime-400 font-bold text-lg">{calories}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wide">Cal</div>
            </div>
          )}
          {proteinValue && (
            <div className="text-center">
              <div className="text-lime-400 font-bold text-lg">{proteinValue}g</div>
              <div className="text-gray-500 text-xs uppercase tracking-wide">Protein</div>
            </div>
          )}
          {carbs && (
            <div className="text-center">
              <div className="text-lime-400 font-bold text-lg">{carbs}g</div>
              <div className="text-gray-500 text-xs uppercase tracking-wide">Carbs</div>
            </div>
          )}
          {fats && (
            <div className="text-center">
              <div className="text-lime-400 font-bold text-lg">{fats}g</div>
              <div className="text-gray-500 text-xs uppercase tracking-wide">Fats</div>
            </div>
          )}
        </div>

        

        {/* Action Button */}
        <button 
        onClick={onClick}
         className="mt-4 w-full bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-lime-500/50 transform hover:scale-105">
          View Details
        </button>
      </div>
    </div>
  );
}