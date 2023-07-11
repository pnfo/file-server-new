<script lang="js" setup>
import { useSettingsStore } from '@/stores/settings'
import { getSeoTags } from '@/stores/utils'
const settingsStore = useSettingsStore()

const { data, refresh } = await useFetch(`/api/entry/0`, { immediate: false })
await refresh()
const config = settingsStore.config

useSeoMeta(getSeoTags(`${config.rootFolderName} මුල් පිටුව`, `${config.fileTypeName} භාගත කරගන්න - tipitaka.lk බෞද්ධ ${config.rootFolderName}.`))
</script>

<template>
  <v-sheet style="width: 100%; max-width: 1000px;" class="ma-1">
    <v-alert variant="text" icon="mdi-magnify" color="secondary" style="font-size: 0.9em;">
      {{ `මෙම ${config.rootFolderName} තුළ ${config.fileTypeName} සෙවීම සඳහා ඉහත කොටුව තුළ සෙවුම් පද යොදන්න.` }}</v-alert>
    <EntryList :entries="data.entries" :folder="data.folder"></EntryList>
    <div style="font-size: 0.85rem; line-height: 1.2; padding: 10px; text-align: center;">
      <template v-if="config.profile == 'library'">
        මෙහි ඇතුළත් කර ඇති පොත් බොහොමයක් පැරණි බෞද්ධ පොත් වන අතර ධර්ම දානය සඳහා ලියන ලද පොත් වේ. කතෘ ජිවත්ව සිටින
        අවස්ථාවලදී කතු අවසරය සහිතව අඩවියට එක් කිරීමට උත්සාහ දරා ඇත. ඔබ කතෘ වන යම් පොතක් මෙම අඩවියෙන් ඉවත් කර ගැනීමට අවශ්‍ය නම් හෝ 
        මෙහි අඩංගු නොවන පොත් අඩවියට ධර්ම දානය පිණිස ඇතුළු කිරීමට අප වෙත ලියන්න admin <v-icon size="small">mdi-at</v-icon> pitaka.lk.<br>
        යතුරුලියනය කළ පොත් ඇසුරින් සැකසු අන්තර්ජාලය අනවශ්‍ය (offline) මෘදුකාංග <v-icon size="small">mdi-laptop</v-icon> <a href="https://tipitaka.lk/library/461">පරිගණක සඳහා</a> සහ
        <v-icon size="small">mdi-android</v-icon> <a href="https://play.google.com/store/apps/details?id=lk.pitaka.books">ඇන්ඩ්‍රොයිඩ් දුරකථන සඳහා</a> බාගත කරගන්න.<br>
        ෴෴
      </template>
      <template v-else-if="config.profile == 'cloud'">
        මෙහි නැති ධර්ම දේශනා සහ පොත් අඩවියට ධර්ම දානය පිණිස ඇතුළු කිරීමට අප වෙත ලියන්න admin <i class="fas fa-at"></i> pitaka.lk.<br>
            ෴෴
      </template>
    </div>
  </v-sheet>
</template>

<style scoped>

</style>
