import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { CustomProvider } from "rsuite";
import { useThemeStore } from "@presentation/store/themeStore";
import { Layout } from "@presentation/components/layout";
import { Dashboard } from "./presentation/components/Dashboard";
import {
    TicketsPage,
    KPIsPage,
    ReportsPage,
    SettingsPage,
} from "@presentation/pages";

/**
 * Componente de rutas con layout
 */
const AppRoutes: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Usuario mock - será reemplazado por autenticación real en el futuro
    const mockUser = {
        name: "Usuario Demo",
        email: "usuario@example.com",
    };

    // Determinar el item activo del menú basado en la ruta actual
    const getActiveMenuItem = () => {
        const path = location.pathname;
        if (path === "/") return "dashboard";
        if (path.startsWith("/tickets")) return "tickets";
        if (path.startsWith("/kpis")) return "kpis";
        if (path.startsWith("/reports")) return "reports";
        if (path.startsWith("/settings")) return "settings";
        return "dashboard";
    };

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    return (
        <Layout
            user={mockUser}
            activeMenuItem={getActiveMenuItem()}
            onNavigate={handleNavigate}
        >
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="/kpis" element={<KPIsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
        </Layout>
    );
};

/**
 * Componente raíz de la aplicación
 */
const App: React.FC = () => {
    const { theme } = useThemeStore();

    return (
        <CustomProvider theme={theme}>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </CustomProvider>
    );
};

export default App;
