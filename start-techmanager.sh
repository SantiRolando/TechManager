#!/bin/bash

# ==========================================================
# TechManager - Script de inicio
# ==========================================================

PROJECT_DIR="/opt/lampp/htdocs/php/TechManager"
BACKEND_DIR="$PROJECT_DIR/back-end"
FRONTEND_DIR="$PROJECT_DIR/front-end"

XAMPP="/opt/lampp/lampp"

BACKEND_PORT=8000
FRONTEND_PORT=5173

echo "=========================================="
echo "       TECHMANAGER - INICIANDO"
echo "=========================================="
echo

# ----------------------------------------------------------
# 1. Obtener permisos sudo
# ----------------------------------------------------------

echo "[1/7] Comprobando permisos..."

sudo -v

if [ $? -ne 0 ]; then
    echo "ERROR: No se pudieron obtener permisos sudo."
    exit 1
fi

echo "      ✓ Permisos obtenidos"
echo


# ----------------------------------------------------------
# 2. Detener servicios que pueden entrar en conflicto
# ----------------------------------------------------------

echo "[2/7] Deteniendo servicios del sistema..."

if systemctl is-active --quiet apache2; then
    echo "      → Deteniendo Apache2..."
    sudo systemctl stop apache2
else
    echo "      ✓ Apache2 ya estaba detenido"
fi

if systemctl is-active --quiet mysql; then
    echo "      → Deteniendo MySQL..."
    sudo systemctl stop mysql
fi

if systemctl is-active --quiet mariadb; then
    echo "      → Deteniendo MariaDB..."
    sudo systemctl stop mariadb
fi

echo "      ✓ Servicios del sistema detenidos"
echo


# ----------------------------------------------------------
# 3. Verificar puertos
# ----------------------------------------------------------

echo "[3/7] Comprobando puertos..."

if sudo ss -ltnp | grep -q ':80 '; then
    echo "ERROR: El puerto 80 sigue ocupado."
    echo "Procesos usando el puerto 80:"
    sudo ss -ltnp | grep ':80 '
    exit 1
fi

if sudo ss -ltnp | grep -q ':3306 '; then
    echo "ERROR: El puerto 3306 sigue ocupado."
    echo "Procesos usando el puerto 3306:"
    sudo ss -ltnp | grep ':3306 '
    exit 1
fi

echo "      ✓ Puerto 80 disponible"
echo "      ✓ Puerto 3306 disponible"
echo


# ----------------------------------------------------------
# 4. Iniciar XAMPP
# ----------------------------------------------------------

echo "[4/7] Iniciando XAMPP..."

sudo "$XAMPP" start

if [ $? -ne 0 ]; then
    echo "ERROR: No se pudo iniciar XAMPP."
    exit 1
fi

sleep 3

echo
sudo "$XAMPP" status
echo


# ----------------------------------------------------------
# 5. Iniciar Laravel
# ----------------------------------------------------------

echo "[5/7] Iniciando backend Laravel..."

cd "$BACKEND_DIR" || {
    echo "ERROR: No se pudo acceder al backend."
    exit 1
}

# Verificar que exista artisan
if [ ! -f "artisan" ]; then
    echo "ERROR: No se encontró artisan."
    exit 1
fi

nohup php artisan serve \
    --host=127.0.0.1 \
    --port=$BACKEND_PORT \
    > "$PROJECT_DIR/backend.log" 2>&1 &

BACKEND_PID=$!

echo "$BACKEND_PID" > "$PROJECT_DIR/backend.pid"

sleep 2

if kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "      ✓ Laravel iniciado"
    echo "      → http://127.0.0.1:$BACKEND_PORT"
else
    echo "ERROR: Laravel no pudo iniciarse."
    echo "Revisá:"
    echo "$PROJECT_DIR/backend.log"
    exit 1
fi

echo


# ----------------------------------------------------------
# 6. Iniciar React / Vite
# ----------------------------------------------------------

echo "[6/7] Iniciando frontend React..."

cd "$FRONTEND_DIR" || {
    echo "ERROR: No se pudo acceder al frontend."
    exit 1
}

if [ ! -d "node_modules" ]; then
    echo "ERROR: No existe node_modules."
    echo "Ejecutá primero:"
    echo "pnpm install"
    exit 1
fi

nohup pnpm dev --host 127.0.0.1 \
    > "$PROJECT_DIR/frontend.log" 2>&1 &

FRONTEND_PID=$!

echo "$FRONTEND_PID" > "$PROJECT_DIR/frontend.pid"

sleep 3

if kill -0 "$FRONTEND_PID" 2>/dev/null; then
    echo "      ✓ React/Vite iniciado"
    echo "      → http://127.0.0.1:$FRONTEND_PORT"
else
    echo "ERROR: React no pudo iniciarse."
    echo "Revisá:"
    echo "$PROJECT_DIR/frontend.log"
    exit 1
fi

echo


# ----------------------------------------------------------
# 7. Final
# ----------------------------------------------------------

echo "[7/7] TechManager listo"
echo
echo "=========================================="
echo "       TECHMANAGER - EJECUTANDO"
echo "=========================================="
echo
echo "Frontend:"
echo "  http://127.0.0.1:$FRONTEND_PORT"
echo
echo "Backend:"
echo "  http://127.0.0.1:$BACKEND_PORT"
echo
echo "XAMPP:"
echo "  Apache → puerto 80"
echo "  MySQL  → puerto 3306"
echo
echo "Logs:"
echo "  Backend:  $PROJECT_DIR/backend.log"
echo "  Frontend: $PROJECT_DIR/frontend.log"
echo
echo "=========================================="
