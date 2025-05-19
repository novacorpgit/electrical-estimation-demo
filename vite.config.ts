
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Add aliases for AG Grid CSS files
      "ag-grid-community/styles": path.resolve(__dirname, "node_modules/ag-grid-community/styles")
    },
  },
  optimizeDeps: {
    include: ['ag-grid-community', 'ag-grid-react']
  },
  build: {
    commonjsOptions: {
      include: [/ag-grid-community/, /node_modules/],
    },
  }
}));
