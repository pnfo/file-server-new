const typeToInfo = {
    'pdf': ['mdi-file-pdf-box', 'PDF', 'PDF ගොනුව බාගත කරගන්න', 'application/pdf', 'error'],
    'htm': ['mdi-language-html5', 'WEB', 'HTML ගොනුව බලන්න', 'text/html', 'info'],
    //'lin': ['mdi-link', 'WWW', 'සබැඳිය වෙත පිවිසෙන්න', ''], // redirect to url
    'col': ['mdi-folder', 'ගොනුව', 'බහාලුම අරින්න', '', 'primary'],
    'zip': ['mdi-folder-zip', 'ZIP', 'ZIP ගොනුව බාගත කරගන්න', 'application/zip', 'secondary'],
    'apk': ['mdi-android', 'APP', 'ඇන්ඩ්‍රොයිඩ් මෘදුකාංගය ලබාගන්න', 'application/octet-stream', 'success'],
    'doc': ['mdi-microsoft-word', 'DOC', 'Word ගොනුව බාගත කරගන්න', 'application/octet-stream', 'success'],
    'xls': ['mdi-microsoft-excel', 'EXCEL', 'Excel වගුව බාගත කරගන්න', 'application/octet-stream', 'success'],
    'jpg': ['mdi-image', 'IMAGE', 'පින්තූරය බාගත කරගන්න', 'image/jpeg', 'warning'],
    'png': ['mdi-image', 'IMAGE', 'පින්තූරය බාගත කරගන්න', 'image/png', 'warning'],
    'txt': ['mdi-text-box', 'TXT', 'TEXT ගොනුව බලන්න', 'text/plain', 'warning'],
    'mp3': ['mdi-volume-high', 'MP3', 'ධර්ම දේශනාව බාගත කරගන්න', 'audio/mpeg', 'success'],
    'm4a': ['mdi-volume-high', 'M4A', 'ධර්ම දේශනාව බාගත කරගන්න', 'audio/mpeg', 'secondary'],
    'unk': ['mdi-file', 'FILE', 'බාගත කරගන්න', 'application/octet-stream', 'warning'], // unknown types
}

export function getTypeInfo(type) {
    let type3 = type.substr(0, 3)
    if (type3 == 'jpeg') type3 = 'jpg'
    const [icon, name, downloadText, mime, color] = typeToInfo[type3] || typeToInfo['unk']
    return {icon, name, downloadText, mime, color}
}
export function getSizeInfo(size) {
    const sizeUnits = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (!size) return '';
    const i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
    const numeral = size / Math.pow(1024, i)
    return { numeral: numeral < 10 ? numeral.toFixed(1) : Math.round(numeral), unit: sizeUnits[i] }
}

// just a helper function to keep the meta tags in one place
import { useSettingsStore } from '@/stores/settings'
export function getSeoTags(title, description, extra) {
    return Object.assign({
        title, description, ogTitle: title, ogDescription: description, 
        ogImage: useSettingsStore().config.ogImage,
    }, extra)
}

// note package.json of vue-clipboard3 need to be changed to "main": "dist/esm/index.js",
import useClipboard from 'vue-clipboard3'
export async function copyClipboard(relativeUrl) {
    const settingsStore = useSettingsStore()
    await useClipboard().toClipboard(`${settingsStore.config.webUrlRoot}${relativeUrl}`)
    settingsStore.setSnackbar({ type: 'link-copied' })
}