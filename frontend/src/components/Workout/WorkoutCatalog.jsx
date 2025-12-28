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

  if (loading) return <p className="text-white text-center text-xl py-12">Loading...</p>;
  if (showCreateWizard) {
    return <CreateProgramWizard />;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            <span className="text-[#D6F93D]">WORKOUT</span> CATALOG
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover our curated selection of professional workouts designed to
            transform your body.
          </p>
        </div>

        {/* Grille responsive automatique */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {workouts.map((w) => (
            <WorkoutCard key={w.id} workout={w} onMoreClick={handleMoreClick} />
          ))}
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <button className="flex-1 bg-transparent border-2 border-lime-400 text-[#D6F93D] hover:bg-lime-400 hover:text-gray-900 font-bold py-3 px-8 rounded-lg transition-all duration-200 uppercase tracking-wider">
            Generate
          </button>
          <button
            onClick={() => setShowCreateWizard(true)} // ✅ ACTION
            className="flex-1 bg-transparent border-2 border-lime-400 text-[#D6F93D] hover:bg-lime-400 hover:text-gray-900 font-bold py-3 px-8 rounded-lg transition-all duration-200 uppercase tracking-wider"
          >
            Create
          </button>
        </div>

        {/* Modale détail */}
        {isDetailOpen && (
          <WorkoutDetailModal
            detail={selectedWorkoutDetail}
            onClose={handleCloseDetail}
          />
        )}
      </div>
    </section>
  );
};

export default WorkoutCatalog;