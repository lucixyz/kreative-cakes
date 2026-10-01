import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Deployed as its own site (own origin), so the base is "/". Set VITE_BASE=/admin/ to serve under a path.
export default defineConfig({ base: process.env.VITE_BASE ?? "/", plugins: [react()], server: { port: 8082 } });
