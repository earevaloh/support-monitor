# GitHub Copilot Instructions - Support Monitor

## Contexto del Proyecto

Estás trabajando en **Support Monitor**, un dashboard de monitoreo de tickets y métricas KPI que se integra con Jira Service Desk. El proyecto utiliza React + TypeScript + Vite con una arquitectura hexagonal (Clean Architecture) para garantizar escalabilidad y mantenibilidad.

## Stack Tecnológico

-   **Frontend**: React 18, TypeScript, Vite
-   **Styling**: Tailwind CSS
-   **State**: Zustand
-   **Gráficas**: Recharts
-   **UI**: RSuite/MUI, React-Toastify, SweetAlert2
-   **HTTP**: Axios
-   **API**: Jira Service Desk REST API
-   **Tema**: Light/Dark mode con persistencia

## Arquitectura

Seguimos **Arquitectura Hexagonal** con las siguientes capas:

```
├── core/              # Lógica de negocio pura (sin dependencias externas)
│   ├── entities/      # Modelos del dominio
│   ├── useCases/      # Casos de uso
│   └── repositories/  # Interfaces
├── adapters/          # Adaptadores a sistemas externos (Jira, etc.)
├── infrastructure/    # Implementaciones técnicas
├── presentation/      # Componentes React, hooks, stores
│   ├── components/    # Componentes UI
│   │   ├── layout/    # Header, Sidebar, Layout principal
│   │   ├── kpis/      # Componentes de KPIs
│   │   └── tickets/   # Componentes de tickets
│   ├── store/         # Stores Zustand (state management)
│   └── hooks/         # Custom hooks
└── shared/           # Utilidades compartidas
```

## Principios de Desarrollo

### 1. Separación de Responsabilidades

-   **Core**: Lógica de negocio independiente de frameworks
-   **Adapters**: Transforman datos entre sistemas externos y el core
-   **Infrastructure**: Implementaciones técnicas (HTTP, persistencia)
-   **Presentation**: UI y manejo de estado

### 2. Dependencias

-   El **core** NO debe depender de nada externo
-   Los **adapters** e **infrastructure** dependen del core
-   La **presentation** usa todos los demás

### 3. Naming Conventions

-   Entidades: `PascalCase` (Ticket, KPI, Sprint)
-   Casos de uso: `VerbNounUseCase` (GetTicketsUseCase)
-   Componentes: `PascalCase` (KPICard, Dashboard, Header, Sidebar)
-   Hooks: `useCamelCase` (useTickets, useKPIData, useTheme)
-   Stores: `camelCaseStore` (ticketsStore, kpiStore, themeStore)
-   Funciones: `camelCase`

### 4. Idioma y Localización

-   **Código**: TODO el código (variables, funciones, clases, interfaces) debe estar en **INGLÉS**
-   **Comentarios**: Todos los comentarios deben estar en **ESPAÑOL**
-   **UI/Textos**: Interfaz en español, pero usar **anglicismos técnicos** comunes en la comunidad hispanohablante:
    -   ✅ "Dashboard" (en lugar de "Tablero")
    -   ✅ "Tickets" (en lugar de "Solicitudes")
    -   ✅ "Sprint" (mantener)
    -   ✅ "Deploy" (en lugar de "Despliegue")
    -   ✅ "Backend/Frontend" (mantener)
    -   ✅ "Testing" (en lugar de "Pruebas")
    -   ❌ Evitar traducciones literales de términos técnicos establecidos

## Reglas de Código

### TypeScript

-   Usar tipos estrictos, evitar `any`
-   Definir interfaces para todas las estructuras de datos
-   Exportar tipos en archivos `types.ts`
-   Usar tipos genéricos cuando sea apropiado

### React

-   Componentes funcionales con hooks
-   Usar `React.FC<Props>` para tipado de props
-   Memoizar componentes pesados con `React.memo`
-   Custom hooks para lógica reutilizable

### Estado con Zustand

```typescript
// Patrón para stores
interface StoreState {
    data: DataType[];
    loading: boolean;
    error: string | null;
    fetchData: () => Promise<void>;
    reset: () => void;
}

export const useStore = create<StoreState>((set) => ({
    data: [],
    loading: false,
    error: null,
    fetchData: async () => {
        /* ... */
    },
    reset: () => set({ data: [], loading: false, error: null }),
}));
```

### Tailwind CSS

-   Usar utility-first approach
-   Crear componentes reutilizables para patrones repetidos
-   Usar las clases personalizadas definidas en `tailwind.config.js`
-   Colores: `primary`, `success`, `warning`, `error`, `critical`
-   **Soporte Dark Mode**: usar clases `dark:` para estilos en tema oscuro
-   Variables CSS para colores dinámicos según tema

### Manejo de Errores

