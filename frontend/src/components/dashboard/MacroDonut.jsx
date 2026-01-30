import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = ["#84cc16", "#22d3ee", "#f59e0b"];

// Tooltip avec style nutrition catalog
function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];

    return (
      <div className="bg-gray-900/95 border border-lime-400/40 rounded-xl px-3 py-2 text-xs backdrop-blur-sm">
        <div className="text-white font-semibold">{name}</div>
        <div className="text-white/80">{Number(value).toFixed(1)} g</div>
      </div>
    );
  }
  return null;
}

export default function MacroDonut({ macros = {} }) {
  const data = useMemo(
    () => [
      { name: "Proteins", value: Number(macros.totalProteins ?? 0) },
      { name: "Carbs", value: Number(macros.totalCarbs ?? 0) },
      { name: "Fats", value: Number(macros.totalFats ?? 0) },
    ],
    [macros]
  );

  const hasData = data.some((d) => d.value > 0);

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 border border-lime-400/30
                    bg-gradient-to-br from-gray-900/80 to-gray-900/60
                    shadow-[0_0_40px_rgba(132,204,22,0.12)] backdrop-blur-sm
                    hover:border-lime-400/40 transition-all duration-300">
      
      {/* Glow blobs */}
      <div className="absolute -top-24 -right-24 h-60 w-60 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-10">
          <h3 className="font-semibold text-xl title-glow">
            Macronutrients
          </h3>
          <span className="text-xs text-white/60">Today</span>
        </div>

        {!hasData ? (
          <div className="h-[220px] flex items-center justify-center text-sm text-white/60">
            No macro data for today
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                label={false}
                labelLine={false}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "rgba(255,255,255,0.75)" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}