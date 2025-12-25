import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneratorForm from '../components/nutrition-ai/GeneratorForm';
import { generateAiNutritionPlan } from '../api/aiNutritionApi';

export default function AiNutritionGeneratorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    objective: 'MAINTAIN',
    startDate: '',
    endDate: '',
    caloriesPerDay: 2000,
    programName: '',
    description: ''
  });

  const handleChange = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  // Convertir dd-mm-yyyy -> yyyy-mm-dd pour le backend
  const convertDateToBackendFormat = (ddmmyyyy) => {
    if (!ddmmyyyy) return '';
    const parts = ddmmyyyy.split('-');
    if (parts.length !== 3) return '';
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem('userId') || '1';
      
      // Préparer le payload avec les dates au format yyyy-mm-dd
      const payload = {
        userId: parseInt(userId),
        objective: values.objective,
        startDate: convertDateToBackendFormat(values.startDate),
        endDate: convertDateToBackendFormat(values.endDate),
        caloriesPerDay: parseInt(values.caloriesPerDay),
        generationMode: 'AUTO_AI'
      };

      // Ajouter les champs optionnels si présents
      if (values.programName) {
        payload.nutritionName = values.programName;
      }
      if (values.description) {
        payload.description = values.description;
      }

      const response = await generateAiNutritionPlan(payload);
      setLoading(false);
      navigate('/ai-nutrition/generating', { 
        state: { planId: response.nutritionPlanId } 
      });
    } catch (err) {
      setError(err.message || 'Failed to generate nutrition plan');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2C0E4E] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
            <svg className="w-8 h-8 text-[#D6F93D]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-[#D6F93D] mb-2">
            AI Nutrition Program Generator
          </h1>
          <p className="text-gray-300">
            Tell us about yourself and let AI create your personalized nutrition plan
          </p>
        </div>

        <GeneratorForm
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
