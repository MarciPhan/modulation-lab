#!/bin/bash
# 🚀 Live Modulation Lab - Startup Script

cd _internal || exit

echo "Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "node_modules not found. Installing..."
    npm install
fi

echo "Starting Digital Modulation Lab..."
npm run dev
