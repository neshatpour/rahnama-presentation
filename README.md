# Simple Observability Project

## Overview
This project provides a simple observability setup to monitor cache-missed requests in a Redis instance through a Flask API. It leverages Docker, Prometheus, Grafana, and k6 for performance testing and visualization.

## Prerequisites
- Docker and Docker Compose installed
- Basic familiarity with Flask, Redis, Prometheus, Grafana, and k6
- The project directory structure available at `samples/instrumented-flask-app`

## Setup Instructions

1. **Start the Application**
   Navigate to the project directory and run the following command to start the services using Docker Compose:

   ```bash
   docker compose up -d
   ```

   The directory path for the project is:

   ```
   samples/instrumented-flask-app
   ```

2. **Configure Grafana Data Source**
   Add Prometheus as a data source in Grafana:
   - URL: `http://prometheus:9090`
   - Follow the Grafana UI to complete the setup.

3. **Import Grafana Dashboard**
   Import the pre-configured dashboard using the file located at:

   ```
   samples/instrumented-flask-app/configs/grafana-dashboard.json
   ```

   In Grafana, go to the dashboard section, select "Import," and upload the `grafana-dashboard.json` file.

4. **Run Load Test**
   Execute the k6 load test to generate traffic and observe cache-missed requests. Run the following command:

   ```bash
   docker run -i --network=instrumented-flask-app_app-network grafana/k6:0.47.0 run - < load_test.js
   ```

5. **Monitor Results**
   Allow the load test to complete, then check the Grafana dashboard to visualize the cache-missed requests and other metrics.

## Notes
- Ensure all services (Flask, Redis, Prometheus, Grafana) are running correctly before starting the load test.
- The load test script (`load_test.js`) should be available in the project directory.

## Contributing
Feel free to contribute by submitting pull requests or reporting issues. Be kind, powerful, and happy in your contributions!

# Sample Output of K6 Staging test

     █ setup

     data_received..................: 286 MB 952 kB/s
     data_sent......................: 2.2 MB 7.4 kB/s
     http_req_blocked...............: avg=174.05µs min=67.8µs   med=150.69µs max=2.79ms  p(90)=275.35µs p(95)=339.11µs
     http_req_connecting............: avg=117.38µs min=46.5µs   med=99.26µs  max=1.62ms  p(90)=188.87µs p(95)=237.27µs
     http_req_duration..............: avg=296.65ms min=463.61µs med=2.95ms   max=5.93s   p(90)=537.97ms p(95)=2.62s   
       { expected_response:true }...: avg=369.91ms min=463.61µs med=3.24ms   max=5.93s   p(90)=1.09s    p(95)=3.04s   
     http_req_failed................: 19.99% ✓ 3078      ✗ 12317
     http_req_receiving.............: avg=528.35µs min=20.56µs  med=194.77µs max=11.33ms p(90)=1.35ms   p(95)=2.1ms   
     http_req_sending...............: avg=33.09µs  min=10.28µs  med=27.41µs  max=1.08ms  p(90)=52.63µs  p(95)=68.61µs 
     http_req_tls_handshaking.......: avg=0s       min=0s       med=0s       max=0s      p(90)=0s       p(95)=0s      
     http_req_waiting...............: avg=296.09ms min=417.42µs med=2.39ms   max=5.93s   p(90)=537.6ms  p(95)=2.62s   
     http_reqs......................: 15395  51.273505/s
     iteration_duration.............: avg=2.23s    min=11.82ms  med=1.29s    max=6.72s   p(90)=5.44s    p(95)=5.97s   
     iterations.....................: 3078   10.25137/s
     vus............................: 1      min=1       max=50 
     vus_max........................: 50     min=50      max=50 
     running (5m00.3s), 00/50 VUs, 3078 complete and 0 interrupted iterations
     default ✓ [ 100% ] 00/50 VUs  5m0s
     time="2025-09-10T18:17:16Z" level=error msg="thresholds on metrics 'http_req_duration' have been crossed"
