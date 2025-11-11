# Support Monitor

Dashboard de monitoreo de tickets y métricas KPI integrado con Jira Service Desk, construido con React, TypeScript y Arquitectura Hexagonal.

## 🚀 Características

-   **Dashboard en tiempo real** con métricas KPI
-   **Integración con Jira Service Desk** vía REST API
-   **Arquitectura Hexagonal** (Clean Architecture) para escalabilidad
-   **TypeScript estricto** para type-safety
-   **Tailwind CSS** para estilos modernos y responsive
-   **Tema Light/Dark** con persistencia de preferencias
-   **Sidebar colapsable** con modos Fixed y Hover
-   **Navegación con React Router** entre vistas
-   **Zustand** para gestión de estado eficiente
-   **Recharts** para visualizaciones de datos

## 📊 KPIs Monitoreados

| KPI                | Descripción              | Meta          |
| ------------------ | ------------------------ | ------------- |
| **FRT**            | First Response Time      | < 2 horas     |
| **TTR**            | Time to Resolve          | < 24 horas    |
| **SLA Compliance** | Cumplimiento de SLA      | ≥ 90%         |
| **SLA Average**    | Promedio de calificación | ≥ 4 estrellas |
| **FCR**            | First Contact Resolution | ≥ 60%         |
| **FRRT**           | Fast Reply Rate          | < 10%         |
| **Escalaciones**   | Porcentaje escalado      | < 15%         |

## 🏗️ Arquitectura

```
src/
├── core/              # Lógica de negocio pura
│   ├── entities/      # Modelos del dominio
│   ├── useCases/      # Casos de uso
│   └── repositories/  # Interfaces
├── adapters/          # Adaptadores a sistemas externos
│   └── jira/          # Adaptador de Jira
├── infrastructure/    # Implementaciones técnicas
│   └── http/          # Clientes HTTP
├── presentation/      # Capa de presentación
│   ├── components/    # Componentes React
│   │   ├── layout/    # Header, Sidebar, Layout
│   │   ├── kpis/      # Componentes de KPIs
│   │   └── tickets/   # Componentes de tickets
│   ├── pages/         # Páginas de navegación
│   ├── hooks/         # Custom hooks (useTheme)
│   └── store/         # Stores Zustand
└── shared/           # Utilidades compartidas
```

## 🛠️ Tecnologías

-   **React 18** - Framework UI
-   **TypeScript** - Type safety
-   **Vite** - Build tool
-   **Tailwind CSS** - Estilos utility-first con dark mode
-   **Zustand** - State management con persistencia
-   **React Router** - Navegación entre vistas
-   **Axios** - HTTP client
-   **Recharts** - Gráficas
-   **RSuite** - Componentes UI
-   **React-Toastify** - Notificaciones
-   **date-fns** - Manejo de fechas

## 🚦 Comenzar

### Prerrequisitos

-   Node.js 18+
-   npm o yarn
-   Cuenta de Jira con API Token

### Instalación

1. **Clonar el repositorio**

```bash
git clone <repo-url>
cd support-monitor
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de Jira:

```env
VITE_JIRA_BASE_URL=https://tu-dominio.atlassian.net
VITE_JIRA_EMAIL=tu-email@ejemplo.com
VITE_JIRA_API_TOKEN=tu-api-token
VITE_JIRA_BOARD_ID=123
```

**Obtener API Token de Jira:**

1. Ir a https://id.atlassian.com/manage-profile/security/api-tokens
2. Crear un nuevo token
3. Copiarlo en `.env`

4. **Iniciar servidor de desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📦 Scripts Disponibles

```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificar tipos TypeScript
```

## 🎨 Personalización

### Colores

Los colores principales se configuran en `tailwind.config.js`:

```javascript
colors: {
  primary: { ... },
  success: { ... },
  warning: { ... },
  error: { ... },
  critical: { ... },
}
```

### Umbrales de KPIs

Los umbrales se definen en `src/core/useCases/CalculateKPIsUseCase.ts`

## 🔧 Desarrollo

### Agregar un nuevo KPI

1. Actualizar `KPICategory` en `src/core/types.ts`
2. Agregar método de cálculo en `CalculateKPIsUseCase.ts`
3. Los componentes se actualizarán automáticamente

### Agregar nuevo adaptador

1. Crear interfaz en `src/core/repositories/`
2. Implementar adaptador en `src/adapters/`
3. Inyectar en stores correspondientes

## 📝 Notas de Desarrollo

-   **Todo el código debe estar en inglés**
-   **Comentarios en español**
-   **UI en español con anglicismos técnicos**
-   Seguir arquitectura hexagonal
-   Mantener el core independiente de frameworks
-   TypeScript estricto (no usar `any`)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Autores

-   **Tu Nombre** - Desarrollo inicial

## 🙏 Agradecimientos

-   Equipo de soporte por feedback constante
-   Jira API documentation
-   Comunidad de React y TypeScript

---

**Support Monitor** - Monitoreando la excelencia en soporte ⚡
