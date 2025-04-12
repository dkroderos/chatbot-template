import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/hubs': {
        target: 'http://localhost:5050',
        changeOrigin: true,
        ws: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
});
