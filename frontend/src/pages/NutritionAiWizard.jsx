// src/pages/NutritionAiWizard.jsx
import React, { useMemo, useState } from "react";
import Sidebar from "@/layout/Sidebar.jsx";

import ObjectiveCard from "@/components/nutritionAi/ObjectiveCard.jsx";
import LoadingScreen from "@/components/nutritionAi/LoadingScreen.jsx";
import DayTabs from "@/components/nutritionAi/DayTabs.jsx";
import MealCard from "@/components/nutritionAi/MealCard.jsx";
import SummaryCard from "@/components/nutritionAi/SummaryCard.jsx";

import { api } from "@/api/auth.js";
import { getCurrentUserId } from "@/utils/authUtils.js";
import { useAuth } from "../features/Nutrition/store/AuthContext.jsx";

function addDays(dateStr, days) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  // force noon to avoid timezone shifting edge-cases
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const OBJECTIVES = [
  { key: "LOSE_WEIGHT", title: "Weight Reduction", subtitle: "Optimize fat loss through caloric precision", icon: "⚖️" },
  { key: "GAIN_MASS", title: "Muscle Growth", subtitle: "Maximize hypertrophy with nutrient density", icon: "💪" },
  { key: "MAINTAIN", title: "Maintenance", subtitle: "Sustain body composition & energy levels", icon: "⚡" },
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
}

// ✅ Backend calls using the same axios instance (auth.js)
async function generateNutritionPlan(payload) {
  // Ensure we call the backend API path. auth.js `api` baseURL should point
  // to the backend host (e.g. http://localhost:8080). We include the /api
  // prefix here so requests go to /api/nutrition/ai/generate.
  const res = await api.post("/api/nutrition/ai/generate", payload, {
    timeout: 300000, // Increased to 300s for long-running AI requests
  });
  return res.data;
}

async function getNutritionWeek(planId) {
  const res = await api.get(`/api/nutrition/ai/plans/${planId}/week`);
  return res.data;
}

