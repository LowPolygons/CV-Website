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
            <Race
                :name="race.name"
                :image-url="race.imageUrl"
                @click="navigateTo(`/${index}`)"
            />
            <hr v-if="index !== races.length - 1">
        </div>
    </div>
</template>

<style scoped lang="scss">
.test {
    @apply text-slate-900 dark:text-slate-200 text-center p-1 text-3xl font-bold bg-gray-400 dark:bg-gray-900;
}
</style>