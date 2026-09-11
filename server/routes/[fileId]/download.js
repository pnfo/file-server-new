// routes/[fileId]/download.js
export default eventHandler(async event => {
    try {
        const indexH = useNitroApp().indexHandler, fileId = parseInt(event.context.params.fileId)
        if (isNaN(fileId)) return { errorMessage: `provided ${fileId} is not a number` }

        const file = indexH.getFile(fileId)
        if (!file) return { errorMessage: `File not found for ${fileId} specified` }
    
        console.log(`download file ${file.id} : ${file.name}.${file.type}`);
        await indexH.incrementDownloads(file.id); // increment download count

        const query = getQuery(event)
        const isInline = query.inline === 'true' || query.inline === '1' || file.type === 'htm'
        const dispositionType = isInline ? 'inline' : 'attachment'

        const fileName = `${file.name}.${file.type}`
        const asciiFallback = `${file.id}.${file.type}`
        const encodedFileName = encodeURIComponent(fileName)
        const contentDisposition = `${dispositionType}; filename="${asciiFallback}"; filename*=UTF-8''${encodedFileName}`

        const signedUrl = await indexH.getSignedUrl(file.Key, 3600, { contentDisposition })
        //res.redirect(302, signedUrl, () => {});
        return sendRedirect(event, signedUrl, 302)
    } catch(err) { 
        return { errorMessage: err } 
    }
})
