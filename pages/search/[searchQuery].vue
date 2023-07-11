<script lang="js" setup>

import { useSettingsStore } from '@/stores/settings'
import { getSeoTags, copyClipboard } from '@/stores/utils'
const settingsStore = useSettingsStore(), route = useRoute(), config = useSettingsStore().config

const query = route.params.searchQuery.trim(), maxResults = 50
// immediate and refresh needed below due to bug here https://github.com/nuxt/nuxt/issues/13805#issuecomment-1397317216
// otherwise will return null on the client side updates
const { data, refresh, status } = await useFetch(`/api/search`, {
        method: 'post',
        body: {query, maxResults},
        key: query, // if no key the same results will be returned since the url is the same
        immediate: false
    })
await refresh()

const entries = computed(() => data.value.entries || [])

useSeoMeta(getSeoTags(`“${query}” සෙවුමේ ප්‍රතිඵල`, `“${query}” යන සෙවුම සඳහා ගැළපෙන ගොනු - tipitaka.lk බෞද්ධ ${config.rootFolderName}.`))


const searchStatus = computed(() => {
  if (data.value.errorMessage) {
    return { text: `ඔබ විසින් ඇතුලු කළ සෙවුම් පදයේ වරදක් ඇත. ${data.value.errorMessage}`, type: 'error' }
  } else if (entries.value.length == 0) {
    return { text: `“${query}” යන සෙවුම සඳහා ගැළපෙන ගොනු ${config.rootFolderName}ේ අඩංගු නොවේ.`, type: 'error' }
  } else if (maxResults > entries.value.length) {
    return { text: `“${query}” යන සෙවුම සඳහා ගැළපෙන ගොනු ${entries.value.length} ක් හමුවිය.`, type: 'success' }
  } else {
    return { text: `ඔබගේ “${query}” යන සෙවුම සඳහා ගැළපෙන ගොනු ${maxResults} කට වඩා හමුවිය. එයින් මුල් ${maxResults} පහත දැක්වේ.`, type: 'warning' }
  }
})
</script>

<template>
  <v-sheet style="width: 100%; max-width: 1000px;" class="ma-1">
    <v-banner :icon="'$' + searchStatus.type" :color="searchStatus.type" density="compact">
        <v-banner-text :style="settingsStore.fontSizeStyle">{{ searchStatus.text }}</v-banner-text>
    </v-banner>

    <EntryList v-if="entries.length" :entries="entries" :folder="{}" :excludeHeadings="['dateAdded']"></EntryList>
  </v-sheet>
</template>

<style scoped>

</style>
