#!/bin/bash

# 🔒 Security-Hardened Deployment Script
# This script builds and serves the React app with security headers

echo "🔨 Building React application..."
cd "$(dirname "$0")"
npm run build

echo ""
echo "✅ Build complete!"
echo ""
echo "📦 Installing 'serve' if not already installed..."
if ! command -v serve &> /dev/null; then
    npm install -g serve
    echo "✅ 'serve' installed globally"
else
    echo "✅ 'serve' already installed"
fi

echo ""
echo "🚀 Starting secure production server on port 4100..."
echo "📋 Security headers will be applied from serve.json"
echo ""
echo "🔒 Applied Security Measures:"
echo "   ✓ Content Security Policy (CSP)"
echo "   ✓ X-Frame-Options (Anti-clickjacking)"
echo "   ✓ X-Content-Type-Options (Anti-MIME-sniffing)"
echo "   ✓ X-XSS-Protection"
echo "   ✓ Referrer-Policy"
echo "   ✓ Permissions-Policy"
echo "   ✓ Cross-Origin-* headers (Spectre mitigation)"
echo ""
echo "🌐 Server will be available at: http://localhost:4100"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

serve -s build -p 4100
