import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#14031f]/95 border border-[#f7ff00]/40 rounded-xl px-3 py-2 text-xs">
      <div className="text-white/80 font-semibold mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-6">
          <span className="text-white/70">{p.name}</span>
          <span className="text-white font-semibold">{Math.round(p.value)} kcal</span>
        </div>
      ))}
    </div>
  );
}

export default function CaloriesChart({ data = [] }) {
  const normalized = useMemo(
    () =>
      (data ?? []).map((d) => ({
        day: d.dayLabel?.slice(0, 3)?.toUpperCase() || "",
        Consumed: d.consumed ?? 0,
        Burned: d.burned ?? 0,
      })),
    [data]
  );

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg title-glow">Calories</h3>
        <span className="text-xs text-white/60">Consumed vs Burned (week)</span>
      </div>

      <ResponsiveContainer width="100%" height={270}>
        <LineChart data={normalized} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="day" stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ color: "rgba(255,255,255,0.75)" }} />
          <Line type="monotone" dataKey="Consumed" stroke="#ff66c4" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Burned" stroke="#6dd5ff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
