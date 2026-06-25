<script setup lang="ts">
import { S } from "vue-router/dist/index-BQLwgiyK.js"
import StyledButton from "~/components/StyledButton.vue"
import races from "~/data/races.json"

const username = ref('')
const raceName = ref('')

const mins = ref(0)
const secs = ref(0)
const millis = ref(0)

const submitted_successfull = ref(false)

async function submit_new_time() {
    submitted_successfull.value = true
}
</script>

<template>
    <div class="container mx-auto bg-stone-800 pb-15 h-screen">
        <h1 class="text-slate-900 dark:text-slate-200 text-center p-1 text-3xl font-bold bg-neutral-400 dark:bg-neutral-700">
            Register a Time
        </h1>
        <div class="bg-neutral-500 dark:bg-neutral-900 flex">
            <StyledATag
                class="flex flex-1 pl-3 pr-3 pt-1 pb-1 m-2"
                href="/"
            >
                <ImportantText>
                    Home
                </ImportantText>
            </StyledATag>
            <StyledATag class="flex-1 pl-3 pr-3 pt-1 pb-1 m-2">
                <ImportantText>View Global Scoreboard</ImportantText>
            </StyledATag>
        </div>
        <div class="flex bg-stone-700 mx-auto mt-20 p-1 w-[279px]">
            <ImportantText class="flex-1 mg-auto">
                Username:
            </ImportantText>
            <input
                class="flex-1 mg-auto w-[10px] text-slate-900 dark:text-slate-200 text-center p-2"
                v-model="username"
                type="text"
                placeholder="Enter Username"
            />
        </div>
        <div class="flex bg-stone-700 mx-auto mt-15 p-1 w-[279px]">
            <ImportantText class="flex-1 mg-auto">
                Race Name:
            </ImportantText>
            <input
                class="flex-1 mg-auto w-[10px] text-slate-900 dark:text-slate-200 text-center p-2"
                v-model="raceName"
                type="text"
                placeholder="Enter Race Name"
            />
        </div>
        <div class="flex bg-stone-700 mx-auto mt-15 p-1 w-[279px]">
            <ImportantText class="flex-1 mg-auto">
                Time:
            </ImportantText>
            <input
                class="flex-1 mg-auto w-[10px] text-slate-900 dark:text-slate-200 text-center p-2"
                v-model="mins"
                type="number"
                placeholder="0"
            />
            <ImportantText class="flex-1 mg-auto">
                :
            </ImportantText>
            <input
                class="flex-1 mg-auto w-[10px] text-slate-900 dark:text-slate-200 text-center p-2"
                v-model="secs"
                type="number"
                placeholder="0"
            />
            <ImportantText class="flex-1 mg-auto">
                .
            </ImportantText>
            <input
                class="flex-1 mg-auto w-[10px] text-slate-900 dark:text-slate-200 p-2"
                v-model="millis"
                type="number"
                placeholder="000"
            />
        </div>

        <div class="flex w-[279px] mx-auto">
            <StyledButton 
                class="mx-auto mt-15 p-1 flex-1"
                @click="submit_new_time()"
            >
                <ImportantText>Submit</ImportantText>
            </StyledButton>
        </div>

        <div 
            v-if="submitted_successfull"
            class="flex w-full mt-5"
        >
            <ImportantText class="w-full text-center">Time Submitted Succesfully</ImportantText>
        </div>
    </div>
</template>

