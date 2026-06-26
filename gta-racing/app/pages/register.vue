<script setup lang="ts">
import { S } from "vue-router/dist/index-BQLwgiyK.js"
import StyledButton from "~/components/StyledButton.vue"
import races from "~/data/races.json"
import type { ApiResponse } from "~/shared/api_response"
import type { TimePacket } from "~/shared/TimePacket"

const username = ref('')
const raceName = ref('')

const mins = ref(0)
const secs = ref(0)
const millis = ref(0)

const submitted_successfull = ref(false)
const error_message = ref('')

async function submit_new_time() {
    const status: ApiResponse<TimePacket> = await $fetch(`/api/${raceName.value}`, {
        method: "POST",
        body: {
            mins: mins.value,
            secs: secs.value,
            millis: millis.value
        }
    })

    if (status.status === 200) {
        submitted_successfull.value = true
    } else {
        submitted_successfull.value = false
        if (status.error !== undefined) {
            console.error(status.error)

            if (status.status === 500)  {
                error_message.value = "The race you provided is not in the dataset"
            } else {
                error_message.value = "Something went wrong internally, please try again later"
            }
        } else {
            error_message.value = "Something went wrong internally, please try again later"
        }
    }
}
</script>

<template>
    <div class="container mx-auto bg-slate-400 dark:bg-slate-900 pb-15 h-screen overflow-y-scroll ">
        <h1 class="text-slate-900 dark:text-slate-200 text-center p-1 text-3xl font-bold bg-teal-400 dark:bg-teal-600">
            Register a Time
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
            <StyledATag class="flex-1 pl-3 pr-3 pt-1 pb-1 m-2">
                <ImportantText>View Global Scoreboard</ImportantText>
            </StyledATag>
        </div>
        <div class="flex bg-neutral-300 dark:bg-neutral-700 mx-auto mt-20 p-1 w-[300px] rounded-xl">
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
        <div class="flex bg-neutral-300 dark:bg-neutral-700 mx-auto mt-15 p-1 w-[300px] rounded-xl">
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
        <div class="flex bg-neutral-300 dark:bg-neutral-700 mx-auto mt-15 p-1 w-[300px] rounded-xl">
            <ImportantText class="flex-1 mg-auto">
                Time:
            </ImportantText>
            <input
                class="flex-1 mg-auto w-[50px] text-slate-900 dark:text-slate-200 text-center p-2"
                v-model="mins"
                @input="mins= parseInt(mins.toString().slice(0, 2))"
                type="number"
                placeholder="0"
            />
            <ImportantText class="flex-1 mg-auto">
                :
            </ImportantText>
            <input
                class="flex-1 mg-auto w-[60px] text-slate-900 dark:text-slate-200 text-center p-2"
                v-model="secs"
                @input="secs= parseInt(secs.toString().slice(0, 2))"
                type="number"
                placeholder="0"
            />
            <ImportantText class="flex-1 mg-auto">
                .
            </ImportantText>
            <input
                class="flex-1 mg-auto w-[70px] text-slate-900 dark:text-slate-200 p-2"
                v-model="millis"
                type="number"
                placeholder="000"
                @input="millis = parseInt(millis.toString().slice(0, 3))"
            />
        </div>

        <div class="flex w-[300px] mx-auto">
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
        <div 
            v-else
            class="flex w-full mt-5"
        >
            <ImportantText class="w-full text-center">{{ error_message }}</ImportantText>
        </div>
    </div>
</template>

