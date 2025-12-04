export const BASE_URL = 'http://localhost:8080/api';

export const THRESHOLDS = {
  http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
  http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
};

export const TEST_USER = {
  email: 'perf-test@example.com',
  password: 'PerfTest123!',
  username: 'perftest'
};

// Grafana Cloud k6 output configuration
// To use: set K6_CLOUD_TOKEN environment variable
// Or run: k6 run --out cloud script.js
export const GRAFANA_CLOUD_CONFIG = {
  projectID: 3855163, // Your Grafana Cloud project ID
  name: 'RealWorld Conduit Performance Test'
};
