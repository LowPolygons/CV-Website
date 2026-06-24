<script setup lang="ts">

// "name": "Invalid Race ID",
// "imageUrl": "https://www.iconpacks.net/icons/2/free-sad-face-icon-2693-thumb.png"

import races from "~/data/races.json"

const route = useRoute()

const race = computed(() => {
    if (route.params.id === undefined) return undefined

    let index;

    try {
        index = parseInt(route.params.id.toString());  
        console.log(index)
    } catch (e) { return undefined } 

    if (Number.isNaN(index)) return undefined;

    return races.at(index);
})

</script>

<template>
    <div>
        <Race v-if="race !== undefined" v-bind="race" />
        <h1 v-else>Race not found</h1>

        <a href="/">Back</a>
    </div>
</template>