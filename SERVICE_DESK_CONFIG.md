# Configuración de Jira Service Desk

Este documento explica cómo configurar Support Monitor para trabajar con **Jira Service Desk** en lugar de un board tradicional de Jira.

## 🔧 Diferencias entre Jira y Service Desk

### Jira Software (Tradicional)

-   Usa **Boards** con sprints
-   Tiene backlog y planificación de sprints
-   Orientado a desarrollo ágil

### Jira Service Desk

-   Usa **Colas (Queues)** para organizar tickets
-   No tiene sprints tradicionales
-   Orientado a soporte y atención al cliente
-   Usa SLA y métricas de tiempo de respuesta

## 📋 Configuración del Proyecto

Tu proyecto está en:

```
https://webtrackdev.atlassian.net/jira/servicedesk/projects/TIK/queues/custom/1
```

De esta URL extraemos:

-   **Dominio**: `webtrackdev.atlassian.net`
-   **Project Key**: `TIK`
-   **Queue ID**: `1` (cola personalizada)

## 🔑 Variables de Entorno

En tu archivo `.env`:

```bash
# Configuración de Jira Service Desk
VITE_JIRA_BASE_URL=https://webtrackdev.atlassian.net
VITE_JIRA_EMAIL=earevalo@webtrackgps.net
VITE_JIRA_API_TOKEN=tu-token-aqui

# Configuración de Service Desk
VITE_JIRA_PROJECT_KEY=TIK
VITE_JIRA_QUEUE_ID=1
```

### Cómo Obtener el API Token

1. Ve a: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click en "Create API token"
3. Dale un nombre descriptivo (ej: "Support Monitor")
4. Copia el token y pégalo en `VITE_JIRA_API_TOKEN`

⚠️ **IMPORTANTE**: Nunca compartas tu API token ni lo subas a Git

## 🔄 Adaptaciones para Service Desk

### 1. Sin Sprints Tradicionales

Service Desk no usa sprints, por lo que hemos implementado **"períodos virtuales"**:

```typescript
// El adapter crea períodos de 7 días (semanas)
- Semana Actual
- Semana Hace 1
- Semana Hace 2
- Semana Hace 3
```

Esto permite analizar tendencias de tickets a lo largo del tiempo.

### 2. JQL Queries

Las consultas JQL se adaptan para usar el **Project Key**:

```jql
# Todos los tickets del proyecto
project = TIK ORDER BY created DESC

# Tickets por estado
project = TIK AND status IN ("Open", "In Progress") ORDER BY created DESC

# Tickets por prioridad
project = TIK AND priority = High ORDER BY created DESC

# Tickets por rango de fechas
project = TIK AND created >= "2025-01-01" AND created <= "2025-01-31" ORDER BY created DESC
```

### 3. Estructura de Tickets

Los tickets en Service Desk tienen campos específicos:

```typescript
interface ServiceDeskTicket {
    key: string; // TIK-123
    summary: string; // Título
    description: string; // Descripción
    status: string; // Open, In Progress, Closed, etc.
    priority: string; // Low, Medium, High, Highest
    reporter: User; // Usuario que creó el ticket
    assignee: User | null; // Agente asignado
    created: Date; // Fecha de creación
    updated: Date; // Última actualización
    resolved: Date | null; // Fecha de resolución

    // Campos específicos de Service Desk
    requestType: string; // Tipo de solicitud
    satisfaction: number; // Calificación del cliente (1-5)
    sla: {
        timeToFirstResponse: number; // Minutos
        timeToResolution: number; // Minutos
    };
}
```

## 📊 KPIs para Service Desk

Los KPIs se calculan basados en métricas de soporte:

### 1. First Response Time (FRT)

-   ⏱️ Tiempo desde creación hasta primera respuesta
-   🎯 Meta: < 2 horas
-   📈 Se calcula con: `firstResponseTime` del campo SLA

### 2. Time to Resolve (TTR)

-   ⏱️ Tiempo desde creación hasta resolución
-   🎯 Meta: < 24 horas
-   📈 Se calcula con: `timeToResolution` del campo SLA

### 3. SLA Compliance

