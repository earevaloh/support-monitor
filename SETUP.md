# Guía de Setup - Support Monitor

## 📋 Resumen del Proyecto

Se ha creado exitosamente el proyecto **Support Monitor**, un dashboard completo de monitoreo de tickets y KPIs integrado con Jira Service Desk, siguiendo arquitectura hexagonal.

## 🏗️ Estructura Creada

```
support-monitor/
├── .vscode/                        # Configuración de VS Code
│   ├── copilot-instructions.md     # Instrucciones para GitHub Copilot
│   ├── extensions.json             # Extensiones recomendadas
│   └── settings.json               # Configuración del workspace
├── src/
│   ├── core/                       # ⚡ Core - Lógica de negocio pura
│   │   ├── entities/               # Modelos del dominio
│   │   │   ├── KPI.ts
│   │   │   ├── Sprint.ts
│   │   │   ├── Ticket.ts
│   │   │   └── index.ts
│   │   ├── useCases/               # Casos de uso
│   │   │   ├── CalculateKPIsUseCase.ts
│   │   │   ├── FilterTicketsUseCase.ts
│   │   │   ├── GetTicketsUseCase.ts
│   │   │   └── index.ts
│   │   ├── repositories/           # Interfaces de repositorios
│   │   │   ├── ISprintRepository.ts
│   │   │   ├── ITicketRepository.ts
│   │   │   └── index.ts
│   │   └── types.ts                # Tipos compartidos
│   ├── adapters/                   # 🔌 Adaptadores externos
│   │   └── jira/
│   │       ├── JiraAdapter.ts      # Adaptador de Jira (Ticket & Sprint)
│   │       ├── JiraMapper.ts       # Mapeo de datos Jira ↔ Dominio
│   │       ├── types.ts            # Tipos de respuestas Jira
│   │       └── index.ts
│   ├── infrastructure/             # 🛠️ Infraestructura técnica
│   │   └── http/
│   │       ├── HttpClient.ts       # Cliente HTTP genérico
│   │       ├── JiraClient.ts       # Cliente específico Jira
│   │       └── index.ts
│   ├── presentation/               # 🎨 Capa de presentación
│   │   ├── components/
│   │   │   ├── kpis/
│   │   │   │   ├── KPICard.tsx
│   │   │   │   ├── KPIGrid.tsx
│   │   │   │   └── index.ts
│   │   │   ├── tickets/
│   │   │   │   └── TicketCard.tsx
│   │   │   └── Dashboard.tsx
│   │   └── store/                  # Stores Zustand
│   │       ├── kpiStore.ts
│   │       ├── sprintsStore.ts
│   │       ├── ticketsStore.ts
│   │       └── index.ts
│   ├── shared/                     # 📦 Utilidades compartidas
│   │   ├── utils/
│   │   │   ├── dateUtils.ts
│   │   │   ├── numberUtils.ts
│   │   │   └── index.ts
│   │   └── constants.ts
│   ├── App.tsx                     # Componente raíz
│   ├── main.tsx                    # Entry point
│   ├── index.css                   # Estilos globales + Tailwind
│   └── vite-env.d.ts               # Tipos de variables de entorno
├── index.html                      # HTML principal
├── package.json                    # Dependencias y scripts
├── tsconfig.json                   # Configuración TypeScript
├── tsconfig.node.json              # TypeScript para Vite
├── vite.config.ts                  # Configuración de Vite
├── tailwind.config.js              # Configuración de Tailwind
├── postcss.config.js               # Configuración de PostCSS
├── .eslintrc.cjs                   # Configuración de ESLint
├── .env.example                    # Template de variables de entorno
├── .gitignore                      # Archivos ignorados por Git
└── README.md                       # Documentación principal
```

## 🚀 Pasos Siguientes

### 1. Instalar Dependencias

```bash
cd /Users/earevalo/dev/code/support-monitor
npm install
```

Esto instalará:

-   React 18 + React DOM
-   TypeScript
-   Vite
-   Tailwind CSS
-   Zustand (state management)
-   Axios (HTTP client)
-   Recharts (gráficas)
-   RSuite (componentes UI)
-   React-Toastify (notificaciones)
-   date-fns (manejo de fechas)
-   Y todas las devDependencies

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de Jira:

```env
VITE_JIRA_BASE_URL=https://tu-dominio.atlassian.net
VITE_JIRA_EMAIL=tu-email@ejemplo.com
VITE_JIRA_API_TOKEN=tu-api-token-aqui
VITE_JIRA_BOARD_ID=123
```

**Para obtener el API Token:**

1. Visita: https://id.atlassian.com/manage-profile/security/api-tokens
2. Crea un nuevo token
3. Cópialo en el archivo `.env`

