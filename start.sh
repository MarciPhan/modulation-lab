#!/bin/bash
# 🚀 Live Modulation Lab - Startup Script

# Serve the current directory using Python.

PORT=8080

# Check if port is taken
if lsof -i :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Port $PORT is already in use. Trying 8081..."
    PORT=8081
fi

echo "Starting Digital Modulation Lab on http://localhost:$PORT ..."

if command -v python3 &>/dev/null; then
    python3 -m http.server $PORT
elif command -v python &>/dev/null; then
    python -m SimpleHTTPServer $PORT
else
    echo "❌ Error: Python not found. Please open index.html in a web browser supporting ES modules."
fi
