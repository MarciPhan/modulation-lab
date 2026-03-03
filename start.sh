#!/bin/bash
# 🚀 Live Modulation Lab - Startup Script

# No dependencies check needed for Raw JS.
# Just serve the current directory using Python or any simple web server.

PORT=8080
echo "Starting Digital Modulation Lab (Raw JS) on http://localhost:$PORT ..."

if command -v python3 &>/dev/null; then
    python3 -m http.server $PORT
elif command -v python &>/dev/null; then
    python -m SimpleHTTPServer $PORT
else
    echo "❌ Error: Python not found. Please open index.html in a web browser supporting ES modules."
fi
