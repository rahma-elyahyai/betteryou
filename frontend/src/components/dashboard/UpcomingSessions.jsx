import React from "react";
import { CalendarDays, Dumbbell } from "lucide-react";

export default function UpcomingSessions({ sessions = [] }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="text-[#f7ff00]" size={20} />
          <h3 className="font-semibold text-lg title-glow">Upcoming Sessions</h3>
        </div>
        <span className="text-xs text-white/60">{(sessions?.length ?? 0)} items</span>
      </div>

      <div className="space-y-3">
        {(!sessions || sessions.length === 0) && (
          <p className="text-sm text-white/60">No upcoming sessions.</p>
        )}

        {(sessions ?? []).map((s, idx) => (
          <div
            key={s?.sessionId ?? idx}
            className="rounded-2xl px-4 py-3 border border-white/10 bg-white/5 hover:bg-white/7 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Dumbbell size={16} className="text-white/80" />
              </div>
              <div>
                <div className="text-sm font-semibold title-glow">
                  {s?.sessionTitle ?? "Training Session"}
                </div>
                <div className="text-[11px] text-white/60">
                  {(s?.dayLabel ?? "DAY")} • {s?.date ?? ""} • {s?.sessionType ?? ""}
                </div>
              </div>
            </div>

            <div className="text-sm font-semibold title-glow">
              {s?.durationMinutes ?? 0} min
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
