# 🎁 Amigo Invisible

Una aplicación web moderna y elegante para organizar intercambios de regalos (Secret Santa) con soporte para usuarios registrados e invitados, sorteos inteligentes y notificaciones por email.

**Deployed Demo**: [Próximamente]

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tech Stack](#tech-stack)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Guía de Desarrollo](#guía-de-desarrollo)
- [Deployment](#deployment)
- [Variables de Entorno](#variables-de-entorno)
- [Seguridad](#seguridad)
- [Licencias](#licencias)

---

## ✨ Características

### 👥 Gestión de Usuarios
- **Autenticación Google OAuth 2.0** - Inicio de sesión sin contraseña
- **Autenticación Local** - Email/contraseña con contraseñas hasheadas
- **Fotos de Perfil** - Subida y almacenamiento de avatares
- **Gestión de Contraseña** - Cambio y recuperación segura
- **Participantes Invitados** - Permite unirse sin registro

### 🎯 Gestión de Grupos
- **Creación de Grupos** - Configuración completa con iconos y colores
- **Invitaciones por Token** - Enlaces únicos y compartibles
- **Límite de Participantes** - Configuración de mínimo de participantes
- **Presupuesto Máximo** - Define límite de gasto
- **Fechas de Eventos** - Fecha del evento y límite de registro
- **Reglas Personalizadas** - Notas adicionales para el grupo
- **Archivado** - Mantén el historial sin mostrar grupos activos
- **Eliminación** - Borra grupos y todos sus datos

### 🎲 Sistema de Sorteo
- **Sorteo Circular** - Algoritmo que garantiza asignaciones válidas
- **Resorteo Ilimitado** - El admin puede regenerar asignaciones
- **Validación de Participantes** - Verifica cantidad mínima antes de sortear
- **Notificaciones Automáticas** - Emails con resultados del sorteo
- **Visualización de Resultados** - Cada usuario ve a quién le toca

### 💌 Sistema de Notificaciones
- **Emails Profesionales** - Plantillas HTML modernas y responsivas
- **Soporte SMTP** - Compatible con Brevo, SendGrid, Gmail, etc.
- **Modo Desarrollo** - Logging en consola para testing
- **Reintentos** - Manejo robusto de fallos de envío

### 🛡️ Protección
- **CSRF Protection** - Tokens CSRF en todos los formularios
- **Rate Limiting** - Protección contra fuerza bruta
- **Validación de Entrada** - Sanitización de datos
- **Sesiones Seguras** - Cookies httpOnly y SameSite
- **Autenticación JWT-like** - Gestión de sesiones

### 📱 Experiencia de Usuario
- **Diseño Responsivo** - Funciona en móvil, tablet y desktop
- **Interfaz Moderna** - Tailwind CSS con diseño limpio
- **Material Icons** - Iconografía profesional
- **Flash Messages** - Notificaciones de éxito/error
- **Modo Oscuro Ready** - Compatible con preferencias del sistema

---

## 🛠️ Tech Stack

### Backend
- **Express.js 5** - Framework web minimalista
- **Node.js 20** - Runtime de JavaScript
- **Prisma 6** - ORM type-safe
- **SQLite** - Base de datos embebida (desarrollo)
- **PostgreSQL** - Base de datos escalable (producción)

### Frontend
- **EJS** - Server-side rendering
- **Tailwind CSS** - Utility-first CSS framework
- **Material Symbols** - Iconografía moderna
- **Responsive Design** - Mobile-first approach

### Seguridad & Autenticación
- **Passport.js** - Estrategias de autenticación
- **bcryptjs** - Hashing de contraseñas
- **csrf-csrf** - Protección CSRF
- **express-session** - Gestión de sesiones

### Email & Notificaciones
- **Nodemailer** - Envío de emails
- **Brevo SMTP** - Relay SMTP confiable

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación local
- **Multer** - Upload de archivos
- **Morgan** - Logging HTTP

---

## 📦 Requisitos

### Sistema
- **Node.js**: 20.x o superior
- **npm**: 10.x o superior
- **Docker**: 24.x o superior (opcional, recomendado)
- **Docker Compose**: 2.x o superior (opcional)

### Cuentas Externas
- **Google Cloud Project** - Para OAuth 2.0
- **Brevo Account** - Para envío de emails (u otro servicio SMTP)
- **Cloudflare Account** - Para dominio y Tunnel (producción)

---

## 🚀 Instalación

### Opción 1: Desarrollo Local

```bash
# 1. Clona el repositorio
git clone https://github.com/daespasa/secret_santa.git
cd secret_santa

# 2. Instala dependencias
npm install

# 3. Configura variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# 4. Genera Prisma Client
npx prisma generate

# 5. Aplica migraciones
npx prisma migrate dev

# 6. Inicia la aplicación
npm run dev
```

Accede a `http://localhost:3000`

### Opción 2: Docker Compose (Recomendado)

```bash
# 1. Clona el repositorio
git clone https://github.com/daespasa/secret_santa.git
cd secret_santa

# 2. Configura variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# 3. Construye e inicia los contenedores
docker-compose up -d --build

# 4. Aplica migraciones (primera ejecución)
docker-compose exec app npx prisma migrate deploy

# 5. Accede a la aplicación
# http://localhost:3000
```

---

## ⚙️ Configuración

### Google OAuth 2.0

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto
3. Habilita la API de Google+ y OAuth Consent Screen
4. Crea credenciales OAuth 2.0 (Web Application)
5. Agrega URIs autorizados:
   - Local: `http://localhost:3000/auth/google/callback`
   - Producción: `https://tu-dominio.com/auth/google/callback`
6. Copia las credenciales a `.env`:

```env
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

### Brevo (Emails)

1. Crea una cuenta en [Brevo](https://www.brevo.com)
2. Ve a **SMTP & API**
3. Copia las credenciales SMTP
4. Configura en `.env`:

```env
EMAIL_MODE=smtp
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-clave-smtp
EMAIL_FROM="Amigo Invisible <noreply@tu-dominio.com>"
```

### Base de Datos (Producción)

Para PostgreSQL en Producción:

```env
DATABASE_URL=postgresql://user:password@host:5432/secret_santa
```

---

## 🏃 Ejecución

### Desarrollo

```bash
# Con hot-reload y Tailwind en tiempo real
npm run dev
```

### Producción

```bash
# Compila CSS y ejecuta servidor
npm run build:css
npm start
```

### Docker

```bash
# Desarrollo con docker-compose
docker-compose up

# Producción (sin modo dev)
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📁 Estructura del Proyecto

```
secret_santa/
├── src/
│   ├── server.js              # Punto de entrada
│   ├── config.js              # Configuración centralizada
│   ├── prisma.js              # Cliente Prisma
│   ├── icons.js               # Helper de iconos
│   ├── middleware/
│   │   ├── auth.js            # Autenticación
│   │   ├── validation.js      # Validación
│   │   └── rate-limit.js      # Rate limiting
│   ├── routes/
│   │   ├── auth.js            # Rutas de autenticación
│   │   ├── dashboard.js       # Dashboard
│   │   ├── groups.js          # Gestión de grupos
│   │   ├── settings.js        # Configuración de usuario
│   │   └── pages.js           # Páginas estáticas
│   └── services/
│       ├── email.js           # Envío de emails
│       └── draw.js            # Algoritmo de sorteo
├── views/
│   ├── layout.ejs             # Layout principal
│   ├── landing.ejs            # Página de inicio
│   ├── dashboard.ejs          # Dashboard
│   ├── settings.ejs           # Configuración
│   ├── auth/                  # Vistas de autenticación
│   ├── groups/                # Vistas de grupos
│   └── partials/              # Componentes reutilizables
├── public/
│   ├── style.css              # CSS compilado (generado)
│   ├── uploads/               # Archivos subidos
│   └── icons/                 # Iconos
├── prisma/
│   ├── schema.prisma          # Esquema de BD
│   ├── migrations/            # Historial de migraciones
│   └── data/                  # Datos de la BD
├── scripts/
│   └── generate-icons.js      # Generador de iconos
├── Dockerfile                 # Imagen Docker
├── docker-compose.yml         # Orquestación local
├── tailwind.config.js         # Configuración Tailwind
├── postcss.config.js          # Configuración PostCSS
└── package.json               # Dependencias
```

---

## 🧑‍💻 Guía de Desarrollo

### Crear una Migración

```bash
# Modifica prisma/schema.prisma
# Luego ejecuta:
npx prisma migrate dev --name nombre_migracion
```

### Acceder a Prisma Studio

```bash
# Panel visual para inspeccionar/editar BD
npx prisma studio
```

### Agregar una Nueva Ruta

1. Crea el archivo en `src/routes/`
2. Define rutas con Express
3. Importa en `src/server.js`

```javascript
// src/routes/nueva.js
import express from "express";
const router = express.Router();

router.get("/nueva", (req, res) => {
  res.render("nueva");
});

export default router;
```

4. Integra en server.js:

```javascript
import nuevaRouter from "./routes/nueva.js";
app.use(nuevaRouter);
```

### Estilos con Tailwind

- Edita `src/input.css` para estilos globales
- Usa clases Tailwind en vistas EJS
- El watch en `npm run dev` recompila automáticamente

### Testing de Emails

```bash
# Modo desarrollo: logs en consola
EMAIL_MODE=dev npm run dev

# Modo SMTP: envía reales a Brevo
EMAIL_MODE=smtp npm run dev
```

---

## 🚀 Deployment

### Opción A: Cloudflare Tunnel + Docker (Recomendado) ⭐

**Ventajas:**
- Sin costos
- SSL automático
- DDoS protection incluido
- Zero-trust network

**Pasos:**
1. Instala `cloudflared` en tu servidor
2. Ejecuta: `cloudflared tunnel create amigo-invisible`
3. Configura el tunnel a `localhost:3000`
4. Actualiza DNS en Cloudflare

Más info: [Cloudflare Tunnel Setup](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/)

### Opción B: Dokploy (Alternativo)

**Ventajas:**
- Panel de control web
- CI/CD automático
- Autoescalado
- Backups automáticos

[Dokploy Docs](https://dokploy.com)

### Variables de Entorno en Producción

```env
# Base
BASE_URL=https://tu-dominio.com
SESSION_SECRET=genera-una-clave-segura-aqui

# Google OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=https://tu-dominio.com/auth/google/callback

# Email
EMAIL_MODE=smtp
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=xxx
SMTP_PASS=xxx
EMAIL_FROM=noreply@tu-dominio.com

# Base de Datos (PostgreSQL en prod)
DATABASE_URL=postgresql://user:pass@host:5432/secret_santa

# Modo
NODE_ENV=production
```

---

## 📋 Variables de Entorno

### Completa (`.env.example`)

```env
# ===== APLICACIÓN =====
BASE_URL=http://localhost:3000
SESSION_SECRET=cambiar-en-produccion
NODE_ENV=development

# ===== GOOGLE OAUTH =====
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# ===== BASE DE DATOS =====
DB_PATH=./data/app.db
DATABASE_URL=file:./data/app.db

# ===== EMAIL (BREVO/SMTP) =====
EMAIL_MODE=dev                    # dev | smtp
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=Secret Santa <noreply@example.com>
```

---

## 🔐 Seguridad

### Prácticas Implementadas

✅ **Autenticación Segura**
- Contraseñas hasheadas con bcryptjs
- Sesiones con cookies httpOnly
- SameSite=Lax contra CSRF

✅ **Protección CSRF**
- Tokens CSRF en todos los formularios
- Validación en endpoints POST/PUT/DELETE

✅ **Rate Limiting**
- Límite de intentos de login: 5 por IP/15 min
- Límite de sorteos: 1 por grupo/5 min
- Límite de creación de grupos: 10 por usuario/hora

✅ **Validación de Entrada**
- Sanitización de datos
- Validación de emails
- Validación de tipos

✅ **Control de Acceso**
- Solo admins pueden sortear/resortear
- Verificación de membresía en grupos
- Aislamiento de datos por usuario

### Recomendaciones Adicionales

1. **En Producción:**
   - Usar HTTPS obligatorio
   - Configurar HSTS headers
   - Habilitar Content Security Policy
   - Usar variables de entorno seguras

2. **Monitoreo:**
   - Logs centralizados
   - Alertas de errores
   - Métricas de performance

3. **Backups:**
   - BD diaria
   - Archivos de usuarios
   - Recuperación probada

---

## 📝 Licencias

Consulta [LICENSES.md](./LICENSES.md) para todas las licencias y atribuciones de dependencias.

---

## 🤝 Contribuciones

Reporta issues en GitHub o crea pull requests.

---

## 📞 Soporte

- 📧 Email: daespasa@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/daespasa/secret_santa/issues)

---

**Versión**: 0.1.0  
**Última Actualización**: Diciembre 2025  
**Licencia**: MIT
