# Nuxt 3 File Server

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install
```

## Development Server

Start the development server on `http://localhost:7771`:

```bash
# npm
npm run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build
```
* Copy the `output` directory from the build process to the server
* Copy the `server-data` directory to the production server
* Copy the `ecosystem.config.js` pm2 config file to the server
* Copy the `passwords.js` file - not in the repo - to the server
* Reload pm2 `pm2 reload ecosystem.config.js` or read `ecosystem.config.js` for more information
* Can run manually using this command as well `NITRO_PORT=8091 PROFILE=cloud NUXT_APP_BASE_URL=/cloud node .output/server/index.mjs`


Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
