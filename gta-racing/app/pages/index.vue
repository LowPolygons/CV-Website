<script setup lang="ts">
import StyledATag from "~/components/StyledATag.vue";
import StyledButton from "~/components/StyledButton.vue";
import races from "~/data/races.json"


</script>

<template>
    <div class="bg-slate-400 dark:bg-slate-950">
        <h1 class="text-slate-900 dark:text-slate-200 text-center p-1 text-3xl font-bold bg-teal-400 dark:bg-teal-600">
            GTA Racing
        </h1>
        <div class="bg-slate-500 dark:bg-slate-800 flex">
            <StyledATag
                class="flex-1 pl-3 pr-3 pt-1 pb-1 m-2"
                href="/register"
            >
                <ImportantText>Register New Time</ImportantText>
            </StyledATag>
            <StyledATag class="flex-1 pl-3 pr-3 pt-1 pb-1 m-2">
                <ImportantText>View Global Scoreboard</ImportantText>
            </StyledATag>
        </div>
        <div
            v-for="(race, index) in races"
            :key="race.name"
            class="w-9/10 mx-auto p-1"
            
        >
            <NuxtLink :to="`/${index}`">
                <Race
                    :name="race.name"
                    :image-url="race.imageUrl"
                />
                <hr v-if="index !== races.length - 1">
            </NuxtLink>
        </div>
    </div>
</template>