import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, X, TrendingDown, Scale, TrendingUp } from 'lucide-react';

/* ------------------------- 🔥 NORMALISATION GLOBALE ------------------------- */
/*  Fonction accessible partout (hoisted) → évite l'erreur "before initialization" */
function normalizeGoal(goal) {
  if (!goal || typeof goal !== 'string') return '';

  const goalMap = {
    'LOSE_WEIGHT': 'LOSE_WEIGHT',
    'LOSE WEIGHT': 'LOSE_WEIGHT',
    'LOSEWEIGHT': 'LOSE_WEIGHT',
    'lose_weight': 'LOSE_WEIGHT',

    'MAINTAIN': 'MAINTAIN',
    'maintain': 'MAINTAIN',

    'GAIN_MASS': 'GAIN_MASS',
    'GAIN MASS': 'GAIN_MASS',
    'GAINMASS': 'GAIN_MASS',
    'gain_mass': 'GAIN_MASS',
  };

  const normalized = goal.trim().toUpperCase().replace(/\s+/g, '_');
  return goalMap[normalized] || goalMap[goal.trim()] || normalized;
}

/* -------------------------- 🔥 COMPOSANT PRINCIPAL -------------------------- */
export default function ObjectiveSection({ userGoal }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessNotif, setShowSuccessNotif] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(normalizeGoal(userGoal || ""));
  const [loading, setLoading] = useState(true);

  // 🔥 Met à jour la sélection lorsque ProfilePage change userGoal
  useEffect(() => {
    setSelectedGoal(normalizeGoal(userGoal || ""));
  }, [userGoal]);

  const goals = [
    { id: 'LOSE_WEIGHT', title: 'LOSE WEIGHT', icon: TrendingDown, description: 'Reduce body fat while preserving muscle mass' },
    { id: 'MAINTAIN', title: 'MAINTAIN', icon: Scale, description: 'Maintain your weight while improving your body composition.' },
    { id: 'GAIN_MASS', title: 'GAIN MASS', icon: TrendingUp, description: 'Intensive strength training develops power and muscle volume.' }
  ];

  /* ----------------------- 🔥 FETCH OBJECTIVE DE LA DB ----------------------- */
  const fetchUserObjective = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/profile");

      if (!response.ok) {
        console.error("❌ Response not OK:", response.status);
        setLoading(false);
        return;
      }

      const data = await response.json();

      const dbGoal = data.objective?.goal || "";
      const normalized = normalizeGoal(dbGoal);

      setSelectedGoal(normalized);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching objective:", error);
      setLoading(false);
    }
  };

  // 🔥 On charge l'objectif uniquement au chargement
  useEffect(() => {
    fetchUserObjective();
  }, []);

  /* ----------------------- 🔥 SAUVEGARDE DES MODIFS ----------------------- */
  const handleSaveModifications = async () => {
    try {
      const payload = { goal: selectedGoal };

      const response = await fetch("http://localhost:8080/api/profile/objective", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Backend error:", await response.text());
        return;
      }

      setIsEditing(false);
      setShowSuccessNotif(true);
      setTimeout(() => setShowSuccessNotif(false), 3000);

      // 🔥 On recharge depuis la base (affichage correct direct)
      await fetchUserObjective();
    } catch (error) {
      console.error("Error saving objective:", error);
    }
  };

  if (loading) return <div className="text-white p-4">Loading...</div>;

  /* ---------------------------- 🔥 RENDER UI ---------------------------- */
  return (
    <>
      <div className="bg-[#2C0E4E] rounded-lg p-8 relative" style={{ border: "1px solid #D6F93D" }}>

        {/* ❌ Bouton Annuler */}
        {isEditing && (
          <button
            onClick={() => {
              setIsEditing(false);
              fetchUserObjective(); // Réinitialise à la valeur DB
            }}
            className="absolute top-4 right-4 text-white"
            style={{ color: "#D6F93D" }}
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {/* Titre */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-700/30 p-2 rounded-full">
              <Target className="w-6 h-6" style={{ color: "#D6F93D" }} />
            </div>
            <h2 className="text-2xl font-bold text-white">Objective</h2>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 rounded-lg font-bold text-black"
              style={{ backgroundColor: "#D6F93D" }}
            >
              Modify
            </button>
          )}
        </div>

        {/* CARTES DES OBJECTIFS */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {goals.map(goal => {
            const Icon = goal.icon;
            const isSelected = selectedGoal === goal.id;

            return (
              <button
                key={goal.id}
                disabled={!isEditing}
                onClick={() => isEditing && setSelectedGoal(goal.id)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-[#D6F93D] bg-purple-800/50"
                    : "border-purple-700 hover:border-purple-500"
                } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <Icon className="w-8 h-8 mb-2"
                      style={{ color: isSelected ? "#D6F93D" : "#9333ea" }} />

                <h3 className="text-white font-bold">{goal.title}</h3>
                <p className="text-gray-300 text-sm">{goal.description}</p>
              </button>
            );
          })}
        </div>

        {/* SAVE BUTTON */}
        {isEditing && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleSaveModifications}
              className="px-12 py-3 rounded-lg font-bold text-black"
              style={{ backgroundColor: "#D6F93D" }}
            >
              Save modifications
            </button>
          </div>
        )}
      </div>

      {/* SUCCESS NOTIF */}
      {showSuccessNotif && (
        <div className="fixed top-8 right-8 z-50 animate-slide-in">
          <div className="px-6 py-4 flex items-center gap-3 rounded-lg shadow-lg"
               style={{ backgroundColor: "#D6F93D", border: "1px solid #b8d631" }}>
            <CheckCircle className="w-6 h-6 text-green-700" />
            <div>
              <p className="font-bold text-black">Objective updated!</p>
              <p className="text-gray-800 text-sm">Your new goal has been saved</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(300px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </>
  );
}
