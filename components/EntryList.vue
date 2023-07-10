<script lang="js" setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import { getTypeInfo, getSizeInfo } from '@/stores/utils'
import { useSettingsStore } from '@/stores/settings'
import { useDisplay } from 'vuetify'
const display = ref(useDisplay()), mounted = ref(false)
const settingsStore = useSettingsStore()

const props = defineProps({
    entries: Array,
    folder: Object,
    excludeHeadings: {
        type: Array,
        default: [],
    }
})

const items = props.entries.map(entry => ({...entry, 
    sizeInfo: getSizeInfo(entry.Size),
    typeInfo: getTypeInfo(entry.type),
    parent: entry.parents.length ? entry.parents.slice(-1)[0] : null,
}))
const parents = props.folder.parents || []

const hasFiles = props.entries.some(({type}) => type != 'coll')
const mandatoryHeaders = [
    { title: 'ගොනුවේ නම', align: 'start', key: 'name', order: 1 },
    { title: 'ප්‍රමාණය', align: 'end', key: 'Size', order: 5 },
]
const fileHeaders = [
    { title: 'බහාලුම', align: 'start', key: 'parent', order: 2 },
    { title: 'බාගත ගණන', align: 'end', key: 'downloads', order: 3 },
    { title: 'එක් කළ දිනය', align: 'end', key: 'dateAdded', order: 4 },
]
const allHeaders = [...fileHeaders, ...mandatoryHeaders]
const headers = computed(() => [
        ...mandatoryHeaders,
        ...(hasFiles && !display.value.xs ? fileHeaders : []), // BUG: on desktop width returns 0
    ].filter(({key}) => !props.excludeHeadings.includes(key))
    .sort((a, b) => a.order - b.order)
)

const sortBy = computed({
  get() { return settingsStore.settings.sortBy },
  set(val) { settingsStore.setSetting('sortBy', val) }
})

// const sortBy = ref([{ key: 'name', order: 'asc' }])
const sortByStr = computed(() => {
    if (!sortBy.value.length) return 'ඉහත ලැයිස්තුවේ පිළිවෙළ වෙනස් කිරීමට අදාළ තීරුවේ මාතකාව මත ඔබන්න.'
    const sort = sortBy.value[0], sortName = allHeaders.find(({key}) => key == sort.key).title
    return `ඉහත ලැයිස්තුව “${sortName}” ${sort.order == 'desc' ? 'අඩුවන' : 'වැඩිවන'} පිළිවෙළට සැකසී ඇත.`
})
</script>

<template>
    <div>
        <TopNav v-if="parents.length" :parents="parents"></TopNav>

        <v-data-table density="compact" :items="items" :headers="headers" v-model:sort-by="sortBy"
            items-per-page="-1" hide-default-footer disable-pagination hover>
            <template v-slot:item.name="{ item }">
                <v-icon class="mr-2" :color="item.raw.typeInfo.color">{{ item.raw.typeInfo.icon }}</v-icon>
                <NuxtLink :class="'entry-name ' + item.raw.type" :to="`/${item.raw.id}`">{{ item.raw.name }}</NuxtLink>
                <span class="entry-details">
                    <span v-if="item.raw.type == 'coll'">{{ `ගොනු ${item.raw.num_entries} කි.` }}</span>
                    <span v-else>{{ item.raw.desc }}</span>
                </span>
            </template>
            <template v-slot:item.Size="{ item }">
                <span class="mr-2">{{ item.raw.sizeInfo.numeral }}</span>
                <span :class="'size-unit ' + item.raw.sizeInfo.unit">{{ item.raw.sizeInfo.unit }}</span>
            </template>
            <template v-slot:item.parent="{ item }">
                <NuxtLink v-if="item.raw.parent" class="parent-name" :to="`/${item.raw.parent.id}`">{{ item.raw.parent.name }}</NuxtLink>
            </template>
            <template v-slot:item.dateAdded="{ item }">
                <span style="font-size: 0.9em;">{{ item.raw.dateAdded }}</span>
            </template>
            <template #bottom></template> <!-- needed to hide the pagination -->
        </v-data-table>
        <v-alert variant="text" icon="mdi-sort" color="secondary" style="font-size: 0.9em;">{{ sortByStr }}</v-alert>
    </div>
</template>

<style scoped>
.entry-name { padding: 0 0.6rem 0 0.2rem; text-decoration: none; color: rgb(var(--v-theme-info))}
.entry-details { font-size: 0.75em; color: rgb(var(--v-theme-secondary))}
.size-unit { font-size: 0.8em; color: rgb(var(--v-theme-success)) }
.size-unit.GB { color: rgb(var(--v-theme-error)) }
.parent-name { text-decoration: none; }
</style>
