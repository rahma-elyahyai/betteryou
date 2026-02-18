import React, { useState, useEffect } from 'react';
import { X, Plus, Search } from 'lucide-react';
import { useNutrition } from '../store/NutritionContext';

const AddMealToDayModal = ({ dayOfWeek, programId, objective, existingMealTypes, onClose, onAdd }) => {
  const { loadAllMeals, cache, loading } = useNutrition();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const allSlots = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
  const availableSlots = allSlots.filter(slot => 
    !existingMealTypes.includes(slot)
  );

  useEffect(() => {
    // 🔥 Charger depuis le context (avec cache)
    loadAllMeals();
  }, [loadAllMeals]);

  const meals = cache.allMeals || [];
  
  // ✅ CORRECTION: Utiliser la bonne clé de loading
  const isLoading = loading['allMeals'];

  const filteredMeals = meals.filter(meal => {
    // 🆕 Filtrage par objectif du plan (optionnel via toggle)
    if (filterByObjective && planObjective && meal.goal && meal.goal !== planObjective) {
      return false;
    }
    const matchSlot = !selectedSlot || meal.mealType === selectedSlot;
    const s = searchTerm.toLowerCase();
    const matchSearch =
      (meal.mealName || "").toLowerCase().includes(s) ||
      (meal.description || "").toLowerCase().includes(s);

    return matchSlot && matchSearch;
  });

  const handleAdd = async () => {
    if (!selectedMeal || !selectedSlot) return;
    
    setIsAdding(true);
    try {
      await onAdd(programId, selectedMeal.idMeal, dayOfWeek, selectedSlot);
      onClose();
    } catch (error) {
      
      console.error('Add error:', error);
    } finally {
      setIsAdding(false);
    }
  };

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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-lime-400">Add Meal to {dayOfWeek}</h2>
            <p className="text-gray-400 text-sm mt-1">
              Select a meal slot and choose your meal
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ✅ Step 1: Select Available Meal Slot */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Step 1: Choose Meal Slot
          </label>
          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {availableSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-4 rounded-xl transition-all flex items-center gap-3 ${
                    selectedSlot === slot
                      ? 'bg-lime-400/20 border-2 border-lime-400'
                      : 'bg-gray-700 border-2 border-transparent hover:border-gray-600'
                  }`}
                >
                  <span className="text-2xl">{getMealIcon(slot)}</span>
                  <span className={`font-semibold ${
                    selectedSlot === slot ? 'text-lime-400' : 'text-white'
                  }`}>
                    {slot}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-center">
              <p className="font-semibold">All meal slots are filled for {dayOfWeek}</p>
              <p className="text-sm mt-1">Maximum 4 meals per day (Breakfast, Lunch, Dinner, Snack)</p>
            </div>
          )}
        </div>

        {/* ✅ Step 2: Select Meal (only if slot selected) */}
        {selectedSlot && availableSlots.length > 0 && (
          <>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Step 2: Choose Meal
            </label>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search meals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-lime-400 focus:outline-none"
              />
            </div>

            {/* ✅ CORRECTION: Utiliser isLoading au lieu de loading */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-gray-600 border-t-lime-400 rounded-full animate-spin"></div>
                <p className="text-gray-400 mt-3">Loading meals...</p>
              </div>
            ) : (
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {filteredMeals.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    {meals.length === 0 ? 'No meals available' : 'No meals found matching your search'}
                  </div>
                ) : (
                  filteredMeals.map(meal => (
                    <div
                      key={meal.idMeal}
                      onClick={() => setSelectedMeal(meal)}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        selectedMeal?.idMeal === meal.idMeal
                          ? 'bg-lime-400/20 border-2 border-lime-400'
                          : 'bg-gray-700 border-2 border-transparent hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{getMealIcon(meal.mealType)}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{meal.mealName}</h3>
                          {meal.description && (
                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                              {meal.description}
                            </p>
                          )}
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {meal.calories && (
                              <span className="text-xs px-2 py-1 bg-red-900/30 text-red-400 rounded-full">
                                {meal.calories} kcal
                              </span>
                            )}
                            {meal.proteins && (
                              <span className="text-xs px-2 py-1 bg-purple-900/30 text-purple-400 rounded-full">
                                {meal.proteins}g protein
                              </span>
                            )}
                            {meal.mealType && (
                              <span className="text-xs px-2 py-1 bg-lime-400/20 text-lime-400 rounded-full capitalize">
                                {meal.mealType.toLowerCase()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            disabled={isAdding}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedMeal || !selectedSlot || isAdding || availableSlots.length === 0}
            className="flex-1 py-3 bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add Meal
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMealToDayModal;
