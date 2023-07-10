
import { getPossibleMatches } from '@pnfo/singlish-search'

export default defineEventHandler(async (event) => {
    const indexH = useNitroApp().indexHandler
    try {
        const body = await readBody(event)
        if (!body || !body.query) return { errorMessage: `malformed search payload query` }
        const terms = getPossibleMatches(body.query) // get all singlish possibilities
        if (terms.length > 300) return { errorMessage: `too many singlish matches` }
        const entries = indexH.search(0, [...terms, body.query], body.maxResults) // include the original query in case English name
        console.log(`for query ${body.query}, singlish terms: ${terms.length}/${terms.slice(0, 5)}..., entries found ${entries.length}`);
        return { entries }
    } catch(err) {
        return { errorMessage: err }
    }
})