import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((sum, p) => sum + (p.value || 0), 0);

  return (
    <div className="bg-gray-900/95 border border-lime-400/40 rounded-xl px-3 py-2 text-xs backdrop-blur-sm">
      <div className="text-white/80 font-semibold mb-1">
        {label} • <span className="text-white">{total} min</span>
      </div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-6">
          <span className="text-white/70">{p.name}</span>
          <span className="text-white font-semibold">{p.value} min</span>
        </div>
      ))}
    </div>
  );
}

export default function TrainingChart({ data = [] }) {
  const normalized = useMemo(
    () =>
      (data ?? []).map((d) => ({
        day: d.dayLabel?.slice(0, 3)?.toUpperCase() || "",
        Cardio: d.cardioMinutes ?? 0,
        Strength: d.strengthMinutes ?? 0,
        Mixed: d.mixedMinutes ?? 0,
      })),
    [data]
  );

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 border border-lime-400/30
                    bg-gradient-to-br from-gray-900/80 to-gray-900/60
                    shadow-[0_0_40px_rgba(132,204,22,0.12)] backdrop-blur-sm
                    hover:border-lime-400/40 transition-all duration-300">
      
      {/* Glow blobs */}
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg title-glow">Training</h3>
          <span className="text-xs text-white/60">Minutes completed</span>
        </div>

        <ResponsiveContainer width="100%" height={270}>
          <BarChart data={normalized} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ color: "rgba(255,255,255,0.75)" }} />
            <Bar dataKey="Cardio" stackId="a" fill="#22d3ee" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Strength" stackId="a" fill="#84cc16" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Mixed" stackId="a" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}