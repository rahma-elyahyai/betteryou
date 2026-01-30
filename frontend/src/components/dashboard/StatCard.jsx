import React from "react";

export default function StatCard({ icon, title, value, subtitle = "This week" }) {
  return (
    <div className="relative overflow-hidden rounded-2xl px-5 py-4 border border-lime-400/30
                    bg-gradient-to-br from-gray-900/80 to-gray-900/60
                    shadow-[0_0_40px_rgba(132,204,22,0.12)] backdrop-blur-sm
                    group hover:border-lime-400/40 hover:-translate-y-1 transition-all duration-300
                    flex flex-col gap-2">
      
      {/* Glow blob - plus petit pour les cards */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-lime-400/10 blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-lime-400/10 group-hover:border-lime-400/30 transition-all duration-300">
            {icon}
          </div>
          <div className="text-sm font-semibold title-glow">{title}</div>
        </div>

        <div className="text-3xl font-extrabold tracking-tight title-glow group-hover:text-lime-400 transition-colors duration-300 mt-2">
          {value}
        </div>
        <div className="text-xs text-white/60">{subtitle}</div>
      </div>

      {/* Hover accent line */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-lime-400 to-cyan-400 rounded-b-2xl group-hover:w-full transition-all duration-500" />
    </div>
  );
}