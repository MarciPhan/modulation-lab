#!/bin/bash
# 🚀 Live Modulation Lab - Startup Script

# No dependencies check needed for Raw JS.
# Just serve the current directory using Python or any simple web server.

PORT=8080

# Check if port is taken
if lsof -i :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Port $PORT is already in use. Trying 8081..."
    PORT=8081
fi

echo "Starting Digital Modulation Lab (Raw JS) on http://localhost:$PORT ..."

if command -v python3 &>/dev/null; then
    python3 -m http.server $PORT
elif command -v python &>/dev/null; then
    python -m SimpleHTTPServer $PORT
else
    echo "❌ Error: Python not found. Please open index.html in a web browser supporting ES modules."
fi
