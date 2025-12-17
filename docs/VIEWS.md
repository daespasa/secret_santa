# Sistema de Vistas EJS

## Partial Compartido: `views/partials/head.ejs`

Se ha creado un partial compartido que contiene todos los elementos comunes del `<head>`:

- Meta tags básicos (charset, viewport)
- Favicons y manifest
- Estilos CSS
- Material Symbols (iconos de Google)
- Theme color

### Uso

En lugar de duplicar todo el head en cada vista, simplemente incluye el partial:

```ejs
<!DOCTYPE html>
<html lang="es">
  <head>
    <%- include('./partials/head') %>
    <!-- O para vistas en subdirectorios: -->
    <%- include('../partials/head') %>

    <!-- Título específico de la página -->
    <title>Mi Página - Secret Santa</title>

    <!-- Meta tags adicionales si son necesarios -->
    <meta name="description" content="Descripción específica" />
  </head>
  <body>
    <!-- Contenido -->
  </body>
</html>
```

### Vistas Actualizadas

Las siguientes vistas ya usan el partial compartido:

- ✅ `views/groups/join.ejs`
- ✅ `views/groups/new.ejs`
- ✅ `views/groups/show.ejs`
- ✅ `views/auth/login.ejs`
- ✅ `views/auth/register.ejs`
- ✅ `views/error.ejs`

### Vistas Pendientes

Todas las vistas han sido actualizadas para usar el partial compartido:

- ✅ `views/landing.ejs`
- ✅ `views/dashboard.ejs`
- ✅ `views/settings.ejs`
- ✅ `views/not-found.ejs`
- ✅ `views/credits.ejs`
- ✅ `views/privacy.ejs`
- ✅ `views/groups/edit.ejs`
- ✅ `views/groups/created.ejs`

### Layout Completo (Opcional)

También se ha creado `views/layout.ejs` como un layout más completo que puede usarse en el futuro con variables locales para mayor flexibilidad.

## Beneficios

1. **Mantenibilidad**: Cambios en iconos, fuentes o meta tags se hacen en un solo lugar
2. **Consistencia**: Todas las páginas tienen los mismos recursos base
3. **DRY**: No repetir código
4. **Performance**: Asegurar que todos los preconnect y preload estén configurados igual

## Layouts Especializados

Se han creado varios layouts para diferentes tipos de páginas, eliminando duplicación:

### `layout-page-start/end` - Páginas Estándar
Para páginas autenticadas con header, contenido y footer:
```ejs
<%- include('../partials/layout-page-start', { 
  title: 'Mi Página', 
  description: 'Descripción de mi página'
}) %>
  <!-- Contenido principal aquí -->
<%- include('../partials/layout-page-end') %>
```

**Características**:
- Header fijo
- Fondo gris
- Flash messages automáticos
- Footer integrado
- Máximo ancho (max-w-7xl)

### `layout-full-start/end` - Páginas Públicas
Para landing pages y páginas públicas:
```ejs
<%- include('../partials/layout-full-start', { 
  title: 'Bienvenido',
  htmlClass: 'h-full scroll-smooth',
  includeHeader: true,
}) %>
  <!-- Contenido principal aquí -->
<%- include('../partials/layout-full-end') %>
```

**Variables opcionales**:
- `htmlClass` - Clases para el html tag
- `includeHeader` - Mostrar header (default: false)
- `keywords` - Meta keywords para SEO
- `robots` - Meta robots
- `canonicalUrl` - URL canónica

### `layout-auth-start/end` - Páginas de Autenticación
Para login, register y páginas similares:
```ejs
<%- include('../partials/layout-auth-start', {
  title: 'Iniciar Sesión'
}) %>
  <!-- Formulario de autenticación -->
<%- include('../partials/layout-auth-end') %>
```

**Características**:
- Contenido centrado
- Gradiente rojo-rosa
- Ancho máximo 448px
- Diseño minimalista

### `layout-error-start/end` - Páginas de Error/Info
Para 404, error pages, etc:
```ejs
<%- include('../partials/layout-error-start', {
  title: 'Página no encontrada',
  description: 'La página que buscas no existe'
}) %>
  <!-- Mensaje y acciones -->
<%- include('../partials/layout-error-end') %>
```

## Partials Compartidos

Todos los layouts usan estos partials comunes:

- `head.ejs` - Meta tags, favicon, estilos
- `header.ejs` - Navegación fija
- `footer.ejs` - Pie de página
- `flash.ejs` - Mensajes de notificación

## Helpers Disponibles

En todas las vistas tienes acceso a:

- `renderIcon(name, classes)` - Renderiza iconos de Material Symbols
- `renderGroupIcon(icon, classes)` - Renderiza iconos de grupo con mapeo
- `csrfToken` - Token CSRF para formularios
- `currentUser` - Usuario actual (si está logueado)
- `flash` - Mensajes flash (success, error, info)
- `config` - Configuración de la app
- `dayjs` - Librería de fechas (donde se incluya)

## Estado de Migración a Layouts

- `layout-page-start/end`: dashboard, settings, groups/new, groups/edit, groups/created
- `layout-full-start/end`: landing, privacy, credits, groups/join, groups/show
- `layout-auth-start/end`: auth/login, auth/register
- `layout-error-start/end`: not-found

### Notas importantes
- El offset del header (`pt-16`) se aplica automáticamente en `layout-full-start` cuando `includeHeader` es `true`.
- Si necesitas mostrar mensajes flash en páginas con `layout-full`, inclúyelos manualmente dentro del contenido: `<%- include('../partials/flash') %>`.
- Los `<script>` deben ir siempre antes del include de cierre correspondiente (`layout-*-end`) para quedar dentro de `<body>`.
