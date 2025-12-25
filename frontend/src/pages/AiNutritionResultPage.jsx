// FILE: src/pages/AiNutritionResultPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAiNutritionPlan, getMealsByDay } from '../api/aiNutritionApi';
import GeneratorPreviewCard from '../components/nutrition-ai/GeneratorPreviewCard';

export default function AiNutritionResultPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [meals, setMeals] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [loading, setLoading] = useState(true);
  const [mealsLoading, setMealsLoading] = useState(false);
  const [error, setError] = useState(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const data = await getAiNutritionPlan(planId);
        setPlan(data);
      } catch (err) {
        setError(err.message || 'Failed to load nutrition plan');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setMealsLoading(true);
        const data = await getMealsByDay(planId, selectedDay);
        setMeals(data || []);
      } catch (err) {
        setMeals([]);
      } finally {
        setMealsLoading(false);
      }
    };

    if (planId && selectedDay) {
      fetchMeals();
    }
  }, [planId, selectedDay]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2C0E4E] flex items-center justify-center">
        <div className="text-[#D6F93D]">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#2C0E4E] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/ai-nutrition')}
            className="px-6 py-2 bg-[#D6F93D] text-[#2C0E4E] rounded-lg font-semibold hover:bg-[#c5e834] transition"
          >
            Back to Generator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2C0E4E] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#D6F93D] mb-2">Your AI Nutrition Plan</h1>
          <p className="text-gray-300">Your personalized meal plan is ready</p>
        </div>

        {plan && <GeneratorPreviewCard plan={plan} />}

        <div className="bg-[#1a0733] rounded-lg p-6 border border-[#D6F93D]/20 mb-6">
          <h2 className="text-xl font-semibold text-[#D6F93D] mb-4">Select Day</h2>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedDay === day
                    ? 'bg-[#D6F93D] text-[#2C0E4E]'
                    : 'bg-[#2C0E4E] text-gray-300 hover:bg-[#3a1563]'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#1a0733] rounded-lg p-6 border border-[#D6F93D]/20">
          <h2 className="text-xl font-semibold text-[#D6F93D] mb-6">
            Meals for {selectedDay}
          </h2>

          {mealsLoading ? (
            <div className="text-center py-8 text-gray-300">Loading meals...</div>
          ) : meals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-2">No meals found for this day</p>
              <p className="text-sm text-gray-500">Try selecting another day</p>
            </div>
          ) : (
            <div className="space-y-6">
              {meals.map((meal, index) => (
                <div
                  key={index}
                  className="bg-[#2C0E4E] rounded-lg p-5 border border-[#D6F93D]/10"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="inline-block px-3 py-1 bg-[#D6F93D]/20 text-[#D6F93D] text-xs font-semibold rounded-full mb-2">
                        {meal.mealSlot}
                      </span>
                      <h3 className="text-lg font-semibold text-white">
                        {meal.mealName}
                      </h3>
                    </div>
                  </div>
                  {meal.description && (
                    <p className="text-gray-400 text-sm mb-4">{meal.description}</p>
                  )}
                  {meal.items && meal.items.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-[#D6F93D] uppercase">
                        Ingredients
                      </p>
                      <div className="space-y-1">
                        {meal.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-gray-300">{item.foodName}</span>
                            <span className="text-gray-400">
                              {item.quantityGrams}g
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/ai-nutrition')}
            className="px-8 py-3 bg-[#D6F93D] text-[#2C0E4E] rounded-lg font-semibold hover:bg-[#c5e834] transition"
          >
            Create Another Program
          </button>
        </div>
      </div>
    </div>
  );
}