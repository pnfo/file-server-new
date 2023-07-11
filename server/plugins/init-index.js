
import fs from 'fs'
import path from 'path'
import { IndexHandler } from '../index-handler'
const profile = process.env.PROFILE || 'library', 
    appBaseUrl = process.env.NUXT_APP_BASE_URL || '',
    serverRoot = 'server-data' // when running prod with "node .output/server/index.mjs"

export default defineNitroPlugin(async (nitroApp) => {
    console.log(`Nitro plugin init index with profile ${profile}`)
    nitroApp.config = JSON.parse(fs.readFileSync(path.join(serverRoot, `${profile}/config.json`), 'utf-8'))
    Object.assign(nitroApp.config, {profile, appBaseUrl})
    nitroApp.indexHandler = new IndexHandler(nitroApp.config)
    await nitroApp.indexHandler.reloadIndex()
    console.log(`current directory: ${process.cwd()}`)
})