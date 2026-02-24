import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,
  nitro: { compatibilityDate: '2026-02-24' },
  app: {
    head: {
      title: 'Event Management',
      meta: [{ name: 'description', content: 'Catálogo de eventos' }]
    }
  },
  css: ['~/assets/styles/main.css']
})
