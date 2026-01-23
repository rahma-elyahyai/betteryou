// src/components/nutritionAi/MealCard.jsx
import React, { useMemo } from "react";

function slotLabel(slot) {
  const s = (slot || "").toUpperCase();
  if (s === "BREAKFAST") return "Breakfast";
  if (s === "LUNCH") return "Lunch";
  if (s === "DINNER") return "Dinner";
  if (s === "SNACK") return "Snack";
  return slot || "Meal";
}

export default function MealCard({ meal }) {
  const itemsArray = meal?.items || [];

  return (
    <div className="group rounded-[2rem] border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-all duration-500 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-[#D6F93D]/0 group-hover:bg-[#D6F93D]/40 transition-all" />

      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
              {slotLabel(meal?.mealSlot)}
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">{meal?.mealName || "Nutritional Unit"}</h3>
            {meal?.description && <p className="text-white/50 text-base leading-relaxed max-w-lg font-medium italic">"{meal.description}"</p>}
          </div>
          <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl grayscale group-hover:grayscale-0 transition-all">
            {meal?.mealSlot === "BREAKFAST" ? "🍳" : meal?.mealSlot === "LUNCH" ? "🍱" : meal?.mealSlot === "DINNER" ? "🍽️" : "🍏"}
          </div>
        </div>

        {itemsArray.length > 0 && (
          <div className="space-y-4">
            <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
            <div className="flex flex-wrap gap-2 text-sm">
              {itemsArray.map((it, idx) => (
                <div key={idx} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-white/80 font-bold flex items-center gap-2">
                  <span className="text-[#D6F93D]">•</span>
                  {it.foodName}
                  {it.quantityGrams && <span className="text-white/20 font-black text-[10px]">{it.quantityGrams}G</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(meal?.preparationSteps) && meal.preparationSteps.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
              Preparation Protocol
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 list-none">
              {meal.preparationSteps.map((s, i) => (
                <li key={i} className="flex gap-4 text-sm text-white/60 leading-relaxed font-medium">
                  <span className="text-[#D6F93D] font-black tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
