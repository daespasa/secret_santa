# 🚀 Guía de Deployment - Amigo Invisible

Guía completa para desplegar **Amigo Invisible** en producción usando **Cloudflare Tunnel + Docker**.

---

## 📋 Tabla de Contenidos

- [Opción A: Cloudflare Tunnel (Recomendado)](#opción-a-cloudflare-tunnel)
- [Opción B: Dokploy](#opción-b-dokploy)
- [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)
- [Troubleshooting](#troubleshooting)

---

## ✅ Opción A: Cloudflare Tunnel (Recomendado) ⭐

**Ventajas:**

- ✅ Sin costos de infraestructura
- ✅ SSL automático con Let's Encrypt
- ✅ DDoS protection gratis
- ✅ Zero-trust network
- ✅ Compatible con CasaOS
- ✅ Configuración simple

### Requisitos Previos

1. **Servidor con Docker** (CasaOS con contenedores)
2. **Dominio** en Cloudflare
3. **PostgreSQL** o base de datos remota
4. **Git** en tu servidor

### Paso 1: Preparar tu Servidor

```bash
# Actualiza paquetes
sudo apt update && sudo apt upgrade -y

# Instala Docker si no lo tiene (CasaOS ya incluye)
curl -fsSL https://get.docker.com | sh

# Crea directorio para la aplicación
mkdir -p ~/amigo-invisible
cd ~/amigo-invisible

# Clona el repositorio
git clone https://github.com/daespasa/secret_santa.git .
```

### Paso 2: Configurar Variables de Entorno

```bash
# Crea .env con variables de producción
cat > .env << 'EOF'
# ===== APLICACIÓN =====
BASE_URL=https://tu-dominio.com
SESSION_SECRET=genera-una-clave-segura-aqui-minimo-32-caracteres
NODE_ENV=production

# ===== GOOGLE OAUTH =====
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=https://tu-dominio.com/auth/google/callback

# ===== BASE DE DATOS (PostgreSQL) =====
DATABASE_URL=postgresql://usuario:contraseña@host:5432/secret_santa

# ===== EMAIL (BREVO) =====
EMAIL_MODE=smtp
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-clave-smtp-brevo
EMAIL_FROM="Amigo Invisible <noreply@tu-dominio.com>"
EOF
```

### Paso 3: Crear docker-compose.prod.yml

```bash
cat > docker-compose.prod.yml << 'EOF'
version: "3.9"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: amigo-invisible
    restart: always
    env_file:
      - .env
    ports:
      - "3000:3000"
    volumes:
      - ./data:/data
      - ./public/uploads:/app/public/uploads
    depends_on:
      - db
    networks:
      - amigo-net
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  db:
    image: postgres:16-alpine
    container_name: amigo-db
    restart: always
    environment:
      POSTGRES_USER: amigo_user
      POSTGRES_PASSWORD: cambiar-en-produccion
      POSTGRES_DB: secret_santa
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - amigo-net
    ports:
      - "5432:5432"  # Solo para backup, no expongas en producción

networks:
  amigo-net:
    driver: bridge

volumes:
  postgres_data:
EOF
```

### Paso 4: Instalar y Configurar Cloudflare Tunnel

#### 4.1 Instala cloudflared

```bash
# Descarga el instalador
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Instala
sudo dpkg -i cloudflared-linux-amd64.deb
```

#### 4.2 Autentica tu cuenta

```bash
cloudflared tunnel login
# Se abrirá navegador para autenticar con Cloudflare
# Selecciona tu dominio
```

#### 4.3 Crea el túnel

```bash
# Crea túnel nombrado
cloudflared tunnel create amigo-invisible

# Copia el UUID que aparece
# Lo necesitarás después
```

#### 4.4 Configura el túnel

```bash
# Crea archivo de configuración
mkdir -p ~/.cloudflared
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: amigo-invisible
ingress:
  - hostname: tu-dominio.com
    service: http://localhost:3000
  - hostname: www.tu-dominio.com
    service: http://localhost:3000
  - service: http_status:404
EOF

# Copia el archivo de credenciales
# Se guardó en ~/.cloudflared/uuid.json
```

#### 4.5 Prueba la conexión

```bash
# Ejecuta en foreground para ver logs
cloudflared tunnel run amigo-invisible
# Deberías ver: "Tunnel is running"
```

### Paso 5: Instalar cloudflared como Servicio

```bash
# Instala como servicio del sistema
sudo cloudflared service install

# Inicia el servicio
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# Verifica estado
sudo systemctl status cloudflared

# Ver logs
sudo journalctl -u cloudflared -f
```

### Paso 6: Configurar DNS en Cloudflare

1. Ve a tu dashboard de Cloudflare
2. Selecciona tu dominio
3. Ve a **DNS**
4. Cloudflare habrá creado automáticamente registros CNAME:
   - `tu-dominio.com` → `uuid.cfargotunnel.com`
   - `www.tu-dominio.com` → `uuid.cfargotunnel.com`

### Paso 7: Iniciar Aplicación en CasaOS (Completamente Automático)

```bash
## ✨ CasaOS (Solo 2 pasos)

# 1) Descarga docker-compose.prod.yml del repositorio

# 2) En CasaOS: AppStore → Custom App → Importa el compose → Presiona "Start"

# 🎉 El sistema automáticamente:
#  ✓ Crea /DATA/secretsanta/{data,uploads}
#  ✓ Genera .env template en /DATA/secretsanta/.env
#  ✓ Ejecuta migraciones de BD
#  ✓ Inicia la aplicación

# 3) Edita /DATA/secretsanta/.env con tus credenciales:
#    - BASE_URL (tu dominio)
#    - SESSION_SECRET (clave larga aleatoria)
#    - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
#    - SMTP_USER, SMTP_PASS (Brevo)
#    - CLOUDFLARE_TUNNEL_TOKEN (opcional)

# 4) Reinicia desde CasaOS (Stop → Start)

# Ver logs:
docker-compose -f docker-compose.prod.yml logs -f app

# Ver estado:
docker-compose -f docker-compose.prod.yml ps
```

**Nota**: El servicio `init` automáticamente crea las carpetas y genera `.env` si no existen.

### Paso 8: Verificar Deployment

```bash
# Prueba la conexión
curl https://tu-dominio.com

# Verifica logs en tiempo real
docker-compose -f docker-compose.prod.yml logs -f app

# Conecta a la BD si necesitas
# (Si usas PostgreSQL en lugar de SQLite)
# psql postgresql://amigo_user:password@localhost:5432/secret_santa
```

### Paso 9: Configurar SSL en Cloudflare

1. Dashboard → SSL/TLS
2. Selecciona **Full** (recomendado)
3. Activa **Always Use HTTPS**
4. Configura **Minimum TLS Version** a 1.2

---

## 🔄 Mantenimiento y Actualizaciones

### Actualizar Código

```bash
# En tu servidor
cd ~/amigo-invisible

# Pull último código
git pull origin main

# Reconstruye imagen
docker-compose -f docker-compose.prod.yml up -d --build

# Aplica migraciones si hay
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

### Backups de BD

```bash
# Backup manual
docker-compose -f docker-compose.prod.yml exec db pg_dump \
  -U amigo_user secret_santa > backup-$(date +%Y%m%d).sql

# Backup automático (cron)
# Edita: crontab -e
# Agrega (diario a las 2 AM):
0 2 * * * cd ~/amigo-invisible && docker-compose -f docker-compose.prod.yml exec db pg_dump -U amigo_user secret_santa > backups/backup-$(date +\%Y\%m\%d).sql
```

### Monitoreo de Logs

```bash
# Ver logs en tiempo real
docker-compose -f docker-compose.prod.yml logs -f app

# Ver solo últimas 50 líneas
docker-compose -f docker-compose.prod.yml logs --tail=50 app

# Ver logs históricos
docker-compose -f docker-compose.prod.yml logs app | tail -100
```

### Reiniciar la Aplicación

```bash
# Reinicia contenedor
docker-compose -f docker-compose.prod.yml restart app

# Stop y start
docker-compose -f docker-compose.prod.yml stop
docker-compose -f docker-compose.prod.yml start
```

---

## 🐛 Troubleshooting

### "Connection refused"

```bash
# Verifica si app está corriendo
docker-compose -f docker-compose.prod.yml ps

# Reinicia
docker-compose -f docker-compose.prod.yml restart app

# Ver logs
docker-compose -f docker-compose.prod.yml logs app
```

### "Database connection error"

```bash
# Verifica si BD está corriendo
docker-compose -f docker-compose.prod.yml ps db

# Verifica conexión
docker-compose -f docker-compose.prod.yml exec app psql $DATABASE_URL -c "SELECT 1"

# Reinicia BD
docker-compose -f docker-compose.prod.yml restart db
```

### "Tunnel not connecting"

```bash
# Verifica cloudflared
sudo systemctl status cloudflared

# Reinicia servicio
sudo systemctl restart cloudflared

# Ver logs
sudo journalctl -u cloudflared -n 20
```

### "SSL Certificate issues"

```bash
# Espera 5-10 minutos a que Cloudflare genere certificados
# Si persiste, ve a Cloudflare SSL/TLS y verifica:
# - SSL mode está en "Full"
# - Dominio está activo

# Limpia cache
# Dashboard Cloudflare → Caching → Purge Everything
```

---

## ⚙️ Configuración Avanzada

### Habilitar Compresión

En `docker-compose.prod.yml`, agrega a `app`:

```yaml
environment:
  - COMPRESS=true
```

### Rate Limiting Personalizado

En `.env`:

```env
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

### Modo Mantenimiento

```bash
# Crea archivo de flag
touch /app/maintenance.flag

# Sirve página estática
# Actualiza Dockerfile si necesitas
```

---

## 📊 Monitoreo Recomendado

### Configura alertas en Cloudflare

1. Dashboard → Notifications
2. Setup → "Firewall events"
3. Recibirás alertas de:
   - Ataques detectados
   - Cambios de reglas
   - Caídas de servicio

### Logs Centralizados (Opcional)

Usa un servicio como:

- **CloudWatch** (AWS)
- **Loggly**
- **Datadog**
- **ELK Stack** (self-hosted)

---

## 🔐 Checklist de Seguridad

- ✅ `SESSION_SECRET` es una clave fuerte (32+ caracteres)
- ✅ `DATABASE_URL` usa contraseña fuerte
- ✅ `GOOGLE_CALLBACK_URL` apunta a `https://`
- ✅ Firewall de Cloudflare está activo
- ✅ SSL/TLS modo "Full"
- ✅ Always Use HTTPS habilitado
- ✅ Backups automáticos configurados
- ✅ Logs monitoreados

---

## ✅ Opción B: Dokploy

Dokploy es una alternativa más compleja pero profesional. Consulta [Dokploy Docs](https://dokploy.com) para instalación.

---

**Última actualización**: Diciembre 2025
