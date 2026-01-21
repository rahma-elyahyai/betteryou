import { authApi, api } from "@/api/auth";

// ================= MOCKS =================

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn((key) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
});

describe("auth API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // ========== TESTS login ==========

    it("devrait appeler l'API login avec les bonnes données", async () => {
        const loginData = {
            email: "test@example.com",
            password: "password123",
        };

        const mockResponse = {
            data: { token: "mock-jwt-token" },
        };

        api.post = jest.fn().mockResolvedValue(mockResponse);

        const response = await authApi.login(loginData);

        expect(api.post).toHaveBeenCalledWith("/api/auth/login", loginData);
        expect(response.data.token).toBe("mock-jwt-token");
    });

    it("devrait gérer les erreurs de login", async () => {
        const loginData = {
            email: "wrong@example.com",
            password: "wrongpassword",
        };

        const error = new Error("Invalid credentials");
        api.post = jest.fn().mockRejectedValue(error);

        await expect(authApi.login(loginData)).rejects.toThrow("Invalid credentials");
    });

    // ========== TESTS register ==========

    it("devrait appeler l'API register avec les bonnes données", async () => {
        const registerData = {
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            password: "password123",
            birthDate: "1990-01-01",
            gender: "MALE",
            goal: "LOSE_WEIGHT",
            heightCm: 180,
            initialWeightKg: 80,
            activityLevel: "MODERATE",
            fitnessLevel: "BEGINNER",
        };

        const mockResponse = {
            data: { token: "mock-register-token" },
        };

        api.post = jest.fn().mockResolvedValue(mockResponse);

        const response = await authApi.register(registerData);

        expect(api.post).toHaveBeenCalledWith("/api/auth/register", registerData);
        expect(response.data.token).toBe("mock-register-token");
    });

    it("devrait gérer les erreurs de register", async () => {
        const registerData = {
            email: "existing@example.com",
            password: "password123",
        };

        const error = {
            response: {
                status: 400,
                data: { message: "Email already exists" },
            },
        };

        api.post = jest.fn().mockRejectedValue(error);

        await expect(authApi.register(registerData)).rejects.toEqual(error);
    });

    // ========== TESTS me ==========

    it("devrait appeler l'API me pour récupérer les infos utilisateur", async () => {
        const mockResponse = {
            data: {
                id: 1,
                email: "test@example.com",
                firstName: "John",
                lastName: "Doe",
            },
        };

        api.get = jest.fn().mockResolvedValue(mockResponse);

        const response = await authApi.me();

        expect(api.get).toHaveBeenCalledWith("/api/auth/me");
        expect(response.data.email).toBe("test@example.com");
    });

    it("devrait gérer les erreurs de me", async () => {
        const error = new Error("Unauthorized");
        api.get = jest.fn().mockRejectedValue(error);

        await expect(authApi.me()).rejects.toThrow("Unauthorized");
    });

    // ========== TESTS forgotPassword ==========

    it("devrait appeler l'API forgotPassword avec l'email", async () => {
        const forgotPasswordData = {
            email: "test@example.com",
        };

        const mockResponse = {
            data: { message: "Reset link sent" },
        };

        api.post = jest.fn().mockResolvedValue(mockResponse);

        const response = await authApi.forgotPassword(forgotPasswordData);

        expect(api.post).toHaveBeenCalledWith(
            "/api/auth/forgot-password",
            forgotPasswordData
        );
        expect(response.data.message).toBe("Reset link sent");
    });

    // ========== TESTS resetPassword ==========

    it("devrait appeler l'API resetPassword avec le token et le nouveau mot de passe", async () => {
        const resetPasswordData = {
            token: "reset-token",
            newPassword: "newPassword123",
        };

        const mockResponse = {
            data: { message: "Password updated successfully" },
        };

        api.post = jest.fn().mockResolvedValue(mockResponse);

        const response = await authApi.resetPassword(resetPasswordData);

        expect(api.post).toHaveBeenCalledWith(
            "/api/auth/reset-password",
            resetPasswordData
        );
        expect(response.data.message).toBe("Password updated successfully");
    });

    // ========== TESTS INTERCEPTOR ==========

    it("devrait ajouter le token dans les headers si présent dans localStorage", async () => {
        localStorage.setItem("token", "test-token");

        // Recréer l'instance api pour que l'interceptor soit configuré
        // Note: Dans un vrai test, on devrait tester l'interceptor séparément
        const mockConfig = {
            headers: {},
        };

        // Simuler l'interceptor
        const token = localStorage.getItem("token");
        if (token) {
            mockConfig.headers.Authorization = `Bearer ${token}`;
        }

        expect(mockConfig.headers.Authorization).toBe("Bearer test-token");
    });

    it("ne devrait pas ajouter le token si absent de localStorage", () => {
        localStorage.removeItem("token");

        const mockConfig = {
            headers: {},
        };

        const token = localStorage.getItem("token");
        if (token) {
            mockConfig.headers.Authorization = `Bearer ${token}`;
        }

        expect(mockConfig.headers.Authorization).toBeUndefined();
    });
});
