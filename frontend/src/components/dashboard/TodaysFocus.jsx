import React from "react";
import { Target, Activity, Flag, PlayCircle, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TodaysFocus({
  goalTracker,
  upcomingSessions = [],
  programName = "Active Program",
}) {
  const nextSession = upcomingSessions?.[0];
  const navigate = useNavigate();


  return (
    <div className="relative overflow-hidden rounded-3xl p-8 border border-lime-400/30
                    bg-gradient-to-br from-gray-900/80 to-gray-900/60
                    shadow-[0_0_40px_rgba(132,204,22,0.12)] backdrop-blur-sm">

      {/* glow blobs - lime & cyan */}
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">
            Today's Focus
          </h2>
          <p className="text-sm text-white/70 mt-1">
            One clear action to move you forward today.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-white/60 bg-white/5 border border-white/10 rounded-full px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
          Live
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Goal overview */}
        <div className="rounded-2xl bg-gray-800/40 border border-gray-700 p-5 hover:bg-gray-800/60 hover:border-gray-600 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-lime-400 to-lime-500 text-gray-900 flex items-center justify-center">
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
              <Target size={16} className="text-lime-400" />
              <span className="text-white/70">Objective:</span>
              <span className="font-semibold title-glow">
                {goalTracker?.objective ?? "No objective"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Activity size={16} className="text-cyan-400" />
              <span className="text-white/70">Level:</span>
              <span className="font-semibold title-glow">
                {goalTracker?.fitnessLevel ?? "Unknown"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Flag size={16} className="text-orange-400" />
              <span className="text-white/70">Status:</span>
              <span className="font-semibold title-glow">
                {goalTracker?.programStatus ?? "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Next session */}
        <div className="rounded-2xl bg-gray-800/40 border border-gray-700 p-5 flex flex-col justify-between hover:bg-gray-800/60 hover:border-gray-600 transition-all">
          <div>
            <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
              <CalendarDays size={14} className="text-lime-400" />
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
          onClick={() => navigate("/workout")}
          className="group mt-5 inline-flex items-center justify-center gap-2 px-5 py-3
                    rounded-xl bg-gradient-to-r from-lime-400 to-lime-500 text-gray-900 font-semibold
                    hover:from-lime-500 hover:to-lime-600 transition-all duration-300
                    hover:shadow-lg hover:shadow-lime-400/30 hover:scale-105 active:scale-95"
        >
          <PlayCircle size={18} />
          Start session
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
        </button>

        </div>
      </div>
    </div>
  );
}