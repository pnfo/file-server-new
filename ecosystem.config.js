// pm2 config - file name has to be ecosystem
// pm2 start ecosystem.config.js --only library-new
// pm2 restart ecosystem.config.js
// pm2 flush - remove logs, useful to do from time to time
module.exports = {
    apps: [
    {
      name: "library-new",
      script: ".output/server/index.mjs",
      env: {
          NITRO_PORT: 8090, 
          PROFILE: "library", 
          NUXT_APP_BASE_URL: "/library", 
      },
    },
    {
      name: "cloud-new",
      script: ".output/server/index.mjs",
      env: {
          NITRO_PORT: 8091, 
          PROFILE: "cloud", 
          NUXT_APP_BASE_URL: "/cloud",
      },
    }
  ]
}