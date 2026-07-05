<script setup lang="ts">
import type { ApiResponse } from '~~/shared/api_response'
import type { DatabaseRaceType } from '~~/shared/DatabaseRaceType'
import type { DatabaseTimeData } from '~~/shared/DatabaseTimeData'

const username = ref('')
const password = ref('')

// const logged_in = ref(true)
// const allRaces = ref<Array<DatabaseRaceType> | null>([])
// const allTimes = ref<Array<DatabaseTimeData> | null>([])

const logged_in = ref(false)
const allRaces = ref<Array<DatabaseRaceType> | null>()
const allTimes = ref<Array<DatabaseTimeData> | null>()

const approvedRace = ref<number | null>(null)
const targettedRace = ref<number | null>(null)
const targettedTime = ref<number | null>(null)

const showingRacesNotTimes = ref(true)
const config = useRuntimeConfig()

const message = ref('No Message To Display')

async function logInAttempt() {
    const session: ApiResponse<boolean> = await $fetch("/api/admin/login", {
        method: "POST",
        body: {
            username: username.value,
            password: password.value
        }
    })

    if (session.status === 200) {
        logged_in.value = true
        const raceResult: ApiResponse<DatabaseRaceType[]> = await $fetch("/api/admin/allRaces", { method: "GET"})
        if (raceResult.status !== 200 || raceResult.content === undefined) {
            console.log(raceResult.error)
            message.value = "Unsuccessful log in: " + raceResult.error
            allRaces.value = null
        } else {
            allRaces.value = raceResult.content
        }

        const timeResult: ApiResponse<DatabaseTimeData[]> = await $fetch("/api/admin/raceTimes", { method: "GET"})
        if (timeResult.status !== 200 || timeResult.content === undefined) {
            console.log(timeResult.error)
            message.value = "Unsuccessful log in: " + timeResult.error
            allTimes.value = null
        } else {
            allTimes.value = timeResult.content
        }
    } else {
        logged_in.value = false
        message.value = "Unsuccessful log in: " + session.error
    }
}

async function tryApproveRace() {
    if (approvedRace.value === null) return undefined
    if (allRaces.value === null || allRaces.value === undefined) return undefined
    
    const targetRace = allRaces.value.find((race) => race.race_id === approvedRace.value) 

    if (targetRace === undefined) return undefined
    if (targetRace.approved === 1) return undefined

    const status: ApiResponse<boolean> = await $fetch("/api/admin/approveRace", { 
        method: "POST",
        body: {
            raceId: approvedRace.value
        }})

    if (status.status === 200) {
        message.value = "Succesfully update Race approval status"
    } else {
        message.value = "Failed to update race status: " + status.error
    }
}

async function tryDeleteRace() {
    if (targettedRace.value === null) return undefined
    if (allRaces.value === null || allRaces.value === undefined) return undefined
    
    const targetRace = allRaces.value.find((race) => race.race_id === targettedRace.value) 

    if (targetRace === undefined) return undefined

    const status: ApiResponse<boolean> = await $fetch("/api/admin/deleteRace", { 
        method: "POST",
        body: {
            raceId: targettedRace.value
        }})

    if (status.status === 200) {
        message.value = "Succesfully deleted RACE "
    } else {
        message.value = "Failed to delete race: " + status.error
    }
}

async function tryDeleteTime() {
    if (targettedTime.value === null) {
        message.value = "targetted time was null" 
        return undefined
    }
    if (allTimes.value === null || allTimes.value === undefined) {
        message.value = "allTimes was null or undefined" 
        return undefined
    }
    
    const targetTime = allTimes.value.find((time) => time.time_id === targettedTime.value) 

    if (targetTime === undefined) {
        message.value = "Target Time wasn't found in allTimes" 
        return undefined
    }

    const status: ApiResponse<boolean> = await $fetch("/api/admin/deleteTime", { 
        method: "POST",
        body: {
            timeId: targettedTime.value
        }})

    if (status.status === 200) {
        message.value = "Succesfully deleted time"
    } else {
        message.value = "Failed to delete time : " + status.error
    }
}
</script>

