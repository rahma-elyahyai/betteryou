import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Search, Calendar, Check, Loader } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNutrition } from '../store/NutritionContext';
import { useAuth } from '../store/AuthContext.jsx';



const AddMealsToPlan = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user, loadingUser } = useAuth();
  const userId = user?.idUser;

  // Utilisation du contexte
  const {
    loadAllMeals,
    loadPlanMealsForWeek,
    loadPlanDetails,
    addMealToPlan,
    removeMealFromPlan,
    loading: contextLoading
  } = useNutrition();

  const [plan, setPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showMealLibrary, setShowMealLibrary] = useState(false);
  const [availableMeals, setAvailableMeals] = useState([]);
  const [planMeals, setPlanMeals] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGoal, setFilterGoal] = useState('ALL');
  const [filterMealType, setFilterMealType] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);



  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealSlots = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];

  const slotIcons = {
    BREAKFAST: '🍳',
    LUNCH: '🍱',
    DINNER: '🍽️',
    SNACK: '🍎'
  };

useEffect(() => {
  if (loadingUser || !userId) return;
  loadAllData();
}, [loadingUser, userId, planId]);

const loadAllData = async () => {
  setLoading(true);
  setError(null);

  try {
    const planDetails = await loadPlanDetails(userId, planId);
    setPlan(planDetails);

    const meals = await loadAllMeals();
    console.log('All meals loaded:', meals);
    const filtered = planDetails?.objective
      ? meals.filter(m => m.goal === planDetails.objective)
      : meals;
    setAvailableMeals(filtered);

    const weekMeals = await loadPlanMealsForWeek(userId, planId);
    setPlanMeals(weekMeals || {});
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
  }
};


  const openMealLibrary = (day, slot) => {
    setSelectedDay(day);
    setSelectedSlot(slot);
    setShowMealLibrary(true);
    setFilterMealType(slot);
  };

const handleAddMeal = async (meal) => {
  setAdding(true);
  setError(null);
  try {
    await addMealToPlan(planId, meal.idMeal, selectedDay, selectedSlot);

    // update local immédiat
    const key = `${selectedDay}-${selectedSlot}`;
    setPlanMeals(prev => ({ ...prev, [key]: meal }));

    setShowMealLibrary(false);
  } catch (e) {
    setError("Failed to add meal.");
if (error.response?.data?.message?.includes("cannot modify a completed plan")) {
  alert("⚠️ This plan has ended. You can no longer modify it.");
} else {
  alert("Error: " + error.message);
}
    // reload
    const weekMeals = await loadPlanMealsForWeek(userId, planId, true);
    setPlanMeals(weekMeals || {});
  } finally {
    setAdding(false);
  }
};

