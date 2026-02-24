export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
  ],

  googleFonts: {
    families: {
      Outfit: [400, 500, 600, 700, 800],
      'Plus Jakarta Sans': [400, 500, 600, 700],
    },
    display: 'swap',
  },

  css: ['~/assets/css/admin.css'],

  routeRules: {
    '/admin/**': { ssr: false },
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  app: {
    head: {
      title: 'Panel de Administración — Gestión de Eventos',
      meta: [
        { name: 'description', content: 'Panel administrativo para gestión de eventos, categorías y reportes.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  compatibilityDate: '2025-02-20',
})
