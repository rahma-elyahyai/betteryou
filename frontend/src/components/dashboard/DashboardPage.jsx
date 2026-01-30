import React, { useEffect, useState } from "react";
import Sidebar from "@/layout/Sidebar.jsx";
import { fetchDashboard } from "@/apis/DashboardApi";

import StatCard from "@/components/dashboard/StatCard";
import CaloriesChart from "@/components/dashboard/CaloriesChart";
import MacroDonut from "@/components/dashboard/MacroDonut";
import TrainingChart from "@/components/dashboard/TrainingChart";
import ProgramProgressGauge from "@/components/dashboard/ProgramProgressGauge";
import TodaysFocus from "@/components/dashboard/TodaysFocus";
import {authApi} from "@/api/auth.js";
import { getCurrentUserId } from "@/utils/authUtils.js";
import { getUserEmail } from "@/utils/authUtils"; 
import { getUserName } from "@/utils/authUtils";

import { Flame, Activity, Clock, Dumbbell, TrendingUp, Award } from "lucide-react";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [emailUser, setEmailUser] = useState("");
  const [nameUser, setNameUser] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const email = await getUserEmail();
        const name = await getUserName();

        setEmailUser(email);
        setNameUser(name);

        const userId = await getCurrentUserId();
        console.log("User ID:", userId);
        const data = await fetchDashboard(userId);
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
      <div className="min-h-screen w-full bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-800 border-t-lime-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400 text-lg mt-6 font-semibold animate-pulse">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a] flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-red-900/20 border-2 border-red-500/50 rounded-2xl p-8 text-center backdrop-blur-sm">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-red-400 font-semibold text-xl mb-2">
            Dashboard Error
          </div>
          <div className="text-red-300 text-sm break-words">
            {error || "No data available"}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
          >
            Retry
          </button>
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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a] text-white flex">
      <Sidebar active="dashboard" />

      <main className="flex-1 overflow-y-auto">
        {/* Header avec Navigation - Style Nutrition Catalog */}
        <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                  <p className="text-gray-500 text-sm">Your fitness journey overview</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-gray-800/60 border border-gray-700 rounded-full px-4 py-2 hover:bg-gray-800 transition-all">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-lime-400 to-lime-500 text-gray-900 flex items-center justify-center font-bold text-sm">
                  {nameUser?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-lime-400">{nameUser}</div>
                  <div className="text-gray-400">{emailUser}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          
          {/* Title Section - Style Nutrition Catalog */}
          <div className="mb-12">
            <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-lime-300 to-lime-500 mb-4 tracking-tight">
              WELCOME BACK 👋
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl">
              Your health journey grows stronger every day. Track your progress and stay motivated.
            </p>
          </div>

          {/* 4 Stats Cards - Improved Design */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              icon={<Flame size={20} className="text-lime-400" />}
              title="Daily Caloric Intake"
              value={`${summary.dailyCaloricIntake ?? 0} kcal`}
              subtitle="From nutrition plan"
            />
            <StatCard
              icon={<Activity size={20} className="text-lime-400" />}
              title="Sessions Completed"
              value={`${summary.sessionsCompleted ?? 0}/${summary.targetSessionsPerWeek ?? 0}`}
              subtitle="This week"
            />
            <StatCard
              icon={<Clock size={20} className="text-lime-400" />}
              title="Training Time"
              value={`${summary.totalTrainingMinutes ?? 0} min`}
              subtitle="DONE sessions only"
            />
            <StatCard
              icon={<Dumbbell size={20} className="text-lime-400" />}
              title="Active Program"
              value={summary.activeProgramName ?? "No program"}
              subtitle="Current plan"
            />
          </section>

          {/* Calories + Donut - Enhanced Layout */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="lg:col-span-2">
              <CaloriesChart data={caloriesPerDay ?? []} />
            </div>
            <MacroDonut macros={macros ?? {}} />
          </section>

          {/* Training + Progress - Enhanced Layout */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="lg:col-span-2">
              <TrainingChart data={trainingMinutesPerDay ?? []} />
            </div>
            <div className="flex flex-col gap-6">
              <ProgramProgressGauge percent={programProgressPercent} />
            </div>
          </section>

          {/* Today's Focus Card */}
          <section className="mb-12">
            <TodaysFocus
              goalTracker={goalTracker}
              upcomingSessions={upcomingSessions}
              programName={summary.activeProgramName ?? "Active Program"}
            />
          </section>

          {/* CTA Section - Style Nutrition Catalog */}
          <section className="border-t border-gray-800 pt-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">Ready to level up?</h3>
                <p className="text-gray-400 text-base">
                  Explore personalized training programs and nutrition plans
                </p>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => window.location.href = '/nutrition'}
                  className="group relative px-8 py-4 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-500 hover:to-lime-600 text-gray-900 font-bold text-base uppercase tracking-wider rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-lime-500/40 transform hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Flame size={18} />
                    Nutrition
                  </span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                </button>
                
                <button 
                  onClick={() => window.location.href = '/workout'}
                  className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-lime-400 hover:text-lime-300 font-bold text-base uppercase tracking-wider rounded-xl transition-all border border-gray-700 hover:border-lime-400/30 hover:shadow-lg transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <Dumbbell size={18} />
                    Training
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}