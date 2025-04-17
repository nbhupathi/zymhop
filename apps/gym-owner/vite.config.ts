import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Use fixed ports instead of importing from the config package
const PORTS = {
  API: 5000,
  ADMIN_DASHBOARD: 3000,
  GYM_OWNER_DASHBOARD: 3001,
  WEB: 3002
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd());
  
  return {
    plugins: [react()],
    server: {
      port: PORTS.GYM_OWNER_DASHBOARD,
      open: true,
      proxy: {
        '/api': {
          target: `http://localhost:${PORTS.API}`,
          changeOrigin: true,
        }
      }
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    define: {
      // Make environment variables available at runtime
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || `http://localhost:${PORTS.API}`),
    }
  };
});