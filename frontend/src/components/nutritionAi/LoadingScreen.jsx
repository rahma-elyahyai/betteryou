// src/components/nutritionAi/LoadingScreen.jsx
import React from "react";

const steps = [
  "Calibrating metabolic targets...",
  "Synthesizing optimal nutrient distribution...",
  "Formatting bio-available meal structures...",
  "Finalizing seven-day strategic cycle...",
];

export default function LoadingScreen({ stepIndex = 0 }) {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 animate-in fade-in duration-1000">
      <div className="w-full max-w-2xl relative">
        <div className="absolute inset-0 bg-[#D6F93D]/5 blur-[120px] rounded-full" />

        <div className="relative rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-12 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <div
              className="h-full bg-[#D6F93D] shadow-[0_0_20px_#D6F93D] transition-all duration-700 ease-out"
              style={{ width: `${(stepIndex + 1) * 25}%` }}
            />
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#D6F93D]/20 blur-2xl group-hover:blur-3xl transition-all rounded-full" />
              <div className="h-28 w-28 rounded-full border-[3px] border-white/10 border-t-[#D6F93D] animate-spin relative z-10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl z-20">🧬</div>
            </div>

            <h2 className="mt-10 text-4xl font-black text-white tracking-tight">AI Synthesis</h2>
            <p className="mt-3 text-white/50 text-lg leading-relaxed italic max-w-sm">
              Our neural engine is calculating your personalized nutrition plan.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {steps.map((s, i) => {
              const done = i < stepIndex;
              const active = i === stepIndex;
              return (
                <div
                  key={s}
                  className={[
                    "flex items-center gap-4 rounded-[1.5rem] border px-6 py-4 transition-all duration-500",
                    done
                      ? "border-[#D6F93D]/20 bg-[#D6F93D]/5"
                      : active
                        ? "border-white/20 bg-white/10 scale-[1.02] shadow-xl"
                        : "border-white/5 bg-transparent opacity-30",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "h-2.5 w-2.5 rounded-full shadow-sm",
                      done ? "bg-[#D6F93D]" : active ? "bg-white animate-pulse" : "bg-white/20",
                    ].join(" ")}
                  />
                  <div className={[
                    "text-sm font-bold tracking-wide uppercase",
                    done ? "text-[#D6F93D]/80" : active ? "text-white" : "text-white/40"
                  ].join(" ")}>{s}</div>

                  {done && <div className="ml-auto text-[#D6F93D] text-xs font-black">COMPLETE</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
