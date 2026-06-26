<script setup lang="ts">
import StyledATag from "~/components/StyledATag.vue";
import StyledButton from "~/components/StyledButton.vue";
import races from "~/data/races.json"
</script>

<template>
    <div class="bg-slate-400 dark:bg-slate-900">
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
                <div class="bg-neutral-300 dark:bg-neutral-700 border-5 border-neutral-300 dark:border-neutral-700 rounded-xl">
                    <h2>
                        <ImportantText>
                            {{ race.name }}
                        </ImportantText>
                    </h2>
                    <img class="flex-1 w-[75%] mx-auto rounded-2xl mb-2":src="race.imageUrl">
                </div>
                <hr v-if="index !== races.length - 1">
            </NuxtLink>
        </div>
    </div>
</template>