# Layout y Sistema de Temas

Este documento describe la implementación del sistema de layout con Header, Sidebar y soporte para temas Light/Dark.

## 📐 Estructura de Layout

El sistema de layout se compone de tres componentes principales:

### 1. Layout (Componente Contenedor)

**Ubicación:** `src/presentation/components/layout/Layout.tsx`

Componente principal que organiza la estructura de la aplicación:

-   Envuelve toda la aplicación
-   Gestiona la composición de Header + Sidebar + Content
-   Inicializa el sistema de temas
-   Responsive y adaptable

**Props:**

```typescript
interface LayoutProps {
    children: React.ReactNode;
    user?: User;
    activeMenuItem?: string;
    onNavigate?: (path: string) => void;
}
```

### 2. Header

**Ubicación:** `src/presentation/components/layout/Header.tsx`

Barra superior fija con:

-   **Toggle de Sidebar** - Botón para colapsar/expandir el menú
-   **Logo/Título** - "Support Monitor" con espacio preparado para logo futuro
-   **Toggle de Tema** - Botón para cambiar entre Light/Dark mode
-   **Menú de Usuario** - Avatar y datos del usuario (preparado para autenticación)

**Características:**

-   Sticky positioning (siempre visible al hacer scroll)
-   Altura fija de 64px
-   Transiciones suaves al cambiar de tema
-   Responsive (oculta texto en pantallas pequeñas)

### 3. Sidebar

**Ubicación:** `src/presentation/components/layout/Sidebar.tsx`

Menú lateral de navegación con:

-   **Modo Fixed** - Sidebar fijo, colapsable manualmente
-   **Modo Hover** - Sidebar colapsado por defecto, se expande al pasar el mouse
-   **5 ítems de menú:**
    -   Dashboard (Home)
    -   Tickets
    -   KPIs
    -   Reportes
    -   Configuración

**Dimensiones:**

-   Expandido: 240px
-   Colapsado: 64px
-   Transiciones suaves (300ms)

**Características:**

-   Iconos SVG para cada item
-   Badges para notificaciones (ej: 5 tickets pendientes)
-   Indicador visual del item activo
-   Tooltips en modo colapsado
-   Footer con versión de la app

## 🎨 Sistema de Temas

### ThemeStore (Zustand)

**Ubicación:** `src/presentation/store/themeStore.ts`

Store de Zustand con persistencia en localStorage que gestiona:

```typescript
interface ThemeState {
    theme: "light" | "dark"; // Tema actual
    sidebarCollapsed: boolean; // Estado del sidebar
    sidebarMode: "fixed" | "hover"; // Modo de comportamiento

    // Acciones
    toggleTheme: () => void;
    setTheme: (theme) => void;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed) => void;
    setSidebarMode: (mode) => void;
}
```

### useTheme Hook

**Ubicación:** `src/presentation/hooks/useTheme.ts`

Hook personalizado que:

1. Obtiene el tema actual del store
2. Aplica/remueve la clase `dark` del elemento `<html>`
3. Sincroniza cambios automáticamente

**Uso:**

```typescript
const { theme, toggleTheme, isDark } = useTheme();
```

### Configuración de Tailwind

**darkMode:** `'class'` - Habilita el modo oscuro basado en clases CSS

**Convención de estilos:**

```tsx
// Ejemplo de componente con soporte dark mode
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
    Contenido
</div>
```

## 🎨 Paleta de Colores

### Light Mode

-   **Fondo primario:** `#ffffff` (white)
-   **Fondo secundario:** `#f5f5f5` (gray-50)
-   **Texto primario:** `#1f2937` (gray-900)
-   **Texto secundario:** `#6b7280` (gray-600)
-   **Bordes:** `#e5e7eb` (gray-200)

### Dark Mode

-   **Fondo primario:** `#1f2937` (gray-800)
-   **Fondo secundario:** `#111827` (gray-900)
-   **Texto primario:** `#f9fafb` (gray-50)
-   **Texto secundario:** `#d1d5db` (gray-300)
-   **Bordes:** `#374151` (gray-700)

### Colores de Estado (ambos temas)

-   **Primary:** `#2196f3` (blue-500)
-   **Success:** `#4caf50` (green)
-   **Warning:** `#ff9800` (orange)
-   **Error:** `#f44336` (red)
-   **Critical:** `#c62828` (dark red)

## 🔧 Variables CSS

Variables globales definidas en `src/index.css`:

```css
:root {
    --sidebar-width-expanded: 240px;
    --sidebar-width-collapsed: 64px;
    --header-height: 64px;

    /* Light theme */
    --bg-primary: #ffffff;
    --bg-secondary: #f5f5f5;
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --border-color: #e5e7eb;
}

.dark {
    --bg-primary: #1f2937;
    --bg-secondary: #111827;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --border-color: #374151;
}
```

## 🚦 Navegación

### React Router

**Rutas configuradas:**

-   `/` - Dashboard (principal)
-   `/tickets` - Lista completa de tickets
-   `/kpis` - Vista detallada de KPIs
-   `/reports` - Generación de reportes
-   `/settings` - Configuración de la app

### Páginas

Cada ruta tiene su componente de página correspondiente:

-   `TicketsPage.tsx`
-   `KPIsPage.tsx`
-   `ReportsPage.tsx`
-   `SettingsPage.tsx`

## 💾 Persistencia

### LocalStorage Keys

-   `theme-storage` - Almacena preferencias de tema, sidebar y modo

**Estructura:**

```json
{
    "state": {
        "theme": "dark",
        "sidebarCollapsed": false,
        "sidebarMode": "fixed"
    },
    "version": 0
}
```

## 🎯 Próximos Pasos

### Implementaciones Futuras

1. **Autenticación**

    - Login/Logout
    - Gestión de sesiones
    - Rutas protegidas

2. **Logo Personalizable**

    - Subir imagen de logo
    - Logo diferente por tema (light/dark)

3. **User Menu Completo**

    - Dropdown con opciones
    - Perfil de usuario
    - Preferencias

4. **Notificaciones en Tiempo Real**

    - Badge con contador en Header
    - Panel de notificaciones

5. **Multi-idioma**
    - i18n con react-i18next
    - Selector de idioma en settings

## 🧪 Testing

Para probar el sistema de layout:

1. **Cambio de tema:**

    - Click en el botón de sol/luna en el Header
    - Verifica que todos los componentes cambien de color
    - Recarga la página y verifica persistencia

2. **Sidebar modes:**

    - Ve a Configuración (`/settings`)
    - Cambia entre modo Fixed y Hover
    - En Fixed: usa el botón de hamburguesa para colapsar
    - En Hover: pasa el mouse sobre el sidebar colapsado

3. **Navegación:**

    - Haz click en cada item del menú
    - Verifica que la URL cambie
    - Verifica que el item activo se resalte

4. **Responsive:**
    - Reduce el tamaño de la ventana
    - Verifica que el texto del Header se oculte en móvil
    - Sidebar debe funcionar correctamente

## 📝 Notas Técnicas

### Performance

-   **Transiciones CSS** en lugar de animaciones JavaScript
-   **Zustand persist** usa debounce interno para no saturar localStorage
-   **useEffect** en useTheme solo ejecuta cuando cambia el tema

### Accesibilidad

-   Botones con `aria-label` apropiados
-   Contraste de colores cumple WCAG AA
-   Navegación por teclado funcional
-   Tooltips informativos

### Browser Support

-   Chrome/Edge 90+
-   Firefox 88+
-   Safari 14+
-   Opera 76+

No soportado: IE11 (no tiene soporte para CSS Grid moderno)
