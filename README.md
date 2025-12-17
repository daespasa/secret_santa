# Secret Santa (Amigo Invisible)

Aplicación Express + EJS para organizar "amigo invisible" con login Google, grupos por invitación, sorteo circular y notificación por email.

## Requisitos

- Node.js 20+
- Docker + Docker Compose (recomendado)

## Configuración

1. Copia `.env.example` a `.env` y rellena las variables (Google OAuth, SMTP si usas modo smtp). Para SQLite en volumen, deja `DB_PATH=/data/app.db` y `DATABASE_URL=file:/data/app.db`.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Genera Prisma Client y aplica migración inicial:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

## Ejecución

- Desarrollo local:
  ```bash
  npm run dev
  ```
  Visita http://localhost:3000
- Docker:
  ```bash
  docker-compose up -d --build
  ```
  El volumen `./data` guarda la base SQLite.

## Flujo

1. Inicia sesión con Google (`/auth/google`).
2. Crea un grupo (`/groups/new`). Al crear se genera un enlace de invitación `/join/:token`.
3. Comparte el enlace; los usuarios logueados entran al grupo en un clic.
4. En dashboard (`/dashboard`) verás tus grupos y, si eres admin, el botón para sortear (mínimo 3 participantes, una sola vez).
5. Tras sortear, cada usuario ve su destinatario en `/groups/:id` y recibe un email. En `EMAIL_MODE=dev` se loggea en consola.

## Notas de seguridad

- Sesiones con cookies `httpOnly` y `SameSite=Lax`.
- CSRF habilitado para formularios.
- Se valida pertenencia antes de mostrar un grupo o su resultado.

## Rutas clave

- GET `/` landing
- GET `/dashboard`
- GET `/groups/new`, POST `/groups`
- GET `/groups/:id`
- POST `/groups/:id/draw` (solo admin)
- GET `/join/:token`
- GET `/auth/google`, GET `/auth/google/callback`, POST `/logout`

## Variables de entorno

Consulta `.env.example` para la lista completa:

- `BASE_URL`, `SESSION_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- `EMAIL_MODE` (`dev`|`smtp`), `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`
- `DB_PATH`, `DATABASE_URL`
