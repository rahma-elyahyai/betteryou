import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { api } from "../../../api/auth";

const NutritionContext = createContext();

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within NutritionProvider');
  }
  return context;
};

const API_BASE_URL = '/api'; // ✅ Pas besoin de localhost car api.baseURL le gère

export const NutritionProvider = ({ children }) => {
  const cacheRef = useRef({
    allMeals: null,
    recommendations: {},
    plansByUser: {},
    planDetails: {},
    planMeals: {},
    mealDetails: {},
    lastFetch: {}
  });
  
  const loadingRef = useRef({});
  const [loading, setLoading] = useState({});
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const updateLoading = useCallback((key, value) => {
    loadingRef.current[key] = value;
    setLoading({ ...loadingRef.current });
  }, []);

  const isCacheValid = useCallback((key) => {
    const lastFetch = cacheRef.current.lastFetch[key];
    if (!lastFetch) return false;
    return Date.now() - lastFetch < CACHE_DURATION;
  }, [CACHE_DURATION]);

  // ==================== MEALS CATALOG ====================
  
  const loadAllMeals = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'allMeals';
    
    if (!forceRefresh && cacheRef.current.allMeals && isCacheValid(cacheKey)) {
      return cacheRef.current.allMeals;
    }

    if (loadingRef.current[cacheKey]) {
      return cacheRef.current.allMeals;
    }

    updateLoading(cacheKey, true);
    try {
      // ✅ Utiliser api.get au lieu de fetch
      const { data } = await api.get(`${API_BASE_URL}/recommendations/meals`);
      
      cacheRef.current.allMeals = data;
      cacheRef.current.lastFetch[cacheKey] = Date.now();
      
      return data;
    } catch (error) {
      console.error('Error loading meals:', error);
      throw error;
    } finally {
      updateLoading(cacheKey, false);
    }
  }, [isCacheValid, updateLoading]);

  const loadRecommendations = useCallback(async (userId, limit = 10, forceRefresh = false) => {
    const cacheKey = `recommendations_${userId}_${limit}`;
    
    if (!forceRefresh && cacheRef.current.recommendations[cacheKey] && isCacheValid(cacheKey)) {
      return cacheRef.current.recommendations[cacheKey];
    }

    if (loadingRef.current[cacheKey]) {
      return cacheRef.current.recommendations[cacheKey];
    }

    updateLoading(cacheKey, true);
    try {
      // ✅ Utiliser api.get
      const { data } = await api.get(
        `${API_BASE_URL}/recommendations/user/${userId}?limit=${limit}`
      );
      
      const meals = Array.isArray(data) ? data : (Array.isArray(data.meals) ? data.meals : []);
      
      cacheRef.current.recommendations[cacheKey] = meals;
      cacheRef.current.lastFetch[cacheKey] = Date.now();
      
      return meals;
    } catch (error) {
      console.error('Error loading recommendations:', error);
      throw error;
    } finally {
      updateLoading(cacheKey, false);
    }
  }, [isCacheValid, updateLoading]);

  const loadMealDetails = useCallback(async (userId, mealId, forceRefresh = false) => {
    const cacheKey = `mealDetails_${mealId}`;
    
    if (!forceRefresh && cacheRef.current.mealDetails[mealId] && isCacheValid(cacheKey)) {
      return cacheRef.current.mealDetails[mealId];
    }

    if (loadingRef.current[cacheKey]) {
      return cacheRef.current.mealDetails[mealId];
    }

    updateLoading(cacheKey, true);
    try {
      // ✅ Utiliser api.get
      const { data } = await api.get(
        `${API_BASE_URL}/recommendations/user/${userId}/meal/${mealId}`
      );
      
      cacheRef.current.mealDetails[mealId] = data;
      cacheRef.current.lastFetch[cacheKey] = Date.now();
      
      return data;
    } catch (error) {
      console.error('Error loading meal details:', error);
      throw error;
    } finally {
      updateLoading(cacheKey, false);
    }
  }, [isCacheValid, updateLoading]);

  // ==================== NUTRITION PLANS ====================

  const createNutritionPlan = useCallback(async (planData) => {
    try {
      // ✅ Utiliser api.post
      const { data } = await api.post(
        `${API_BASE_URL}/myprograms/saveNutritionPlan`,
        planData
      );
      
      // Invalider le cache des plans
      Object.keys(cacheRef.current.lastFetch).forEach(key => {
        if (key.startsWith('plansByUser_')) {
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
    
    if (!forceRefresh && cacheRef.current.plansByUser[cacheKey] && isCacheValid(cacheKey)) {
      return cacheRef.current.plansByUser[cacheKey];
    }

    if (loadingRef.current[cacheKey]) {
      return cacheRef.current.plansByUser[cacheKey];
    }

    updateLoading(cacheKey, true);
    try {
      // ✅ Utiliser api.get
      const { data } = await api.get(
        `${API_BASE_URL}/myprograms/user/${userId}?dayOfWeek=${dayOfWeek}`
      );
      
      cacheRef.current.plansByUser[cacheKey] = data;
      cacheRef.current.lastFetch[cacheKey] = Date.now();
      
      return data;
    } catch (error) {
      console.error('Error loading plans:', error);
      throw error;
    } finally {
      updateLoading(cacheKey, false);
    }
  }, [isCacheValid, updateLoading]);

  const loadPlanDetails = useCallback(async (userId, planId, forceRefresh = false) => {
    const cacheKey = `planDetails_${planId}`;
    
    if (!forceRefresh && cacheRef.current.planDetails[planId] && isCacheValid(cacheKey)) {
      return cacheRef.current.planDetails[planId];
    }

    if (loadingRef.current[cacheKey]) {
      return cacheRef.current.planDetails[planId];
    }

    updateLoading(cacheKey, true);
    try {
      // ✅ Utiliser api.get
      const { data: plans } = await api.get(
        `${API_BASE_URL}/myprograms/user/${userId}?dayOfWeek=Monday`
      );
      
      const plan = plans.find(p => p.idNutrition == planId);
      
      cacheRef.current.planDetails[planId] = plan;
      cacheRef.current.lastFetch[cacheKey] = Date.now();
      
      return plan;
    } catch (error) {
      console.error('Error loading plan details:', error);
      throw error;
    } finally {
      updateLoading(cacheKey, false);
    }
  }, [isCacheValid, updateLoading]);

  const updateNutritionPlan = useCallback(async (planId, planData) => {
    try {
      // ✅ Utiliser api.put
      await api.put(
        `${API_BASE_URL}/myprograms/nutritionplans/${planId}/update`,
        planData
      );
      
      // Invalider le cache
      delete cacheRef.current.planDetails[planId];
      Object.keys(cacheRef.current.lastFetch).forEach(key => {
        if (key.includes(planId) || key.startsWith('plansByUser_')) {
          delete cacheRef.current.lastFetch[key];
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  }, []);

  const deleteNutritionPlan = useCallback(async (planId) => {
    try {
      // ✅ Utiliser api.delete
      await api.delete(
        `${API_BASE_URL}/myprograms/nutritionplans/${planId}/delete`
      );
      
      // Nettoyer le cache
      delete cacheRef.current.planDetails[planId];
      delete cacheRef.current.planMeals[planId];
      
      Object.keys(cacheRef.current.lastFetch).forEach(key => {
        if (key.includes(planId) || key.startsWith('plansByUser_')) {
          delete cacheRef.current.lastFetch[key];
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  }, []);

  // ==================== MEALS IN PLANS ====================

  const loadPlanMealsForWeek = useCallback(async (userId, planId, forceRefresh = false) => {
    const cacheKey = `planMeals_${planId}`;
    
    if (!forceRefresh && cacheRef.current.planMeals[planId] && isCacheValid(cacheKey)) {
      return cacheRef.current.planMeals[planId];
    }

    if (loadingRef.current[cacheKey]) {
      return cacheRef.current.planMeals[planId];
    }

    updateLoading(cacheKey, true);
    try {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      // ✅ Utiliser api.get avec Promise.all
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

      cacheRef.current.planMeals[planId] = mealsMap;
      cacheRef.current.lastFetch[cacheKey] = Date.now();
      
      return mealsMap;
    } catch (error) {
      console.error('Error loading plan meals:', error);
      throw error;
    } finally {
      updateLoading(cacheKey, false);
    }
  }, [isCacheValid, updateLoading]);

  const addMealToPlan = useCallback(async (planId, mealId, dayOfWeek, mealSlot) => {
    try {
      // ✅ Utiliser api.post
      await api.post(
        `${API_BASE_URL}/myprograms/nutritionplans/${planId}/addMeal/${mealId}`,
        { dayOfWeek, mealSlot }
      );

      // Invalider le cache
      Object.keys(cacheRef.current.lastFetch).forEach(key => {
        if (key.startsWith('plansByUser_') && key.includes(dayOfWeek)) {
          delete cacheRef.current.lastFetch[key];
        }
      });

      return true;
    } catch (error) {
      console.error('Error adding meal:', error);
      throw error;
    }
  }, []);

  const removeMealFromPlan = useCallback(async (planId, mealId, dayOfWeek, mealSlot) => {
    try {
      // ✅ Utiliser api.delete
      await api.delete(
        `${API_BASE_URL}/myprograms/nutritionplans/${planId}/removeMeal?idMeal=${mealId}&dayOfWeek=${dayOfWeek}&mealSlot=${mealSlot}`
      );

      // Invalider le cache
      Object.keys(cacheRef.current.lastFetch).forEach(key => {
        if (key.startsWith('plansByUser_') && key.includes(dayOfWeek)) {
          delete cacheRef.current.lastFetch[key];
        }
      });

      return true;
    } catch (error) {
      console.error('Error removing meal:', error);
      throw error;
    }
  }, []);

  const replaceMealInPlan = useCallback(async (planId, oldMealId, newMealId, dayOfWeek, mealSlot) => {
    try {
      console.log('🔄 Replace meal request:', { 
        planId: `${planId} (type: ${typeof planId})`, 
        oldMealId: `${oldMealId} (type: ${typeof oldMealId})`, 
        newMealId: `${newMealId} (type: ${typeof newMealId})`, 
        dayOfWeek, 
        mealSlot 
      });
      
      // ✅ Utiliser api.put
      await api.put(
        `${API_BASE_URL}/myprograms/nutritionplans/${planId}/replaceMeal?oldMealId=${oldMealId}&newMealId=${newMealId}&dayOfWeek=${dayOfWeek}&mealSlot=${mealSlot}`
      );

      console.log('✅ Meal replaced successfully');

      // Invalider le cache
      Object.keys(cacheRef.current.lastFetch).forEach(key => {
        if (key.startsWith('plansByUser_') && key.includes(dayOfWeek)) {
          delete cacheRef.current.lastFetch[key];
        }
      });

      return true;
    } catch (error) {
      console.error('💥 Error replacing meal:', error);
      throw error;
    }
  }, []);

  // ==================== MEAL CONSUMPTION ====================

  const recordMealConsumption = useCallback(async (userId, mealId, consumptionDate, servings = 1) => {
    try {
      // ✅ Utiliser api.post
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
    if (!cacheRef.current.allMeals) return [];
    if (!goal || goal === 'ALL') return cacheRef.current.allMeals;
    return cacheRef.current.allMeals.filter(meal => meal.goal === goal);
  }, []);

  const invalidateCache = useCallback((keys) => {
    if (!keys) {
      cacheRef.current.lastFetch = {};
    } else {
      keys.forEach(key => delete cacheRef.current.lastFetch[key]);
    }
  }, []);

  const getCache = useCallback(() => cacheRef.current, []);

  const value = {
    cache: cacheRef.current,
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
    
    // Meals in Plans
    loadPlanMealsForWeek,
    addMealToPlan,
    removeMealFromPlan,
    replaceMealInPlan,
    
    // Meal Consumption
    recordMealConsumption,
    
    // Utilities
    invalidateCache
  };

  return (
    <NutritionContext.Provider value={value}>
      {children}
    </NutritionContext.Provider>
  );
};