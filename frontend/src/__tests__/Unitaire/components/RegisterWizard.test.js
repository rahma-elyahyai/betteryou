import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RegisterWizard from "@/components/auth/RegisterWizard";
import { authApi } from "@/api/auth";

// ================= MOCKS =================

jest.mock("@/api/auth");

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
    const actual = jest.requireActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Wrapper avec Router
const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("RegisterWizard Component", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // ========== TESTS DE RENDU ==========

    it("devrait afficher le premier step (Profile)", () => {
        renderWithRouter(<RegisterWizard />);

        expect(screen.getByText("BETTER YOU")).toBeInTheDocument();
        expect(screen.getByText("Create your account in a few steps")).toBeInTheDocument();
        expect(screen.getByText("Profile")).toBeInTheDocument();
        expect(screen.getByText("25%")).toBeInTheDocument();
    });

    it("devrait afficher les boutons Back et Next", () => {
        renderWithRouter(<RegisterWizard />);

        expect(screen.getByRole("button", { name: /BACK/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /NEXT/i })).toBeInTheDocument();
    });

    it("devrait afficher le lien vers login", () => {
        renderWithRouter(<RegisterWizard />);

        const loginLink = screen.getByText("Already have an account?");
        expect(loginLink).toBeInTheDocument();
        expect(screen.getByText("Login")).toBeInTheDocument();
    });

    // ========== NAVIGATION ENTRE STEPS ==========

    it("devrait passer au step suivant quand on clique sur NEXT", () => {
        renderWithRouter(<RegisterWizard />);

        const nextButton = screen.getByRole("button", { name: /NEXT/i });
        fireEvent.click(nextButton);

        expect(screen.getByText("Objective")).toBeInTheDocument();
        expect(screen.getByText("50%")).toBeInTheDocument();
    });

    it("devrait revenir au step précédent quand on clique sur Back", () => {
        renderWithRouter(<RegisterWizard />);

        // Aller au step 2
        const nextButton = screen.getByRole("button", { name: /NEXT/i });
        fireEvent.click(nextButton);

        // Revenir au step 1
        const backButton = screen.getByRole("button", { name: /BACK/i });
        fireEvent.click(backButton);

        expect(screen.getByText("Profile")).toBeInTheDocument();
        expect(screen.getByText("25%")).toBeInTheDocument();
    });

    it("ne devrait pas permettre de revenir en arrière depuis le premier step", () => {
        renderWithRouter(<RegisterWizard />);

        const backButton = screen.getByRole("button", { name: /BACK/i });
        expect(backButton).toBeDisabled();
    });

    // ========== SOUMISSION ==========

    it("devrait soumettre le formulaire et rediriger vers /welcome après inscription réussie", async () => {
        authApi.register.mockResolvedValue({
            data: { token: "register-token" },
        });

        authApi.login.mockResolvedValue({
            data: { token: "login-token" },
        });

        renderWithRouter(<RegisterWizard />);

        // Remplir le formulaire (simulation)
        // Aller jusqu'au dernier step
        const nextButton = screen.getByRole("button", { name: /NEXT/i });
        
        // Step 1 -> Step 2
        fireEvent.click(nextButton);
        
        // Step 2 -> Step 3
        fireEvent.click(nextButton);
        
        // Step 3 -> Step 4 (Summary)
        fireEvent.click(nextButton);

        // Cliquer sur CREATE
        const createButton = screen.getByRole("button", { name: /CREATE/i });
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(authApi.register).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(authApi.login).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(localStorage.getItem("token")).toBe("login-token");
            expect(mockNavigate).toHaveBeenCalledWith("/welcome");
        });
    });

    it("devrait afficher une erreur si l'inscription échoue", async () => {
        const errorMessage = "Email already exists";
        authApi.register.mockRejectedValue({
            response: { data: { message: errorMessage } },
        });

        // Mock window.alert
        const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

        renderWithRouter(<RegisterWizard />);

        // Aller jusqu'au dernier step
        const nextButton = screen.getByRole("button", { name: /NEXT/i });
        fireEvent.click(nextButton);
        fireEvent.click(nextButton);
        fireEvent.click(nextButton);

        // Cliquer sur CREATE
        const createButton = screen.getByRole("button", { name: /CREATE/i });
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(authApi.register).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(
                expect.stringContaining(errorMessage)
            );
        });

        alertSpy.mockRestore();
    });

    it("devrait désactiver les boutons pendant la soumission", async () => {
        authApi.register.mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 100))
        );
        authApi.login.mockResolvedValue({ data: { token: "token" } });

        renderWithRouter(<RegisterWizard />);

        // Aller jusqu'au dernier step
        const nextButton = screen.getByRole("button", { name: /NEXT/i });
        fireEvent.click(nextButton);
        fireEvent.click(nextButton);
        fireEvent.click(nextButton);

        const createButton = screen.getByRole("button", { name: /CREATE/i });
        fireEvent.click(createButton);

        // Le bouton devrait être désactivé pendant la soumission
        expect(createButton).toBeDisabled();
        expect(screen.getByText(/CREATING/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(createButton).not.toBeDisabled();
        });
    });

    // ========== PROGRESSION ==========

    it("devrait afficher la progression correcte pour chaque step", () => {
        renderWithRouter(<RegisterWizard />);

        // Step 1: 25%
        expect(screen.getByText("25%")).toBeInTheDocument();

        // Step 2: 50%
        fireEvent.click(screen.getByRole("button", { name: /NEXT/i }));
        expect(screen.getByText("50%")).toBeInTheDocument();

        // Step 3: 75%
        fireEvent.click(screen.getByRole("button", { name: /NEXT/i }));
        expect(screen.getByText("75%")).toBeInTheDocument();

        // Step 4: 100%
        fireEvent.click(screen.getByRole("button", { name: /NEXT/i }));
        expect(screen.getByText("100%")).toBeInTheDocument();
    });
});
