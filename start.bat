@echo off
:: 🚀 Live Modulation Lab - Startup Script for Windows

:: No dependencies check needed for Raw JS.
set PORT=8080
echo Starting Digital Modulation Lab (Raw JS) on http://localhost:%PORT% ...

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    python -m http.server %PORT%
) else (
    echo ❌ Error: Python not found. Please open index.html in a web browser supporting ES modules.
    pause
)
