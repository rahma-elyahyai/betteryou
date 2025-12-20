import React, { useState, useEffect } from "react";
import { Target, CheckCircle, X, TrendingDown, Scale, TrendingUp } from "lucide-react";
import { profileApi } from "@/api/profileApi";

function normalizeGoal(goal) {
  if (!goal || typeof goal !== "string") return "";
  const goalMap = {
    LOSE_WEIGHT: "LOSE_WEIGHT",
    "LOSE WEIGHT": "LOSE_WEIGHT",
    LOSEWEIGHT: "LOSE_WEIGHT",
    lose_weight: "LOSE_WEIGHT",
    MAINTAIN: "MAINTAIN",
    maintain: "MAINTAIN",
    GAIN_MASS: "GAIN_MASS",
    "GAIN MASS": "GAIN_MASS",
    GAINMASS: "GAIN_MASS",
    gain_mass: "GAIN_MASS",
  };
  const normalized = goal.trim().toUpperCase().replace(/\s+/g, "_");
  return goalMap[normalized] || goalMap[goal.trim()] || normalized;
}

export default function ObjectiveSection({ userGoal }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessNotif, setShowSuccessNotif] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(normalizeGoal(userGoal || ""));
  const [loading, setLoading] = useState(true);

  useEffect(() => setSelectedGoal(normalizeGoal(userGoal || "")), [userGoal]);

  const goals = [
    { id: "LOSE_WEIGHT", title: "Lose weight", icon: TrendingDown, description: "Reduce body fat while preserving muscle mass" },
    { id: "MAINTAIN", title: "Maintain", icon: Scale, description: "Maintain your weight while improving your body composition." },
    { id: "GAIN_MASS", title: "Gain mass", icon: TrendingUp, description: "Intensive strength training develops power and muscle volume." },
  ];

  const fetchUserObjective = async () => {
    try {
      const { data } = await profileApi.getProfile();
      const dbGoal = data.objective?.goal || "";
      setSelectedGoal(normalizeGoal(dbGoal));
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching objective:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserObjective();
  }, []);

  const handleSaveModifications = async () => {
    try {
      await profileApi.updateObjective({ goal: selectedGoal });
      setIsEditing(false);
      setShowSuccessNotif(true);
      setTimeout(() => setShowSuccessNotif(false), 2500);
      await fetchUserObjective();
    } catch (error) {
      console.error("Error saving objective:", error);
    }
  };

  const card =
    "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.40)]";
  const pillBtn =
    "px-6 py-2.5 rounded-xl font-semibold text-black bg-[#D6F93D] hover:brightness-95 transition shadow-[0_12px_40px_rgba(214,249,61,0.18)]";

  if (loading) return <div className="text-white/80 p-4">Loading...</div>;

  return (
    <>
      <div className={card + " p-8 relative"}>
        {isEditing && (
          <button
            onClick={() => {
              setIsEditing(false);
              fetchUserObjective();
            }}
            className="absolute top-5 right-5 h-10 w-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center justify-center"
            aria-label="Cancel"
          >
            <X className="w-5 h-5 text-[#D6F93D]" />
          </button>
        )}

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#D6F93D]/10 border border-[#D6F93D]/25 flex items-center justify-center">
              <Target className="w-5 h-5 text-[#D6F93D]" />
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold tracking-tight">Objective</h2>
              <p className="text-white/55 text-sm mt-1">Pick the goal that fits you best.</p>
            </div>
          </div>

          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className={pillBtn}>
              Modify
            </button>
          ) : (
            <button onClick={handleSaveModifications} className={pillBtn}>
              Save
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoal === goal.id;

            return (
              <button
                key={goal.id}
                disabled={!isEditing}
                onClick={() => isEditing && setSelectedGoal(goal.id)}
                className={[
                  "text-left rounded-2xl p-6 border transition-all",
                  "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20",
                  "hover:-translate-y-[2px] active:translate-y-0",
                  isSelected ? "border-[#D6F93D]/60 bg-[#D6F93D]/10 ring-4 ring-[#D6F93D]/10" : "",
                  !isEditing ? "opacity-95 cursor-default" : "cursor-pointer",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                    <Icon className={["w-6 h-6", isSelected ? "text-[#D6F93D]" : "text-purple-400"].join(" ")} />
                  </div>

                  {isSelected && (
                    <span className="rounded-full bg-[#D6F93D]/15 text-[#D6F93D] border border-[#D6F93D]/30 px-3 py-1 text-[11px] font-semibold tracking-wide">
                      SELECTED
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="text-white font-semibold text-lg tracking-tight">{goal.title}</h3>
                  <p className="text-white/60 text-sm mt-1 leading-5">{goal.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {isEditing && (
          <div className="flex justify-end mt-6">
            <button onClick={handleSaveModifications} className={pillBtn}>
              Save modifications
            </button>
          </div>
        )}
      </div>

      {showSuccessNotif && (
        <div className="fixed top-8 right-8 z-50">
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-[#D6F93D]/35 bg-black/60 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
            <div className="h-10 w-10 rounded-2xl bg-[#D6F93D]/15 border border-[#D6F93D]/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#D6F93D]" />
            </div>
            <div>
              <p className="font-semibold text-white">Objective updated</p>
              <p className="text-sm text-white/60">Your new goal has been saved</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
