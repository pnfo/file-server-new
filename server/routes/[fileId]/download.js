// routes/[fileId]/download.js
export default eventHandler(async event => {
    try {
        const indexH = useNitroApp().indexHandler, fileId = parseInt(event.context.params.fileId)
        if (isNaN(fileId)) return { errorMessage: `provided ${fileId} is not a number` }

        const file = indexH.getFile(fileId)
        if (!file) return { errorMessage: `File not found for ${fileId} specified` }
    
        console.log(`serve file ${file.id} : ${file.name}.${file.type}`);
        await indexH.incrementDownloads(file.id); // increment download count

        const query = getQuery(event)
        const isAudio = file.type === 'mp3' || file.type === 'm4a'
        const isDirect = query.inline === '1' || query.direct === '1'

        // Audio streams and direct requests get a direct 302 redirect to DigitalOcean Spaces signed URL
        if (isAudio || isDirect) {
            const signedUrl = await indexH.getSignedUrl(file.Key, 3600)
            return sendRedirect(event, signedUrl, 302)
        }

        // For all other files (PDF, HTML, ZIP, etc.), generate signed URL and serve an HTML bridge page.
        // This solves:
        // 1. Facebook In-App Browser: loads the HTML page natively, then redirects cleanly without appending ?fbclid to the S3 URL (which breaks S3 SigV4 signature).
        // 2. Mobile Chrome / Safari: avoids the blank "Loading PDF" bug caused by cross-origin 302 redirects to PDFs.
        // 3. DigitalOcean Droplet: 0 memory & 0 bandwidth consumed, preventing 504 Gateway Timeouts & OOM crashes on large files (up to 300MB).
        const signedUrl = await indexH.getSignedUrl(file.Key, 3600)
        const fullFileName = `${file.name}.${file.type}`
        const safeTitle = fullFileName.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        const escapedUrl = signedUrl.replace(/"/g, '&quot;')

        setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
        setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')

        return `<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${safeTitle} - බාගත කිරීම / Download</title>
    <meta http-equiv="refresh" content="0; url=${escapedUrl}">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 1rem;
            box-sizing: border-box;
        }
        .card {
            background: #ffffff;
            border-radius: 12px;
            padding: 2rem;
            max-width: 440px;
            width: 100%;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            text-align: center;
        }
        .spinner {
            width: 40px;
            height: 40px;
            margin: 0 auto 1.5rem;
            border: 3px solid #e2e8f0;
            border-top-color: #0284c7;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        h1 {
            font-size: 1.1rem;
            margin: 0 0 0.5rem;
            line-height: 1.4;
            word-break: break-word;
        }
        p {
            color: #64748b;
            font-size: 0.9rem;
            margin: 0 0 1.5rem;
        }
        .btn {
            display: inline-block;
            background-color: #0284c7;
            color: #ffffff;
            text-decoration: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            font-size: 0.95rem;
            transition: background-color 0.2s;
        }
        .btn:hover {
            background-color: #0369a1;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="spinner"></div>
        <h1>${safeTitle}</h1>
        <p>ගොනුව විවෘත වෙමින් පවතී. ස්වයංක්‍රීයව විවෘත නොවන්නේ නම් පහත බොත්තම ඔබන්න.<br>(Opening file. If it doesn't open automatically, click below:)</p>
        <a class="btn" href="${escapedUrl}">ගොනුව විවෘත කරන්න / Open File</a>
    </div>
    <script>
        window.location.replace(${JSON.stringify(signedUrl)});
    </script>
</body>
</html>`
    } catch(err) { 
        console.error('Download route error:', err)
        return { errorMessage: err.message || err.toString() } 
    }
})
