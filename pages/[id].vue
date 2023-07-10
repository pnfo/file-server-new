<script lang="js" setup>
const route = useRoute()
import { useSettingsStore } from '@/stores/settings'
import { getSeoTags, copyClipboard } from '@/stores/utils'
const settingsStore = useSettingsStore()

const id = route.params.id, data = ref({});
useSeoMeta(getSeoTags(`“${id}” සෙවුමේ ප්‍රතිඵල`, `“${id}” යන සෙවුම සඳහා ගැළපෙන වචන - අරුත.lk සිංහල ශබ්දකෝෂය.`));


console.log(`calling api with id ${id}`)
const { data: apiData, refresh } = await useFetch(`/api/entry/${id}`, { immediate: false })
await refresh()
data.value = apiData.value

// unless the useFetch is called onMounted/nextTick it returns null on the client due to some bug
onMounted(() => {
    // nextTick(() => {
    //     loadData()
    // })
})
//console.log(data.value.entries.length)

// const router = useRouter()
// watch(id, (newId, previous) => {
//     if (parseInt(newId) && newId) {
//       router.replace(`/${newId}`) // this will change the addressbar without refreshing the whole page
//     }
// })
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
