import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@core": path.resolve(__dirname, "./src/core"),
            "@adapters": path.resolve(__dirname, "./src/adapters"),
            "@infrastructure": path.resolve(__dirname, "./src/infrastructure"),
            "@presentation": path.resolve(__dirname, "./src/presentation"),
            "@shared": path.resolve(__dirname, "./src/shared"),
        },
    },
    server: {
        port: 3000,
        open: true,
        proxy: {
            "/api/jira": {
                target: "https://webtrackdev.atlassian.net",
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api\/jira/, ""),
                configure: (proxy) => {
                    proxy.on("proxyReq", (proxyReq, req) => {
                        // Headers XSRF requeridos por Jira Cloud
                        proxyReq.setHeader("X-Atlassian-Token", "no-check");
                        proxyReq.setHeader(
                            "X-Requested-With",
                            "XMLHttpRequest"
                        );

                        // Preservar autenticación y Content-Type
                        if (req.headers.authorization) {
                            proxyReq.setHeader(
                                "Authorization",
                                req.headers.authorization
                            );
                        }
                        if (req.headers["content-type"]) {
                            proxyReq.setHeader(
                                "Content-Type",
                                req.headers["content-type"]
                            );
                        }
                    });
                },
            },
        },
    },
});
