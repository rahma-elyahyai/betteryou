import http from 'k6/http';
import { check, sleep } from 'k6';

// 1️⃣ Config de simulation
export let options = {
    vus: 50,           // nombre d'utilisateurs virtuels
    duration: '30s',   // durée totale du test
};

// 2️⃣ URL de ton backend
const BASE_URL = 'http://localhost:8080';

// 3️⃣ Fonction principale exécutée par chaque utilisateur virtuel
export default function () {

    // ---- LOGIN ----
    let loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
        email: 'ali12@gmail.com',   // change selon ton user de test
        password: 'ali123'
    }), { headers: { 'Content-Type': 'application/json' } });

    // Vérification que login a réussi
    check(loginRes, {
        'login status 200': (r) => r.status === 200,
        'token received': (r) => r.json('token') !== undefined
    });

    let token = loginRes.json('token');

    // ---- ENDPOINT PROTÉGÉ ----
    let res = http.get(`${BASE_URL}/dashboard/nutrition`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    check(res, {
        'status is 200': (r) => r.status === 200
    });

    // Pause pour simuler un utilisateur réel
    sleep(Math.random() * 2 + 1); // 1 à 3 secondes
}
