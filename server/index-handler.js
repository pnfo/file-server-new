/**
 * GUIDE
 * File name format - name[desc]{rowid}.type
 * Specify {rowid} for all files/folders manually, including new files/folders
 * reuse the rowid of the old file when replacing it with a new file, it will carry forward the download count and added date
 * 
 * update: 2020 april - rebuild index is now not recursive, mediafire code commented out
 * update: 2023 april - rebuild index now reads s3 buckets instead of filesystem, 
 *      instead of sqlite use a local json file to store downloads count and date added.
 *      unused db related code moved to obsolete folder
 */
"use strict";

import fs from 'fs'
import vkb from 'vkbeautify'
import { S3Handler, parseFileName } from './s3-hander.js'

export const getDate = (date) => date.toISOString().split('T')[0];
const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function generateParents(prefix) {
    const parts = prefix.split('/')
    return parts.map((p, i) => ({...parseFileName(p), Key: parts.slice(0, i + 1).join('/')}))
}
const fromNowTs = (seconds) => Date.now() + seconds * 1000

const memoryThreshold = 300, memoryCheckInterval = 5 // in MB and seconds
let highMemoryRounds = 0
function checkMemory() {
    const memory = process.memoryUsage()
    const memoryUsage = memory.rss + memory.external;
    console.log(`Memory Usage Check ${Math.round(memoryUsage / 1024 / 1024)} MB`)
    if (memoryUsage > memoryThreshold * 1024 * 1024) {
        highMemoryRounds++
        if (highMemoryRounds > 5) { // if high memory conseqtively
            console.error(`Memory usage over threshold ${memoryThreshold}. Usage: ${memoryUsage / 1024 / 1024} MB`)
            process.exit(1)
        }
    } else {
        highMemoryRounds = 0
    }
}

export class IndexHandler {
    constructor(config) {
        this.config = config
        this.s3Hander = new S3Handler(config.s3RootFolder) 
        this.indexLoaded = false
        this.idInfoLastWrite = Date.now()
        this.indexStats = { numFiles: 0, numFolders: 0 }
        this.signedUrlCache = {}
        setInterval(checkMemory, memoryCheckInterval * 1000)
    }

    async incrementDownloads(id) {
        if (!this.files[id]) return
        this.files[id].downloads++
        await this.checkWriteInfo(false)
    }
    async checkWriteInfo(forceWrite) {
        if (!this.indexLoaded) return // can't write anything until the index is loaded successfully
        if (forceWrite || this.idInfoLastWrite < Date.now() - 3600 * 1000) { // every one hour write to file
            const idToInfos = {}
            Object.entries(this.files).forEach(([id, {downloads, dateAdded}]) => idToInfos[id] = {downloads, dateAdded})
            await fs.promises.writeFile(this.config.idToInfoFile, vkb.json(JSON.stringify(idToInfos)), 'utf-8')
            this.idInfoLastWrite = Date.now()
        }
    }

    // read s3 completely and download stats and make an index
    async reloadIndex() {
        let entries
        try {
            entries = await this.s3Hander.list('', true) // get all
        } catch (e) {
            console.log(`server exiting due to s3 listing failure..`)
            process.exit(1) // this error is unrecoverable
        }

        await this.checkWriteInfo(true) // make sure to write any updates before reading
        const idToInfos = JSON.parse(fs.readFileSync(this.config.idToInfoFile, 'utf-8'))
        this.indexLoaded = false // prevent id info being written to file until everything is successfully loaded
        this.folders = {}
        this.files = {}
        
        entries.forEach(e => {
            if (this.files[e.id] || this.folders[e.id]) {
                throw new Error(`duplicate id in ${(this.files[e.id] || this.folders[e.id]).Key} and ${e.Key}. fix and refresh again.`)
            }
            const parents = generateParents(e.prefix), 
                {downloads, dateAdded} = idToInfos[e.id] || {downloads: 0, dateAdded: getDate(new Date())}
            this.files[e.id] = {...e, parents, downloads, dateAdded}

            parents.forEach(({name, id, Key}) => {
                const folder = this.folders[id]
                if (this.files[id] || (folder && folder.Key != Key)) {
                    throw new Error(`duplicate id in ${(this.files[id] || folder).Key} and ${Key}. fix and refresh again.`)
                }
                if (folder) {
                    folder.num_entries++
                    folder.Size += e.Size
                } else {
                    this.folders[id] = {name, id, num_entries: 1, Size: e.Size, Key, type: 'coll', parents: generateParents(Key)}
                }
            })
            
        });
        //console.log(this.files)
        //console.log(this.folders)
        this.indexLoaded = true

        const numFiles = Object.keys(this.files).length, numFolders = Object.keys(this.folders).length,
            nextEntryId = Math.max(...this.getAllEntries().map(({id}) => id)) + 1
        const stats = {numFiles, numFolders, nextEntryId, time: new Date().toLocaleString(),
            numFilesChange: numFiles - this.indexStats.numFiles, 
            numFoldersChange: numFolders - this.indexStats.numFolders}
        console.log(`index reloaded with ${numFiles} files and ${numFolders} folders. next entry id ${nextEntryId}`)
        return this.indexStats = stats
    }
    
    isFolder(id) { return !!this.folders[id] }
    getFolder(id) { return id ? this.folders[id] : {parents: [], id: 0, Key: ''} }
    getFile(id) { return this.files[id] }

    getAllEntries() {
        return [...Object.values(this.folders), ...Object.values(this.files)]
    }
    // get all files and folders within a prefix
    getAll(entryId) {
        if (entryId == 0) return this.getAllEntries()
        if (!this.isFolder(entryId)) throw new Error(`provided id ${entryId} is not a folder`)
        return this.getAllEntries().filter(data => data.Key.startsWith(this.folders[entryId].Key + '/'))
    }
    
    // immediate children, both files and folders
    getChildren(entryId) {
        const folderDepth = entryId ? this.folders[entryId].Key.split('/').length : 0
        return this.getAll(entryId).filter(({Key}) => Key.split('/').length == folderDepth + 1)
    }
    getRecentlyAdded(prefix, pastDate) {
        return this.getAll(prefix).filter(({dateAdded}) => dateAdded && dateAdded > getDate(pastDate))
    }
    
    search(entryId, queryTerms, maxResults = 100) {
        if (!queryTerms.length) return []
        const regexp = new RegExp(queryTerms.map(q => escapeRegExp(q)).join('|'))
        return this.getAll(entryId).filter(({name}) => regexp.test(name)).slice(0, maxResults)
    }
    async readStream(key) {
        return this.s3Hander.readFile(key)
    }
    async getSignedUrl(key, expiresIn) {
        // introduce a cache since there are lot of duplicate requests in quick succession - suspect OOM error due to urlsigning
        if (this.signedUrlCache[key] && this.signedUrlCache[key].expireTime > fromNowTs(10)) // expire more than 10 secs from now
            return this.signedUrlCache[key].url
        const url = this.s3Hander.getSignedUrl(key, expiresIn), expireTime = fromNowTs(expiresIn)
        this.signedUrlCache[key] = {url, expireTime}
        return url
    }
}