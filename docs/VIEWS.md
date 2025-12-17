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

Si creas nuevas vistas o actualizas las existentes, usa el partial para mantener consistencia:

- `views/landing.ejs`
- `views/dashboard.ejs`
- `views/settings.ejs`
- `views/not-found.ejs`
- `views/credits.ejs`
- `views/privacy.ejs`
- `views/groups/edit.ejs`
- `views/groups/created.ejs`

### Layout Completo (Opcional)

También se ha creado `views/layout.ejs` como un layout más completo que puede usarse en el futuro con variables locales para mayor flexibilidad.

## Beneficios

1. **Mantenibilidad**: Cambios en iconos, fuentes o meta tags se hacen en un solo lugar
2. **Consistencia**: Todas las páginas tienen los mismos recursos base
3. **DRY**: No repetir código
4. **Performance**: Asegurar que todos los preconnect y preload estén configurados igual

## Helpers Disponibles

En todas las vistas tienes acceso a:

- `renderIcon(name, classes)` - Renderiza iconos de Material Symbols
- `renderGroupIcon(icon, classes)` - Renderiza iconos de grupo con mapeo
- `csrfToken` - Token CSRF para formularios
- `currentUser` - Usuario actual (si está logueado)
- `flash` - Mensajes flash (success, error, info)
- `config` - Configuración de la app
- `dayjs` - Librería de fechas (donde se incluya)
