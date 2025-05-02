import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ['prototype.prismic.fr'],
    host: '0.0.0.0', // Bind to all network interfaces
    port: 5173, // Optional: Ensure the port matches your Dockerfile
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // define: {
  //   'process.env': env, // Pass the environment variables to your application
  // },
})
