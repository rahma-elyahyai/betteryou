// src/components/nutritionAi/DayTabs.jsx
import React from "react";

export default function DayTabs({ days = [], activeDay, onChange }) {
  return (
    <div className="rounded-[2.5rem] border border-white/5 bg-white/5 p-4 overflow-hidden backdrop-blur-md">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
        {days.map((d) => {
          const isActive = d.dayOfWeek === activeDay;
          return (
            <button
              key={d.dayOfWeek}
              onClick={() => onChange(d.dayOfWeek)}
              className={[
                "px-8 py-3.5 rounded-2xl border text-[11px] font-black tracking-[0.1em] uppercase transition-all duration-300 min-w-max",
                isActive
                  ? "bg-[#D6F93D] text-black border-[#D6F93D] shadow-[0_10px_30px_-10px_rgba(214,249,61,0.5)] scale-[1.05]"
                  : "bg-white/5 text-white/30 border-white/5 hover:bg-white/10 hover:text-white/70 hover:scale-105",
              ].join(" ")}
            >
              {d.dayOfWeek}
            </button>
          );
        })}
      </div>
    </div>
  );
}
