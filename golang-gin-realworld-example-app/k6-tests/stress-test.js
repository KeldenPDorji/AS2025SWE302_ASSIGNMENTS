import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from './config.js';
import { getAuthHeaders } from './helpers.js';

export const options = {
  stages: [
    { duration: '2m', target: 30 },    // Ramp up to 30 users
    { duration: '3m', target: 30 },    // Stay at 30
    { duration: '2m', target: 50 },    // Ramp up to 50 users
    { duration: '3m', target: 50 },    // Stay at 50
    { duration: '2m', target: 70 },    // Ramp up to 70 users (safe)
    { duration: '3m', target: 70 },    // Stay at 70
    { duration: '3m', target: 0 },     // Ramp down gradually
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // More relaxed threshold
    http_req_failed: ['rate<0.1'],     // Allow up to 10% errors
  },
};

export function setup() {
  const loginRes = http.post(`${BASE_URL}/users/login`, JSON.stringify({
    user: {
      email: 'perf-test@example.com',
      password: 'PerfTest123!'
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  });

  return { token: loginRes.json('user.token') };
}

export default function (data) {
  const authHeaders = getAuthHeaders(data.token);
  
  // Test most critical endpoints under stress
  const response = http.get(`${BASE_URL}/articles`, authHeaders);
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