<template>
    <div class="container mx-auto bg-slate-400 dark:bg-slate-900 pb-15 h-screen overflow-y-scroll ">
        <ImportantText class="whitespace-nowrap">
            Message: {{ message }}
        </ImportantText>
        <div v-if="!logged_in">
            <div class="flex bg-neutral-300 dark:bg-neutral-700 mx-auto mt-20 p-1 w-[300px] rounded-xl">

                <ImportantText class="whitespace-nowrap">
                    Username:
                </ImportantText>
                <input
                    class="text-slate-900 dark:text-slate-200 p-2 overflow-x-scroll flex-1 min-w-0"
                    v-model="username"
                    type="text"
                    placeholder="Enter Username"
                />
            </div>
            <div class="flex flex-col bg-neutral-300 dark:bg-neutral-700 mx-auto mt-10 py-1 w-[300px] rounded-xl">
                <ImportantText>
                Password 
                </ImportantText>
                <input
                    class="text-slate-900 dark:text-slate-200 p-2 overflow-x-scroll flex-1 min-w-0"
                    v-model="password"
                    type="text"
                    placeholder="Enter Password"
                />
            </div>
            <div class="flex flex-col bg-neutral-300 dark:bg-neutral-700 mx-auto mt-10 py-1 w-[300px] rounded-xl">
                <StyledButton @click="logInAttempt">
                    Login
                </StyledButton>
            </div>
        </div>
        <div v-if="logged_in">
            <ImportantText>
                Admin Session
            </ImportantText>
            <div class="flex bg-neutral-800">
                <StyledButton class="mx-auto" @click="showingRacesNotTimes = true">
                    <ImportantText>Races</ImportantText> 
                </StyledButton>
                <StyledButton class="mx-auto" @click="showingRacesNotTimes = false">
                    <ImportantText>Times</ImportantText> 
                </StyledButton>
                <StyledButton class="mx-auto" @click="logInAttempt">
                    <ImportantText>Refresh Page</ImportantText> 
                </StyledButton>
            </div>
            <div
                v-if="!showingRacesNotTimes && allTimes !== null"
            >
                <div class="flex bg-neutral-300 dark:bg-neutral-700 mx-auto mt-10 py-1 w-[300px] rounded-xl my-10">
                    <input
                        class="text-slate-900 dark:text-slate-200 flex-1 text-center"
                        v-model="targettedTime"
                        type="number"
                        placeholder="Enter Time ID"
                    />
                    <StyledButton class="flex-1 mx-2" @click="tryDeleteTime">
                        Submit Time To Delete 
                    </StyledButton>
                </div>
                <table 
                    class="w-[90%] mx-auto border-3 border-slate-500 mb-3" 
                >
                    <thead class="w-[90%]">
                        <tr class="text-xl italic">
                            <th class="text-slate-900 dark:text-slate-200 border-2 border-slate-500">Username</th>
                            <th class="text-slate-900 dark:text-slate-200 border-2 border-slate-500">Time ID</th>
                            <th class="text-slate-900 dark:text-slate-200 border-2 border-slate-500">Race ID</th>
                            <th class="text-slate-900 dark:text-slate-200 border-2 border-slate-500">Mins</th>
                            <th class="text-slate-900 dark:text-slate-200 border-2 border-slate-500">Secs</th>
                            <th class="text-slate-900 dark:text-slate-200 border-2 border-slate-500">Millis</th>
                            <th class="text-slate-900 dark:text-slate-200 border-2 border-slate-500">Car</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="(timeDetails, index) in allTimes"
                            :key="index"
                            class="text-center text-slate-900 dark:text-slate-200 border-2 border-slate-500"
                        >
                            <td class="p-1">{{ timeDetails.username }}</td>
                            <td class="p-1">{{ timeDetails.time_id }}</td>
                            <td class="p-1">{{ timeDetails.race_id }}</td>
                            <td class="p-1">{{ timeDetails.mins }}</td>
                            <td class="p-1">{{ timeDetails.secs }}</td>
                            <td class="p-1">{{ timeDetails.millis }}</td>
                            <td class="p-1">{{ timeDetails.car }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div
                v-if="showingRacesNotTimes && allRaces !== null"
            >
                <div class="flex bg-neutral-300 dark:bg-neutral-700 mx-auto mt-10 py-1 w-[300px] rounded-xl my-10">
                    <input
                        class="text-slate-900 dark:text-slate-200 flex-1 text-center"
                        v-model="approvedRace"
                        type="number"
                        placeholder="Enter Race ID"
                    />
                    <StyledButton class="flex-1 mx-2" @click="tryApproveRace">
                        Submit Race Approval
                    </StyledButton>
                </div>
                <div class="flex bg-neutral-300 dark:bg-neutral-700 mx-auto mt-10 py-1 w-[300px] rounded-xl my-10">
                    <input
                        class="text-slate-900 dark:text-slate-200 flex-1 text-center"
                        v-model="targettedRace"
                        type="number"
                        placeholder="Enter Race ID"
                    />
                    <StyledButton class="flex-1 mx-2" @click="tryDeleteRace">
                        Submit Race To Delete 
                    </StyledButton>
                </div>
                <table 
                    class="w-[90%] mx-auto border-3 border-slate-500 mb-3" 
                >
                    <thead class="w-[90%]">
                        <tr class="text-xl italic">
                            <th class="text-slate-900 dark:text-slate-200 border-2 border-slate-500">Race ID</th>
                            <th class="text-slate-900 dark:text-slate-200 border-2 border-slate-500">Name</th>
                            <th class="text-slate-900 dark:text-slate-200 border-2 border-slate-500">Description</th>
                            <th class="text-slate-900 dark:text-slate-200 border-2 border-slate-500">Approved</th>
                            <th class="text-slate-900 dark:text-slate-200 border-2 border-slate-500">Image Key (url after base url)</th>
                            <th class="text-slate-900 dark:text-slate-200 border-2 border-slate-500">Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="(raceDetails, index) in allRaces"
                            :key="index"
                            class="text-center text-slate-900 dark:text-slate-200 border-2 border-slate-500"
                        >
                            <td class="p-1">{{ raceDetails.race_id }}</td>
                            <td class="p-1">{{ raceDetails.name }}</td>
                            <td class="p-1">{{ raceDetails.description }}</td>
                            <td class="p-1">{{ raceDetails.approved }}</td>
                            <td class="p-1">{{ raceDetails.image_url }}</td>
                            <td class="p-1">
                                <img :src="((raceDetails.image_url ?? '').includes('uploads')) ? 
                                    `${config.public.imageBaseUrl}/${raceDetails.image_url}` : 
                                    `${raceDetails.image_url}`" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div >
    </div>
</template>
