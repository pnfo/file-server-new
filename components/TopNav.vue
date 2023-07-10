<script lang="js" setup>
import { copyClipboard } from '@/stores/utils';

const props = defineProps({
    parents: Array,
    extra: {
        type: Array,
        default: [],
    },
})
const homeItem = {icon: 'mdi-home', to: '/'}
const parentItems = props.parents.map(({name, id}) => ({title: name, to: `/${id}`, id}))
const items = [homeItem, ...parentItems, ...props.extra], lastItem = items.slice(-1)[0]
</script>

<template>
    <div class="d-flex flex-row flex-wrap">
        <v-breadcrumbs :items="items" style="font-size: 0.9em;" density="compact">
            <template v-slot:divider>
                <v-icon size="small" icon="mdi-chevron-right" color="secondary"></v-icon>
            </template>
            <template v-slot:title="{ item, index }">
                <v-icon v-if="item.icon" :icon="item.icon"></v-icon>
                {{ item.title || '' }}
            </template>
        </v-breadcrumbs>
        <!-- <v-btn  @click.stop="copyClipboard(lastItem.id)" icon="mdi-share" density="compact"></v-btn> -->
        <v-btn v-if="lastItem.title" color="info" variant="text" prepend-icon="mdi-share" @click.stop="copyClipboard(lastItem.id)">සබැඳිය</v-btn>
    </div>
</template>

<style scoped>
</style>
