#!/bin/bash
# Digital Modulation Lab - Deployment Script (Raw JS version)
# No Node.js / npm required. Just pure ES modules.

DEST="../modulation-pico-server/www"
SRC="./_internal/src"

echo "🚀 Nasazuji Raw JS verzi na Pico W server..."

# Vytvoření cílové složky pokud neexistuje
mkdir -p "$DEST"

# Čištění starých assetů (z předchozích verzí buildu)
rm -rf "$DEST/assets"
rm -rf "$DEST/ui"
rm -rf "$DEST/core"
rm -rf "$DEST/modulations"
rm -rf "$DEST/i18n"

# Kopírování zdrojových souborů
cp -rv "$SRC/"* "$DEST/"

echo "✅ Hotovo! Aplikace je připravena v $DEST"
echo "💡 Tip: Na Pico W teď stačí nahrát obsah složky www/ pomocí Thonny nebo mpremote."
