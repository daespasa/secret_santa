# 📝 Changelog

Todos los cambios notables en este proyecto serán documentados aquí.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/) y este proyecto sigue [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Changes
- Docs: Update README and DEPLOYMENT.md for CasaOS-friendly compose (env at /DATA/secretsanta/.env, volumes under /DATA/secretsanta, Node healthcheck).

### Planeado

- [ ] Base de datos PostgreSQL
- [ ] Soporte para múltiples idiomas
- [ ] Notificaciones push en navegador
- [ ] Búsqueda y filtrado avanzado en grupos
- [ ] Estadísticas y reportes
- [ ] API REST para integraciones
- [ ] Temas personalizados (dark mode completo)

---

## [0.1.0] - 2025-12-18

### ✨ Agregado

- ✅ Autenticación Google OAuth 2.0
- ✅ Autenticación local (email/contraseña)
- ✅ Registro e inicio de sesión
- ✅ Gestión de perfil de usuario
- ✅ Subida de fotos de perfil
- ✅ Creación de grupos con configuración completa
- ✅ Invitaciones por token único
- ✅ Soporte para participantes invitados (sin registro)
- ✅ Sistema de sorteo circular garantizado
- ✅ Resorteo ilimitado por admin
- ✅ Visualización de resultados personalizados
- ✅ Envío de emails con notificaciones de sorteo
- ✅ Plantillas HTML de email modernas
- ✅ Dashboard con vista de grupos
- ✅ Gestión de participantes (admin)
- ✅ Eliminación de participantes por admin
- ✅ Archivado de grupos
- ✅ Eliminación de grupos
- ✅ Capacidad de dejar grupo
- ✅ Protección CSRF en formularios
- ✅ Rate limiting contra fuerza bruta
- ✅ Validación de entrada
- ✅ Sesiones seguras (HTTPOnly, SameSite)
- ✅ Interfaz responsiva (móvil/tablet/desktop)
- ✅ Diseño moderno con Tailwind CSS
- ✅ Material Icons para UI
- ✅ Modo oscuro compatible
- ✅ Flash messages para feedback
- ✅ Manejo de errores amigable
- ✅ Página de privacidad
- ✅ Página de créditos y licencias
- ✅ Documentación completa
- ✅ Guía de deployment
- ✅ Guía de contribución

### 🔧 Configuración Técnica

- Node.js 20 con Express.js 5
- Prisma 6 con SQLite (desarrollo)
- EJS para server-side rendering
- Tailwind CSS con PostCSS
- Passport.js para autenticación
- bcryptjs para hashing de contraseñas
- Nodemailer con Brevo SMTP
- Docker y Docker Compose
- Morgan para logging

### 🛡️ Seguridad

- CSRF protection con csrf-csrf
- Rate limiting con express-rate-limit
- Validación de entrada
- Contraseñas hasheadas con bcryptjs
- Sesiones seguras
- Control de acceso basado en roles

### 📱 Features de UX

- Layout responsivo con 4 templates
- Navegación principal fija
- Flash messages contextuales
- Formularios validados
- Iconografía Material Symbols
- Diseño consistente en toda la app

---

## Versiones Futuras

### v0.2.0 (Estimado: Q1 2026)

- [ ] Migración a PostgreSQL
- [ ] Panel de administración
- [ ] Búsqueda global
- [ ] Historial de eventos
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Integración con calendarios (Google Calendar, Outlook)

### v0.3.0 (Estimado: Q2 2026)

- [ ] API REST completa
- [ ] Aplicación móvil (React Native)
- [ ] Pago y plan premium
- [ ] Análisis y reportes avanzados
- [ ] Exportación de datos

### v1.0.0 (Estimado: Q3 2026)

- Release estable
- Cobertura de tests 80%+
- Performance optimizada
- Documentación finalizada

---

## Notas de Versión

### v0.1.0 - Release Inicial

**¡Primera versión pública de Amigo Invisible!**

Este MVP incluye todas las características esenciales para organizar intercambios de regalos:

- Sistema de sorteo funcional y garantizado
- Soporte para usuarios con y sin registro
- Notificaciones por email
- Interfaz moderna y responsiva
- Seguridad básica implementada

**Conocidos Issues:**

- SQLite no es escalable para muchos usuarios (plan migrar a PostgreSQL)
- Falta de tests automatizados (próxima versión)
- Falta de API REST (v0.2.0)

**Gracias especiales a:**

- Usuarios de testing
- Comunidad de código abierto

---

## Cómo Reportar Cambios

Si encuentras un bug o tienes sugerencias:

1. Abre un [issue en GitHub](https://github.com/daespasa/secret_santa/issues)
2. O contáctame en daespasa@gmail.com

---

## Licencia

Este proyecto está bajo licencia MIT. Ver [LICENSES.md](./LICENSES.md) para más detalles.

---

**Última actualización**: 18 de Diciembre de 2025
