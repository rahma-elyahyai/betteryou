import React, { useEffect, useState } from "react";
import { fetchWorkouts, fetchWorkoutDetail } from "../../api/Workout/workoutApi";
import WorkoutCard from "./WorkoutCard";
import WorkoutDetailModal from "./WorkoutDetailModal";
import CreateProgramWizard from "./CreateProgramWizard";
import GenerateProgramModal from "./GenerateProgramModal";
import { generateWeekProgramAI } from "../../api/Workout/aiProgramApi";
import Sidebar from "@/Layout/Sidebar";

const WorkoutCatalog = ({ onGoPrograms }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkoutDetail, setSelectedWorkoutDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [openGenerate, setOpenGenerate] = useState(false);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const data = await fetchWorkouts();
        setWorkouts(data);
      } catch (error) {
        console.error("Erreur lors du chargement des workouts", error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  const handleMoreClick = async (workoutId) => {
    try {
      console.log("Loading detail for id =", workoutId);
      const detail = await fetchWorkoutDetail(workoutId);
      setSelectedWorkoutDetail(detail);
      setIsDetailOpen(true);
    } catch (error) {
      console.error("Erreur lors du chargement du détail", error);
    }
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedWorkoutDetail(null);
  };

  const handleGenerate = async ({ userNotes, constraints }) => {
    try {
      console.log("✅ Generate program with:", { 
        userNotes, 
        constraints,
        timestamp: new Date().toISOString()
      });

      const userId = 1;

      console.log("➡️ Calling POST /api/ai/programs/generate-week with:", {
        userId,
        userNotes,
        constraints
      });

      const res = await generateWeekProgramAI({
        userId,
        userNotes: userNotes?.trim() || "",
        constraints: constraints?.trim() || "",
      });
      
      console.log("✅ AI program created:", res);
      console.log("✅ Program ID:", res?.programId);
      console.log("✅ Response status:", res?.status);

      setOpenGenerate(false);

      if (res?.programId && onGoPrograms) {
        console.log("✅ Navigation to programs page");
        onGoPrograms();
      } else {
        console.warn("⚠️ No programId in response:", res);
      }
      
    } catch (e) {
      console.error("❌ AI generation failed:", e);
      console.error("❌ Error status:", e?.response?.status);
      console.error("❌ Error data:", e?.response?.data);
      console.error("❌ Error message:", e?.message);
      console.error("❌ Full error:", e);
      
      alert(
        "Generation failed: " +
          (e?.response?.status ? `HTTP ${e.response.status} - ` : "") +
          JSON.stringify(e?.response?.data || e?.message || "Unknown error")
      );
    }
  };

  if (showCreateWizard) {
    return <CreateProgramWizard onClose={() => setShowCreateWizard(false)} />;
  }

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a]">
      {/* Ajout de la Sidebar ici */}
      <Sidebar active="workout" />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Workout</h1>
                <p className="text-gray-500 text-sm">
                  Professional Training Programs
                </p>
              </div>

              <button
                type="button"
                onClick={() => onGoPrograms?.()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-lime-400 hover:text-lime-300 rounded-xl font-semibold transition-all border border-gray-700 hover:border-lime-400/30"
              >
                <span>My Programs</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-8 py-12">
            {/* Title */}
            <div className="mb-12">
              <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-lime-300 to-lime-500 mb-4 tracking-tight">
                WORKOUT CATALOG
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl">
                Discover our curated selection of professional workouts designed
                to transform your body and maximize your results
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="w-20 h-20 border-4 border-gray-800 border-t-lime-400 rounded-full animate-spin" />
                <p className="text-gray-400 text-base mt-6 font-medium">
                  Loading your workouts...
                </p>
              </div>
            )}

            {/* Grid */}
            {!loading && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                  {workouts.map((w) => (
                    <WorkoutCard
                      key={w.id}
                      workout={w}
                      onMoreClick={handleMoreClick}
                    />
                  ))}
                </div>

                {/* Buttons */}
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto flex gap-6">
                  <button
                    type="button"
                    onClick={() => {
                      console.log("hi rahma");
                      setOpenGenerate(true);
                    }}
                    className="pointer-events-auto group px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-black text-lg uppercase tracking-wider rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-600/40 transform hover:scale-105 hover:-translate-y-1"
                  >
                    Generate
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCreateWizard(true)}
                    className="pointer-events-auto group px-12 py-5 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-500 hover:to-lime-600 text-gray-900 font-black text-xl uppercase tracking-wider rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-lime-500/40 transform hover:scale-105 hover:-translate-y-1"
                  >
                    Create
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {isDetailOpen && (
        <WorkoutDetailModal
          detail={selectedWorkoutDetail}
          onClose={handleCloseDetail}
        />
      )}

      {/* Generate modal */}
      <GenerateProgramModal
        open={openGenerate}
        onClose={() => setOpenGenerate(false)}
        onGenerate={handleGenerate}
      />
    </div>
  );
};

export default WorkoutCatalog;