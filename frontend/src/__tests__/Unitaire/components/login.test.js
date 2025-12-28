import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "@/components/auth/Login";
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

describe("Login Component", () => {

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // ========== TESTS DE RENDU ==========

    it("devrait afficher tous les éléments de l'interface", () => {
        renderWithRouter(<Login />);

        expect(screen.getByText("BETTER YOU")).toBeInTheDocument();
        expect(
            screen.getByText("Log in to access your BetterYou account")
        ).toBeInTheDocument();

        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("you@example.com")
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Enter your password")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /LOGIN/i })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /Forgot Password/i })
        ).toBeInTheDocument();

        expect(screen.getByText("Create an account")).toBeInTheDocument();
    });

    it("devrait afficher le bouton afficher/masquer le mot de passe", () => {
        renderWithRouter(<Login />);
        expect(
            screen.getByRole("button", { name: /Show password/i })
        ).toBeInTheDocument();
    });

    // ========== INTERACTIONS ==========

    it("devrait permettre la saisie de l'email", () => {
        renderWithRouter(<Login />);
        const email = screen.getByPlaceholderText("you@example.com");

        fireEvent.change(email, { target: { value: "test@example.com" } });
        expect(email.value).toBe("test@example.com");
    });

    it("devrait permettre la saisie du mot de passe", () => {
        renderWithRouter(<Login />);
        const password = screen.getByPlaceholderText("Enter your password");

        fireEvent.change(password, { target: { value: "password123" } });
        expect(password.value).toBe("password123");
    });

    it("devrait basculer la visibilité du mot de passe", () => {
        renderWithRouter(<Login />);

        const password = screen.getByPlaceholderText("Enter your password");
        const toggle = screen.getByRole("button", { name: /Show password/i });

        expect(password.type).toBe("password");

        fireEvent.click(toggle);
        expect(password.type).toBe("text");

        fireEvent.click(toggle);
        expect(password.type).toBe("password");
    });

    // ========== SOUMISSION ==========

    it("devrait se connecter et rediriger vers /profile", async () => {
        authApi.login.mockResolvedValue({
            data: { token: "fake-token" },
        });

        renderWithRouter(<Login />);

        fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
            target: { value: "test@example.com" },
        });

        fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByRole("button", { name: /LOGIN/i }));

        await waitFor(() => {
            expect(authApi.login).toHaveBeenCalledWith({
                email: "test@example.com",
                password: "password123",
            });
        });

        expect(localStorage.getItem("token")).toBe("fake-token");
        expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });

    it("devrait afficher une erreur si l'authentification échoue", async () => {
        authApi.login.mockRejectedValue(new Error("Invalid credentials"));

        renderWithRouter(<Login />);

        fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
            target: { value: "wrong@example.com" },
        });

        fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
            target: { value: "wrongpassword" },
        });

        fireEvent.click(screen.getByRole("button", { name: /LOGIN/i }));

        await waitFor(() => {
            expect(
                screen.getByText("Email ou mot de passe invalide.")
            ).toBeInTheDocument();
        });

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(localStorage.getItem("token")).toBeNull();
    });

    // ========== NAVIGATION ==========

    it("devrait avoir un lien vers l'inscription", () => {
        renderWithRouter(<Login />);
        expect(screen.getByText("Create an account")).toHaveAttribute(
            "href",
            "/register"
        );
    });

    // ========== ACCESSIBILITÉ ==========

    it("devrait avoir des labels accessibles", () => {
        renderWithRouter(<Login />);
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });
});
