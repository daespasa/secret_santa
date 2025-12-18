#!/bin/bash

# ==================================================
# AMIGO INVISIBLE - Quick Start Script
# ==================================================
# Este script configura todo lo necesario para
# desarrollar o desplegar la aplicación

set -e

echo "🎁 Amigo Invisible - Setup Script"
echo "=================================="
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Detecta si es Windows/WSL
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  echo "⚠️  Script pensado para Linux/Mac. En Windows usa: npm install && npx prisma migrate dev"
  exit 1
fi

# 1. Verifica Node.js
echo -e "${BLUE}[1/5]${NC} Verificando Node.js..."
if ! command -v node &> /dev/null; then
  echo "❌ Node.js no instalado. Instala desde https://nodejs.org (v20+)"
  exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓${NC} Node.js $NODE_VERSION"

# 2. Instala dependencias
echo ""
echo -e "${BLUE}[2/5]${NC} Instalando dependencias..."
npm install
echo -e "${GREEN}✓${NC} Dependencias instaladas"

# 3. Configura .env
echo ""
echo -e "${BLUE}[3/5]${NC} Configurando .env..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo -e "${GREEN}✓${NC} .env creado (edita con tus credenciales)"
else
  echo -e "${GREEN}✓${NC} .env ya existe"
fi

# 4. Genera Prisma
echo ""
echo -e "${BLUE}[4/5]${NC} Generando Prisma Client..."
npx prisma generate
echo -e "${GREEN}✓${NC} Prisma Client generado"

# 5. Base de datos
echo ""
echo -e "${BLUE}[5/5]${NC} Aplicando migraciones..."
npx prisma migrate dev
echo -e "${GREEN}✓${NC} Base de datos lista"

echo ""
echo -e "${GREEN}=================================="
echo "✓ Setup completado"
echo "===================================${NC}"
echo ""
echo "Próximos pasos:"
echo "1. Edita .env con tus credenciales:"
echo "   - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET"
echo "   - SMTP_USER / SMTP_PASS (si usas EMAIL_MODE=smtp)"
echo ""
echo "2. Inicia la aplicación:"
echo "   npm run dev"
echo ""
echo "3. Abre http://localhost:3000"
echo ""
