<script setup>
import { useSettingsStore } from '@/stores/settings'
const settingsStore = useSettingsStore(), route = useRoute()
const param = parseInt(route.params.duration.trim())
const duration = ref(!isNaN(param) ? param : 90)

const items = [1, 2, 3, 4, 6, 9, 12]
const { data, refresh } = await useFetch(`/api/recent?duration=${duration.value * 30}`, { key: '' + duration.value, immediate: false})
await refresh()
//console.log(data)

</script>

<template>
  <v-sheet style="width: 100%; max-width: 1000px;" class="ma-1">
    <div class="d-flex flex-row align-center">
      <v-icon class="mx-2">mdi-calendar-month</v-icon>
      <span>පසුගිය මාස </span>
      <v-select :items="items" v-model="duration" density="compact" class="mx-2"
        @update:model-value="navigateTo('/recent/' + duration)" style="min-width: 70px; max-width: 90px;"></v-select>
      <span>තුළ අලුතෙන් එකතු කළ ගොනු පහතින්.</span>
    </div>
    
    <EntryList v-if="data.entries" :entries="data.entries" :folder="{}" :excludeHeadings="['parent']"></EntryList>
  </v-sheet>
</template>

<style scoped>

</style>
