#!/bin/bash

PROJECT_DIR="/opt/lampp/htdocs/php/TechManager"
XAMPP="/opt/lampp/lampp"

echo "=========================================="
echo "       TECHMANAGER - DETENIENDO"
echo "=========================================="
echo

# ----------------------------------------------------------
# Detener Laravel
# ----------------------------------------------------------

if [ -f "$PROJECT_DIR/backend.pid" ]; then

    BACKEND_PID=$(cat "$PROJECT_DIR/backend.pid")

    if kill -0 "$BACKEND_PID" 2>/dev/null; then
        echo "→ Deteniendo Laravel..."
        kill "$BACKEND_PID"
        echo "  ✓ Laravel detenido"
    else
        echo "✓ Laravel ya estaba detenido"
    fi

    rm -f "$PROJECT_DIR/backend.pid"

else
    echo "✓ No se encontró PID de Laravel"
fi


# ----------------------------------------------------------
# Detener React
# ----------------------------------------------------------

if [ -f "$PROJECT_DIR/frontend.pid" ]; then

    FRONTEND_PID=$(cat "$PROJECT_DIR/frontend.pid")

    if kill -0 "$FRONTEND_PID" 2>/dev/null; then
        echo "→ Deteniendo React/Vite..."
        kill "$FRONTEND_PID"
        echo "  ✓ React/Vite detenido"
    else
        echo "✓ React/Vite ya estaba detenido"
    fi

    rm -f "$PROJECT_DIR/frontend.pid"

else
    echo "✓ No se encontró PID de React"
fi


# ----------------------------------------------------------
# Detener XAMPP
# ----------------------------------------------------------

echo
echo "→ Deteniendo XAMPP..."

sudo -v

sudo "$XAMPP" stop

echo
echo "=========================================="
echo "       TECHMANAGER - DETENIDO"
echo "=========================================="
