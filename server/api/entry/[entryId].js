

export default defineEventHandler(async (event) => {
    const indexH = useNitroApp().indexHandler, entryId = parseInt(event.context.params.entryId)
    if (isNaN(entryId)) return { errorMessage: `provided ${entryId} is not a number` }

    try {
        const file = indexH.getFile(entryId)
        if (file) {
            console.log(`view file page ${file.id} : ${file.name}`)
            return { type: 'file', file }
        }

        const folder = indexH.getFolder(entryId)
        if (!folder) return { errorMessage: `provided ${entryId} does not exist` }
        const entries = indexH.getChildren(folder.id) // direct children
        console.log(`view folder page ${folder.id || 'root folder'} with ${entries.length} entries`);
        return { type: 'coll', entries, folder }

    } catch (err) {
        return { errorMessage: err }
    }
    // //return await useStorage().getItem(`assets/library/library-config.json`)
})
