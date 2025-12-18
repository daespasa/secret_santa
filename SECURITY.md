# 🔐 Política de Seguridad

Documento de seguridad para **Amigo Invisible**.

---

## 📝 Reportar Vulnerabilidades

**POR FAVOR NO ABRAS ISSUES PÚBLICOS** para vulnerabilidades de seguridad.

### Cómo Reportar

Envía un email a **daespasa@gmail.com** con:

```
Asunto: [SECURITY] - Descripción de la vulnerabilidad

Cuerpo:
1. Descripción de la vulnerabilidad
2. Pasos para reproducir
3. Impacto potencial
4. Sugerencia de fix (si tienes)
```

### Tiempo de Respuesta

- ✅ Confirmación inicial: 48 horas
- ✅ Fix: 7 días (dependiendo de severidad)
- ✅ Disclosure: 30 días después del fix

---

## 🛡️ Prácticas de Seguridad Implementadas

### Autenticación

✅ **Contraseñas**

- Hasheadas con bcryptjs (cost: 10)
- Mínimo 8 caracteres en validación
- Never stored in plain text

✅ **Sessions**

- HTTPOnly cookies
- SameSite=Lax
- Secure flag en HTTPS
- 24 horas de expiración

✅ **OAuth 2.0**

- Google OAuth con PKCE
- Token refresh automático
- State parameter validation

### Protección CSRF

✅ **Tokens CSRF**

- Generados por csrf-csrf
- Validados en POST/PUT/DELETE
- Regenerados en login
- Incluidos en todas las formas

### Validación de Entrada

✅ **Sanitización**

- Validación de emails con regex
- Trim de espacios en blanco
- Type checking con Prisma
- Límites de longitud

✅ **Inyección SQL**

- Prisma ORM (queries parametrizadas)
- No concatenación de SQL
- Parameterized statements

### Rate Limiting

✅ **Protección contra fuerza bruta**

- Login: 5 intentos / 15 minutos
- Draw: 1 intento / 5 minutos
- Group creation: 10 / hora

✅ **Implementación**

```javascript
// src/middleware/rate-limit.js
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  message: "Demasiados intentos",
});
```

### Control de Acceso

✅ **Autorización**

- Solo admin puede sortear
- Verificación de membresía
- Aislamiento de datos por usuario
- No acceso a data de otros usuarios

✅ **Ejemplo:**

```javascript
if (group.adminUserId !== req.user.id) {
  return res.status(403).json({ error: "Forbidden" });
}
```

### Gestión de Archivos

✅ **Uploads**

- Validación de tipo MIME
- Límite de tamaño (5MB)
- Almacenamiento en servidor
- Renombrado de archivos
- Sin ejecución en carpeta pública

### Encriptación

✅ **En tránsito**

- HTTPS obligatorio en producción
- TLS 1.2+
- HSTS headers habilitados

✅ **En reposo**

- Contraseñas con bcryptjs
- Tokens firmados
- Datos en BD sin encriptar (confía en TLS)

### Logging y Monitoreo

✅ **Access Logs**

```javascript
// Morgan logs todas las peticiones
import morgan from "morgan";
app.use(morgan("combined"));
```

✅ **Error Logs**

- Errores sin stack trace en producción
- Error tracking en desarrollo

### Dependencias

✅ **Auditoría Regular**

```bash
npm audit
npm audit fix
```

✅ **Versiones Pinned**

- package-lock.json en control de versiones
- Actualizaciones consideradas
- No auto-updates en producción

---

## 📋 Checklist de Seguridad para Producción

- [ ] `SESSION_SECRET` es clave fuerte (32+ caracteres)
- [ ] `NODE_ENV=production`
- [ ] `BASE_URL` es HTTPS
- [ ] CSRF tokens habilitados
- [ ] Rate limiting activo
- [ ] Logs centralizados
- [ ] Backups automáticos
- [ ] Monitoreo de errores
- [ ] SSL/TLS configurado
- [ ] HSTS headers activos
- [ ] Content-Security-Policy configurada
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff

---

## 🔍 Security Headers Recomendados

```javascript
// src/server.js
app.use((req, res, next) => {
  // Prevent MIME sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // XSS Protection (legacy)
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  // Content Security Policy
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "font-src 'self' fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self'",
    ].join("; ")
  );

  next();
});
```

---

## 🚨 Incidentes de Seguridad Previos

Ninguno reportado a la fecha.

---

## 📚 Referencias y Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [Prisma Security](https://www.prisma.io/docs/concepts/more/security)

---

## 📞 Contacto

Para problemas de seguridad:

- 📧 Email: daespasa@gmail.com
- 🔐 No abras issues públicos

Para otros temas:

- 📖 Docs: [README.md](./README.md)
- 🐛 Issues: [GitHub Issues](https://github.com/daespasa/secret_santa/issues)

---

**Última actualización**: Diciembre 2025
