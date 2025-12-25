import React from "react";

export default function StatCard({ icon, title, value, subtitle = "This week" }) {
  return (
    <div className="glass-card rounded-2xl px-5 py-4 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          {icon}
        </div>
        <div className="text-sm font-semibold title-glow">{title}</div>
      </div>

      <div className="text-3xl font-extrabold tracking-tight title-glow">{value}</div>
      <div className="text-xs text-white/60">{subtitle}</div>
    </div>
  );
}
