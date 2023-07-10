module.exports = {
    apps: [
    {
      name: "library-new",
      script: ".output/server/index.mjs",
      env: {
          NITRO_PORT: 8090, // needed
          PROFILE: "library", // needed
          NUXT_PUBLIC_BASE_URL: "https://tipitaka.lk/library", // not needed
      },
    },
    {
      name: "cloud-new",
      script: ".output/server/index.mjs",
      env: {
          NITRO_PORT: 8091, // needed
          PROFILE: "cloud", // needed
          NUXT_PUBLIC_BASE_URL: "https://tipitaka.lk/cloud", // not needed
      },
    }
  ]
}