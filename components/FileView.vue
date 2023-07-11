<script lang="js" setup>

import { useSettingsStore } from '@/stores/settings'
import { getTypeInfo, getSizeInfo, copyClipboard } from '@/stores/utils'
const props = defineProps({
    file: Object
})
const file = props.file, config = useSettingsStore().config
// can also use runtimeConfig.app.baseURL
const sizeInfo = getSizeInfo(file.Size), typeInfo = getTypeInfo(file.type), downloadLink = `${config.appBaseUrl}/${file.id}/download`
function formatNumber(num) {
    return num ? num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '';
}
function getThumbImage(index) {
    return `https://tipitaka.sgp1.cdn.digitaloceanspaces.com/${config.s3RootFolder}/thumbs/${file.id}-${index}.jpg`
}
</script>

<template>
    <v-container fluid>
        <v-row no-gutters class="ma-0 pa-0">
            <v-col cols="12">
                <TopNav :parents="file.parents" :extra="[{icon: typeInfo.icon}]"></TopNav>
            </v-col>
        </v-row>

        <v-row align="center" justify="start" class="flex-nowrap" no-gutters>
            <v-col class="flex-grow-0">
                <v-icon :color="typeInfo.color" style="font-size: 7em;">{{ typeInfo.icon }}</v-icon>
            </v-col>
            <v-col class="flex-grow-1"><span style="font-size: 1.5em;">{{ file.name + '.' + file.type }}</span></v-col>
        </v-row>

        <v-row v-if="file.type == 'mp3' || file.type == 'm4a'" dense>
            <v-col cols="12">
                <audio controls :src="downloadLink" preload="auto">
                    ඔබගේ අතිරික්සුව (browser) <code>audio</code> අංගය සඳහා සහාය නොදක්වයි.
                </audio>
            </v-col>
        </v-row>

        <v-row dense>
            <v-col cols="12">
                <span class="text-secondary">බාගත කිරීම් ගණන : </span>
                <span class="text-primary">{{ formatNumber(file.downloads) }}</span>
            </v-col>

            <v-col cols="12">
                <span class="text-secondary">වෙබ් අඩවියට එක් කළ දිනය : </span>
                <span class="text-primary">{{ file.dateAdded }}</span>
            </v-col>

            <v-col cols="12">
                <span class="text-secondary">ගොනුවේ ප්‍රමාණය : </span>
                <span class="mr-2">{{ sizeInfo.numeral }}</span>
                <span :class="'size-unit ' + sizeInfo.unit">{{ sizeInfo.unit }}</span>
            </v-col>
        </v-row>

        <v-row >
            <v-col cols="12" sm="6">
                <v-btn size="large" color="success" :href="downloadLink" variant="flat" prepend-icon="mdi-download" nuxt>
                    {{ typeInfo.downloadText }}
                </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
                <v-btn color="info" variant="tonal" prepend-icon="mdi-share" @click.stop="copyClipboard(file.id)">බෙදාගැනීමට සබැඳියක් ගන්න</v-btn>
            </v-col>
        </v-row>

        <v-row dense v-if="file.type == 'pdf' && config.displayThumbs">
            <v-col cols="12">
                <v-alert variant="text" icon="mdi-image-multiple" color="secondary" style="font-size: 0.9em;">පොතේ මුල් සහ මැද පිටු වල ඡායාරූප පහතින් බලන්න.</v-alert>
            </v-col>

            <v-col v-for="n in 2" :key="n" cols="12" sm="6">
                <v-img :src="getThumbImage(n - 1)" cover class="bg-grey-lighten-2">
                    <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                        </div>
                    </template>
                </v-img>
            </v-col>
        </v-row>

        <!--<div v-if="details.length" class="entry-details">{{ details }}</div>
        <div v-if="details.length < 10" class="file-details">ඉහත පොත ඔබ කියවා ඇත්නම් හෝ පොත ගැන යම් වැදගත් විස්තරයක් දන්නේ නම්, එය
              මෙම පිටුවට පැමිණෙන අයගේ ද දැනගැනීම පිණිස මෙතැන පළ කිරීමට උචිත ලෙස ලියා අප වෙත email කරන්න. 
              පොතට අදාළ සබැඳිය ද සඳහන් කිරීමට අමතක නොකරන්න. සිංහලෙන් හෝ ඉංග්‍රීසියෙන් ලියන්න. සිංග්ලිෂ් වලින් ලිවීමෙන් වලකින්න. 
        </div>-->
      
    </v-container>
</template>

<style scoped>
.size-unit { font-size: 0.8em; color: rgb(var(--v-theme-success)) }
.size-unit.GB { color: rgb(var(--v-theme-error)) }

</style>
