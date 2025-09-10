// docker run -i --network=instrumented-flask-app_app-network grafana/k6:0.47.0 run - < load_test.js

import http from 'k6/http';
import { sleep } from 'k6';

// Base URL of the Flask app
const BASE_URL = 'http://instrumented-flask-app-flask-app-1:9000'; // Adjust to match Docker service name/port

// Generate 5 fixed random keys for cache misses
const timestamp = Date.now();
const cacheMissKeys = Array.from({ length: 5 }, (_, i) => `cache_miss_${timestamp}_${Math.floor(Math.random() * 9000 + 1000)}_${i}`);

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp up to 10 VUs over 30s
    { duration: '2m', target: 20 },  // Ramp up to 20 VUs and hold for 2m
    { duration: '2m', target: 50 },  // Ramp up to 50 VUs and hold for 2m
    { duration: '30s', target: 0 },  // Ramp down to 0 VUs over 30s
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should complete in <500ms
  },
};

export default function () {
  // Test hello endpoint
  http.get(`${BASE_URL}/`);
  sleep(0.1);

  // Test add item endpoint
  const addPayload = JSON.stringify({
    key: `test_key_${timestamp}_${Math.floor(Math.random() * 9000 + 1000)}`,
    value: `test_value_${timestamp}`,
  });
  http.post(`${BASE_URL}/items`, addPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  sleep(0.2);

  // Test get item endpoint (cache hits)
  const hitKeyNum = Math.floor(Math.random() * 5) + 1;
  http.get(`${BASE_URL}/items/load_test_key_${hitKeyNum}`);
  sleep(0.1);

  // Test list items endpoint
  http.get(`${BASE_URL}/items`);
  sleep(0.3);

  // Test cache miss endpoint (multiple requests for fixed keys)
  const missKey = cacheMissKeys[Math.floor(Math.random() * cacheMissKeys.length)];
  http.get(`${BASE_URL}/items/${missKey}`);
  sleep(0.05);
}

export function setup() {
  // Pre-populate keys for cache hits
  for (let i = 1; i <= 5; i++) {
    const payload = JSON.stringify({
      key: `load_test_key_${i}`,
      value: `load_test_value_${i}`,
    });
    http.post(`${BASE_URL}/items`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  console.log(`Generated cache miss keys: ${cacheMissKeys}`);
}

// test for commit