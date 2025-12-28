import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { api, authApi } from "@/api/auth";
import { profileApi } from "@/api/profileApi";

// Créer un mock adapter pour axios
const mock = new MockAdapter(api);

// Mock des modules si nécessaire
// jest.mock("@/api/auth"); // Si besoin de mocker complètement authApi

describe("API Integration Tests - Auth", () => {
    beforeEach(() => {
        localStorage.clear();
        mock.reset();
        jest.clearAllMocks();
    });

    // ========== TESTS DE L'INTERCEPTOR ==========
    describe("Axios Interceptor", () => {
        it("devrait ajouter automatiquement le token dans les headers", async () => {
            const token = "fake-jwt-token-123";
            localStorage.setItem("token", token);

            mock.onGet("/api/auth/me").reply((config) => {
                expect(config.headers.Authorization).toBe(`Bearer ${token}`);
                return [200, { email: "test@test.com" }];
            });

            await authApi.me();
        });

        it("ne devrait pas ajouter de header Authorization si pas de token", async () => {
            mock.onGet("/api/auth/me").reply((config) => {
                expect(config.headers.Authorization).toBeUndefined();
                return [200, {}];
            });

            await authApi.me();
        });

        it("devrait utiliser la baseURL correcte", () => {
            expect(api.defaults.baseURL).toBe("http://localhost:8080");
        });
    });

    // ========== TESTS DE authApi.login ==========
    describe("authApi.login", () => {
        it("devrait appeler POST /api/auth/login avec les bonnes données", async () => {
            const credentials = { email: "test@example.com", password: "password123" };
            mock.onPost("/api/auth/login", credentials).reply(200, { token: "fake-token-456" });

            const response = await authApi.login(credentials);

            expect(response.status).toBe(200);
            expect(response.data.token).toBe("fake-token-456");
        });

        it("devrait gérer les erreurs 401 (credentials invalides)", async () => {
            const credentials = { email: "wrong@example.com", password: "wrongpassword" };
            mock.onPost("/api/auth/login").reply(401, { message: "Invalid credentials" });

            await expect(authApi.login(credentials)).rejects.toThrow();
        });

        it("devrait gérer les erreurs 500 du serveur", async () => {
            mock.onPost("/api/auth/login").reply(500, { message: "Internal server error" });
            await expect(authApi.login({})).rejects.toThrow();
        });

        it("devrait gérer les erreurs réseau", async () => {
            mock.onPost("/api/auth/login").networkError();
            await expect(authApi.login({})).rejects.toThrow();
        });
    });

    // ========== TESTS DE authApi.register ==========
    describe("authApi.register", () => {
        it("devrait appeler POST /api/auth/register avec les bonnes données", async () => {
            const userData = {
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
                fitnessLevel: "INTERMEDIATE",
            };

            mock.onPost("/api/auth/register", userData).reply(200, { token: "new-user-token" });
            const response = await authApi.register(userData);

            expect(response.status).toBe(200);
            expect(response.data.token).toBe("new-user-token");
        });

        it("devrait gérer les emails déjà existants (409)", async () => {
            const userData = { email: "existing@example.com", password: "password123" };
            mock.onPost("/api/auth/register").reply(409, { message: "Email already exists" });

            await expect(authApi.register(userData)).rejects.toThrow();
        });

        it("devrait gérer les données invalides (400)", async () => {
            mock.onPost("/api/auth/register").reply(400, { message: "Invalid data" });
            await expect(authApi.register({})).rejects.toThrow();
        });
    });

    // ========== TESTS DE authApi.me ==========
    describe("authApi.me", () => {
        it("devrait récupérer les données de l'utilisateur connecté", async () => {
            const token = "valid-token";
            localStorage.setItem("token", token);

            const userData = { idUser: 1, firstName: "John", lastName: "Doe", email: "john@example.com", gender: "MALE", goal: "LOSE_WEIGHT" };
            mock.onGet("/api/auth/me").reply(200, userData);

            const response = await authApi.me();
            expect(response.status).toBe(200);
            expect(response.data).toEqual(userData);
        });

        it("devrait retourner 401 si pas de token", async () => {
            mock.onGet("/api/auth/me").reply(401, { message: "Unauthorized" });

            await expect(authApi.me()).rejects.toThrow();
        });

        it("devrait retourner 403 si token invalide", async () => {
            localStorage.setItem("token", "invalid-token");
            mock.onGet("/api/auth/me").reply(403, { message: "Invalid token" });

            await expect(authApi.me()).rejects.toThrow();
        });
    });
});

// ==== profileApi ====
describe("API Integration Tests - Profile", () => {
    beforeEach(() => {
        localStorage.clear();
        mock.reset();
        localStorage.setItem("token", "valid-token");
    });

    describe("profileApi.getProfile", () => {
        it("devrait récupérer le profil complet de l'utilisateur", async () => {
            const profileData = { info: { firstName: "Jane", lastName: "Doe", birthDate: "1995-05-15", gender: "FEMALE", weight: 65.0, heightCm: 170, fitnessLevel: "ADVANCED", activityLevel: "ACTIVE" }, objective: { goal: "GAIN_MUSCLE", targetWeight: 70.0 } };
            mock.onGet("/api/profile").reply(200, profileData);

            const response = await profileApi.getProfile();
            expect(response.status).toBe(200);
            expect(response.data).toEqual(profileData);
        });

        it("devrait gérer l'erreur 404 si profil non trouvé", async () => {
            mock.onGet("/api/profile").reply(404, { message: "Profile not found" });
            await expect(profileApi.getProfile()).rejects.toThrow();
        });
    });
});
