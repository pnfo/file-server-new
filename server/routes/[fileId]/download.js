// routes/[fileId]/download.js
export default eventHandler(async event => {
    try {
        const indexH = useNitroApp().indexHandler, fileId = parseInt(event.context.params.fileId)
        if (isNaN(fileId)) return { errorMessage: `provided ${fileId} is not a number` }

        const file = indexH.getFile(fileId)
        if (!file) return { errorMessage: `File not found for ${fileId} specified` }
    
        console.log(`download file ${file.id} : ${file.name}.${file.type}`);
        await indexH.incrementDownloads(file.id); // increment download count

        const signedUrl = await indexH.getSignedUrl(file.Key, 600)
        //res.redirect(302, signedUrl, () => {});
        return sendRedirect(event, signedUrl, 302)
    } catch(err) { 
        return { errorMessage: err } 
    }
})
