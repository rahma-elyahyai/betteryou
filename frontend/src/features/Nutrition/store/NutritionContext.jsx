import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { api } from "@/api/auth";

const NutritionContext = createContext();

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within NutritionProvider');
  }
  return context;
};

const API_BASE_URL = ''; // ✅ Pas besoin de localhost car api.baseURL le gère

export const NutritionProvider = ({ children }) => {
  // 🆕 États React pour les données (au lieu de juste useRef)
  const [allMeals, setAllMeals] = useState(null);
  const [recommendations, setRecommendations] = useState({});
  const [plansByUser, setPlansByUser] = useState({});
  const [planDetails, setPlanDetails] = useState({});
  const [planMeals, setPlanMeals] = useState({});
  const [mealDetails, setMealDetails] = useState({});
  
  // Cache pour les timestamps uniquement
  const cacheRef = useRef({
    lastFetch: {}
  });
  
  const loadingRef = useRef({});
  const [loading, setLoading] = useState({});
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const updateLoading = useCallback((key, value) => {
    loadingRef.current[key] = value;
    setLoading(prev => ({ ...prev, [key]: value }));
  }, []);

  const isCacheValid = useCallback((key) => {
    const lastFetch = cacheRef.current.lastFetch[key];
    if (!lastFetch) return false;
    return Date.now() - lastFetch < CACHE_DURATION;
  }, [CACHE_DURATION]);

  const isPlanActive = useCallback((plan) => {
    if (!plan || !plan.startDate || !plan.endDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return today <= plan.endDate;
  }, []);

  const isInactivePlanError = useCallback((error) => {
    const errorMessage = error?.response?.data?.error || error?.message || '';
    return errorMessage.includes('ended on') || 
           errorMessage.includes('completed') ||
           errorMessage.includes('cannot modify');
  }, []);

  const getActivePlan = useCallback(async (userId, forceRefresh = false) => {
    const cacheKey = `activePlan_${userId}`;
    
    if (!forceRefresh && plansByUser[cacheKey] && isCacheValid(cacheKey)) {
      return plansByUser[cacheKey];
    }

    try {
      const { data: plans } = await api.get(
        `${API_BASE_URL}/myprograms/user/${userId}?dayOfWeek=Monday`
      );
      
      const activePlan = plans.find(plan => isPlanActive(plan));
      
      setPlansByUser(prev => ({ ...prev, [cacheKey]: activePlan || null }));
      cacheRef.current.lastFetch[cacheKey] = Date.now();
      
      return activePlan || null;
    } catch (error) {
      console.error('Error getting active plan:', error);
      return null;
    }
  }, [isCacheValid, isPlanActive, plansByUser]);
  
  // ==================== MEALS CATALOG ====================
  
  const loadAllMeals = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'allMeals';
    
    if (!forceRefresh && allMeals && isCacheValid(cacheKey)) {
      return allMeals;
    }

    if (loadingRef.current[cacheKey]) {
      return allMeals;
    }

    updateLoading(cacheKey, true);
    try {
      const { data } = await api.get(`${API_BASE_URL}/recommendations/meals`);
      
      setAllMeals(data);
      cacheRef.current.lastFetch[cacheKey] = Date.now();
      
      return data;
    } catch (error) {
      console.error('Error loading meals:', error);
      throw error;
    } finally {
      updateLoading(cacheKey, false);
    }
  }, [isCacheValid, updateLoading, allMeals]);

  const loadRecommendations = useCallback(async (userId, limit = 10, forceRefresh = false) => {
    const cacheKey = `recommendations_${userId}_${limit}`;
    
    if (!forceRefresh && recommendations[cacheKey] && isCacheValid(cacheKey)) {
      return recommendations[cacheKey];
    }

    if (loadingRef.current[cacheKey]) {
      return recommendations[cacheKey];
    }

    updateLoading(cacheKey, true);
    try {
      const { data } = await api.get(
        `${API_BASE_URL}/recommendations/user/${userId}?limit=${limit}`
      );
      
      const meals = Array.isArray(data) ? data : (Array.isArray(data.meals) ? data.meals : []);
      
      setRecommendations(prev => ({ ...prev, [cacheKey]: meals }));
      cacheRef.current.lastFetch[cacheKey] = Date.now();
      
      return meals;
    } catch (error) {
      console.error('Error loading recommendations:', error);
      throw error;
    } finally {
      updateLoading(cacheKey, false);
    }
  }, [isCacheValid, updateLoading, recommendations]);

  const loadMealDetails = useCallback(async (userId, mealId, forceRefresh = false) => {
    const cacheKey = `mealDetails_${mealId}`;
    
    if (!forceRefresh && mealDetails[mealId] && isCacheValid(cacheKey)) {
      return mealDetails[mealId];
    }

    if (loadingRef.current[cacheKey]) {
      return mealDetails[mealId];
    }

    updateLoading(cacheKey, true);
    try {
      const { data } = await api.get(
        `${API_BASE_URL}/recommendations/user/${userId}/meal/${mealId}`
      );
      
      setMealDetails(prev => ({ ...prev, [mealId]: data }));
      cacheRef.current.lastFetch[cacheKey] = Date.now();
      
      return data;
    } catch (error) {
      console.error('Error loading meal details:', error);
      throw error;
    } finally {
      updateLoading(cacheKey, false);
    }
  }, [isCacheValid, updateLoading, mealDetails]);

  // ==================== NUTRITION PLANS ====================

  const createNutritionPlan = useCallback(async (planData) => {
    try {
      const { data } = await api.post(
        `${API_BASE_URL}/myprograms/saveNutritionPlan`,
        planData
      );
      
      // 🆕 Nettoyer les états
      setPlansByUser({});
      Object.keys(cacheRef.current.lastFetch).forEach(key => {
        if (key.startsWith('plansByUser_') || key.startsWith('activePlan_')) {
          delete cacheRef.current.lastFetch[key];
        }
      });
      
      return data;
    } catch (error) {
      console.error('Error creating plan:', error);
      throw error;
    }
  }, []);

  const loadUserPlansForDay = useCallback(async (userId, dayOfWeek, forceRefresh = false) => {
    const cacheKey = `plansByUser_${userId}_${dayOfWeek}`;
    
    if (!forceRefresh && plansByUser[cacheKey] && isCacheValid(cacheKey)) {
      return plansByUser[cacheKey];
    }

    if (loadingRef.current[cacheKey]) {
      return plansByUser[cacheKey];
    }

    updateLoading(cacheKey, true);
    try {
      const { data } = await api.get(
        `${API_BASE_URL}/myprograms/user/${userId}?dayOfWeek=${dayOfWeek}`
      );
      
      // 🆕 Trier les plans : plan actif en premier (1 seul possible), puis les inactifs par date décroissante
const sortedPlans = [...data].sort((a, b) => {
  const aActive = isPlanActive(a);
  const bActive = isPlanActive(b);
  
  // Le plan actif vient toujours en premier
  if (aActive && !bActive) return -1;
  if (!aActive && bActive) return 1;
  
  // Pour les plans inactifs, trier par date de fin (plus récent d'abord)
  const dateA = new Date(a.endDate || a.startDate || 0);
  const dateB = new Date(b.endDate || b.startDate || 0);
  return dateB - dateA;
});

      setPlansByUser(prev => ({ ...prev, [cacheKey]: sortedPlans }));
      cacheRef.current.lastFetch[cacheKey] = Date.now();
      
      return sortedPlans;
    } catch (error) {
      console.error('Error loading plans:', error);
      throw error;
    } finally {
      updateLoading(cacheKey, false);
    }
  }, [isCacheValid, updateLoading, plansByUser, isPlanActive]);

  const loadPlanDetails = useCallback(async (userId, planId, forceRefresh = false) => {
    const cacheKey = `planDetails_${planId}`;
    
    if (!forceRefresh && planDetails[planId] && isCacheValid(cacheKey)) {
      return planDetails[planId];
    }

    if (loadingRef.current[cacheKey]) {
      return planDetails[planId];
    }

    updateLoading(cacheKey, true);
    try {
      const { data: plans } = await api.get(
        `${API_BASE_URL}/myprograms/user/${userId}?dayOfWeek=Monday`
      );
      
      const plan = plans.find(p => p.idNutrition == planId);
      
      setPlanDetails(prev => ({ ...prev, [planId]: plan }));
      cacheRef.current.lastFetch[cacheKey] = Date.now();
      
      return plan;
    } catch (error) {
      console.error('Error loading plan details:', error);
      throw error;
    } finally {
      updateLoading(cacheKey, false);
    }
  }, [isCacheValid, updateLoading, planDetails]);

  const updateNutritionPlan = useCallback(async (planId, planData) => {
    try {
      await api.put(
        `${API_BASE_URL}/myprograms/nutritionplans/${planId}/update`,
        planData
      );
      
      // 🆕 Nettoyer les états
      setPlanDetails(prev => {
        const newState = { ...prev };
        delete newState[planId];
        return newState;
      });
      setPlansByUser({});
      
      Object.keys(cacheRef.current.lastFetch).forEach(key => {
        if (key.includes(planId) || key.startsWith('plansByUser_')) {
          delete cacheRef.current.lastFetch[key];
        }
      });
      
      return true;
    } catch (error) {
      if (isInactivePlanError(error)) {
        const errorMsg = error?.response?.data?.error || 'This nutrition plan has ended and cannot be modified.';
        alert(`⚠️ ${errorMsg}`);
      }
      console.error('Error updating plan:', error);
      throw error;
    }
  }, [isInactivePlanError]);

  const deleteNutritionPlan = useCallback(async (planId) => {
    try {
      await api.delete(
        `${API_BASE_URL}/myprograms/nutritionplans/${planId}/delete`
      );
      
      // 🆕 Nettoyer les états
      setPlanDetails(prev => {
        const newState = { ...prev };
        delete newState[planId];
        return newState;
      });
      setPlanMeals(prev => {
        const newState = { ...prev };
        delete newState[planId];
        return newState;
      });
      setPlansByUser({});
      
      Object.keys(cacheRef.current.lastFetch).forEach(key => {
        if (key.includes(planId) || key.startsWith('plansByUser_') || key.startsWith('activePlan_')) {
          delete cacheRef.current.lastFetch[key];
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  }, []);

  const endNutritionPlan = useCallback(async (planId) => {
    try {
      const { data } = await api.put(
        `${API_BASE_URL}/myprograms/nutritionplans/${planId}/end`
      );
      
      // 🆕 Nettoyer les états
      setPlansByUser({});
      
      Object.keys(cacheRef.current.lastFetch).forEach(key => {
        if (key.includes(planId) || key.startsWith('plansByUser_') || key.startsWith('activePlan_')) {
          delete cacheRef.current.lastFetch[key];
        }
      });
      
      return data;
    } catch (error) {
      console.error('Error ending plan:', error);
      throw error;
    }
  }, []);

  // ==================== MEALS IN PLANS ====================

  const loadPlanMealsForWeek = useCallback(async (userId, planId, forceRefresh = false) => {
    const cacheKey = `planMeals_${planId}`;
    
    if (!forceRefresh && planMeals[planId] && isCacheValid(cacheKey)) {
      return planMeals[planId];
    }

    if (loadingRef.current[cacheKey]) {
      return planMeals[planId];
    }

    updateLoading(cacheKey, true);
    try {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      const promises = days.map(day =>
        api.get(`${API_BASE_URL}/myprograms/user/${userId}?dayOfWeek=${day}`)
          .then(({ data: plans }) => ({ day, data: plans.find(p => p.idNutrition == planId) }))
          .catch(() => ({ day, data: null }))
      );

      const results = await Promise.all(promises);
      
      const mealsMap = {};
      results.forEach(({ day, data }) => {
        if (data && data.meals) {
          data.meals.forEach(meal => {
            const key = `${day}-${meal.mealSlot}`;
            mealsMap[key] = meal;
          });
        }
      });

      setPlanMeals(prev => ({ ...prev, [planId]: mealsMap }));
      cacheRef.current.lastFetch[cacheKey] = Date.now();
      
      return mealsMap;
    } catch (error) {
      console.error('Error loading plan meals:', error);
      throw error;
    } finally {
      updateLoading(cacheKey, false);
    }
  }, [isCacheValid, updateLoading, planMeals]);

  const addMealToPlan = useCallback(async (planId, mealId, dayOfWeek, mealSlot) => {
    try {
      await api.post(
        `${API_BASE_URL}/myprograms/nutritionplans/${planId}/addMeal/${mealId}`,
        { dayOfWeek, mealSlot }
      );

      // 🆕 Nettoyer les états pour forcer le rechargement
      setPlanMeals(prev => {
        const newState = { ...prev };
        delete newState[planId];
        return newState;
      });
      setPlansByUser({});
      
      Object.keys(cacheRef.current.lastFetch).forEach(key => {
        if (key.startsWith('plansByUser_') || key.startsWith('planMeals_')) {
          delete cacheRef.current.lastFetch[key];
        }
      });

      return true;
    } catch (error) {
      if (isInactivePlanError(error)) {
        const errorMsg = error?.response?.data?.error || 'This nutrition plan has ended and cannot be modified.';
        alert(`⚠️ ${errorMsg}`);
      }
      console.error('Error adding meal:', error);
      throw error;
    }
  }, [isInactivePlanError]);

  const removeMealFromPlan = useCallback(async (planId, mealId, dayOfWeek, mealSlot) => {
    try {
      await api.delete(
        `${API_BASE_URL}/myprograms/nutritionplans/${planId}/removeMeal?idMeal=${mealId}&dayOfWeek=${dayOfWeek}&mealSlot=${mealSlot}`
      );

      // 🆕 Nettoyer les états pour forcer le rechargement
      setPlanMeals(prev => {
        const newState = { ...prev };
        delete newState[planId];
        return newState;
      });
      setPlansByUser({});
      
      Object.keys(cacheRef.current.lastFetch).forEach(key => {
        if (key.startsWith('plansByUser_') || key.startsWith('planMeals_')) {
          delete cacheRef.current.lastFetch[key];
        }
      });

      return true;
    } catch (error) {
      if (isInactivePlanError(error)) {
        const errorMsg = error?.response?.data?.error || 'This nutrition plan has ended and cannot be modified.';
        alert(`⚠️ ${errorMsg}`);
      }
      console.error('Error removing meal:', error);
      throw error;
    }
  }, [isInactivePlanError]);

  const replaceMealInPlan = useCallback(async (planId, oldMealId, newMealId, dayOfWeek, mealSlot) => {
    try {
      console.log('🔄 Replace meal request:', { 
        planId: `${planId} (type: ${typeof planId})`, 
        oldMealId: `${oldMealId} (type: ${typeof oldMealId})`, 
        newMealId: `${newMealId} (type: ${typeof newMealId})`, 
        dayOfWeek, 
        mealSlot 
      });
      
      await api.put(
        `${API_BASE_URL}/myprograms/nutritionplans/${planId}/replaceMeal?oldMealId=${oldMealId}&newMealId=${newMealId}&dayOfWeek=${dayOfWeek}&mealSlot=${mealSlot}`
      );

      console.log('✅ Meal replaced successfully');

      // 🆕 Nettoyer les états pour forcer le rechargement
      setPlanMeals(prev => {
        const newState = { ...prev };
        delete newState[planId];
        return newState;
      });
      setPlansByUser({});
      
      Object.keys(cacheRef.current.lastFetch).forEach(key => {
        if (key.startsWith('plansByUser_') || key.startsWith('planMeals_')) {
          delete cacheRef.current.lastFetch[key];
        }
      });

      return true;
    } catch (error) {
      if (isInactivePlanError(error)) {
        const errorMsg = error?.response?.data?.error || 'This nutrition plan has ended and cannot be modified.';
        alert(`⚠️ ${errorMsg}`);
      }
      console.error('Error replacing meal:', error);
      throw error;
    }
  }, [isInactivePlanError]);

  // ==================== MEAL CONSUMPTION ====================

  const recordMealConsumption = useCallback(async (userId, mealId, consumptionDate, servings = 1) => {
    try {
      await api.post(
        `${API_BASE_URL}/myprograms/recordMealConsumption`,
        {
          userId,
          mealId,
          consumptionDate,
          servings
        }
      );
      
      return true;
    } catch (error) {
      console.error('Error recording consumption:', error);
      throw error;
    }
  }, []);

  // ==================== UTILITY FUNCTIONS ====================

  const getMealsByGoal = useCallback((goal) => {
    if (!allMeals) return [];
    if (!goal || goal === 'ALL') return allMeals;
    return allMeals.filter(meal => meal.goal === goal);
  }, [allMeals]);

  const invalidateCache = useCallback((keys) => {
    if (!keys) {
      cacheRef.current.lastFetch = {};
      // 🆕 Réinitialiser tous les états
      setPlansByUser({});
      setPlanMeals({});
      setPlanDetails({});
    } else {
      keys.forEach(key => delete cacheRef.current.lastFetch[key]);
    }
  }, []);

  const getCache = useCallback(() => ({
    allMeals,
    recommendations,
    plansByUser,
    planDetails,
    planMeals,
    mealDetails,
    lastFetch: cacheRef.current.lastFetch
  }), [allMeals, recommendations, plansByUser, planDetails, planMeals, mealDetails]);

  const value = {
    cache: {
      allMeals,
      recommendations,
      plansByUser,
      planDetails,
      planMeals,
      mealDetails
    },
    getCache,
    loading,
    
    // Meals Catalog
    loadAllMeals,
    loadRecommendations,
    loadMealDetails,
    getMealsByGoal,
    
    // Nutrition Plans
    createNutritionPlan,
    loadUserPlansForDay,
    loadPlanDetails,
    updateNutritionPlan,
    deleteNutritionPlan,
    endNutritionPlan,
    
    // Meals in Plans
    loadPlanMealsForWeek,
    addMealToPlan,
    removeMealFromPlan,
    replaceMealInPlan,
    
    // Meal Consumption
    recordMealConsumption,
    
    // Utilities
    invalidateCache,
    isPlanActive,
    isInactivePlanError,
    getActivePlan,
  };

  return (
    <NutritionContext.Provider value={value}>
      {children}
    </NutritionContext.Provider>
  );
};