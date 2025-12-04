#!/bin/bash

# Test script to verify backend and frontend are running

echo "🔍 Checking Backend (http://localhost:8080)..."
if curl -s http://localhost:8080/api/tags > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is NOT running"
    echo "   Start it with: cd golang-gin-realworld-example-app && go run ."
    exit 1
fi

echo ""
echo "🔍 Checking Frontend (http://localhost:4100)..."
if curl -s http://localhost:4100 > /dev/null; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is NOT running"
    echo "   Start it with: cd react-redux-realworld-example-app && npm start"
    exit 1
fi

echo ""
echo "✅ All services are running!"
echo "🚀 You can now run Cypress tests"
