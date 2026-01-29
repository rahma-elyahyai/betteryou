import React from "react";

export default function ProgramProgressGauge({ percent = 0 }) {
  const value = Math.min(100, Math.max(0, percent));

  const size = 230;        // ⬅️ taille globale du gauge
  const stroke = 25;       // ⬅️ épaisseur
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col items-center">
      <h3 className="font-semibold text-xl title-glow mb-4 self-start">
        Program Progress
      </h3>

      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
        >
          {/* background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={stroke}
            fill="transparent"
          />

          {/* progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="#6dd5ff"
            strokeWidth={stroke}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{
              filter: "drop-shadow(0 0 14px rgba(109,213,255,0.45))",
              transition: "stroke-dashoffset 600ms ease",
            }}
          />
        </svg>

        {/* center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-extrabold title-glow">
            {value}%
          </div>
          <div className="text-sm text-white/60">
            completed
          </div>
        </div>
      </div>
    </div>
  );
}
