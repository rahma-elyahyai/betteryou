import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const NutritionContext = createContext();

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within NutritionProvider');
  }
  return context;
};

const API_BASE_URL = 'http://localhost:8080/api';

export const NutritionProvider = ({ children }) => {
  // ✅ Utiliser useRef pour éviter les re-renders
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

  // ✅ Fonction helper pour update loading
  const updateLoading = useCallback((key, value) => {
    loadingRef.current[key] = value;
    setLoading({ ...loadingRef.current });
  }, []);

  // ✅ Vérifier si le cache est valide (sans dépendances)
  const isCacheValid = useCallback((key) => {
    const lastFetch = cacheRef.current.lastFetch[key];
    if (!lastFetch) return false;
    return Date.now() - lastFetch < CACHE_DURATION;
  }, [CACHE_DURATION]);

  // ==================== MEALS CATALOG ====================
  
  // 🔥 Charger TOUS les meals disponibles
  const loadAllMeals = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'allMeals';
    
    // ✅ Vérifier le cache sans causer de re-render
    if (!forceRefresh && cacheRef.current.allMeals && isCacheValid(cacheKey)) {
      return cacheRef.current.allMeals;
    }

    // ✅ Éviter les requêtes multiples simultanées
    if (loadingRef.current[cacheKey]) {
      return cacheRef.current.allMeals;
    }

    updateLoading(cacheKey, true);
    try {
      const response = await fetch(`${API_BASE_URL}/recommendations/meals`);
      if (!response.ok) throw new Error('Failed to load meals');
      const data = await response.json();
      
      // ✅ Mettre à jour le cache sans causer de re-render
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

  // 🔥 Charger les recommandations pour un utilisateur
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
      const response = await fetch(
        `${API_BASE_URL}/recommendations/user/${userId}?limit=${limit}`
      );
      
      if (!response.ok) throw new Error('Failed to load recommendations');
      const data = await response.json();
      
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

  // 🔥 Charger les détails d'un meal
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
      const response = await fetch(
        `${API_BASE_URL}/recommendations/user/${userId}/meal/${mealId}`
      );
      
      if (!response.ok) throw new Error('Failed to load meal details');
      const data = await response.json();
      
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

  // 🔥 Créer un nouveau plan nutritionnel
  const createNutritionPlan = useCallback(async (planData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/myprograms/saveNutritionPlan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });

      if (!response.ok) throw new Error('Failed to create nutrition plan');
      const data = await response.json();
      
      // ✅ Invalider uniquement le cache des plans
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

  // 🔥 Charger les plans d'un utilisateur pour un jour spécifique
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
      const response = await fetch(
        `${API_BASE_URL}/myprograms/user/${userId}?dayOfWeek=${dayOfWeek}`
      );
      
      if (!response.ok) throw new Error('Failed to load plans');
      const data = await response.json();
      
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

  // 🔥 Charger un plan spécifique
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
      const response = await fetch(
        `${API_BASE_URL}/myprograms/user/${userId}?dayOfWeek=Monday`
      );
      
      if (!response.ok) throw new Error('Failed to load plan');
      const plans = await response.json();
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

  // 🔥 Mettre à jour un plan
  const updateNutritionPlan = useCallback(async (planId, planData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/myprograms/nutritionplans/${planId}/update`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(planData)
        }
      );

      if (!response.ok) throw new Error('Failed to update plan');
      
      // ✅ Invalider uniquement le cache concerné
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

  // 🔥 Supprimer un plan
  const deleteNutritionPlan = useCallback(async (planId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/myprograms/nutritionplans/${planId}/delete`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to delete plan');
      
      // ✅ Nettoyer le cache
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

  // 🔥 Charger tous les meals d'un plan pour la semaine
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
      
      const promises = days.map(day =>
        fetch(`${API_BASE_URL}/myprograms/user/${userId}?dayOfWeek=${day}`)
          .then(res => res.ok ? res.json() : [])
          .then(plans => ({ day, data: plans.find(p => p.idNutrition == planId) }))
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

  // 🔥 Ajouter un meal à un plan
  const addMealToPlan = useCallback(async (planId, mealId, dayOfWeek, mealSlot) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/myprograms/nutritionplans/${planId}/addMeal/${mealId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dayOfWeek, mealSlot })
        }
      );

      if (!response.ok) throw new Error('Failed to add meal');

      // ✅ Invalider uniquement le cache du jour concerné
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

  // 🔥 Supprimer un meal d'un plan
  const removeMealFromPlan = useCallback(async (planId, mealId, dayOfWeek, mealSlot) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/myprograms/nutritionplans/${planId}/removeMeal?idMeal=${mealId}&dayOfWeek=${dayOfWeek}&mealSlot=${mealSlot}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to remove meal');

      // ✅ Invalider uniquement le cache du jour concerné
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

  // 🔥 Remplacer un meal dans un plan
  const replaceMealInPlan = useCallback(async (planId, oldMealId, newMealId, dayOfWeek, mealSlot) => {
    try {
      // 🔍 Log détaillé pour debug
      console.log('🔄 Replace meal request:', { 
        planId: `${planId} (type: ${typeof planId})`, 
        oldMealId: `${oldMealId} (type: ${typeof oldMealId})`, 
        newMealId: `${newMealId} (type: ${typeof newMealId})`, 
        dayOfWeek, 
        mealSlot 
      });
      
      const url = `${API_BASE_URL}/myprograms/nutritionplans/${planId}/replaceMeal?oldMealId=${oldMealId}&newMealId=${newMealId}&dayOfWeek=${dayOfWeek}&mealSlot=${mealSlot}`;
      console.log('📍 Full URL:', url);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        let errorText = '';
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = 'Could not read error response';
        }
        
        console.error('❌ Replace meal API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: url
        });
        throw new Error(`Failed to replace meal (${response.status}): ${errorText}`);
      }

      console.log('✅ Meal replaced successfully');

      // ✅ Invalider uniquement le cache du jour concerné
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
      const response = await fetch(
        `${API_BASE_URL}/myprograms/recordMealConsumption`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            mealId,
            consumptionDate,
            servings
          })
        }
      );

      if (!response.ok) throw new Error('Failed to record consumption');
      
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

  // ✅ Exposer le cache via un getter pour éviter les re-renders
  const getCache = useCallback(() => cacheRef.current, []);

  const value = {
    // État
    cache: cacheRef.current, // ⚠️ Attention: ne pas utiliser dans les dépendances
    getCache, // ✅ Utiliser cette fonction à la place
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