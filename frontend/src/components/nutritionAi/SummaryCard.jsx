// src/components/nutritionAi/SummaryCard.jsx
import React, { useMemo } from "react";

export default function SummaryCard({ day }) {
  const summary = useMemo(() => {
    const meals = day?.meals || [];
    const totalItems = meals.reduce((acc, m) => acc + (m.items?.length || 0), 0);
    return { mealsCount: meals.length, totalItems };
  }, [day]);

  return (
    <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-20 bg-[#D6F93D]/20 rounded-full" />

      <h4 className="text-white font-bold text-lg tracking-tight mb-8">Daily Analytics</h4>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5">
          <div className="text-white/40 text-[10px] font-black uppercase tracking-widest">Planned Meals</div>
          <div className="text-[#D6F93D] text-3xl font-black tabular-nums">{summary.mealsCount}</div>
        </div>

        <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5">
          <div className="text-white/40 text-[10px] font-black uppercase tracking-widest">Ingredient Vector</div>
          <div className="text-white text-3xl font-black tabular-nums">{summary.totalItems}</div>
        </div>

        <div className="flex items-center justify-between p-5 rounded-2xl bg-[#D6F93D]/10 border border-[#D6F93D]/20 mt-10">
          <div className="text-[#D6F93D]/60 text-[10px] font-black uppercase tracking-widest">Active Focus</div>
          <div className="text-white text-lg font-black tracking-tight">{day?.dayOfWeek || "Not Set"}</div>
        </div>
      </div>
    </div>
  );
}
