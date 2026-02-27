@echo off
:: 🚀 Live Modulation Lab - Startup Script for Windows

cd _internal

echo Checking dependencies...
if not exist node_modules (
    echo node_modules not found. Installing...
    npm install
)

echo Starting Digital Modulation Lab...
npm run dev
