#!/bin/bash
# Digital Modulation Lab - Deployment Script (Raw JS version)
# No Node.js / npm required. Just pure ES modules.

DEST="../modulation-pico-server/www"
SRC="."

echo "🚀 Nasazuji Raw JS verzi na Pico W server..."

# Vytvoření cílové složky pokud neexistuje
mkdir -p "$DEST"

# Čištění starých souborů na serveru
rm -rf "$DEST/ui"
rm -rf "$DEST/core"
rm -rf "$DEST/modulations"
rm -rf "$DEST/i18n"
rm -f "$DEST/index.html"
rm -f "$DEST/main.js"
rm -f "$DEST/plotly-basic.min.js"
rm -f "$DEST/favicon.ico"
rm -rf "$DEST/assets" # Starý Vite bundle if exists

# Kopírování zdrojových souborů
# Kopírování potřebných souborů a složek (Raw JS)
cp -rv "$SRC/ui" "$SRC/core" "$SRC/modulations" "$SRC/i18n" "$SRC/index.html" "$SRC/main.js" "$SRC/plotly-basic.min.js" "$SRC/favicon.ico" "$DEST/"

echo "✅ Hotovo! Aplikace je připravena v $DEST"
echo "💡 Tip: Na Pico W teď stačí nahrát obsah složky www/ pomocí Thonny nebo mpremote."
