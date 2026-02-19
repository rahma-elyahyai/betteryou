import React, { useState } from 'react';
import { Calendar, Target, FileText, Flame, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useNutrition } from '../store/NutritionContext';

 import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext.jsx';



const CreateNutritionPlanForm = () => {
  const {createNutritionPlan} = useNutrition();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nutritionName: '',
    startDate: '',
    endDate: '',
    objective: '',
    description: '',
    caloriesPerDay: 2000
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // Objectifs prédéfinis
  const objectives = [
    { value: 'GAIN_MASS', label: '💪 Gain Mass', desc: 'Build lean muscle mass' },
    { value: 'LOSE_WEIGHT', label: '🔥 Lose Weight', desc: 'Reduce body fat' },
    { value: 'MAINTAIN', label: '⚖️ Maintain', desc: 'Maintain current weight' },
  ];

 const handleChange = (e) => {
  const { name, value } = e.target;
  
  if (name === 'startDate' && value) {
    // Forcer au lundi de la semaine sélectionnée
    const date = new Date(value);
    const day = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const diff = day === 0 ? -6 : 1 - day; // calcul du lundi
    date.setDate(date.getDate() + diff);
    const monday = date.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, startDate: monday }));
  } else {
    setFormData(prev => ({ ...prev, [name]: value }));
  }
  
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
};

  const handleObjectiveSelect = (value) => {
    setFormData(prev => ({ ...prev, objective: value }));
    if (errors.objective) {
      setErrors(prev => ({ ...prev, objective: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.nutritionName.trim()) {
      newErrors.nutritionName = 'Program name is required';
    } else if (formData.nutritionName.length < 3) {
      newErrors.nutritionName = 'Name must be at least 3 characters';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    if (!formData.objective) {
      newErrors.objective = 'Please select an objective';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.caloriesPerDay < 1000 || formData.caloriesPerDay > 5000) {
      newErrors.caloriesPerDay = 'Calories must be between 1000 and 5000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // 🔥 Utiliser le context
      const data = await createNutritionPlan({
        nutritionName: formData.nutritionName,
        startDate: formData.startDate,
        objective: formData.objective,
        description: formData.description,
        caloriesPerDay: formData.caloriesPerDay,
        idUser: user.idUser
      });

      console.log('Plan created:', data);
      navigate(`/nutrition-plans/${data.idNutrition}/add-meals`);
      
    } catch (error) {
      console.error('Error creating plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoGenerate = () => {
    // Redirection vers la page de génération automatique
    navigate('/ai-nutrition');
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a] flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 border-2 border-lime-400 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-lime-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Check className="w-10 h-10 text-gray-900" />
          </div>
          <h2 className="text-3xl font-bold text-lime-400 mb-2">Success!</h2>
          <p className="text-gray-400">Your nutrition program has been created</p>
          <p className="text-gray-500 text-sm mt-2">Redirecting to your programs...</p>
        </div>
        
      </div>
    );
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-lime-400 transition-all mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-lime-400 mb-2">Create Nutrition Plan</h1>
            <p className="text-gray-400">Design your personalized nutrition program</p>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-lime-400" />
              <div>
                <p className="text-white font-semibold">Want AI to do it for you?</p>
                <p className="text-gray-400 text-sm">Generate a plan based on your profile</p>
              </div>
            </div>
            <button
              onClick={handleAutoGenerate}
              className="px-6 py-2 bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold rounded-lg transition-all"
            >
              Auto-Generate
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700 shadow-xl">
          
          {/* Error global */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400">
              {errors.submit}
            </div>
          )}

          {/* Program Name */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-lime-400 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Program Information
            </h2>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Program Name *
              </label>
              <input
                type="text"
                name="nutritionName"
                value={formData.nutritionName}
                onChange={handleChange}
                placeholder="e.g., Summer Shred 2025"
                maxLength={100}
                className={`w-full px-4 py-3 bg-gray-900 border ${
                  errors.nutritionName ? 'border-red-500' : 'border-gray-700'
                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 transition-all`}
              />
              {errors.nutritionName && (
                <p className="text-red-400 text-sm mt-1">{errors.nutritionName}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {formData.nutritionName.length}/100 characters
              </p>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your nutrition program goals and approach..."
                rows={4}
                maxLength={255}
                className={`w-full px-4 py-3 bg-gray-900 border ${
                  errors.description ? 'border-red-500' : 'border-gray-700'
                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 transition-all resize-none`}
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {formData.description.length}/255 characters
              </p>
            </div>
          </div>

          {/* Objective */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-lime-400 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Main Objective *
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {objectives.map(obj => (
                <button
                  key={obj.value}
                  type="button"
                  onClick={() => handleObjectiveSelect(obj.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.objective === obj.value
                      ? 'bg-lime-400/20 border-lime-400 shadow-lg shadow-lime-400/20'
                      : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-2">{obj.label.split(' ')[0]}</div>
                  <div className="font-bold text-white mb-1">
                    {obj.label.split(' ').slice(1).join(' ')}
                  </div>
                  <div className="text-sm text-gray-400">{obj.desc}</div>
                </button>
              ))}
            </div>
            {errors.objective && (
              <p className="text-red-400 text-sm mt-2">{errors.objective}</p>
            )}
          </div>

          {/* Dates */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-lime-400 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Program Duration *
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 bg-gray-900 border ${
                    errors.startDate ? 'border-red-500' : 'border-gray-700'
                  } rounded-xl text-white focus:outline-none focus:border-lime-400 transition-all`}
                />
                {errors.startDate && (
                  <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>
                )}
               {formData.startDate && (
  <p className="text-lime-400 text-xs mt-1">
    📅 Plan will start on Monday: {formData.startDate}
  </p>
)}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  readOnly
                  disabled
                  value={
                    formData.startDate 
                      ? new Date(new Date(formData.startDate).getTime() + 6 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split('T')[0]
                      : ''
                  }
                  onChange={handleChange}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 bg-gray-900 border ${
                    errors.startDate ? 'border-red-500' : 'border-gray-700'
                  } rounded-xl text-white focus:outline-none focus:border-lime-400 transition-all`}
                
/>
               
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <div className="mt-3 p-3 bg-lime-400/10 border border-lime-400/30 rounded-lg">
                <p className="text-lime-400 text-sm font-semibold">
                  Duration: {Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            )}
          </div>

          {/* Calories */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-lime-400 mb-4 flex items-center gap-2">
              <Flame className="w-6 h-6" />
              Daily Calorie Target *
            </h2>
            
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Calories Per Day
              </label>
              <input
                type="number"
                name="caloriesPerDay"
                value={formData.caloriesPerDay}
                onChange={handleChange}
                min="1000"
                max="5000"
                step="50"
                className={`w-full px-4 py-3 bg-gray-900 border ${
                  errors.caloriesPerDay ? 'border-red-500' : 'border-gray-700'
                } rounded-xl text-white focus:outline-none focus:border-lime-400 transition-all`}
              />
              {errors.caloriesPerDay && (
                <p className="text-red-400 text-sm mt-1">{errors.caloriesPerDay}</p>
              )}
              
              {/* Visual Slider */}
              <input
                type="range"
                name="caloriesPerDay"
                value={formData.caloriesPerDay}
                onChange={handleChange}
                min="1000"
                max="5000"
                step="50"
                className="w-full mt-3 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-lime-400"
              />
              
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>1000 kcal</span>
                <span className="text-lime-400 font-bold text-lg">{formData.caloriesPerDay} kcal/day</span>
                <span>5000 kcal</span>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-4 bg-lime-400 hover:bg-lime-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 font-bold rounded-xl transition-all transform hover:scale-105 disabled:transform-none shadow-lg shadow-lime-400/30"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Program'
              )}
            </button>
          </div>

          <p className="text-gray-500 text-sm text-center mt-6">
            * Required fields
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-gray-800/30 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-sm">
            <span className="text-lime-400 font-semibold">💡 Next Step:</span> After creating your program, 
            you'll be able to add meals for each day of the week.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateNutritionPlanForm;
