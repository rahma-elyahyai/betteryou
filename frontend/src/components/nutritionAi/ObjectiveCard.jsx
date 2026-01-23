// src/components/nutritionAi/ObjectiveCard.jsx
import React from "react";

export default function ObjectiveCard({ active, title, subtitle, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group w-full text-left rounded-[2rem] border p-6 transition-all duration-500",
        "bg-white/5 hover:bg-white/10 hover:scale-[1.02]",
        active ? "border-[#D6F93D] ring-8 ring-[#D6F93D]/5 shadow-[0_20px_50px_-10px_rgba(214,249,61,0.2)]" : "border-white/5",
      ].join(" ")}
    >
      <div className="flex items-center gap-5">
        <div
          className={[
            "h-14 w-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-500 group-hover:scale-110",
            active ? "bg-[#D6F93D] text-black shadow-[0_0_20px_rgba(214,249,61,0.4)]" : "bg-white/5 text-white/20",
          ].join(" ")}
        >
          {icon}
        </div>

        <div className="flex-1">
          <div className="text-white font-black text-xl tracking-tight">{title}</div>
          <div className="text-white/40 text-sm mt-1 font-medium italic">{subtitle}</div>
        </div>

        <div
          className={[
            "h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all duration-500",
            active ? "border-[#D6F93D] bg-[#D6F93D]/10" : "border-white/10",
          ].join(" ")}
        >
          {active && <div className="h-3 w-3 rounded-full bg-[#D6F93D] shadow-[0_0_10px_#D6F93D]" />}
        </div>
      </div>
    </button>
  );
}
