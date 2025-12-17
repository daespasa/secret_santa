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

### `layout-page.ejs` - Páginas Estándar
Para páginas autenticadas con header, contenido y footer:
```ejs
<%- include('../partials/layout-page', { 
  title: 'Mi Página', 
  description: 'Descripción de mi página',
  body: renderedContent 
}) %>
```

**Características**:
- Header fijo
- Fondo gris
- Flash messages automáticos
- Footer integrado
- Máximo ancho (max-w-7xl)

### `layout-full.ejs` - Páginas Públicas
Para landing pages y páginas públicas:
```ejs
<%- include('../partials/layout-full', { 
  title: 'Bienvenido',
  htmlClass: 'h-full scroll-smooth',
  includeHeader: true,
  body: renderedContent
}) %>
```

**Variables opcionales**:
- `htmlClass` - Clases para el html tag
- `includeHeader` - Mostrar header (default: false)
- `keywords` - Meta keywords para SEO
- `robots` - Meta robots
- `canonicalUrl` - URL canónica

### `layout-auth.ejs` - Páginas de Autenticación
Para login, register y páginas similares:
```ejs
<%- include('../partials/layout-auth', {
  title: 'Iniciar Sesión',
  body: renderedContent
}) %>
```

**Características**:
- Contenido centrado
- Gradiente rojo-rosa
- Ancho máximo 448px
- Diseño minimalista

### `layout-error.ejs` - Páginas de Error/Info
Para 404, error pages, etc:
```ejs
<%- include('../partials/layout-error', {
  title: 'Página no encontrada',
  description: 'La página que buscas no existe',
  headerOffset: '16', // pt-16 if header shown
  body: renderedContent
}) %>
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
