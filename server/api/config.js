
import { password } from '../passwords.js'
import vkb from 'vkbeautify'

export default defineEventHandler(async (event) => {
    const indexH = useNitroApp().indexHandler, query = getQuery(event)
    try {
        console.log(`received config request with command ${query.command}`)
        
        if (query.command == 'reload') {
            if (query.password != password) {
                return { errorMessage: `supplied password ${query.password} is not correct.` }
            }
            const stats = await indexH.reloadIndex()
            const statsStr = vkb.json(JSON.stringify(stats))
            console.log(`index reloaded with stats: ${statsStr}`)
        }
        // return the config and stats
        return {config: indexH.config, indexStats: indexH.indexStats}

    } catch(err) {
        return { errorMessage: err }
    }
})