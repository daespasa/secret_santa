# 🤝 Guía de Contribución

Gracias por tu interés en contribuir a **Amigo Invisible**. Este documento describe cómo participar en el proyecto.

---

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Reportar Issues](#cómo-reportar-issues)
- [Cómo Hacer Contribuciones](#cómo-hacer-contribuciones)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)

---

## 📜 Código de Conducta

Este proyecto tiene un Código de Conducta basado en respeto, inclusión y profesionalismo.

### Nuestro compromiso

- Crear un entorno acogedor y seguro
- Respetar diferentes puntos de vista y experiencias
- Dar crédito a las contribuciones
- Aceptar crítica constructiva

### Inaceptable

- Lenguaje ofensivo o intimidante
- Discriminación de cualquier tipo
- Acoso en línea o fuera de ella
- Spam o autopromoción

---

## 🐛 Cómo Reportar Issues

### Antes de reportar

1. Verifica que el issue no exista ya en [Issues](https://github.com/daespasa/secret_santa/issues)
2. Actualiza a la última versión
3. Verifica la [documentación](./README.md)

### Al reportar

Incluye:

```markdown
**Descripción del problema**
Explicación clara de qué no funciona.

**Pasos para reproducir**
1. Paso 1
2. Paso 2
3. Paso 3

**Comportamiento esperado**
Qué debería suceder.

**Comportamiento actual**
Qué sucede realmente.

**Screenshots/Videos**
Si aplica.

**Entorno**
- OS: [Windows/Linux/Mac]
- Node.js: [versión]
- Navegador: [Chrome/Firefox/etc]
```

---

## 🚀 Cómo Hacer Contribuciones

### Configuración Inicial

```bash
# 1. Fork el repositorio en GitHub
# 2. Clona tu fork
git clone https://github.com/TU-USUARIO/secret_santa.git
cd secret_santa

# 3. Agrega el upstream
git remote add upstream https://github.com/daespasa/secret_santa.git

# 4. Crea rama de desarrollo
git checkout -b develop
git pull upstream develop

# 5. Crea rama para tu feature
git checkout -b feature/tu-feature
```

### Tipos de Contribuciones

#### 🐛 Bug Fixes
```bash
git checkout -b fix/descripcion-del-bug
# Haz tus cambios
# Incluye tests si es posible
```

#### ✨ Nuevas Características
```bash
git checkout -b feature/nueva-caracteristica
# Haz tus cambios
# Documenta la feature
```

#### 📚 Documentación
```bash
git checkout -b docs/tema
# Edita .md, READMEs, etc.
```

#### 🎨 Mejoras de UI/UX
```bash
git checkout -b ui/descripcion
# Cambios en vistas/estilos
```

---

## 📏 Estándares de Código

### JavaScript/Node.js

```javascript
// ✅ Bueno
function handleUserLogin(email, password) {
  const user = findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }
  return authenticateUser(user, password);
}

// ❌ Malo
function login(e, p) {
  let u = db.query(`SELECT * FROM users WHERE email='${e}'`);
  if (!u) throw 'err';
  return auth(u, p);
}
```

### Reglas

- ✅ 2 espacios de indentación
- ✅ Nombres descriptivos en inglés
- ✅ Funciones pequeñas (máx 50 líneas)
- ✅ Usa `const`/`let`, evita `var`
- ✅ Comentarios para lógica compleja
- ✅ Sin `console.log` en producción

### EJS (Templates)

```ejs
<!-- ✅ Bueno -->
<% if (user) { %>
  <div class="user-card">
    <h2><%= user.name %></h2>
    <p><%= user.email %></p>
  </div>
<% } %>

<!-- ❌ Malo -->
<div class="user-card">
  <h2><%= user.name %></h2>
</div>
```

### CSS/Tailwind

```html
<!-- ✅ Bueno -->
<button class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
  Click me
</button>

<!-- ❌ Malo -->
<button class="px4 py2 bgRed600 text-white rounded hover:bgRed700">
  Click me
</button>
```

### Prisma

```prisma
// ✅ Bueno
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String
  groups Group[] @relation("GroupAdmin")
}

// ❌ Malo
model user {
  id Int @id
  email String
  nm String
}
```

---

## 💻 Workflow de Desarrollo

### 1. Antes de comenzar

```bash
# Actualiza tu rama
git checkout develop
git pull upstream develop

# Crea rama nueva
git checkout -b feature/tu-feature
```

### 2. Durante el desarrollo

```bash
# Instala dependencias si agregaste algo
npm install

# Ejecuta en desarrollo
npm run dev

# Verifica que todo funciona
# - Navega por la app
# - Prueba tu feature
# - Verifica logs en consola
```

### 3. Tests (si aplica)

```bash
# Ejecuta tests
npm run test

# Verifica cobertura
npm run test:coverage
```

### 4. Commits

```bash
# Commits pequeños y descriptivos
git commit -m "fix: corregir bug en login"
git commit -m "feat: agregar two-factor authentication"
git commit -m "docs: actualizar README con instrucciones"
```

**Formato de commits:**
```
<tipo>: <descripción corta>

<descripción larga opcional>

Closes #123
```

**Tipos válidos:**
- `feat` - Nueva característica
- `fix` - Corrección de bug
- `docs` - Cambios en documentación
- `style` - Formato, sin cambiar lógica
- `refactor` - Refactorizar código
- `perf` - Mejoras de performance
- `test` - Tests
- `chore` - Cambios de build/deps

### 5. Push a tu fork

```bash
# Push a tu rama
git push origin feature/tu-feature

# O con force si es necesario
git push origin feature/tu-feature --force-with-lease
```

---

## 🔄 Proceso de Pull Request

### 1. Abre un PR

- Ve a [Pull Requests](https://github.com/daespasa/secret_santa/pulls)
- Click en "New Pull Request"
- Selecciona tu rama

### 2. Template de PR

```markdown
## Descripción
Explicación clara de los cambios.

## Tipo de cambio
- [ ] 🐛 Bug fix
- [ ] ✨ Nueva feature
- [ ] 📚 Documentación
- [ ] 🎨 UI/UX
- [ ] ♻️ Refactor

## Testing
Describe cómo probaste los cambios:
- [ ] Creé un grupo de prueba
- [ ] Probé el sorteo
- [ ] Verifiqué el email
- [ ] Probé en móvil

## Checklist
- [ ] Mi código sigue los estándares
- [ ] He actualizado la documentación
- [ ] No hay breaking changes
- [ ] He testeado los cambios
- [ ] Commits son descriptivos
```

### 3. Review Process

1. Los mantenedores revisarán tu PR
2. Podrán pedir cambios
3. Una vez aprobado, se mergeará a `develop`
4. Después se hará release a `main`

### 4. Después de Mergeado

Tu contribución será creditada en:
- Changelog
- Página de créditos
- Release notes

---

## 📚 Recursos Útiles

- [GitHub Docs](https://docs.github.com)
- [Conventional Commits](https://www.conventionalcommits.org)
- [Express.js Guide](https://expressjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

## ❓ Preguntas?

- 📧 Email: daespasa@gmail.com
- 💬 Issues: [GitHub Issues](https://github.com/daespasa/secret_santa/issues)
- 📖 Docs: [README.md](./README.md)

---

**Gracias por contribuir a hacer Amigo Invisible mejor! 🎁**
