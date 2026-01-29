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
    <div className="bg-[#14031f]/95 border border-[#f7ff00]/40 rounded-xl px-3 py-2 text-xs">
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
    <div className="glass-card rounded-2xl p-5">
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
          <Bar dataKey="Cardio" stackId="a" fill="#ff66c4" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Strength" stackId="a" fill="#6dd5ff" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Mixed" stackId="a" fill="#c77dff" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
