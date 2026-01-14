import React, { useState, useEffect } from 'react';
import { Calendar, Edit2, Trash2, Plus, ChevronLeft, ChevronRight, Target, RefreshCw } from 'lucide-react';
import MealDetailModal from './MealDetail.jsx';
import EditPlanModal from './EditModal.jsx';
import DeleteConfirmModal from './DeleteConfirmModal.jsx';
import ReplaceMealModal from './ReplaceMealModal.jsx';
import AddMealToDayModal from './AddMealToDayModal.jsx';
import { useNutrition } from '../store/NutritionContext.jsx';
import { useAuth } from "../store/AuthContext";
import Sidebar from "../../../layout/Sidebar"; // on dois remonté trois fichiers 


const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MyPrograms = () => {
  const {
    loadUserPlansForDay,
    updateNutritionPlan,
    deleteNutritionPlan,
    removeMealFromPlan,
    replaceMealInPlan,
    addMealToPlan,
    recordMealConsumption,
    loading
  } = useNutrition();

  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [currentDay, setCurrentDay] = useState('Monday');
  const [saveMsg, setSaveMsg] = useState("");
  const [saveErr, setSaveErr] = useState("");
  
  // ✅ États modaux
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletingPlan, setDeletingPlan] = useState(null);
  const [replacingMeal, setReplacingMeal] = useState(null);
  const [addingMealToDay, setAddingMealToDay] = useState(null);
  const [removingMealId, setRemovingMealId] = useState(null);
  const [savingMealId, setSavingMealId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user, loadingUser } = useAuth();
const userId = user?.idUser;