-   Usar try-catch en operaciones asíncronas
-   Mostrar errores con Toast para notificaciones temporales
-   Usar SweetAlert2 para confirmaciones y errores críticos
-   Loguear errores en consola para debugging

### Integración con Jira

-   Todas las llamadas a Jira deben pasar por `JiraAdapter`
-   Usar el cliente configurado en `infrastructure/http`
-   Transformar respuestas de Jira a entidades del dominio
-   Manejar paginación y rate limiting

## KPIs del Proyecto

Generar código que calcule y visualice estos KPIs:

| KPI            | Descripción                    | Umbral Crítico | Meta    |
| -------------- | ------------------------------ | -------------- | ------- |
| FRT            | First Response Time < 2h       | > 4h           | > 48h   |
| TTR            | Time to Resolve < 24h          | > 48h          | < 3.5.0 |
| SLA Compliance | % tickets ≥ 90%                | < 80%          | -       |
| SLA Average    | Promedio ≥ 4                   | < 3.5.0        | -       |
| FCR            | First Contact Resolution ≥ 60% | < 45%          | -       |
| FRRT           | Fast Reply Rate < 10%          | > 10%          | -       |
| Escalaciones   | % < 15%                        | > 25%          | -       |

## Estructura de Layout

### Header

El header debe incluir:

-   **Logo/Título del proyecto** (lado izquierdo)
    -   Espacio preparado para logo futuro
    -   Título "Support Monitor" visible
-   **Información del usuario** (lado derecho)
    -   Avatar/icono de usuario
    -   Nombre de usuario (preparado para autenticación futura)
    -   Menú dropdown con opciones
-   **Toggle de tema** (Light/Dark mode)
-   **Altura fija** y sticky al scroll

```typescript
// Ejemplo de estructura del Header
interface HeaderProps {
    user?: {
        name: string;
        avatar?: string;
        email?: string;
    };
    onToggleSidebar: () => void;
}
```

### Sidebar

El sidebar debe ser completamente funcional con:

**Modos de visualización:**

1. **Expandido** (texto + icono): 240px de ancho
2. **Colapsado** (solo iconos): 64px de ancho
3. **Hover** (expandir al pasar mouse): temporal sobre el contenido

**Comportamientos:**

-   **Toggle manual**: botón para colapsar/expandir
-   **Modo fijo**: sidebar siempre visible (expandido o colapsado)
-   **Modo hover**: sidebar colapsado, se expande con mouseover
-   **Persistencia**: recordar preferencia del usuario (localStorage)

**Estructura del menú:**

```typescript
interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
    badge?: number; // Para notificaciones
    submenu?: MenuItem[];
}

// Ejemplo de menú
const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <HomeIcon />, path: "/" },
    {
        id: "tickets",
        label: "Tickets",
        icon: <TicketIcon />,
        path: "/tickets",
        badge: 5,
    },
    { id: "kpis", label: "KPIs", icon: <ChartIcon />, path: "/kpis" },
    {
        id: "reports",
        label: "Reportes",
        icon: <ReportIcon />,
        path: "/reports",
    },
    {
        id: "settings",
        label: "Configuración",
        icon: <SettingsIcon />,
        path: "/settings",
    },
];
```

**Características visuales:**

-   Highlight del item activo
-   Animaciones suaves de transición
-   Tooltips en modo colapsado
-   Separadores visuales entre secciones
-   Íconos consistentes y claros

### Layout Principal

```typescript
interface LayoutProps {
    children: React.ReactNode;
}

// Estructura del layout
<div className="flex h-screen">
    <Sidebar
        collapsed={sidebarCollapsed}
        mode={sidebarMode} // 'fixed' | 'hover'
        onToggle={handleToggleSidebar}
    />
    <div className="flex-1 flex flex-col">
        <Header user={currentUser} onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
            {children}
        </main>
    </div>
</div>;
```

## Tema Light/Dark

### Implementación

-   **Store de tema** con Zustand para gestionar el estado
-   **Persistencia** en localStorage
-   **Detección automática** del tema del sistema (opcional)
-   **Transiciones suaves** entre temas

### Store del tema

```typescript
interface ThemeState {
    theme: "light" | "dark";
    sidebarMode: "fixed" | "hover";
    sidebarCollapsed: boolean;
    toggleTheme: () => void;
    setTheme: (theme: "light" | "dark") => void;
    toggleSidebar: () => void;
    setSidebarMode: (mode: "fixed" | "hover") => void;
}
```

### Colores por tema

**Light Mode:**

-   Fondo principal: `bg-gray-50`
-   Fondo cards: `bg-white`
-   Texto principal: `text-gray-900`
-   Texto secundario: `text-gray-600`
-   Bordes: `border-gray-200`

**Dark Mode:**

