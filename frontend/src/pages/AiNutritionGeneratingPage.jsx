// FILE: src/pages/AiNutritionGeneratingPage.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GeneratingSpinner from '../components/nutrition-ai/GeneratingSpinner';

export default function AiNutritionGeneratingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const planId = location.state?.planId;

  useEffect(() => {
    if (!planId) {
      navigate('/ai-nutrition');
      return;
    }

    const timer = setTimeout(() => {
      navigate(`/ai-nutrition/result/${planId}`);
    }, 1000);

    return () => clearTimeout(timer);
  }, [planId, navigate]);

  return (
    <div className="min-h-screen bg-[#2C0E4E] flex items-center justify-center px-4">
      <div className="text-center">
        <GeneratingSpinner />
        <h2 className="text-2xl font-semibold text-[#D6F93D] mt-8 mb-2">
          AI is creating your program...
        </h2>
        <p className="text-gray-300">
          Please wait while we generate your personalized nutrition plan
        </p>
      </div>
    </div>
  );
}