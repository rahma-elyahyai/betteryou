
// WorkoutCatalog.jsx
import React, { useEffect, useState } from "react";
import { fetchWorkouts, fetchWorkoutDetail } from "../../api/Workout/workoutApi";
import WorkoutCard from "./WorkoutCard";
import WorkoutDetailModal from "./WorkoutDetailModal";
import CreateProgramWizard from "./CreateProgramWizard";

const WorkoutCatalog = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkoutDetail, setSelectedWorkoutDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showCreateWizard, setShowCreateWizard] = useState(false);

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
      console.log("Detail loaded:", detail);
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

  if (showCreateWizard) {
    return <CreateProgramWizard />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a]">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Header avec Navigation */}
        <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">Workout</h1>
                  <p className="text-gray-500 text-sm">Professional Training Programs</p>
                </div>
              </div>
              
              <button 
                onClick={() => window.location.href = '/myprograms'}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-lime-400 hover:text-lime-300 rounded-xl font-semibold transition-all border border-gray-700 hover:border-lime-400/30"
              >
                <span>My Programs</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-8 py-12">
            
            {/* Title Section */}
            <div className="mb-12">
              <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-lime-300 to-lime-500 mb-4 tracking-tight">
                WORKOUT CATALOG
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl">
                Discover our curated selection of professional workouts designed to transform your body and maximize your results
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-gray-800 border-t-lime-400 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-400 text-base mt-6 font-medium">Loading your workouts...</p>
              </div>
            )}

            {/* Workouts Grid */}
            {!loading && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                  {workouts.map((w) => (
                    <WorkoutCard key={w.id} workout={w} onMoreClick={handleMoreClick} />
                  ))}
                </div>

                {/* Action Buttons - CENTRÉ */}
                <div className="flex justify-center items-center gap-6 py-12 border-t border-gray-800">
                  <button 
                    className="group relative px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-black text-lg uppercase tracking-wider rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-600/40 transform hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate
                    </span>
                  </button>

                  <button 
                    onClick={() => setShowCreateWizard(true)}
                    className="group relative px-12 py-5 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-500 hover:to-lime-600 text-gray-900 font-black text-xl uppercase tracking-wider rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-lime-500/40 transform hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                      </svg>
                      Create
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && (
        <WorkoutDetailModal
          detail={selectedWorkoutDetail}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default WorkoutCatalog;