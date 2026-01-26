import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { NutritionProvider, useNutrition } from "@/features/Nutrition/store/NutritionContext";
import { api } from "@/api/auth";

// ================= MOCKS =================

jest.mock("@/api/auth", () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
}));

const wrapper = ({ children }) => (
    <NutritionProvider>{children}</NutritionProvider>
);

describe("NutritionContext", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // ========== TESTS DE BASE ==========

    it("devrait fournir le contexte nutrition", () => {
        const { result } = renderHook(() => useNutrition(), { wrapper });

        expect(result.current).toBeDefined();
        expect(result.current.loadAllMeals).toBeDefined();
        expect(result.current.loadRecommendations).toBeDefined();
        expect(result.current.createNutritionPlan).toBeDefined();
    });

    it("devrait lever une erreur si utilisé en dehors du provider", () => {
        // Supprimer la console.error pour éviter le bruit dans les tests
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

        expect(() => {
            renderHook(() => useNutrition());
        }).toThrow("useNutrition must be used within NutritionProvider");

        consoleError.mockRestore();
    });

    // ========== TESTS loadAllMeals ==========

    it("devrait charger tous les repas", async () => {
        const mockMeals = [
            { mealId: 1, mealName: "Chicken Salad" },
            { mealId: 2, mealName: "Grilled Fish" },
        ];

        api.get.mockResolvedValue({ data: mockMeals });

        const { result } = renderHook(() => useNutrition(), { wrapper });

        let meals;
        await act(async () => {
            meals = await result.current.loadAllMeals();
        });

        expect(meals).toEqual(mockMeals);
        expect(api.get).toHaveBeenCalledWith("/api/recommendations/meals");
    });

    it("devrait utiliser le cache si les données sont récentes", async () => {
        const mockMeals = [{ mealId: 1, mealName: "Test Meal" }];
        api.get.mockResolvedValue({ data: mockMeals });

        const { result } = renderHook(() => useNutrition(), { wrapper });

        // Premier appel
        await act(async () => {
            await result.current.loadAllMeals();
        });

        // Deuxième appel (devrait utiliser le cache)
        let cachedMeals;
        await act(async () => {
            cachedMeals = await result.current.loadAllMeals();
        });

        expect(cachedMeals).toEqual(mockMeals);
        // api.get ne devrait être appelé qu'une seule fois
        expect(api.get).toHaveBeenCalledTimes(1);
    });

    // ========== TESTS loadRecommendations ==========

    it("devrait charger les recommandations pour un utilisateur", async () => {
        const userId = 1;
        const limit = 5;
        const mockRecommendations = [
            { mealId: 1, mealName: "Recommended Meal 1" },
        ];

        api.get.mockResolvedValue({ data: mockRecommendations });

        const { result } = renderHook(() => useNutrition(), { wrapper });

        let recommendations;
        await act(async () => {
            recommendations = await result.current.loadRecommendations(userId, limit);
        });

        expect(recommendations).toEqual(mockRecommendations);
        expect(api.get).toHaveBeenCalledWith(
            `/api/recommendations/user/${userId}?limit=${limit}`
        );
    });

    // ========== TESTS createNutritionPlan ==========

    it("devrait créer un plan nutritionnel", async () => {
        const planData = {
            planName: "Test Plan",
            userId: 1,
            caloriesPerDay: 2000,
        };

        const mockResponse = { idNutrition: 1, ...planData };
        api.post.mockResolvedValue({ data: mockResponse });

        const { result } = renderHook(() => useNutrition(), { wrapper });

        let createdPlan;
        await act(async () => {
            createdPlan = await result.current.createNutritionPlan(planData);
        });

        expect(createdPlan).toEqual(mockResponse);
        expect(api.post).toHaveBeenCalledWith(
            "/api/myprograms/saveNutritionPlan",
            planData
        );
    });

    // ========== TESTS loadUserPlansForDay ==========

    it("devrait charger les plans pour un jour donné", async () => {
        const userId = 1;
        const dayOfWeek = "Monday";
        const mockPlans = [{ idNutrition: 1, planName: "Monday Plan" }];

        api.get.mockResolvedValue({ data: mockPlans });

        const { result } = renderHook(() => useNutrition(), { wrapper });

        let plans;
        await act(async () => {
            plans = await result.current.loadUserPlansForDay(userId, dayOfWeek);
        });

        expect(plans).toEqual(mockPlans);
        expect(api.get).toHaveBeenCalledWith(
            `/api/myprograms/user/${userId}?dayOfWeek=${dayOfWeek}`
        );
    });

    // ========== TESTS addMealToPlan ==========

    it("devrait ajouter un repas à un plan", async () => {
        const planId = 1;
        const mealId = 2;
        const dayOfWeek = "Monday";
        const mealSlot = "BREAKFAST";

        api.post.mockResolvedValue({ data: {} });

        const { result } = renderHook(() => useNutrition(), { wrapper });

        await act(async () => {
            await result.current.addMealToPlan(planId, mealId, dayOfWeek, mealSlot);
        });

        expect(api.post).toHaveBeenCalledWith(
            `/api/myprograms/nutritionplans/${planId}/addMeal/${mealId}`,
            { dayOfWeek, mealSlot }
        );
    });

    // ========== TESTS removeMealFromPlan ==========

    it("devrait retirer un repas d'un plan", async () => {
        const planId = 1;
        const mealId = 2;
        const dayOfWeek = "Monday";
        const mealSlot = "BREAKFAST";

        api.delete.mockResolvedValue({});

        const { result } = renderHook(() => useNutrition(), { wrapper });

        await act(async () => {
            await result.current.removeMealFromPlan(planId, mealId, dayOfWeek, mealSlot);
        });

        expect(api.delete).toHaveBeenCalledWith(
            `/api/myprograms/nutritionplans/${planId}/removeMeal?idMeal=${mealId}&dayOfWeek=${dayOfWeek}&mealSlot=${mealSlot}`
        );
    });

    // ========== TESTS recordMealConsumption ==========

    it("devrait enregistrer une consommation de repas", async () => {
        const userId = 1;
        const mealId = 2;
        const consumptionDate = "2025-01-15";
        const servings = 2;

        api.post.mockResolvedValue({ data: {} });

        const { result } = renderHook(() => useNutrition(), { wrapper });

        await act(async () => {
            await result.current.recordMealConsumption(
                userId,
                mealId,
                consumptionDate,
                servings
            );
        });

        expect(api.post).toHaveBeenCalledWith(
            "/api/myprograms/recordMealConsumption",
            {
                userId,
                mealId,
                consumptionDate,
                servings,
            }
        );
    });

    // ========== TESTS GESTION D'ERREURS ==========

    it("devrait gérer les erreurs lors du chargement des repas", async () => {
        const error = new Error("Network error");
        api.get.mockRejectedValue(error);

        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

        const { result } = renderHook(() => useNutrition(), { wrapper });

        await act(async () => {
            await expect(
                result.current.loadAllMeals()
            ).rejects.toThrow("Network error");
        });

        expect(consoleError).toHaveBeenCalledWith(
            "Error loading meals:",
            error
        );

        consoleError.mockRestore();
    });

    // ========== TESTS UTILITAIRES ==========

    it("devrait invalider le cache", async () => {
        const { result } = renderHook(() => useNutrition(), { wrapper });

        await act(async () => {
            result.current.invalidateCache();
        });

        // Le cache devrait être vidé
        const cache = result.current.getCache();
        expect(cache.lastFetch).toEqual({});
    });

    it("devrait filtrer les repas par objectif", async () => {
        const mockMeals = [
            { mealId: 1, mealName: "Meal 1", goal: "LOSE_WEIGHT" },
            { mealId: 2, mealName: "Meal 2", goal: "GAIN_MASS" },
        ];

        api.get.mockResolvedValue({ data: mockMeals });

        const { result } = renderHook(() => useNutrition(), { wrapper });

        // Charger les repas
        await act(async () => {
            await result.current.loadAllMeals();
        });

        // Filtrer par objectif
        let filteredMeals;
        await act(async () => {
            filteredMeals = result.current.getMealsByGoal("LOSE_WEIGHT");
        });

        expect(filteredMeals).toHaveLength(1);
        expect(filteredMeals[0].goal).toBe("LOSE_WEIGHT");
    });
});
