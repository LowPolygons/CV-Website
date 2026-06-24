<script setup lang="ts">
import races from "~/data/races.json"
</script>

<template>
    <div>
        <h1>GTA Racing</h1>
        <template
            v-for="(race, index) in races"
            :key="race.name"
        >
            <Race
                :name="race.name"
                :image-url="race.imageUrl"
                @click="navigateTo(`/${index}`)"
            />
            <hr v-if="index !== races.length - 1">
        </template>
    </div>
</template>