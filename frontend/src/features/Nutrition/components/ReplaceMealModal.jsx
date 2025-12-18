import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Search } from 'lucide-react';

const ReplaceMealModal = ({ currentMeal, dayOfWeek, programId, onClose, onReplace }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isReplacing, setIsReplacing] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/recommendations/meals')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(m => m.idMeal !== currentMeal.idMeal && m.mealType === currentMeal.mealType);
        setMeals(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching meals:', err);
        setLoading(false);
      });
  }, [currentMeal]);

  const filteredMeals = meals.filter(meal =>
    meal.mealName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meal.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReplace = async () => {
    if (!selectedMeal) return;
    
    setIsReplacing(true);
    try {
      await onReplace(currentMeal.idMeal, selectedMeal.idMeal, dayOfWeek, currentMeal.mealType.toUpperCase());
      onClose();
    } catch (error) {
      console.error('Replace error:', error);
    } finally {
      setIsReplacing(false);
    }
  };

  const getMealIcon = (type) => {
    const icons = {
      breakfast: '🍳',
      lunch: '🍱',
      dinner: '🍽️',
      snacks: '🍎'
    };
    return icons[type?.toLowerCase()] || '🍽️';
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-lime-400">Replace Meal</h2>
            <p className="text-gray-400 text-sm mt-1">
              Currently: <span className="text-white font-medium">{currentMeal.mealName}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-lime-400 focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading meals...</div>
        ) : (
          <>
            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {filteredMeals.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No meals found</div>
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
                        {meal.mealType && (
                          <span className="inline-block mt-2 text-xs text-lime-400 capitalize">
                            {meal.mealType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <button
                onClick={onClose}
                disabled={isReplacing}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReplace}
                disabled={!selectedMeal || isReplacing}
                className="flex-1 py-3 bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isReplacing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Replacing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Replace Meal
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReplaceMealModal;