# Licencias de Dependencias

Este proyecto utiliza las siguientes librerías de código abierto:

## Dependencias Principales

### Express.js (^4.19.2)

- **Licencia**: MIT
- **URL**: https://github.com/expressjs/express
- **Descripción**: Web framework minimalista y flexible para Node.js

### Prisma (^5.22.0)

- **Licencia**: Apache 2.0
- **URL**: https://github.com/prisma/prisma
- **Descripción**: ORM moderno y type-safe para Node.js y TypeScript

### @prisma/client (^5.22.0)

- **Licencia**: Apache 2.0
- **URL**: https://github.com/prisma/prisma
- **Descripción**: Cliente Prisma para acceso a base de datos

### Passport.js (^0.7.0)

- **Licencia**: MIT
- **URL**: https://github.com/jaredhanson/passport
- **Descripción**: Middleware de autenticación flexible para Node.js

### passport-google-oauth20 (^2.0.0)

- **Licencia**: MIT
- **URL**: https://github.com/jaredhanson/passport-google-oauth2
- **Descripción**: Estrategia Google OAuth 2.0 para Passport

### EJS (^3.1.10)

- **Licencia**: Apache 2.0
- **URL**: https://github.com/mde/ejs
- **Descripción**: Motor de plantillas JavaScript embebido

### Express-session (^1.17.3)

- **Licencia**: MIT
- **URL**: https://github.com/expressjs/session
- **Descripción**: Middleware de gestión de sesiones para Express

### Connect-flash (^0.1.1)

- **Licencia**: MIT
- **URL**: https://github.com/jaredhanson/connect-flash
- **Descripción**: Middleware para mensajes flash en Express

### Morgan (^1.10.0)

- **Licencia**: MIT
- **URL**: https://github.com/expressjs/morgan
- **Descripción**: Logger HTTP middleware para Express

### Nodemailer (^7.0.11)

- **Licencia**: EUPL-1.2
- **URL**: https://github.com/nodemailer/nodemailer
- **Descripción**: Librería de envío de emails para Node.js

### Multer (^2.0.2)

- **Licencia**: MIT
- **URL**: https://github.com/expressjs/multer
- **Descripción**: Middleware para manejo de cargas de archivos

### Dotenv (^16.4.5)

- **Licencia**: BSD-2-Clause
- **URL**: https://github.com/motdotla/dotenv
- **Descripción**: Carga variables de entorno desde archivo .env

### Day.js (^1.11.11)

- **Licencia**: MIT
- **URL**: https://github.com/iamkun/dayjs
- **Descripción**: Librería minimalista de fecha/hora

### Nanoid (^5.0.7)

- **Licencia**: MIT
- **URL**: https://github.com/ai/nanoid
- **Descripción**: Generador de IDs únicos pequeños y seguras

### CSRF-csrf (^4.0.3)

- **Licencia**: MIT
- **URL**: https://github.com/Psifi-Solutions/csrf-csrf
- **Descripción**: Protección CSRF para aplicaciones Express

### SQLite3 (^5.1.7)

- **Licencia**: BSD-3-Clause
- **URL**: https://github.com/mapbox/node-sqlite3
- **Descripción**: Binding de Node.js para SQLite

## Dependencias de Desarrollo

### Nodemon (^3.1.4)

- **Licencia**: MIT
- **URL**: https://github.com/remy/nodemon
- **Descripción**: Monitor de cambios automático para desarrollo

### Sharp (^0.34.5)

- **Licencia**: Apache 2.0
- **URL**: https://github.com/lovell/sharp
- **Descripción**: Procesamiento de imágenes de alto rendimiento

## Recursos Externos

### Tailwind CSS (CDN)

- **Licencia**: MIT
- **URL**: https://tailwindcss.com
- **Descripción**: Framework CSS utilitario (cargado via CDN)

## Archivo de Licencia Completo

Todas las dependencias incluyen sus archivos de licencia en el directorio `node_modules`.
Puedes revisar las licencias individuales ejecutando:

```bash
npm ls --depth=0
# Y luego revisar las licencias específicas en node_modules/[nombre-paquete]/LICENSE
```

## Resumen de Licencias

- **MIT**: La mayoría de las dependencias (Express, Passport, Morgan, Connect-flash, Day.js, Nanoid, CSRF-csrf, Nodemon)
- **Apache 2.0**: Prisma, EJS, Sharp
- **EUPL-1.2**: Nodemailer
- **BSD**: Dotenv (BSD-2-Clause), SQLite3 (BSD-3-Clause)

Todas estas licencias son permisivas y compatible con proyectos comerciales y de código abierto.

---

**Última actualización**: 17 de Diciembre de 2025
