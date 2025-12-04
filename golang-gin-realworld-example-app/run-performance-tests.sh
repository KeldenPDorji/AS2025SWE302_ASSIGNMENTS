#!/bin/bash

# Assignment 3: Complete Test Execution Script
# This script runs all performance tests according to ASSIGNMENT_3.md

set -e  # Exit on error

echo "=================================================="
echo "Assignment 3: Performance Testing Suite"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if k6 is installed
if ! command -v k6 &> /dev/null; then
    echo -e "${RED}Error: k6 is not installed${NC}"
    echo "Install with: brew install k6"
    exit 1
fi

# Check if backend is running
echo -e "${YELLOW}Checking if backend is running...${NC}"
if ! curl -s http://localhost:8080/api/health > /dev/null 2>&1; then
    echo -e "${RED}Error: Backend is not running on http://localhost:8080${NC}"
    echo "Start the backend first: cd golang-gin-realworld-example-app && go run main.go"
    exit 1
fi
echo -e "${GREEN}✓ Backend is running${NC}"
echo ""

# Create results directory
mkdir -p results
cd k6-tests

echo "=================================================="
echo "Task 2: Load Testing"
echo "=================================================="
echo "Duration: ~16 minutes"
echo "Profile: Ramp 1→10→50→0 VUs"
echo ""
read -p "Run load test? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Running load test...${NC}"
    k6 run load-test.js --out json=../results/load-test-results.json
    echo -e "${GREEN}✓ Load test completed${NC}"
    echo -e "${YELLOW}→ Create k6-load-test-analysis.md${NC}"
else
    echo "Skipped"
fi
echo ""

echo "=================================================="
echo "Task 3: Stress Testing"
echo "=================================================="
echo "Duration: ~20 minutes"
echo "Profile: Ramp 1→50→100→200→300→0 VUs"
echo "Note: Will run locally (Grafana Cloud limit: 100 VUs)"
echo ""
read -p "Run stress test? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Running stress test...${NC}"
    k6 run stress-test.js --out json=../results/stress-test-results.json
    echo -e "${GREEN}✓ Stress test completed${NC}"
    echo -e "${YELLOW}→ Create k6-stress-test-analysis.md${NC}"
else
    echo "Skipped"
fi
echo ""

echo "=================================================="
echo "Task 4: Spike Testing"
echo "=================================================="
echo "Duration: ~6 minutes"
echo "Profile: Sudden spike 10→200 VUs"
echo ""
read -p "Run spike test? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Running spike test...${NC}"
    k6 run spike-test.js --out json=../results/spike-test-results.json
    echo -e "${GREEN}✓ Spike test completed${NC}"
    echo -e "${YELLOW}→ Create k6-spike-test-analysis.md${NC}"
else
    echo "Skipped"
fi
echo ""

echo "=================================================="
echo "Task 5: Soak Testing"
echo "=================================================="
echo "Duration: ~30 minutes (reduced from 3+ hours)"
echo "Profile: Sustained 50 VUs for 25 minutes"
echo ""
read -p "Run soak test? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Running soak test...${NC}"
    echo "This will take 30 minutes..."
    k6 run soak-test.js --out json=../results/soak-test-results.json
    echo -e "${GREEN}✓ Soak test completed${NC}"
    echo -e "${YELLOW}→ Create k6-soak-test-analysis.md${NC}"
else
    echo "Skipped"
fi
echo ""

cd ..

echo "=================================================="
echo "Performance Testing Complete!"
echo "=================================================="
echo ""
echo "Results saved in: ./results/"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Create analysis documents for each test"
echo "2. Implement performance optimizations (Task 6)"
echo "3. Re-run tests to measure improvements"
echo "4. Move to Cypress E2E testing (Part B)"
echo ""
echo -e "${GREEN}All test files are in: ./results/${NC}"
ls -lh results/ 2>/dev/null || echo "No results yet"
echo ""
