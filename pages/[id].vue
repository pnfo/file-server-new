<script lang="js" setup>
const route = useRoute()
import { useSettingsStore } from '@/stores/settings'
import { getSeoTags, copyClipboard } from '@/stores/utils'
const settingsStore = useSettingsStore(), config = settingsStore.config

const id = route.params.id

console.log(`calling api with id ${id}`)
const { data, refresh } = await useFetch(`/api/entry/${id}`, { immediate: false })
await refresh()

let title = ''
if (data.value.type == 'coll') title = data.value.folder.name + ' බහාලුම'
else if (data.value.type == 'file') title = data.value.file.name + ' ගොනුව'
useSeoMeta(getSeoTags(`${title}`, `${title}ේ අන්තර්ගතය - tipitaka.lk බෞද්ධ ${config.rootFolderName}.`))

// unless the useFetch is called onMounted/nextTick it returns null on the client due to some bug
onMounted(() => {
    // nextTick(() => {
    //     loadData()
    // })
})
</script>

<template>
    <v-sheet v-if="data" style="width: 100%; max-width: 1000px;" class="ma-1">
        <v-alert v-if="data.errorMessage" border variant="tonal" color="error" icon="$error">
            {{ data.errorMessage }}
        </v-alert>
        <EntryList v-else-if="data.type == 'coll'" :entries="data.entries" :folder="data.folder" :excludeHeadings="['parent']"></EntryList>
        <FileView v-else-if="data.type == 'file'" :file="data.file"></FileView>
    </v-sheet>
</template>

<style scoped>

</style>
