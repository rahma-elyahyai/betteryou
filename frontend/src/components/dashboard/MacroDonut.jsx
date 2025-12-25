import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = ["#f7ff00", "#ff4fa3", "#9d4edd"];

// Tooltip noir professionnel
function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];

    return (
      <div className="bg-[#14031f]/95 border border-[#f7ff00]/40 rounded-xl px-3 py-2 text-xs">
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
    <div className="glass-card rounded-2xl p-5">
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
  );
}
