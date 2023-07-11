<template>
  <v-app>
  <v-layout>
    <v-app-bar density="compact">
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" :color="drawer ? 'secondary' : 'primary'"></v-app-bar-nav-icon>
        </template>

        <v-spacer></v-spacer>
        <v-text-field style="width: 100%; max-width: 400px;" placeholder="සෙවුම් පද මෙතැන යොදන්න" v-model="searchTerm"
          density="compact" hide-details @update:modelValue="doSearch" @update:focused="checkSearch"></v-text-field>
        <!-- <v-app-bar-title color="primary" class="app-title">අරුත.lk</v-app-bar-title> -->

        <v-spacer></v-spacer>
        <template v-if="display.smAndUp || drawer">
          <v-divider class="mx-3 align-self-center" length="24" thickness="2" vertical></v-divider>
          <v-btn icon="mdi-home" to="/"></v-btn>
          <v-btn prepend-icon="mdi-new-box" to="/recent/3">අලුත් ගොනු</v-btn>
          <v-btn icon="mdi-theme-light-dark" @click.stop="darkMode = !darkMode"></v-btn>
        </template>
    </v-app-bar>
    
    <v-main>
      <NuxtLayout>
        <v-sheet class="d-flex flex-column align-center justify-center" :style="settingsStore.fontSizeStyle">
          <NuxtPage />
        </v-sheet>
      </NuxtLayout>
    </v-main>
  </v-layout>
  <v-snackbar app v-model="settingsStore.snackbar.model" top rounded="pill" color="info"
      :timeout="settingsStore.snackbar.timeout" >
      <div style="text-align: center;"><span>{{ settingsStore.snackbar.message }}</span></div>
  </v-snackbar>
</v-app>
</template>

<script setup>
useHead({
  titleTemplate: (titleChunk) => titleChunk ? `${titleChunk} - Tipitaka.lk` : 'Tipitaka.lk',
})
const searchTerm = ref('')
// prevent multiple searches that makes the UI sluggish when typing fast in the search box
let timeoutId
function doSearch(term) {
    if (!term.trim().length) return
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => navigateTo('/search/' + term.trim().toLowerCase()), 400)
}
function checkSearch(focused) {
    if (focused && searchTerm.value.length && !useRoute().path.includes('search')) doSearch(searchTerm.value)
}

import { useSettingsStore } from '@/stores/settings'
const settingsStore = useSettingsStore()
await settingsStore.loadConfig()

import { useTheme, useDisplay } from 'vuetify'
const theme = useTheme(), display = ref(useDisplay())
const drawer = computed({
  get() { return settingsStore.settings.drawer },
  set(val) { settingsStore.setSetting('drawer', val) }
})
const darkMode = computed({
  get() { return settingsStore.settings.darkMode },
  set(val) { 
    settingsStore.setSetting('darkMode', val)
    theme.global.name.value = val ? 'dark' : 'light'
  }
})

onMounted(() => {
    settingsStore.loadSettings()

    console.log(`settings darkMode = ${darkMode.value}`)
    theme.global.name.value = darkMode.value ? 'dark' : 'light'
})
</script>

<style>
@font-face { src: local('###'), url('/fonts/UN-Abhaya.ttf') format('truetype'); font-weight: normal; font-family: 'sinhala'; }
@font-face { src: local('###'), url('/fonts/UN-Alakamanda-4-95.ttf') format('truetype'); font-weight: normal; font-family: 'styled'; }
body {
  font-family: 'sinhala';
}
</style>
