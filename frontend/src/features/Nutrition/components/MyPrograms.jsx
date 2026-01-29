import React, { useState, useEffect } from 'react';
import { Calendar, Edit2, Trash2, Plus, ChevronLeft, ChevronRight, Target, RefreshCw } from 'lucide-react';
import MealDetailModal from './MealDetail.jsx';
import EditPlanModal from './EditModal.jsx';
import DeleteConfirmModal from './DeleteConfirmModal.jsx';
import ReplaceMealModal from './ReplaceMealModal.jsx';
import AddMealToDayModal from './AddMealToDayModal.jsx';
import { useNutrition } from '../store/NutritionContext.jsx';
import Sidebar from '../../../layout/Sidebar';

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
    isPlanActive,
    loading
  } = useNutrition();

  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [currentDay, setCurrentDay] = useState('Monday');
  const [saveMsg, setSaveMsg] = useState("");
  const [saveErr, setSaveErr] = useState("");
  
  // États modaux
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletingPlan, setDeletingPlan] = useState(null);
  const [replacingMeal, setReplacingMeal] = useState(null);
  const [addingMealToDay, setAddingMealToDay] = useState(null);
  const [removingMealId, setRemovingMealId] = useState(null);
  const [savingMealId, setSavingMealId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const userId = 1; // TODO: remplacer par user réel

  useEffect(() => {
    if (!userId) return;

    const fetchPrograms = async () => {
      try {
        const data = await loadUserPlansForDay(userId, currentDay);
        setPrograms(data || []);

        if (!data || data.length === 0) {
          setSelectedProgram(null);
          return;
        }

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
  }, [currentDay, loadUserPlansForDay]);

  const handleUpdatePlan = async (formData) => {
    if (!selectedProgram || !isPlanActive(selectedProgram)) {
      alert('⚠️ This nutrition plan has ended and cannot be modified.');
      return;
    }
    try {
      await updateNutritionPlan(selectedProgram.idNutrition, formData);
      setSaveMsg('✅ Plan updated successfully!');
      setTimeout(() => setSaveMsg(""), 3000);
      const data = await loadUserPlansForDay(userId, currentDay, true);
      setPrograms(data || []);
      setEditingPlan(null);
    } catch (e) {
      console.error('Update error:', e);
      setSaveErr(`❌ Failed to update: ${e.message}`);
      setTimeout(() => setSaveErr(""), 5000);
    }
  };

  const handleDeletePlan = async (planId) => {
    setIsDeleting(true);
    try {
      await deleteNutritionPlan(planId);
      setSaveMsg('✅ Plan deleted successfully!');
      setTimeout(() => setSaveMsg(""), 3000);
      setSelectedProgram(null);
      setDeletingPlan(null);
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

  const handleRemoveMeal = async (meal) => {
    if (!selectedProgram || !isPlanActive(selectedProgram)) {
      alert('⚠️ This nutrition plan has ended and cannot be modified.');
      return;
    }
    setRemovingMealId(meal.idMeal);
    try {
      await removeMealFromPlan(selectedProgram.idNutrition, meal.idMeal, currentDay, meal.mealType);
      setSaveMsg('✅ Meal removed successfully!');
      setTimeout(() => setSaveMsg(""), 3000);
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

  const handleReplaceMeal = async (oldMealId, newMealId, dayOfWeek, mealSlot) => {
    if (!selectedProgram || !isPlanActive(selectedProgram)) {
      alert('⚠️ This nutrition plan has ended and cannot be modified.');
      throw new Error('Plan inactive');
    }
    try {
      await replaceMealInPlan(selectedProgram.idNutrition, oldMealId, newMealId, dayOfWeek, mealSlot);
      setSaveMsg('✅ Meal replaced successfully!');
      setTimeout(() => setSaveMsg(""), 3000);
      setReplacingMeal(null);
      const data = await loadUserPlansForDay(userId, currentDay, true);
      setPrograms(data || []);
    } catch (e) {
      console.error('Replace meal error:', e);
      setSaveErr(`❌ Failed to replace meal: ${e.message}`);
      setTimeout(() => setSaveErr(""), 5000);
      throw e;
    }
  };

  const handleAddMeal = async (programId, mealId, dayOfWeek, mealSlot) => {
    if (!selectedProgram || !isPlanActive(selectedProgram)) {
      alert('⚠️ This nutrition plan has ended and cannot be modified.');
      throw new Error('Plan inactive');
    }
    try {
      await addMealToPlan(programId, mealId, dayOfWeek, mealSlot);
      setSaveMsg('✅ Meal added successfully!');
      setTimeout(() => setSaveMsg(""), 3000);
      setAddingMealToDay(null);
      const data = await loadUserPlansForDay(userId, currentDay, true);
      setPrograms(data || []);
    } catch (e) {
      console.error('Add meal error:', e);
      setSaveErr(`❌ Failed to add meal: ${e.message}`);
      setTimeout(() => setSaveErr(""), 5000);
      throw e;
    }
  };

  const handleSaveMeal = async (meal) => {
    setSavingMealId(meal.idMeal);
    try {
      await recordMealConsumption(userId, meal.idMeal, new Date().toISOString().slice(0, 10), 1);
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

  const isLoadingPlans = loading[`plansByUser_${userId}_${currentDay}`];

  const getMealIcon = (type) => {
    const icons = { breakfast: '🍳', lunch: '🍱', dinner: '🍽️', snack: '🍎' };
    return icons[type.toLowerCase()] || '🍽️';
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

  if (!programs || programs.length === 0) {
    return <EmptyState />;
  }

  const currentDayIndex = fullDays.indexOf(currentDay);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      {/* … Tout le reste du rendu reste le même que ton code initial … */}
      {/* N'oublie pas de conserver les modals à la fin */}
    </div>
  );
};

export default MyPrograms;
