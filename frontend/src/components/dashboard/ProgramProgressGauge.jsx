import React from "react";

export default function ProgramProgressGauge({ percent = 0 }) {
  const value = Math.min(100, Math.max(0, percent));

  const size = 230;        
  const stroke = 25;       
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 border border-lime-400/30
                    bg-gradient-to-br from-gray-900/80 to-gray-900/60
                    shadow-[0_0_40px_rgba(132,204,22,0.12)] backdrop-blur-sm
                    hover:border-lime-400/40 transition-all duration-300
                    flex flex-col items-center">
      
      {/* Glow blobs */}
      <div className="absolute -top-24 -right-24 h-60 w-60 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 w-full">
        <h3 className="font-semibold text-xl title-glow mb-4 self-start">
          Program Progress
        </h3>

        <div className="flex justify-center">
          <div className="relative" style={{ width: size, height: size }}>
            <svg
              width={size}
              height={size}
              className="-rotate-90"
            >
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#84cc16" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>

              {/* background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={stroke}
                fill="transparent"
              />

              {/* progress circle avec gradient lime → cyan */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke="url(#progressGradient)"
                strokeWidth={stroke}
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={c}
                strokeDashoffset={offset}
                style={{
                  filter: "drop-shadow(0 0 14px rgba(132, 204, 22, 0.45))",
                  transition: "stroke-dashoffset 600ms ease",
                }}
              />
            </svg>

            {/* center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">
                {value}%
              </div>
              <div className="text-sm text-white/60">
                completed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}