**Para obtener el Board ID:**

1. Abre tu board de Jira en el navegador
2. El ID está en la URL: `.../jira/software/c/projects/XXX/boards/123`
3. Copia el número (123) en el archivo `.env`

### 3. Iniciar Desarrollo

```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

### 4. Verificar Todo Funciona

Una vez iniciado, deberías ver:

-   ✅ Dashboard con estadísticas
-   ✅ Grid de KPIs calculados
-   ✅ Datos cargados desde Jira
-   ✅ Sprint activo (si existe)

## 📊 KPIs Implementados

Los siguientes KPIs se calculan automáticamente:

1. **FRT** (First Response Time) - Tiempo de primera respuesta
2. **TTR** (Time to Resolve) - Tiempo de resolución
3. **SLA Compliance** - % de cumplimiento SLA
4. **SLA Average** - Promedio de calificación SLA
5. **FCR** (First Contact Resolution) - Resolución en primer contacto
6. **FRRT** (Fast Reply Rate) - Tasa de respuesta rápida
7. **Escalations** - % de tickets escalados

## 🎯 Características Principales

### Arquitectura Hexagonal ✨

-   **Core** independiente de frameworks
-   **Adapters** para integración con sistemas externos
-   **Infrastructure** para implementaciones técnicas
-   **Presentation** con React + Zustand
-   **Fácil** de testear y extender

### TypeScript Estricto 💪

-   Sin uso de `any`
-   Tipos e interfaces bien definidos
-   Type-safety en toda la aplicación

### State Management con Zustand 🐻

-   3 stores principales: `tickets`, `kpis`, `sprints`
-   Lógica de negocio en casos de uso
-   Estado reactivo y eficiente

### Integración con Jira 🔗

-   Autenticación básica con API Token
-   Mapeo automático de issues a tickets
-   Soporte para custom fields
-   Manejo de sprints y boards

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificar tipos TypeScript
```

## 🔧 Personalización

### Cambiar Umbrales de KPIs

Editar `src/core/useCases/CalculateKPIsUseCase.ts`:

```typescript
thresholds: {
  excellent: 2,   // ← Cambiar aquí
  good: 3,
  warning: 4,
  critical: 48,
}
```

### Agregar Nuevos KPIs

1. Agregar categoría en `src/core/types.ts`
2. Crear método de cálculo en `CalculateKPIsUseCase`
3. Los componentes se actualizan automáticamente

### Cambiar Colores

Editar `tailwind.config.js`:

```javascript
colors: {
  primary: { ... },
  success: { ... },
  // ...
}
```

## 📝 Convenciones de Código

-   **Código en inglés**: variables, funciones, clases
-   **Comentarios en español**: documentación del código
-   **UI en español**: textos de interfaz con anglicismos técnicos
-   **TypeScript estricto**: sin `any`, interfaces bien definidas

## 🐛 Troubleshooting

### Error de autenticación con Jira

-   Verifica que el email y API token son correctos
-   Asegúrate que el dominio incluye `.atlassian.net`
-   Revisa que tienes permisos en el proyecto de Jira

### No aparecen datos

-   Verifica que el `VITE_JIRA_BOARD_ID` es correcto
-   Revisa la consola del navegador para errores
-   Asegúrate que tu cuenta tiene acceso al board

### Error de TypeScript

-   Ejecuta `npm install` de nuevo
-   Verifica que todos los imports usan los alias (`@core`, `@adapters`, etc.)
-   Ejecuta `npm run type-check` para detalles

## 📚 Recursos Adicionales

-   [Documentación de Jira API](https://developer.atlassian.com/cloud/jira/service-desk/rest/)
-   [Zustand Docs](https://zustand-demo.pmnd.rs/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [Recharts](https://recharts.org/)
-   [RSuite](https://rsuitejs.com/)

## ✅ Checklist Final

-   [ ] Dependencias instaladas (`npm install`)
-   [ ] Variables de entorno configuradas (`.env`)
-   [ ] Servidor de desarrollo corriendo (`npm run dev`)
-   [ ] Dashboard visible en navegador
-   [ ] Datos cargados desde Jira
-   [ ] KPIs calculándose correctamente
-   [ ] Sin errores en consola

## 🎉 ¡Listo!

El proyecto **Support Monitor** está completamente configurado y listo para usar.

**Próximos pasos sugeridos:**

1. Explorar el dashboard y verificar datos
2. Personalizar umbrales de KPIs según tu equipo
3. Agregar más gráficas y visualizaciones
4. Implementar filtros avanzados
5. Agregar exportación de reportes

---

**¿Necesitas ayuda?** Consulta el `README.md` o las instrucciones en `.vscode/copilot-instructions.md`
