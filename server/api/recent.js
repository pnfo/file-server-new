
export default defineEventHandler( (event) => {
    const indexH = useNitroApp().indexHandler
    const backDays = parseInt(getQuery(event).duration) || 90
    try {
        //const backDays = isNaN(req.params.duration) ? 90 : req.params.duration
        const pastDate = new Date(Date.now() - backDays * 24 * 60 * 60 * 1000)
        const entries = indexH.getRecentlyAdded(0, pastDate), folder = indexH.getFolder(0)
        console.log(`recent files in ${0} from ${backDays}:${pastDate} has ${entries.length} files`);
        return { entries, folder };
    } catch(err) {
        return { errorMessage: err }
    }
})