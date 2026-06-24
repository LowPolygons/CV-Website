<script setup lang="ts">
import races from "~/data/races.json"
</script>

<template>
    <div class="bg-gray-300 dark:bg-gray-700">
        <h1 class="text-slate-900 dark:text-slate-200 text-center p-1 text-3xl font-bold bg-gray-400 dark:bg-gray-900">
            GTA Racing
        </h1>
        <div
            v-for="(race, index) in races"
            :key="race.name"
            class="w-9/10 mx-auto p-1"
            
        >
            <NuxtLink :to="`/${index}`">
                <!-- <a :href="'/${index}'" when not using nuxtlink-->
                <Race
                    :name="race.name"
                    :image-url="race.imageUrl"
                />
                <hr v-if="index !== races.length - 1">
            </NuxtLink>
        </div>
    </div>
</template>