useEffect(() => {
  if (loadingUser || !userId) return;

  const fetchPrograms = async () => {
    try {
      const data = await loadUserPlansForDay(userId, currentDay);
      setPrograms(data || []);

      if (!data || data.length === 0) {
        setSelectedProgram(null);
        return;
      }

      // garder selectedProgram à jour
      if (!selectedProgram) {
        setSelectedProgram(data[0]);
      } else {
        const updated = data.find(p => p.idNutrition === selectedProgram.idNutrition);
        setSelectedProgram(updated || data[0]);
      }
    } catch (err) {
      console.error("Error fetching programs:", err);
      setSaveErr("Failed to load programs");
      setTimeout(() => setSaveErr(""), 5000);
    }
  };

  fetchPrograms();
}, [loadingUser, userId, currentDay, loadUserPlansForDay, selectedProgram]);


  // 🔥 Mettre à jour un plan
  const handleUpdatePlan = async (formData) => {
    try {
      await updateNutritionPlan(selectedProgram.idNutrition, formData);
      
      setSaveMsg('✅ Plan updated successfully!');
      setTimeout(() => setSaveMsg(""), 3000);
      
      // Recharger
      const data = await loadUserPlansForDay(userId, currentDay, true);
      setPrograms(data || []);
      setEditingPlan(null);
    } catch (e) {
      console.error('Update error:', e);
      setSaveErr(`❌ Failed to update: ${e.message}`);
      setTimeout(() => setSaveErr(""), 5000);
    }
  };

  // 🔥 Supprimer un plan
  const handleDeletePlan = async (planId) => {
    setIsDeleting(true);
    try {
      await deleteNutritionPlan(planId);
      
      setSaveMsg('✅ Plan deleted successfully!');
      setTimeout(() => setSaveMsg(""), 3000);
      setSelectedProgram(null);
      setDeletingPlan(null);
      
      // Recharger
      const data = await loadUserPlansForDay(userId, currentDay, true);
      setPrograms(data || []);
    } catch (e) {
      console.error('Delete error:', e);
      setSaveErr(`❌ Failed to delete: ${e.message}`);
      setTimeout(() => setSaveErr(""), 5000);
    } finally {
      setIsDeleting(false);
    }
  };

  // 🔥 Supprimer un meal
  const handleRemoveMeal = async (meal) => {
    setRemovingMealId(meal.idMeal);
    try {
      await removeMealFromPlan(
        selectedProgram.idNutrition,
        meal.idMeal,
        currentDay,
        meal.mealType
      );
      
      setSaveMsg('✅ Meal removed successfully!');
      setTimeout(() => setSaveMsg(""), 3000);
      
      // Recharger
      const data = await loadUserPlansForDay(userId, currentDay, true);
      setPrograms(data || []);
    } catch (e) {
      console.error('Remove meal error:', e);
      setSaveErr(`❌ Failed to remove meal: ${e.message}`);
      setTimeout(() => setSaveErr(""), 5000);
    } finally {
      setRemovingMealId(null);
    }
  };

  // 🔥 Remplacer un meal
  const handleReplaceMeal = async (oldMealId, newMealId, dayOfWeek, mealSlot) => {
    try {
      await replaceMealInPlan(
        selectedProgram.idNutrition,
        oldMealId,
        newMealId,
        dayOfWeek,
        mealSlot
      );
      
      setSaveMsg('✅ Meal replaced successfully!');
      setTimeout(() => setSaveMsg(""), 3000);
      setReplacingMeal(null);
      
      // Recharger
      const data = await loadUserPlansForDay(userId, currentDay, true);
      setPrograms(data || []);
    } catch (e) {
      console.error('Replace meal error:', e);
      setSaveErr(`❌ Failed to replace meal: ${e.message}`);
      setTimeout(() => setSaveErr(""), 5000);
      throw e;
    }
  };

  // 🔥 Ajouter un meal
  const handleAddMeal = async (programId, mealId, dayOfWeek, mealSlot) => {
    try {
      await addMealToPlan(programId, mealId, dayOfWeek, mealSlot);
      
      setSaveMsg('✅ Meal added successfully!');
      setTimeout(() => setSaveMsg(""), 3000);
      setAddingMealToDay(null);
      
      // Recharger
      const data = await loadUserPlansForDay(userId, currentDay, true);
      setPrograms(data || []);
    } catch (e) {
      console.error('Add meal error:', e);
      setSaveErr(`❌ Failed to add meal: ${e.message}`);
      setTimeout(() => setSaveErr(""), 5000);
      throw e;
    }
  };

  // 🔥 Enregistrer la consommation
  const handleSaveMeal = async (meal) => {
    setSavingMealId(meal.idMeal);
    try {
      await recordMealConsumption(
        userId,
        meal.idMeal,
        new Date().toISOString().slice(0, 10),
        1
      );
      
      setSaveMsg(`✅ ${meal.mealName} saved to your diary!`);
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (e) {
      console.error("Save meal error:", e);
      setSaveErr(`❌ Failed to save: ${e.message}`);
      setTimeout(() => setSaveErr(""), 5000);
    } finally {
      setSavingMealId(null);
    }
  };

  // ✅ Utiliser la clé de loading du contexte
  const isLoadingPlans = loading[`plansByUser_${userId}_${currentDay}`];

  const getMealIcon = (type) => {
    const icons = {
      breakfast: '🍳',
      lunch: '🍱',
      dinner: '🍽️',
      snack: '🍎',
      BREAKFAST: '🍳',
      LUNCH: '🍱',
      DINNER: '🍽️',
      SNACK: '🍎'
    };
    return icons[type] || '🍽️';
  };

  const EmptyState = () => (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a]">
      <Sidebar active="nutrition" />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-lime-400/10 rounded-full flex items-center justify-center">
            <Calendar className="w-16 h-16 text-lime-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">No Programs Yet</h2>
          <p className="text-gray-400 mb-8 max-w-md">
            Start your fitness journey by creating your first personalized nutrition program
          </p>
          <button 
            className="px-8 py-3 bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
            onClick={() => window.location.href = '/create-nutrition-plan'}
          >
            <Plus className="w-5 h-5" />
            Create New Program
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoadingPlans) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a]">
        <Sidebar active="nutrition" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lime-400 text-2xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  if (programs.length === 0) {
    return <EmptyState />;
  }

  const currentDayIndex = fullDays.indexOf(currentDay);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a]">
      <Sidebar active="nutrition" />
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
                  {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-lime-400">My Nutrition Programs</h1>
              <button
                onClick={() => window.location.href = '/nutrition'}
                className="px-6 py-3 bg-gray-800 hover:bg-lime-400 text-lime-400 hover:text-gray-900 font-semibold rounded-xl border-2 border-gray-700 hover:border-lime-400 transition-all flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Nutrition Catalog
              </button>
            </div> 
            <div className="flex gap-3">
              {programs.length > 1 && (
                <select 
                  value={selectedProgram?.idNutrition || ''}
                  onChange={(e) => {
                    const program = programs.find(p => p.idNutrition === parseInt(e.target.value));
                    setSelectedProgram(program);
                  }}
                  className="flex-1 p-3 rounded-xl bg-gray-800 text-white border-2 border-gray-700 hover:border-lime-400 focus:outline-none focus:border-lime-400 transition-all"
                >
                  {programs.map(program => (
                    <option key={program.idNutrition} value={program.idNutrition}>
                      {program.nutritionName}
                    </option>
                  ))}
                </select>
              )}
              
              {selectedProgram && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingPlan(selectedProgram)}
                    className="p-3 bg-gray-800 hover:bg-lime-400 text-lime-400 hover:text-gray-900 rounded-xl border-2 border-gray-700 hover:border-lime-400 transition-all"
                    title="Edit Plan"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeletingPlan(selectedProgram)}
                    className="p-3 bg-gray-800 hover:bg-red-500 text-red-400 hover:text-white rounded-xl border-2 border-gray-700 hover:border-red-500 transition-all"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          {saveMsg && (
            <div className="mb-4 p-3 rounded-xl bg-lime-400/20 border border-lime-400/50 text-lime-400">
              {saveMsg}
            </div>
          )}

          {saveErr && (
            <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-500/50 text-red-400">
              {saveErr}
            </div>
          )}

          {selectedProgram && (
            <>
              {/* Info Card */}
              <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 mb-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-lime-400 mb-4">{selectedProgram.nutritionName}</h2>
                <div className="grid grid-cols-2 gap-4 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-lime-400" />
                    <div>
                      <div className="text-xs text-gray-500 uppercase">Objective</div>
                      <div className="font-semibold text-white">{selectedProgram.objective}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-lime-400" />
                    <div>
                      <div className="text-xs text-gray-500 uppercase">Duration</div>
                      <div className="font-semibold text-white text-sm">
                        {selectedProgram.startDate} → {selectedProgram.endDate}
                      </div>
                    </div>
                  </div>
                </div>
                {selectedProgram.description && (
                  <p className="text-gray-400 mt-4 text-sm">{selectedProgram.description}</p>
                )}
              </div>

              {/* Weekly Calendar */}
              <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-4 mb-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={() => setCurrentDay(fullDays[Math.max(0, currentDayIndex - 1)])}
                    disabled={currentDayIndex === 0}
                    className="p-2 rounded-full bg-gray-700 hover:bg-lime-400 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-gray-700 transition-all text-lime-400"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-xl font-bold text-lime-400">{currentDay}</h3>
                  <button 
                    onClick={() => setCurrentDay(fullDays[Math.min(6, currentDayIndex + 1)])}
                    disabled={currentDayIndex === 6}
                    className="p-2 rounded-full bg-gray-700 hover:bg-lime-400 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-gray-700 transition-all text-lime-400"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex gap-2 justify-center">
                  {days.map((day, idx) => (
                    <button
                      key={day}
                      onClick={() => setCurrentDay(fullDays[idx])}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        fullDays[idx] === currentDay
                          ? 'bg-lime-400 text-gray-900 shadow-lg shadow-lime-400/50'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meals Section */}
              {selectedProgram.meals && selectedProgram.meals.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {selectedProgram.meals.map((meal, idx) => (
                    <div key={idx} className="bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-gray-700 hover:border-lime-400/50 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{getMealIcon(meal.mealType)}</div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{meal.mealName}</h3>
                            {meal.mealType && (
                              <span className="text-sm text-lime-400 font-medium capitalize">
                                {meal.mealType}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setReplacingMeal({ meal, dayOfWeek: currentDay })}
                            className="p-2 text-lime-400 hover:bg-lime-400/20 rounded-lg transition-all"
                            title="Replace meal"
                          >
                            <RefreshCw className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleRemoveMeal(meal)}
                            disabled={removingMealId === meal.idMeal}
                            className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-all disabled:opacity-50"
                            title="Remove meal"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {meal.description && (
                        <p className="text-gray-400 text-sm mb-4">{meal.description}</p>
                      )}

                      {meal.ingredients && meal.ingredients.length > 0 && (
                        <>
                          <ul className="space-y-2 mb-4">
                            {meal.ingredients.map((ing, i) => (
                              <li key={i} className="text-gray-300 text-sm flex items-start">
                                <span className="mr-2 text-lime-400">•</span>
                                <span>{ing.foodName} - {ing.quantity_grams}g</span>
                              </li>
                            ))}
                          </ul>

                          <div className="flex gap-2 mb-4 flex-wrap">
                            <span className="px-3 py-1 bg-red-900/30 text-red-400 border border-red-500/30 rounded-full text-xs font-medium">
                              {meal.ingredients.reduce((sum, ing) => sum + (Number(ing.calories) || 0), 0).toFixed(0)} kcal
                            </span>
                            <span className="px-3 py-1 bg-purple-900/30 text-purple-400 border border-purple-500/30 rounded-full text-xs font-medium">
                              {meal.ingredients.reduce((sum, ing) => sum + (Number(ing.proteins) || 0), 0).toFixed(0)}g Protein
                            </span>
                            <span className="px-3 py-1 bg-orange-900/30 text-orange-400 border border-orange-500/30 rounded-full text-xs font-medium">
                              {meal.ingredients.reduce((sum, ing) => sum + (Number(ing.carbs) || 0), 0).toFixed(0)}g Carbs
                            </span>
                            <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-medium">
                              {meal.ingredients.reduce((sum, ing) => sum + (Number(ing.fats) || 0), 0).toFixed(0)}g Fats
                            </span>
                          </div>
                        </>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedMeal(meal)}
                          className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
                        >
                          View Recipe
                        </button>
                        
                        <button
                          onClick={() => handleSaveMeal(meal)}
                          disabled={savingMealId === meal.idMeal}
                          className="flex-1 py-3 bg-lime-400 hover:bg-lime-500 disabled:opacity-60 text-gray-900 font-semibold rounded-xl transition-all"
                        >
                          {savingMealId === meal.idMeal ? "Saving..." : "Save Meal"}
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {selectedProgram.meals.length < 4 && (
                    <button
                      onClick={() => setAddingMealToDay({
                        dayOfWeek: currentDay,
                        existingMealTypes: selectedProgram.meals.map(m => m.mealType.toUpperCase())
                      })}
                      className="w-full py-4 bg-gray-800/50 hover:bg-lime-400/10 border-2 border-dashed border-gray-600 hover:border-lime-400 rounded-2xl transition-all flex items-center justify-center gap-2 text-gray-400 hover:text-lime-400 group"
                    >
                      <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold">Add Another Meal ({selectedProgram.meals.length}/4)</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-12 text-center border border-gray-700 mb-6">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-2xl font-bold text-white mb-2">No Meals for {currentDay}</h3>
                  <p className="text-gray-400 mb-6">Add your first meal to this day</p>
                  <button 
                    onClick={() => setAddingMealToDay({
                      dayOfWeek: currentDay,
                      existingMealTypes: []
                    })}
                    className="px-6 py-3 bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold rounded-full transition-all flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Add First Meal
                  </button>
                </div>
              )}

              {/* Daily Summary */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border-2 border-lime-400/30">
                <h3 className="text-2xl font-bold text-lime-400 mb-4">Daily Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                    <div className="text-3xl font-bold text-lime-400">{selectedProgram.caloriesPerDay || 0}</div>
                    <div className="text-gray-400 text-sm uppercase">Target Calories</div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                    <div className="text-3xl font-bold text-lime-400">
                      {selectedProgram.meals?.reduce((sum, meal) => 
                        sum + (meal.ingredients?.reduce((s, ing) => s + (Number(ing.proteins) || 0), 0) || 0), 0
                      ).toFixed(0) || 0}g
                    </div>
                    <div className="text-gray-400 text-sm uppercase">Protein</div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                    <div className="text-3xl font-bold text-lime-400">
                      {selectedProgram.meals?.reduce((sum, meal) => 
                        sum + (meal.ingredients?.reduce((s, ing) => s + (Number(ing.carbs) || 0), 0) || 0), 0
                      ).toFixed(0) || 0}g
                    </div>
                    <div className="text-gray-400 text-sm uppercase">Carbs</div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                    <div className="text-3xl font-bold text-lime-400">
                      {selectedProgram.meals?.reduce((sum, meal) => 
                        sum + (meal.ingredients?.reduce((s, ing) => s + (Number(ing.fats) || 0), 0) || 0), 0
                      ).toFixed(0) || 0}g
                    </div>
                    <div className="text-gray-400 text-sm uppercase">Fats</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modals */}
        {selectedMeal && (
          <MealDetailModal
            meal={selectedMeal}
            onClose={() => setSelectedMeal(null)}
          />
        )}

        {editingPlan && (
          <EditPlanModal
            program={editingPlan}
            onClose={() => setEditingPlan(null)}
            onSave={handleUpdatePlan}
          />
        )}

        {deletingPlan && (
          <DeleteConfirmModal
            programName={deletingPlan.nutritionName}
            onClose={() => setDeletingPlan(null)}
            onConfirm={() => handleDeletePlan(deletingPlan.idNutrition)}
            isDeleting={isDeleting}
          />
        )}

        {replacingMeal && (
          <ReplaceMealModal
            currentMeal={replacingMeal.meal}
            dayOfWeek={replacingMeal.dayOfWeek}
            programId={selectedProgram.idNutrition}
            onClose={() => setReplacingMeal(null)}
            onReplace={handleReplaceMeal}
          />
        )}

        {addingMealToDay && (
          <AddMealToDayModal
            dayOfWeek={addingMealToDay.dayOfWeek}
            programId={selectedProgram.idNutrition}
            existingMealTypes={addingMealToDay.existingMealTypes}
            onClose={() => setAddingMealToDay(null)}
            onAdd={handleAddMeal}
          />
        )}
      </div>
    </div>
  );
};

export default MyPrograms;