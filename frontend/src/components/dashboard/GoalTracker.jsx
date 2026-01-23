import React from "react";
import { Target, Activity, Flag } from "lucide-react";

const Row = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1">
      <div className="text-xs text-white/60">{label}</div>
      <div className="text-sm font-semibold title-glow">{value}</div>
    </div>
  </div>
);

export default function GoalTracker({ data }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="font-semibold text-lg title-glow mb-4">Goal Tracker</h3>

      <div className="space-y-3">
        <Row icon={<Target size={18} className="text-[#f7ff00]" />} label="Objective" value={data?.objective ?? "No objective"} />
        <Row icon={<Activity size={18} className="text-[#6dd5ff]" />} label="Fitness level" value={data?.fitnessLevel ?? "Unknown"} />
        <Row icon={<Flag size={18} className="text-[#ff66c4]" />} label="Program status" value={data?.programStatus ?? "No active program"} />
      </div>
    </div>
  );
}
