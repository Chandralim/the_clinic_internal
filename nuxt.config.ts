// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url'
export default defineNuxtConfig({
  extends: [
    '../_layers/core-base'
  ],
  alias: {
    // Daftarkan alias @core menuju absolute path folder layer Anda
    '@core': fileURLToPath(new URL('../_layers/core-base', import.meta.url))
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss','@pinia/nuxt'],
  // Enables the Nuxt 4/5 folder behavior
  runtimeConfig: {
    // public berarti bisa diakses di Client & Server
    public: { 
      baseURL: process.env.MY_API_ADDR || 'http://localhost:8000', 
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  ssr: false,
  // This tells Nuxt that your UI code is inside the app folder
  // Note: 'server' and 'public' stay outside even with this setting
  srcDir: 'app/',
  build: {
    transpile: ['@vuepic/vue-datepicker']
  },
  vite: {
    // Disable certain optimizations that might crash IPC on specific file systems
    server: {
      watch: {
        usePolling: true, // Try this if on a network/external drive
      }
    },
    // Force faster cleanup
    build: {
      commonjsOptions: { transformMixedEsModules: true },
    }
  },
  typescript: {
    typeCheck: false,
    strict: false
  },
   css: [
    '~/assets/css/tailwind.css',
    '~/assets/main.scss'
  ],
  components: [{ path: "~/components",pathPrefix: false, global: true }],
})