-   Fondo principal: `bg-gray-900`
-   Fondo cards: `bg-gray-800`
-   Texto principal: `text-gray-100`
-   Texto secundario: `text-gray-400`
-   Bordes: `border-gray-700`

### Variables CSS para temas

```css
:root {
    --color-bg-primary: #f9fafb;
    --color-bg-secondary: #ffffff;
    --color-text-primary: #111827;
    --color-text-secondary: #6b7280;
    --color-border: #e5e7eb;
}

.dark {
    --color-bg-primary: #111827;
    --color-bg-secondary: #1f2937;
    --color-text-primary: #f9fafb;
    --color-text-secondary: #9ca3af;
    --color-border: #374151;
}
```

## Ejemplos de Código

### Store de Tema

```typescript
// presentation/store/themeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
    theme: "light" | "dark";
    sidebarCollapsed: boolean;
    sidebarMode: "fixed" | "hover";
    toggleTheme: () => void;
    toggleSidebar: () => void;
    setSidebarMode: (mode: "fixed" | "hover") => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: "light",
            sidebarCollapsed: false,
            sidebarMode: "fixed",
            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === "light" ? "dark" : "light",
                })),
            toggleSidebar: () =>
                set((state) => ({
                    sidebarCollapsed: !state.sidebarCollapsed,
                })),
            setSidebarMode: (mode) => set({ sidebarMode: mode }),
        }),
        {
            name: "theme-storage",
        }
    )
);
```

### Hook de Tema

```typescript
// presentation/hooks/useTheme.ts
import { useEffect } from "react";
import { useThemeStore } from "@presentation/store/themeStore";

export const useTheme = () => {
    const { theme, toggleTheme } = useThemeStore();

    useEffect(() => {
        // Aplicar clase dark al html
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    return { theme, toggleTheme };
};
```

### Componente Sidebar

```typescript
// presentation/components/layout/Sidebar.tsx
interface SidebarProps {
    collapsed: boolean;
    mode: "fixed" | "hover";
    onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    collapsed,
    mode,
    onToggle,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const isExpanded = mode === "hover" ? isHovered : !collapsed;

    return (
        <aside
            className={`
        transition-all duration-300 ease-in-out
        ${isExpanded ? "w-60" : "w-16"}
        bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700
        ${mode === "hover" ? "fixed z-50 h-screen" : "relative"}
      `}
            onMouseEnter={() => mode === "hover" && setIsHovered(true)}
            onMouseLeave={() => mode === "hover" && setIsHovered(false)}
        >
            {/* Contenido del sidebar */}
        </aside>
    );
};
```

### Componente Header

```typescript
// presentation/components/layout/Header.tsx
interface HeaderProps {
    user?: User;
    onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onToggleSidebar }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center space-x-4">
                <button onClick={onToggleSidebar}>
                    <MenuIcon />
                </button>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Support Monitor
                </h1>
            </div>

            <div className="flex items-center space-x-4">
                <button onClick={toggleTheme}>
                    {theme === "light" ? <MoonIcon /> : <SunIcon />}
                </button>
                <UserMenu user={user} />
            </div>
        </header>
    );
};
```

### Caso de Uso

```typescript
// core/useCases/CalculateKPIsUseCase.ts
export class CalculateKPIsUseCase {
    execute(tickets: Ticket[]): KPI[] {
        // Lógica pura de cálculo
        return [
            this.calculateFRT(tickets),
            this.calculateTTR(tickets),
            // ...
        ];
    }
}
```

### Adaptador

```typescript
// adapters/jira/JiraAdapter.ts
export class JiraAdapter {
    constructor(private client: JiraClient) {}

    async getTickets(): Promise<Ticket[]> {
        const response = await this.client.search();
        return response.issues.map(this.mapToTicket);
    }

    private mapToTicket(jira: JiraIssue): Ticket {
        // Transformación
    }
}
```

### Componente

```typescript
// presentation/components/kpis/KPICard.tsx
interface KPICardProps {
    kpi: KPI;
    showTrend?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({ kpi, showTrend }) => {
    const statusColor = getStatusColor(kpi.status);

    return <div className={`p-4 rounded-lg ${statusColor}`}>{/* ... */}</div>;
};
```

### Store

```typescript
// presentation/store/kpiStore.ts
interface KPIState {
    kpis: KPI[];
    loading: boolean;
    fetchKPIs: () => Promise<void>;
}

export const useKPIStore = create<KPIState>((set) => ({
    kpis: [],
    loading: false,
    fetchKPIs: async () => {
        set({ loading: true });
        // Usar caso de uso
        set({ kpis: result, loading: false });
    },
}));
```

## Gráficas

### Gráfica de Dona (Distribución)

