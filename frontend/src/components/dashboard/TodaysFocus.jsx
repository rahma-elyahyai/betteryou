import React from "react";
import { Target, Activity, Flag, PlayCircle, CalendarDays } from "lucide-react";

export default function TodaysFocus({
  goalTracker,
  upcomingSessions = [],
  programName = "Active Program",
}) {
  const nextSession = upcomingSessions?.[0];

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 border border-[#f7ff00]/30
                    bg-gradient-to-br from-[#2b0b45] via-[#3a0b63] to-[#1a0625]
                    shadow-[0_0_40px_rgba(247,255,0,0.12)]">

      {/* glow blobs */}
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#f7ff00]/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#6dd5ff]/10 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold neon-text">Today’s Focus</h2>
          <p className="text-sm text-white/70 mt-1">
            One clear action to move you forward today.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-white/60 bg-white/5 border border-white/10 rounded-full px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-[#f7ff00] animate-pulse" />
          Live
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Goal overview */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-[#f7ff00]/90 text-black flex items-center justify-center">
              <Target size={22} />
            </div>
            <div>
              <div className="text-xs text-white/60">Active Program</div>
              <div className="text-lg font-bold title-glow">
                {programName}
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-[#f7ff00]" />
              <span className="text-white/70">Objective:</span>
              <span className="font-semibold title-glow">
                {goalTracker?.objective ?? "No objective"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Activity size={16} className="text-[#6dd5ff]" />
              <span className="text-white/70">Level:</span>
              <span className="font-semibold title-glow">
                {goalTracker?.fitnessLevel ?? "Unknown"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Flag size={16} className="text-[#ff66c4]" />
              <span className="text-white/70">Status:</span>
              <span className="font-semibold title-glow">
                {goalTracker?.programStatus ?? "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Next session */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
              <CalendarDays size={14} className="text-[#f7ff00]" />
              Next session
            </div>

            {nextSession ? (
              <>
                <div className="text-lg font-bold title-glow">
                  {nextSession.sessionTitle ?? "Training Session"}
                </div>
                <div className="text-sm text-white/70 mt-1">
                  {(nextSession.dayLabel ?? "DAY")} •{" "}
                  {(nextSession.sessionType ?? "TYPE")} •{" "}
                  {(nextSession.durationMinutes ?? 0)} min
                </div>
                <div className="text-xs text-white/60 mt-2">
                  Date: {nextSession.date ?? "-"}
                </div>
              </>
            ) : (
              <div className="text-sm text-white/60">
                No upcoming session planned.
              </div>
            )}
          </div>

          <button
            className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3
                       rounded-xl bg-[#f7ff00] text-black font-semibold
                       hover:scale-[1.03] transition-transform"
          >
            <PlayCircle size={18} />
            Start session
          </button>
        </div>
      </div>
    </div>
  );
}
