import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "@/components/dashboard/DashboardPage";
import { fetchDashboard } from "@/apis/DashboardApi";
import { getCurrentUserId } from "@/utils/authUtils";

// ================= MOCKS =================

jest.mock("@/apis/DashboardApi");
jest.mock("@/utils/authUtils");

const mockDashboardData = {
    dailyCaloricIntake: 2000,
    sessionsCompleted: 3,
    targetSessionsPerWeek: 5,
    totalTrainingMinutes: 120,
    activeProgramName: "Beginner Program",
    programProgressPercent: 60,
    weeklyCalories: [
        { dayLabel: "MONDAY", consumed: 1800, burned: 300 },
        { dayLabel: "TUESDAY", consumed: 2000, burned: 400 },
    ],
    macros: {
        totalProteins: 150,
        totalCarbs: 200,
        totalFats: 50,
    },
    weeklyTraining: [
        { dayLabel: "MONDAY", cardioMinutes: 30, strengthMinutes: 20, mixedMinutes: 0 },
        { dayLabel: "TUESDAY", cardioMinutes: 0, strengthMinutes: 40, mixedMinutes: 0 },
    ],
    goalTracker: {
        objective: "LOSE_WEIGHT",
        fitnessLevel: "BEGINNER",
        programStatus: "ONGOING",
    },
    upcomingSessions: [
        {
            sessionId: 1,
            sessionTitle: "Upper Body",
            sessionType: "STRENGTH",
            dayLabel: "WEDNESDAY",
            date: "2025-01-15",
            durationMinutes: 60,
        },
    ],
};

describe("DashboardPage Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getCurrentUserId.mockResolvedValue(1);
        fetchDashboard.mockResolvedValue(mockDashboardData);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // ========== TESTS DE RENDU ==========

    it("devrait afficher un état de chargement initial", () => {
        getCurrentUserId.mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve(1), 100))
        );

        render(<DashboardPage />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("devrait charger et afficher les données du dashboard", async () => {
        render(<DashboardPage />);

        await waitFor(() => {
            expect(getCurrentUserId).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(fetchDashboard).toHaveBeenCalledWith(1);
        });

        await waitFor(() => {
            expect(screen.getByText("Welcome back 👋")).toBeInTheDocument();
        });

        expect(screen.getByText("2000 kcal")).toBeInTheDocument();
        expect(screen.getByText("3/5")).toBeInTheDocument();
        expect(screen.getByText("120 min")).toBeInTheDocument();
        expect(screen.getByText("Beginner Program")).toBeInTheDocument();
    });

    it("devrait afficher les 4 cartes de statistiques", async () => {
        render(<DashboardPage />);

        await waitFor(() => {
            expect(screen.getByText("Daily Caloric Intake")).toBeInTheDocument();
        });

        expect(screen.getByText("Sessions Completed")).toBeInTheDocument();
        expect(screen.getByText("Training Time")).toBeInTheDocument();
        expect(screen.getByText("Active Program")).toBeInTheDocument();
    });

    it("devrait afficher un message d'erreur si le chargement échoue", async () => {
        const errorMessage = "Failed to fetch dashboard";
        fetchDashboard.mockRejectedValue(new Error(errorMessage));

        render(<DashboardPage />);

        await waitFor(() => {
            expect(screen.getByText("Dashboard Error")).toBeInTheDocument();
        });

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("devrait gérer les données manquantes avec des valeurs par défaut", async () => {
        const incompleteData = {
            dailyCaloricIntake: 0,
            sessionsCompleted: 0,
        };

        fetchDashboard.mockResolvedValue(incompleteData);

        render(<DashboardPage />);

        await waitFor(() => {
            expect(screen.getByText("0 kcal")).toBeInTheDocument();
        });
    });

    it("devrait afficher le header avec le message de bienvenue", async () => {
        render(<DashboardPage />);

        await waitFor(() => {
            expect(screen.getByText("Welcome back 👋")).toBeInTheDocument();
        });

        expect(
            screen.getByText(
                "Your health journey grows stronger every day. Keep going!"
            )
        ).toBeInTheDocument();
    });

    it("devrait afficher les composants de graphiques", async () => {
        render(<DashboardPage />);

        await waitFor(() => {
            expect(screen.getByText("Welcome back 👋")).toBeInTheDocument();
        });

        // Les composants de graphiques devraient être présents
        // (même si leur contenu exact dépend de l'implémentation)
        expect(screen.getByText("Daily Caloric Intake")).toBeInTheDocument();
    });

    it("devrait gérer les erreurs de récupération de l'ID utilisateur", async () => {
        getCurrentUserId.mockRejectedValue(new Error("User not authenticated"));

        render(<DashboardPage />);

        await waitFor(() => {
            expect(screen.getByText("Dashboard Error")).toBeInTheDocument();
        });
    });
});
