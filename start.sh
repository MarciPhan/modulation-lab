#!/bin/bash
# 🚀 Live Modulation Lab - Startup Script for Linux/macOS

PORT=8080

# Check if port is taken (Fallback chain: lsof -> ss -> netstat)
is_port_in_use() {
    if command -v lsof &>/dev/null; then
        lsof -i :$PORT -sTCP:LISTEN -t >/dev/null
    elif command -v ss &>/dev/null; then
        ss -tuln | grep -E ":$PORT\b" >/dev/null
    elif command -v netstat &>/dev/null; then
        netstat -tuln | grep -E ":$PORT\b" >/dev/null
    else
        # If no tools are available, tentatively return success (port not in use)
        # to let Python try binding to it anyway.
        return 1
    fi
}

if is_port_in_use; then
    echo "⚠️ Port $PORT is already in use. Trying 8081..."
    PORT=8081
fi

echo "Starting Digital Modulation Lab on http://localhost:$PORT ..."

# Try Python3
if command -v python3 &>/dev/null; then
    xdg-open "http://localhost:$PORT" 2>/dev/null || open "http://localhost:$PORT" 2>/dev/null &
    python3 -m http.server $PORT
    exit 0
fi

# Try Python 2
if command -v python &>/dev/null; then
    xdg-open "http://localhost:$PORT" 2>/dev/null || open "http://localhost:$PORT" 2>/dev/null &
    python -m SimpleHTTPServer $PORT
    exit 0
fi

echo "❌ Error: Python not found!"
echo ""
echo "Because the app uses ES Modules, it MUST be served via a local web server."
echo "Please install Python to run this application automatically."
echo ""
echo "  Arch/Manjaro:   sudo pacman -S python"
echo "  Debian/Ubuntu:  sudo apt install python3"
echo "  Fedora:         sudo dnf install python3"
echo ""
echo "Or use your own web server (nginx, apache) pointing to this directory."
exit 1
