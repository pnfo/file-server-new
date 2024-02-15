
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  devServer: {
    port: process.env.NITRO_PORT || 7771, // in prod set the env variable
  },
  modules: [
    '@pinia/nuxt',
  ],
  runtimeConfig: {
    // Private keys are only available on the server
    // apiSecret: '123',

    // Public keys that are exposed to the client
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api', // not used
      baseURL: process.env.NUXT_APP_BASE_URL || '', // not used
    },
  },
  nitro: {
    //serverAssets: [{
    //  baseName: 'library',
    //  dir: './library' // Relative to `srcDir` (`server/` for nuxt)
    //}]
    output: {
      dir: 'output',
    },
  },
  devtools: { enabled: true }
})
