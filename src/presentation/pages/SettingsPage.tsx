import React, { useState } from "react";
import { useThemeStore } from "@presentation/store/themeStore";
import { useTicketsStore } from "@presentation/store/ticketsStore";
import {
    Panel,
    Toggle,
    Button,
    Input,
    InputGroup,
    Form,
    ButtonToolbar,
    Message,
    Divider,
    Badge,
    SelectPicker,
} from "rsuite";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";

/**
 * Página de Configuración
 * Ajustes de la aplicación, preferencias de usuario, etc.
 */
export const SettingsPage: React.FC = () => {
    const {
        theme,
        toggleTheme,
        sidebarMode,
        setSidebarMode,
    } = useThemeStore();
    const { tickets } = useTicketsStore();

    // Estados para configuración de Jira
    const [jiraConfig, setJiraConfig] = useState({
        baseUrl: import.meta.env.VITE_JIRA_BASE_URL || "",
        email: import.meta.env.VITE_JIRA_EMAIL || "",
        apiToken: "",
        project: "TIK",
    });

    const [showApiToken, setShowApiToken] = useState(false);
    const [configSaved, setConfigSaved] = useState(false);

    // Estados para configuración de notificaciones
    const [notifications, setNotifications] = useState({
        enabled: true,
        slaAlerts: true,
        escalationAlerts: true,
        newTickets: false,
        sound: true,
    });

    // Estados para configuración de actualización
    const [refreshInterval, setRefreshInterval] = useState<string>("5");

    const handleJiraConfigChange = (field: string, value: string) => {
        setJiraConfig((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveJiraConfig = () => {
        // En producción, esto guardaría en variables de entorno o backend
        console.log("Guardando configuración de Jira:", jiraConfig);
        setConfigSaved(true);
        setTimeout(() => setConfigSaved(false), 3000);
    };

    const handleTestConnection = async () => {
        // Aquí iría la lógica para probar la conexión
        console.log("Probando conexión con Jira...");
    };

    const handleNotificationChange = (field: string, value: boolean) => {
        setNotifications((prev) => ({ ...prev, [field]: value }));
    };

    const refreshOptions = [
        { label: "30 segundos", value: "0.5" },
        { label: "1 minuto", value: "1" },
        { label: "2 minutos", value: "2" },
        { label: "5 minutos", value: "5" },
        { label: "10 minutos", value: "10" },
        { label: "Manual", value: "0" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Configuración
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Ajustes y preferencias de la aplicación
                </p>
            </div>

            {/* Apariencia */}
            <Panel
                bordered
                header={
                    <h2 className="text-lg font-semibold">
                        Apariencia
                    </h2>
                }
                className="bg-white dark:bg-gray-800"
            >
                <div className="space-y-6">
                    {/* Tema */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Modo Oscuro
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Activa el tema oscuro para reducir la fatiga
                                    visual
                                </p>
                            </div>
                            <Toggle
                                checked={theme === "dark"}
                                onChange={toggleTheme}
                                size="lg"
                            />
                        </div>
                    </div>

                    <Divider />

                    {/* Sidebar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Comportamiento del Menú Lateral
                        </label>
                        <div className="space-y-3">
                            <label className="flex items-start cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <input
                                    type="radio"
                                    value="fixed"
                                    checked={sidebarMode === "fixed"}
                                    onChange={() => setSidebarMode("fixed")}
                                    className="mt-1 mr-3"
                                />
                                <div className="flex-1">
                                    <span className="block font-medium text-gray-900 dark:text-gray-100">
                                        Fijo
                                    </span>
                                    <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Siempre visible, se colapsa manualmente
                                        con el botón
                                    </span>
                                </div>
                            </label>
                            <label className="flex items-start cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <input
                                    type="radio"
                                    value="hover"
                                    checked={sidebarMode === "hover"}
                                    onChange={() => setSidebarMode("hover")}
                                    className="mt-1 mr-3"
                                />
                                <div className="flex-1">
                                    <span className="block font-medium text-gray-900 dark:text-gray-100">
                                        Hover
                                    </span>
                                    <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Se expande automáticamente al pasar el
                                        mouse
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </Panel>

            {/* Conexión Jira */}
            <Panel
                bordered
                header={
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Conexión con Jira
                        </h2>
                        <Badge
                            content="Conectado"
                            color="green"
                        />
                    </div>
                }
                className="bg-white dark:bg-gray-800"
            >
                {configSaved && (
                    <Message
                        showIcon
                        type="success"
                        className="mb-4"
                    >
                        Configuración guardada correctamente
                    </Message>
                )}

                <Form fluid>
                    <Form.Group>
                        <Form.ControlLabel>URL Base de Jira</Form.ControlLabel>
                        <Input
                            value={jiraConfig.baseUrl}
                            onChange={(value) =>
                                handleJiraConfigChange("baseUrl", value)
                            }
                            placeholder="https://tu-empresa.atlassian.net"
                        />
                        <Form.HelpText>
                            URL de tu instancia de Jira Cloud
                        </Form.HelpText>
                    </Form.Group>

                    <Form.Group>
                        <Form.ControlLabel>Email</Form.ControlLabel>
                        <Input
                            type="email"
                            value={jiraConfig.email}
                            onChange={(value) =>
                                handleJiraConfigChange("email", value)
                            }
                            placeholder="usuario@empresa.com"
                        />
                        <Form.HelpText>
                            Email de tu cuenta de Jira
                        </Form.HelpText>
                    </Form.Group>

                    <Form.Group>
                        <Form.ControlLabel>API Token</Form.ControlLabel>
                        <InputGroup inside>
                            <Input
                                type={showApiToken ? "text" : "password"}
                                value={jiraConfig.apiToken}
                                onChange={(value) =>
                                    handleJiraConfigChange("apiToken", value)
                                }
                                placeholder="Tu API Token de Jira"
                            />
                            <InputGroup.Button
                                onClick={() => setShowApiToken(!showApiToken)}
                            >
                                {showApiToken ? (
                                    <EyeSlashIcon />
                                ) : (
                                    <EyeIcon />
                                )}
                            </InputGroup.Button>
                        </InputGroup>
                        <Form.HelpText>
                            Token de API generado desde{" "}
                            <a
                                href="https://id.atlassian.com/manage-profile/security/api-tokens"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Atlassian Account
                            </a>
                        </Form.HelpText>
                    </Form.Group>

                    <Form.Group>
                        <Form.ControlLabel>
                            Proyecto por Defecto
                        </Form.ControlLabel>
                        <Input
                            value={jiraConfig.project}
                            onChange={(value) =>
                                handleJiraConfigChange("project", value)
                            }
                            placeholder="TIK"
                        />
                        <Form.HelpText>
                            Clave del proyecto de Jira (ej: TIK, SUP, HELP)
                        </Form.HelpText>
                    </Form.Group>

                    <Form.Group>
                        <ButtonToolbar>
                            <Button
                                appearance="primary"
                                onClick={handleSaveJiraConfig}
                            >
                                Guardar Configuración
                            </Button>
                            <Button
                                appearance="ghost"
                                onClick={handleTestConnection}
                            >
                                Probar Conexión
                            </Button>
                        </ButtonToolbar>
                    </Form.Group>
                </Form>

                <Divider />

                <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium mb-2">Estado de la conexión:</p>
                    <ul className="space-y-1 ml-4">
                        <li>✓ URL configurada: {jiraConfig.baseUrl || "No configurada"}</li>
                        <li>✓ Tickets cargados: {tickets.length}</li>
                        <li>✓ Última actualización: Hace pocos minutos</li>
                    </ul>
                </div>
            </Panel>

            {/* Notificaciones */}
            <Panel
                bordered
                header={
                    <h2 className="text-lg font-semibold">
                        Notificaciones
                    </h2>
                }
                className="bg-white dark:bg-gray-800"
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Habilitar Notificaciones
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Recibe alertas sobre eventos importantes
                            </p>
                        </div>
                        <Toggle
                            checked={notifications.enabled}
                            onChange={(checked) =>
                                handleNotificationChange("enabled", checked)
                            }
                        />
                    </div>

                    {notifications.enabled && (
                        <>
                            <Divider />

                            <div className="space-y-4 ml-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Alertas de SLA
                                        </label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Notificar cuando un SLA esté por
                                            vencer
                                        </p>
                                    </div>
                                    <Toggle
                                        checked={notifications.slaAlerts}
                                        onChange={(checked) =>
                                            handleNotificationChange(
                                                "slaAlerts",
                                                checked
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Alertas de Escalación
                                        </label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Notificar cuando un ticket sea
                                            escalado
                                        </p>
                                    </div>
                                    <Toggle
                                        checked={notifications.escalationAlerts}
                                        onChange={(checked) =>
                                            handleNotificationChange(
                                                "escalationAlerts",
                                                checked
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Nuevos Tickets
                                        </label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Notificar cuando se cree un nuevo
                                            ticket
                                        </p>
                                    </div>
                                    <Toggle
                                        checked={notifications.newTickets}
                                        onChange={(checked) =>
                                            handleNotificationChange(
                                                "newTickets",
                                                checked
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Sonido
                                        </label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Reproducir sonido con las
                                            notificaciones
                                        </p>
                                    </div>
                                    <Toggle
                                        checked={notifications.sound}
                                        onChange={(checked) =>
                                            handleNotificationChange(
                                                "sound",
                                                checked
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Panel>

            {/* Actualización de Datos */}
            <Panel
                bordered
                header={
                    <h2 className="text-lg font-semibold">
                        Actualización de Datos
                    </h2>
                }
                className="bg-white dark:bg-gray-800"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Intervalo de Actualización Automática
                    </label>
                    <SelectPicker
                        data={refreshOptions}
                        value={refreshInterval}
                        onChange={(value) => setRefreshInterval(value || "5")}
                        searchable={false}
                        cleanable={false}
                        block
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {refreshInterval === "0"
                            ? "Los datos se actualizarán solo cuando recargues manualmente"
                            : `Los datos se actualizarán automáticamente cada ${
                                  parseFloat(refreshInterval) < 1
                                      ? "30 segundos"
                                      : parseFloat(refreshInterval) === 1
                                      ? "minuto"
                                      : `${refreshInterval} minutos`
                              }`}
                    </p>
                </div>
            </Panel>

            {/* Información del Sistema */}
            <Panel
                bordered
                header={
                    <h2 className="text-lg font-semibold">
                        Información del Sistema
                    </h2>
                }
                className="bg-white dark:bg-gray-800"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">
                            Versión:
                        </span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                            1.0.0
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">
                            Entorno:
                        </span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                            {import.meta.env.DEV ? "Desarrollo" : "Producción"}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">
                            Tickets en caché:
                        </span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                            {tickets.length}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">
                            Tema actual:
                        </span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                            {theme === "dark" ? "Oscuro" : "Claro"}
                        </span>
                    </div>
                </div>

                <Divider />

                <div className="flex gap-3">
                    <Button
                        appearance="ghost"
                        onClick={() => window.location.reload()}
                    >
                        Recargar Aplicación
                    </Button>
                    <Button
                        appearance="ghost"
                        color="red"
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                        }}
                    >
                        Limpiar Caché
                    </Button>
                </div>
            </Panel>
        </div>
    );
};