```typescript
<DonutChart
    data={[
        { name: "Críticos", value: 10, color: "#c62828" },
        { name: "Altos", value: 25, color: "#ed6c02" },
        // ...
    ]}
/>
```

### Gráfica de Barras (Comparación)

```typescript
<BarChart data={sprintData} xKey="sprint" yKeys={["frt", "ttr", "fcr"]} />
```

## Prioridades de Desarrollo

1. **Core primero**: Implementar entidades y casos de uso
2. **Adapters**: Integración con Jira
3. **Layout y Navegación**: Header, Sidebar, routing
4. **Tema**: Implementar Light/Dark mode
5. **State**: Stores de Zustand (tickets, KPIs, theme)
6. **UI**: Componentes visuales (KPIs, tickets, gráficas)
7. **Testing**: Pruebas de integración

## Extensibilidad Futura

Al generar código, considera:

-   **Autenticación**: Header preparado para login/logout futuro
-   **Logo personalizable**: Espacio reservado en header
-   **Agregar nuevos adaptadores**: Slack, Teams, ServiceNow
-   **Cambiar sistemas de tickets** sin afectar el core
-   **Agregar nuevos KPIs** fácilmente
-   **Implementar caché** y optimizaciones
-   **Soporte para múltiples proyectos/equipos**
-   **Permisos y roles**: Preparar estructura para gestión de accesos
-   **Personalización del sidebar**: Permitir reordenar items del menú

## Testing

-   Casos de uso deben ser testeables sin mocks
-   Adapters se testean con mocks de APIs
-   Componentes con React Testing Library
-   Stores con test unitarios

## Performance

-   Lazy loading de rutas
-   Memoización de cálculos pesados
-   Debounce en búsquedas
-   Virtual scrolling para listas grandes
-   Cachear datos de Jira apropiadamente

## Seguridad

-   NUNCA hardcodear API keys
-   Usar variables de entorno (VITE\_\*)
-   Validar datos de entrada
-   Sanitizar datos de Jira
-   Implementar rate limiting

## Comandos Útiles

```bash
npm run dev          # Desarrollo
npm run build        # Producción
npm run preview      # Preview build
npm run lint         # Linting
npm run type-check   # Type checking
```

## Referencias Rápidas

-   Jira API: https://developer.atlassian.com/cloud/jira/service-desk/rest/
-   Zustand: https://zustand-demo.pmnd.rs/
-   Recharts: https://recharts.org/
-   Tailwind: https://tailwindcss.com/

## Notas Importantes

-   Siempre seguir la arquitectura hexagonal
-   Mantener el core independiente
-   Usar TypeScript estricto
-   Documentar código complejo
-   Priorizar legibilidad sobre brevedad
-   Escribir código que otros puedan entender y extender
-   **Diseño responsive**: móvil, tablet, desktop
-   **Accesibilidad**: usar atributos ARIA cuando sea necesario
-   **Performance**: lazy loading, memoización, optimizaciones

## Componentes de Layout Requeridos

### Componentes Obligatorios

1. **Header** (`presentation/components/layout/Header.tsx`)

    - Logo/título del proyecto
    - Toggle de sidebar
    - Toggle de tema (light/dark)
    - Información de usuario con dropdown

2. **Sidebar** (`presentation/components/layout/Sidebar.tsx`)

    - Lista de items del menú con iconos
    - Soporte para colapsar (solo iconos)
    - Modo hover (expandir al pasar mouse)
    - Tooltips en modo colapsado
    - Highlight del item activo
    - Animaciones suaves

3. **Layout** (`presentation/components/layout/Layout.tsx`)

    - Composición de Header + Sidebar + Content
    - Manejo del estado de sidebar
    - Aplicación del tema

4. **ThemeToggle** (`presentation/components/layout/ThemeToggle.tsx`)

    - Botón para cambiar entre light/dark
    - Ícono según tema actual
    - Transición suave

5. **UserMenu** (`presentation/components/layout/UserMenu.tsx`)
    - Avatar de usuario
    - Nombre y email
    - Dropdown con opciones (perfil, configuración, logout)

### Stores Requeridos

1. **themeStore** - Gestión del tema y preferencias de UI
2. **authStore** - Preparado para autenticación futura
3. **sidebarStore** - Estado del sidebar (puede fusionarse con themeStore)

---

**Cuando generes código, asegúrate de:**

1. Seguir la estructura de carpetas definida
2. Usar los patrones establecidos
3. Tipar correctamente con TypeScript
4. Separar responsabilidades según la capa
5. Hacer el código extensible y mantenible
6. **Implementar dark mode** con clases `dark:` de Tailwind
7. **Sidebar completamente funcional** con todos los modos
8. **Header sticky** con información de usuario
9. **Persistir preferencias** en localStorage
10. **Animaciones suaves** y transiciones
