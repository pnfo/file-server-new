// pm2 config - file name has to be ecosystem
// pm2 start ecosystem.config.js --only library-new
// pm2 restart/reload ecosystem.config.js (might need pm2 kill/delete before any changes are taken effect from the config changes)
// pm2 flush - remove logs, useful to do from time to time
module.exports = {
    apps: [
    {
      name: "library-new",
      script: "output/server/index.mjs",
      //cron_restart: '0 */6 * * *',
      max_memory_restart: '600M',
      env: {
          NITRO_PORT: 8090, 
          PROFILE: "library", 
          NUXT_APP_BASE_URL: "/library", 
          NODE_OPTIONS: "--max_old_space_size=280", // limit memory allocation to 300MB - more aggresive gc
      },
    },
    {
      name: "cloud-new",
      script: "output/server/index.mjs",
      env: {
          NITRO_PORT: 8091, 
          PROFILE: "cloud", 
          NUXT_APP_BASE_URL: "/cloud",
          NODE_OPTIONS: "--max_old_space_size=280",
      },
    }
  ]
}