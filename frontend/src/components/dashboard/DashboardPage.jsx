import React, { useEffect, useState } from "react";
import Sidebar from "@/layout/Sidebar.jsx";
import { fetchDashboard } from "@/apis/DashboardApi";

import StatCard from "@/components/dashboard/StatCard";
import CaloriesChart from "@/components/dashboard/CaloriesChart";
import MacroDonut from "@/components/dashboard/MacroDonut";
import TrainingChart from "@/components/dashboard/TrainingChart";
import ProgramProgressGauge from "@/components/dashboard/ProgramProgressGauge";
import TodaysFocus from "@/components/dashboard/TodaysFocus";

import { Flame, Activity, Clock, Dumbbell } from "lucide-react";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchDashboard(1);
        setDashboard(data);
      } catch (e) {
        console.error("Erreur API Dashboard", e);
        setError(e?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full app-bg flex items-center justify-center">
        <div className="text-2xl font-extrabold neon-text animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen w-full app-bg flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
          <div className="text-red-300 font-semibold text-lg mb-2">
            Dashboard Error
          </div>
          <div className="text-red-200 text-sm break-words">
            {error || "No data"}
          </div>
        </div>
      </div>
    );
  }

  // ----------- Normalisation / fallback -----------
  const summary = dashboard.summary ?? {
    dailyCaloricIntake: dashboard.dailyCaloricIntake ?? 0,
    sessionsCompleted: dashboard.sessionsCompleted ?? 0,
    targetSessionsPerWeek: dashboard.targetSessionsPerWeek ?? 0,
    totalTrainingMinutes: dashboard.totalTrainingMinutes ?? 0,
    activeProgramName: dashboard.activeProgramName ?? "No program",
  };

  const caloriesPerDay =
    dashboard.caloriesPerDay ??
    (dashboard.weeklyCalories ?? []).map((d) => ({
      dayLabel: d.dayLabel,
      consumed: d.consumed ?? 0,
      burned: d.burned ?? 0,
    })) ??
    [];

  const trainingMinutesPerDay =
    dashboard.trainingMinutesPerDay ??
    (dashboard.weeklyTraining ?? []).map((d) => ({
      dayLabel: d.dayLabel,
      cardioMinutes: d.cardioMinutes ?? 0,
      strengthMinutes: d.strengthMinutes ?? 0,
      mixedMinutes: d.mixedMinutes ?? 0,
    })) ??
    [];

  const macros = dashboard.macros ?? {
    totalProteins: dashboard.totalProteins ?? 0,
    totalCarbs: dashboard.totalCarbs ?? 0,
    totalFats: dashboard.totalFats ?? 0,
  };

  const goalTracker = dashboard.goalTracker ?? {
    objective: "No objective defined",
    fitnessLevel: "Unknown",
    programStatus: "No active program",
  };

  const upcomingSessions = dashboard.upcomingSessions ?? [];
  const programProgressPercent = dashboard.programProgressPercent ?? 0;

  return (
    <div className="min-h-screen w-full app-bg text-white flex">
      <Sidebar active="dashboard" />

      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <section className="glass-card rounded-2xl px-8 py-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold neon-text">
              Welcome back 👋
            </h1>
            <p className="text-sm text-white/70 mt-2">
              Your health journey grows stronger every day. Keep going!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <div className="h-10 w-10 rounded-full bg-[#f7ff00]/90 text-black flex items-center justify-center font-extrabold">
              U
            </div>
            <div className="text-xs">
              <div className="font-semibold title-glow">User</div>
              <div className="text-white/60">user@email.com</div>
            </div>
          </div>
        </section>

        {/* 4 cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Flame size={18} className="text-[#f7ff00]" />}
            title="Daily Caloric Intake"
            value={`${summary.dailyCaloricIntake ?? 0} kcal`}
            subtitle="From nutrition plan"
          />
          <StatCard
            icon={<Activity size={18} className="text-[#ff66c4]" />}
            title="Sessions Completed"
            value={`${summary.sessionsCompleted ?? 0}/${summary.targetSessionsPerWeek ?? 0}`}
            subtitle="This week"
          />
          <StatCard
            icon={<Clock size={18} className="text-[#6dd5ff]" />}
            title="Training Time"
            value={`${summary.totalTrainingMinutes ?? 0} min`}
            subtitle="DONE sessions only"
          />
          <StatCard
            icon={<Dumbbell size={18} className="text-[#c77dff]" />}
            title="Active Program"
            value={summary.activeProgramName ?? "No program"}
            subtitle="Current plan"
          />
        </section>

        {/* Calories + donut */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 items-start">
          <div className="lg:col-span-2">
            <CaloriesChart data={caloriesPerDay ?? []} />
          </div>
          <MacroDonut macros={macros ?? {}} />
        </section>

        {/* Training + progress */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 items-start">
          <div className="lg:col-span-2">
            <TrainingChart data={trainingMinutesPerDay ?? []} />
          </div>

          <div className="flex flex-col gap-4">
            <ProgramProgressGauge percent={programProgressPercent} />
          </div>
        </section>

        {/* CREATIVE WOW CARD */}
        <section className="mb-10">
          <TodaysFocus
            goalTracker={goalTracker}
            upcomingSessions={upcomingSessions}
            programName={summary.activeProgramName ?? "Active Program"}
          />
        </section>
      </main>
    </div>
  );
}
