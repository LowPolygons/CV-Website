<script setup lang="ts">
import StyledButton from "~/components/StyledButton.vue"
import { formattedTime } from "~/util/formattedTime"
import type { RaceType } from "~~/shared/RaceType"
import type { TimePacket } from "~~/shared/TimePacket"
import { FetchError } from 'ofetch'

const route = useRoute()

async function getRaceInfoFromId(): Promise<RaceType | undefined> { 
    const raw = route.query.raceId

    if (!raw) return undefined

    const id = Array.isArray(raw) ? raw[0] : raw 

    if (!id) return undefined

    const { data, error } = await useFetch(`/api/races/${id}`)

    if (error.value !== undefined) {
        console.error(error)
        return undefined
    }

    return data.value ?? undefined
}

const preLoadedRace = ref(await getRaceInfoFromId())

const username = ref('')
const carName = ref('')
const raceName = (preLoadedRace && preLoadedRace.value) ? ref(preLoadedRace.value.name) : ref('Race Not Found')

const mins = ref('')
const secs = ref('')
const millis = ref('')

const submitted_successfull = ref(false)
const message = ref('')

async function submitNewTime() {
    if (!preLoadedRace) {
        message.value = "There is no race pre-loaded for time submission"
        return undefined
    }
    if (!preLoadedRace.value) {
        message.value = "There is no race pre-loaded for time submission"
        return undefined
    }
    
    if (username.value === '' ||
        carName.value === '' ||
        mins.value === '' ||
        secs.value === '' ||
        millis.value === ''
    ) {
        message.value = "Please ensure you fill all fields"
        return undefined
    }

    if (Number.isNaN(Number(mins.value)) || 
        Number.isNaN(Number(secs.value)) ||
        Number.isNaN(Number(millis.value)) ) {
        message.value = "Please ensure your time only contains numbers"
        return undefined
    } 

    try {
        const _ = await $fetch<TimePacket>(`/api/raceTimes/${preLoadedRace.value.id}`, {
            method: "POST",
            body: {
                username: username.value,
                mins: mins.value,
                secs: secs.value,
                car: carName.value,
                millis: millis.value
            }
        })

        submitted_successfull.value = true        

        message.value = "Successfully submitted a " + formattedTime(Number(mins.value), Number(secs.value), Number(millis.value)) + 
            " time on " + raceName.value + " under the username " + username.value

        username.value = ''
        raceName.value = ''
        mins.value = ''
        secs.value = ''
        millis.value = ''
    } catch (error) {
        submitted_successfull.value = false
        console.error(error)

        if (error instanceof FetchError) {
            if (error.statusCode === 500)  {;
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
        <ImportantText class="flex-1 mx-auto mt-10">
            {{ raceName }}
        </ImportantText>
        <div class="flex bg-neutral-300 dark:bg-neutral-700 mx-auto mt-10 p-1 w-[300px] rounded-xl">
            <ImportantText class="flex-1 ">
                Username:
            </ImportantText>
            <input
                class="flex-1 w-[10px] text-slate-900 dark:text-slate-200 text-center p-2"
                v-model="username"
                type="text"
                placeholder="Enter Username"
            />
        </div>

        <div class="flex bg-neutral-300 dark:bg-neutral-700 mx-auto mt-10 p-1 w-[300px] rounded-xl">
            <ImportantText class="text-left pl-5 pr-2">
                Car Name:
            </ImportantText>
            <input
                class="flex-1 w-[10px] text-slate-900 dark:text-slate-200 text-center p-2"
                v-model="carName"
                type="text"
                placeholder="Enter Car Name"
            />
        </div>
        <!-- <div class="flex bg-neutral-300 dark:bg-neutral-700 mx-auto mt-15 p-1 w-[300px] rounded-xl">
            <ImportantText class="flex-1 mg-auto">
                Race Name:
            </ImportantText>
            <input
                class="flex-1 mg-auto w-[10px] text-slate-900 dark:text-slate-200 text-center p-2"
                v-model="raceName"
                type="text"
                placeholder="Enter Race Name"
            /> -->
        <!-- </div> -->
        <div class="flex bg-neutral-300 dark:bg-neutral-700 mx-auto mt-10 p-1 w-[300px] rounded-xl">
            <ImportantText class="flex-1">
                Time:
            </ImportantText>
            <input
                class="flex-1 w-[50px] text-slate-900 dark:text-slate-200 text-center p-2"
                v-model="mins"
                type="string"
                placeholder="0"
                maxlength="2"
                pattern="[0-9]*"
                inputmode="numeric"
            />
            <ImportantText class="flex-1 ">
                :
            </ImportantText>
            <input
                class="flex-1 w-[60px] text-slate-900 dark:text-slate-200 text-center p-2"
                v-model="secs"
                type="string"
                placeholder="00"
                maxlength="2"
                pattern="[0-9]*"
                inputmode="numeric"
            />
            <ImportantText class="flex-1 ">
                .
            </ImportantText>
            <input
                class="flex-1 w-[70px] text-slate-900 dark:text-slate-200 p-2"
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
                @click="submitNewTime"
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

