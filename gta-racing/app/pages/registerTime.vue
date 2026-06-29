<script setup lang="ts">
import StyledButton from "~/components/StyledButton.vue"
import { formattedTime } from "~/util/formattedTime"
import type { ApiResponse } from "~~/shared/api_response"
import type { TimePacket } from "~~/shared/TimePacket"

const route = useRoute()

const preLoadedRace = computed(() => { 
    const raw = route.query.raceName

    if (!raw) return undefined

    return Array.isArray(raw) ? raw[0] : raw 
})

const username = ref('')
const raceName = (preLoadedRace) ? ref(preLoadedRace.value) : ref('')

const mins = ref('')
const secs = ref('')
const millis = ref('')

const submitted_successfull = ref(false)
const message = ref('')

async function submit_new_time() {
    const status: ApiResponse<TimePacket> = await $fetch(`/api/raceTimes/${raceName.value}`, {
        method: "POST",
        body: {
            username: username.value,
            mins: mins.value,
            secs: secs.value,
            millis: millis.value
        }
    })

    if (status.status === 200) {
        submitted_successfull.value = true        

        message.value = "Successfully submitted a " + formattedTime(Number(mins.value), Number(secs.value), Number(millis.value)) + 
            " time on " + raceName.value + " under the username " + username.value

        username.value = ''
        raceName.value = ''
        mins.value = ''
        secs.value = ''
        millis.value = ''

    } else {
        submitted_successfull.value = false
        if (status.error !== undefined) {
            console.error(status.error)

            if (status.status === 500)  {
                message.value = "The race you provided is not in the dataset"
            } else {
                message.value = "Something went wrong internally, please try again later"
            }
        } else {
            message.value = "Something went wrong internally, please try again later"
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
            <StyledATag class="flex-1 pl-3 pr-3 pt-1 pb-1 m-2"
                href="/registerRace"
            >
                <ImportantText>Register New Race</ImportantText>
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
                type="string"
                placeholder="0"
                maxlength="2"
                pattern="[0-9]*"
                inputmode="numeric"
            />
            <ImportantText class="flex-1 mg-auto">
                :
            </ImportantText>
            <input
                class="flex-1 mg-auto w-[60px] text-slate-900 dark:text-slate-200 text-center p-2"
                v-model="secs"
                type="string"
                placeholder="00"
                maxlength="2"
                pattern="[0-9]*"
                inputmode="numeric"
            />
            <ImportantText class="flex-1 mg-auto">
                .
            </ImportantText>
            <input
                class="flex-1 mg-auto w-[70px] text-slate-900 dark:text-slate-200 p-2"
                v-model="millis"
                type="string"
                placeholder="000"
                maxlength="3"
                pattern="[0-9]*"
                inputmode="numeric"
            />
        </div>

        <div class="flex w-[300px] mx-auto">
            <StyledButton 
                class="mx-auto mt-15 p-1 flex-1"
                type="button"
                @click="submit_new_time"
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

