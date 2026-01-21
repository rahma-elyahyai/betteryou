import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 10,
    duration: '30s',
};

export default function () {
    const payload = JSON.stringify({
        email: "ali12@gmail.com",
        password: "ali123"
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post('http://localhost:8080/api/auth/login', payload, params);

    check(res, {
        'login status is 200': (r) => r.status === 200,
        'token received': (r) => r.json('token') !== undefined,
    });

    sleep(1);
}