-   ✅ % de tickets resueltos dentro del SLA
-   🎯 Meta: ≥ 90%
-   📈 Se calcula con: `breachTime` del campo SLA

### 4. Customer Satisfaction (CSAT)

-   ⭐ Promedio de calificaciones de clientes
-   🎯 Meta: ≥ 4 estrellas (de 5)
-   📈 Se calcula con: campo `satisfaction`

### 5. First Contact Resolution (FCR)

-   ✅ % de tickets resueltos en primer contacto
-   🎯 Meta: ≥ 60%
-   📈 Se calcula contando tickets con 1 sola respuesta

## 🔍 Consultas JQL Útiles

### Tickets Abiertos

```jql
project = TIK AND status NOT IN (Closed, Resolved)
```

### Tickets SLA Vencido

```jql
project = TIK AND "Time to resolution" > 0
```

### Tickets de Alta Prioridad

```jql
project = TIK AND priority = Highest AND status NOT IN (Closed, Resolved)
```

### Tickets por Agente

```jql
project = TIK AND assignee = "earevalo@webtrackgps.net"
```

### Tickets del Mes Actual

```jql
project = TIK AND created >= startOfMonth() ORDER BY created DESC
```

### Tickets Resueltos Hoy

```jql
project = TIK AND resolved >= startOfDay() ORDER BY resolved DESC
```

## 🛠️ API Endpoints de Service Desk

### Obtener Tickets

```
GET /rest/api/3/search?jql=project=TIK
```

### Obtener Ticket Individual

```
GET /rest/api/3/issue/TIK-123
```

### Obtener Colas del Proyecto

```
GET /rest/servicedeskapi/servicedesk/{serviceDeskId}/queue
```

### Obtener Request Types

```
GET /rest/servicedeskapi/servicedesk/{serviceDeskId}/requesttype
```

### Obtener SLA Info

```
GET /rest/api/3/issue/{issueKey}/sla
```

## 🚀 Próximos Pasos

### 1. Verificar Conexión

```bash
npm run dev
```

Deberías ver los tickets del proyecto TIK en el dashboard.

### 2. Personalizar Filtros

Edita `src/adapters/jira/JiraAdapter.ts` para ajustar:

-   Campos específicos de tu Service Desk
-   Request types personalizados
-   SLA específicos de tu configuración

### 3. Agregar Campos Personalizados

Si tu Service Desk tiene campos custom:

```typescript
// En JiraMapper.ts
toTicket(jiraIssue: JiraIssue): Ticket {
  return {
    // ... campos estándar
    customField1: jiraIssue.fields.customfield_10001,
    customField2: jiraIssue.fields.customfield_10002,
  };
}
```

## 🐛 Troubleshooting

### Error: "No se pueden obtener tickets"

1. Verifica el API token
2. Verifica el PROJECT_KEY (TIK)
3. Verifica permisos en Jira

### Error: "CORS"

Si estás en desarrollo local y tienes errores CORS:

1. Usar proxy en `vite.config.ts`
2. O configurar CORS en Jira (solo administradores)

### Tickets no tienen SLA

Si no ves datos de SLA:

1. Verifica que tu Service Desk tiene SLA configurados
2. Los campos de SLA pueden variar por configuración
3. Consulta con tu admin de Jira

## 📚 Referencias

-   [Jira Service Desk API](https://developer.atlassian.com/cloud/jira/service-desk/rest/intro/)
-   [Jira Platform REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/)
-   [JQL (Jira Query Language)](https://www.atlassian.com/software/jira/guides/expand-jira/jql)
-   [SLA en Service Desk](https://support.atlassian.com/jira-service-management-cloud/docs/configure-slas/)

## 💡 Consejos

1. **Usa JQL Browser**: En Jira, ve a Filters > Advanced y prueba tus queries
2. **Revisa campos disponibles**: Usa `/rest/api/3/field` para ver todos los campos
3. **Testea con Postman**: Prueba las APIs antes de integrarlas
4. **Logs detallados**: Activa console.log en desarrollo para debug

---

¿Necesitas ayuda? Revisa los logs en la consola del navegador para más detalles.