export default function NutritionAiWizard() {
  const { user, loadingUser } = useAuth();
  const [step, setStep] = useState("form"); // form | loading | plan
  const [loadingStep, setLoadingStep] = useState(0);

  const [programName, setProgramName] = useState("");
  const [objective, setObjective] = useState("");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [caloriesPerDay, setCaloriesPerDay] = useState("");

  // ✅ 7 days inclusive => start + 6
  const endDate = useMemo(() => addDays(startDate, 6), [startDate]);

  const [result, setResult] = useState(null); // backend generate response
  const [week, setWeek] = useState([]); // [{dayOfWeek, meals:[...]}]
  const [activeDay, setActiveDay] = useState("");

  const activeDayData = useMemo(() => {
    if (!week?.length) return null;
    return week.find((d) => d.dayOfWeek === activeDay) || week[0];
  }, [week, activeDay]);

  async function handleGenerate(e) {
    e.preventDefault();

    if (!objective) return alert("Please select an objective.");
    if (!startDate) return alert("Please choose a start date.");

    const cal = Number(caloriesPerDay);
    if (!cal || cal <= 0) return alert("Please enter a valid calories/day value.");

    let userIdRaw = getCurrentUserId?.();
    let userId = Number(userIdRaw);

    // ✅ Fallback for testing when not logged in
    if (!userId || Number.isNaN(userId)) {
      console.warn("User not logged in, using fallback userId=1 for testing.");
      userId = 1;
    }

    setStep("loading");
    setLoadingStep(0);

    // small progress animation while waiting
    const t = setInterval(() => {
      setLoadingStep((s) => (s < 3 ? s + 1 : s));
    }, 1200);

    try {
      const payload = {
        userId,
        objective,      // must match backend enum: LOSE_WEIGHT / GAIN_MASS / MAINTAIN
        startDate,
        caloriesPerDay: cal,
        // endDate is computed on backend (start + 6). We don’t send it.
      };

      const gen = await generateNutritionPlan(payload);
      setResult(gen);

      // Your backend response already contains "days"
      const days = Array.isArray(gen?.days) ? gen.days : null;

      if (days?.length) {
        setWeek(days);
        setActiveDay(days[0]?.dayOfWeek || "Monday");
      } else if (gen?.nutritionPlanId) {
        const w = await getNutritionWeek(gen.nutritionPlanId);
        setWeek(w);
        setActiveDay(w[0]?.dayOfWeek || "Monday");
      } else {
        throw new Error("No days and no nutritionPlanId returned from backend.");
      }

      setStep("plan");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to generate plan.";
      alert(msg);
      setStep("form");
    } finally {
      clearInterval(t);
    }
  }

  function resetWizard() {
    setStep("form");
    setResult(null);
    setWeek([]);
    setActiveDay("");
    setLoadingStep(0);
  }

  return (
    <div className="flex min-h-screen bg-black">
    {/* Sidebar */}
    <Sidebar />

    {/* ===== MAIN CONTENT ===== */}
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-black via-gray-900 to-black px-6 py-10">
      <div className="mx-auto w-full max-w-6xl">

        {/* ===== HEADER ===== */}
        <div className="mb-10 flex items-center justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              AI Nutrition <span className="text-[#D6F93D]">Architect</span>
            </h1>
            <p className="mt-3 text-lg text-white/50 leading-relaxed italic">
              Empowering your health journey with precision-engineered, seven-day nutritional strategies.
            </p>
          </div>

          {step === "plan" && (
            <button
              onClick={resetWizard}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white/90 hover:bg-white/10 transition backdrop-blur-md"
            >
              <span>Generate New Strategy</span>
              <span className="text-lg">↺</span>
            </button>
          )}
        </div>

        {/* STEP 1: FORM */}
        {step === "form" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-1.5 w-8 rounded-full bg-[#D6F93D]" />
                <h2 className="text-white font-bold text-2xl tracking-tight">Configuration</h2>
              </div>

              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="group">
                  <label className="block text-white/50 text-xs font-bold uppercase tracking-widest mb-2.5 transition-colors group-focus-within:text-[#D6F93D]">Program Designation</label>
                  <input
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    placeholder='e.g. "Summer Transformation 2026"'
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none focus:ring-2 focus:ring-[#D6F93D]/30 focus:border-[#D6F93D]/60 transition-all placeholder:text-white/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-white/50 text-xs font-bold uppercase tracking-widest mb-2.5 group-focus-within:text-[#D6F93D]">Commencement Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none focus:ring-2 focus:ring-[#D6F93D]/30 focus:border-[#D6F93D]/60 transition-all [color-scheme:dark]"
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-white/50 text-xs font-bold uppercase tracking-widest mb-2.5">Completion Date</label>
                    <div className="w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-white/40 cursor-not-allowed font-medium italic">
                      {formatDate(endDate)}
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-white/50 text-xs font-bold uppercase tracking-widest mb-2.5 group-focus-within:text-[#D6F93D]">Daily Caloric Target</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={caloriesPerDay}
                      onChange={(e) => setCaloriesPerDay(e.target.value)}
                      placeholder="e.g. 2200"
                      min={1200}
                      max={5000}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none focus:ring-2 focus:ring-[#D6F93D]/30 focus:border-[#D6F93D]/60 transition-all placeholder:text-white/20"
                      required
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 text-xs font-bold uppercase">kcal</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full group mt-4 overflow-hidden rounded-2xl bg-[#D6F93D] px-6 py-5 font-black text-black hover:scale-[1.02] active:scale-[0.98] transition shadow-[0_20px_60px_-15px_rgba(214,249,61,0.3)] relative"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    GENERATE AI STRATEGY
                    <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-8 rounded-full bg-white/20" />
                <h2 className="text-white font-bold text-2xl tracking-tight">Strategic Objective</h2>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {OBJECTIVES.map((o) => (
                  <ObjectiveCard
                    key={o.key}
                    active={objective === o.key}
                    title={o.title}
                    subtitle={o.subtitle}
                    icon={o.icon}
                    onClick={() => setObjective(o.key)}
                  />
                ))}
              </div>

              <div className="rounded-3xl border border-white/5 bg-[#D6F93D]/5 p-8 border-l-[#D6F93D]/40 border-l-4">
                <div className="text-[#D6F93D] font-bold text-lg">System Intelligence</div>
                <p className="mt-3 text-sm text-white/70 leading-relaxed italic">
                  Our algorithm processes your biometric constraints to generate a bio-available meal structure that ensures metabolic stability across the full seven-day cycle.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LOADING */}
        {step === "loading" && <LoadingScreen stepIndex={loadingStep} />}

        {/* STEP 3: PLAN */}
        {step === "plan" && (
          <div className="space-y-10 animate-in fade-in duration-1000">
            <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 bg-[#D6F93D]/10 blur-[100px] -mr-20 -mt-20 rounded-full" />

              <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D6F93D]/10 border border-[#D6F93D]/20 text-[#D6F93D] text-[10px] font-black uppercase tracking-widest">
                    Strategy Finalized
                  </div>
                  <h2 className="text-white font-black text-4xl tracking-tight leading-none">
                    {result?.nutritionName || programName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-white/30 font-bold uppercase tracking-tighter text-[10px]">Strategic Target:</span>
                      <span className="text-white/90 font-bold">{result?.objective || OBJECTIVES.find(o => o.key === objective)?.title || objective}</span>
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="flex items-center gap-2">
                      <span className="text-white/30 font-bold uppercase tracking-tighter text-[10px]">Metabolic Intake:</span>
                      <span className="text-white/90 font-bold">{result?.caloriesPerDay} <span className="text-white/40 font-normal">kcal/day</span></span>
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="flex items-center gap-2">
                      <span className="text-white/30 font-bold uppercase tracking-tighter text-[10px]">Temporal Range:</span>
                      <span className="text-white/90 font-bold">{formatDate(startDate)} — {formatDate(endDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 md:flex-none rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-xs font-black text-white/80 hover:bg-white/10 hover:text-white transition flex items-center justify-center gap-2"
                  >
                    <span>EXPORT PDF</span>
                    <span className="opacity-50 text-base">⭳</span>
                  </button>
                  <button
                    onClick={async () => {
                      if (!result?.nutritionPlanId) return;
                      const w = await getNutritionWeek(result.nutritionPlanId);
                      setWeek(w);
                      setActiveDay(w[0]?.dayOfWeek || "Monday");
                    }}
                    className="flex-1 md:flex-none rounded-2xl border border-[#D6F93D]/30 bg-[#D6F93D]/5 px-6 py-4 text-xs font-black text-[#D6F93D] hover:bg-[#D6F93D]/10 transition flex items-center justify-center gap-2"
                  >
                    <span>REFRESH DATA</span>
                    <span className="opacity-50 text-base">↺</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-6 rounded-full bg-[#D6F93D]" />
                  <h3 className="text-white font-bold text-xl tracking-tight">Weekly Roadmap</h3>
                </div>
                <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Select Day to View Details</div>
              </div>

              <DayTabs
                days={week}
                activeDay={activeDayData?.dayOfWeek}
                onChange={setActiveDay}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {(activeDayData?.meals || []).map((m, idx) => (
                  <MealCard key={idx} meal={m} />
                ))}
              </div>

              <div className="space-y-6">
                <SummaryCard day={activeDayData} />

                <div className="rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-white/5 to-transparent p-10 relative overflow-hidden">
                  <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-[#D6F93D]/5 blur-3xl rounded-full" />
                  <div className="relative">
                    <h4 className="text-white font-bold text-lg tracking-tight">Nutritional Integrity</h4>
                    <p className="mt-4 text-white/50 text-sm leading-relaxed leading-relaxed font-medium italic">
                      "Consistency in metabolic scheduling is fundamental to sustained biological performance. Adhere strictly to the allocated micro-nutrient distributions for optimal outcome."
                    </p>
                    <div className="mt-6 flex items-center gap-3 pt-6 border-t border-white/5">
                      <div className="h-10 w-10 rounded-full bg-[#D6F93D]/20 flex items-center justify-center text-[#D6F93D] font-black text-xs">AI</div>
                      <div>
                        <div className="text-white text-xs font-black uppercase tracking-wide">Expert Advisor</div>
                        <div className="text-white/30 text-[10px]">Bio-Feedback Engine</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  </div>
    
  );
}
