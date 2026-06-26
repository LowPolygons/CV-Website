<script setup lang="ts">
import { I } from 'vue-router/dist/index-BQLwgiyK.js';
import type { ApiResponse } from '~~/shared/api_response';

const raceName = ref('')
const description = ref('')

const message = ref('')

async function submitRace() {
    const raceStatus: ApiResponse<boolean> = await $fetch("/api/races/races", {
        method: "POST",
        body: {
            name: raceName.value,
            description: description.value,
            imageUrl: "/question_mark.png"
        }
    })
    
    if (raceStatus.status == 200) {
        message.value = "Successfully uploaded race. It must be approved before it appears on the site"
    } else {
        console.log(raceStatus.error)

        message.value = "Failed to upload the race, please try again later"
    }
}

</script>

<template>
    <div class="container mx-auto bg-slate-400 dark:bg-slate-900 pb-15 h-screen overflow-y-scroll ">
        <h1 class="text-slate-900 dark:text-slate-200 text-center p-1 text-3xl font-bold bg-teal-400 dark:bg-teal-600">
            Register a New Race 
        </h1>
        <div class="bg-slate-500 dark:bg-slate-800 flex">
            <StyledATag
                class="flex flex-1 pl-3 pr-3 pt-1 pb-1 m-2"
                href="/"
            >
                <ImportantText>
                    Home
                </ImportantText>
            </StyledATag>
            <StyledATag
                class="flex-1 pl-3 pr-3 pt-1 pb-1 m-2"
                href="/registerTime"
            >
                <ImportantText>Register New Time</ImportantText>
            </StyledATag>
        </div>
        <div class="flex bg-neutral-300 dark:bg-neutral-700 mx-auto mt-20 p-1 w-[300px] rounded-xl">
            <ImportantText class="whitespace-nowrap">
                Race Name:
            </ImportantText>
            <input
                class="text-slate-900 dark:text-slate-200 p-2 overflow-x-scroll flex-1 min-w-0"
                v-model="raceName"
                type="text"
                placeholder="Enter Race Name"
            />
        </div>
        <div class="flex flex-col bg-neutral-300 dark:bg-neutral-700 mx-auto mt-15 py-1 w-[300px] rounded-xl">
            <ImportantText>
                Description
            </ImportantText>
            <textarea
                class="text-slate-900 dark:text-slate-200 text-center p-2 rounded-xl min-w-0 "
                v-model="description"
                type="text"
                placeholder="Enter Description"
            />
        </div>
        <div class="flex w-[300px] mx-auto">
            <StyledButton 
                class="mt-15 p-1 flex-1"
                type="button"
                @click="submitRace"
            >
                <ImportantText>Submit</ImportantText>
            </StyledButton>
        </div>

        <div 
            class="flex w-full mt-5"
            v-if="message !== ''"
        >
            <ImportantText class="w-full text-center">{{ message }}</ImportantText>
        </div>
    </div>
</template>