const handleRemoveMeal = async (day, slot) => {
  const meal = getMealForSlot(day, slot);
  if (!meal) return;

  setError(null);
  try {
    await removeMealFromPlan(planId, meal.idMeal, day, slot);

    const key = `${day}-${slot}`;
    setPlanMeals(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  } catch (e) {
    setError("Failed to remove meal.");
    const weekMeals = await loadPlanMealsForWeek(userId, planId, true);
    setPlanMeals(weekMeals || {});
  }
};

console.log('🔍 Debugging filters:');
console.log('- availableMeals:', availableMeals?.length);
console.log('- filterGoal:', filterGoal);
console.log('- filterMealType:', filterMealType);
console.log('- searchQuery:', searchQuery);
  const filteredMeals = (availableMeals|| []).filter(meal => {
    const matchesSearch = meal.mealName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGoal = filterGoal === 'ALL' || meal.goal === filterGoal;
    const matchesType = filterMealType === 'ALL' || meal.mealType === filterMealType;
    return matchesSearch && matchesGoal && matchesType;
  });

  const getMealForSlot = (day, slot) => {
    return planMeals[`${day}-${slot}`];
  };

  const getTotalMealsForDay = (day) => {
    return Object.keys(planMeals).filter(key => key.startsWith(day)).length;
  };

  const finishPlanning = () => {
    navigate('/myprograms');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-lime-400 animate-spin mx-auto mb-4" />
          <div className="text-lime-400 text-xl font-semibold">Loading your plan...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a] p-4">
      <div className="max-w-7xl mx-auto py-8">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-lime-400 transition-all mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-lime-400 mb-2">Plan Your Weekly Meals</h1>
              <p className="text-gray-400">
                {plan?.nutritionName || 'Nutrition Program'} • {plan?.objective || 'Your Goal'}
              </p>
            </div>
            <button
              onClick={finishPlanning}
              className="px-6 py-3 bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold rounded-xl transition-all shadow-lg shadow-lime-400/30"
            >
              Finish & View Plan
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8 bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm font-semibold">Weekly Progress</span>
            <span className="text-lime-400 font-bold">{Object.keys(planMeals).length} / 28 meals</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-lime-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(Object.keys(planMeals).length / 28) * 100}%` }}
            />
          </div>
        </div>

        {/* Weekly Calendar Grid */}
        <div className="grid grid-cols-1 gap-4">
          {days.map(day => (
            <div key={day} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all">
              
              {/* Day Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-lime-400 flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  {day}
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    getTotalMealsForDay(day) === 4 
                      ? 'bg-lime-400/20 text-lime-400' 
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {getTotalMealsForDay(day)}/4 meals
                  </span>
                  {getTotalMealsForDay(day) === 4 && (
                    <Check className="w-5 h-5 text-lime-400" />
                  )}
                </div>
              </div>

              {/* Meal Slots Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                {mealSlots.map(slot => {
                  const meal = getMealForSlot(day, slot);
                  
                  return (
                    <div key={slot} className="bg-gray-900 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-xs uppercase font-semibold flex items-center gap-1">
                          {slotIcons[slot]} {slot}
                        </span>
                        {meal && (
                          <button
                            onClick={() => handleRemoveMeal(day, slot)}
                            className="text-red-400 hover:text-red-300 transition-all p-1 hover:bg-red-900/20 rounded"
                            title="Remove meal"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {meal ? (
                        <div className="text-white">
                          <p className="font-semibold text-sm mb-1 line-clamp-1">{meal.mealName}</p>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{meal.description}</p>
                          {meal.calories && (
                            <span className="text-xs text-lime-400 font-semibold">
                              {meal.calories} kcal
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => openMealLibrary(day, slot)}
                          className="w-full py-3 border-2 border-dashed border-gray-700 hover:border-lime-400 rounded-lg text-gray-500 hover:text-lime-400 transition-all flex items-center justify-center gap-2 group"
                        >
                          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-semibold">Add</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Meal Library Modal */}
        {showMealLibrary && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className="relative w-full max-w-6xl bg-gray-800 rounded-2xl border-2 border-gray-700 shadow-2xl my-8">
                
                {/* Modal Header */}
                <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 rounded-t-2xl z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-lime-400 flex items-center gap-2">
                        {slotIcons[selectedSlot]} Select {selectedSlot}
                      </h2>
                      <p className="text-gray-400 text-sm">For {selectedDay}</p>
                    </div>
                    <button
                      onClick={() => setShowMealLibrary(false)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                    >
                      <X className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>

                  {/* Search & Filters */}
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex-1 min-w-[200px] relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search meals..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 transition-all"
                      />
                    </div>
                    <select
                      value={filterGoal}
                      onChange={(e) => setFilterGoal(e.target.value)}
                      className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-lime-400 transition-all"
                    >
                      <option value="ALL">All Goals</option>
                      <option value="LOSE_WEIGHT">Lose Weight</option>
                      <option value="GAIN_MASS">Gain Mass</option>
                      <option value="MAINTAIN">Maintain</option>
                    </select>
                    <select
                      value={filterMealType}
                      onChange={(e) => setFilterMealType(e.target.value)}
                      className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-lime-400 transition-all"
                    >
                      <option value="ALL">All Types</option>
                      <option value="BREAKFAST">Breakfast</option>
                      <option value="LUNCH">Lunch</option>
                      <option value="DINNER">Dinner</option>
                      <option value="SNACK">Snack</option>
                    </select>
                  </div>
                </div>

                {/* Meals Grid */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  {!availableMeals || availableMeals.length === 0 ? (
                    <div>Loading meals...</div>
                  ) : filteredMeals.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredMeals.map(meal => (
                        <div
                          key={meal.idMeal}
                          className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden hover:border-lime-400/50 transition-all group"
                        >
                          <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-5xl">
                            {slotIcons[meal.mealType] || '🍽️'}
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-white mb-2 line-clamp-1">{meal.mealName}</h3>
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                              {meal.description}
                            </p>
                            <div className="flex gap-2 mb-3 flex-wrap">
                              {meal.goal && (
                                <span className="px-2 py-1 bg-lime-400/20 text-lime-400 rounded text-xs font-semibold">
                                  {meal.goal.replace('_', ' ')}
                                </span>
                              )}
                              {meal.foodPreferences && (
                                <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs">
                                  {meal.foodPreferences}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleAddMeal(meal)}
                              disabled={adding}
                              className="w-full py-2 bg-lime-400 hover:bg-lime-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 font-semibold rounded-lg transition-all"
                            >
                              {adding ? 'Adding...' : 'Add to Plan'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🔍</div>
                      <p className="text-gray-400 text-lg">No meals found</p>
                      <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMealsToPlan;
