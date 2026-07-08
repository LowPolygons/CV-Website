<script setup lang="ts">
import type { StoredTimeData } from "~~/shared/StoredTimeData"
import { formattedTime } from "~/util/formattedTime"

const config = useRuntimeConfig()

const route = useRoute()

const { data: raceData, error } = await useFetch(`/api/races/${route.params.id}`)
const race = computed(() => {
    if (error.value) {
        console.error(error.value.message)

        return undefined
    }
    if (!raceData.value) return undefined

    raceData.value.imageUrl = (raceData.value.imageUrl.includes('uploads')) 
            ? `${config.public.imageBaseUrl}/${raceData.value.imageUrl}` 
            : `${raceData.value.imageUrl}`

    return raceData.value
})

async function getTimes(raceId: number): Promise<[boolean, number, Array<StoredTimeData>?]> {
    if (route.params.id === undefined) return [false, 0]; 

    const { data: timeData, error } = await useFetch(`/api/raceTimes/${raceId}`)

    if (error.value) {
        console.error(error.value.message)

        return [false, 0]
    }

    if (timeData.value === undefined) return [false, 0]

    return [true, timeData.value.length, timeData.value]
}

const validAndMaybeNum: [boolean, number, Array<StoredTimeData>?] = (race.value) ? await getTimes(race.value.id) : [false, 0]
</script>

<template>
    <div class="container mx-auto bg-slate-400 dark:bg-slate-900 pb-15 h-screen overflow-y-scroll ">
        <h1 
            class="text-slate-900 dark:text-slate-200 text-center p-1 text-3xl font-bold bg-teal-400 dark:bg-teal-600"
        >
            Race Details 
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
                v-if="race !== undefined"
                :href="`/registerTime?raceId=${race.id}`"
            >
                <ImportantText>Register New Time</ImportantText>
            </StyledATag>
            <StyledATag class="flex-1 pl-3 pr-3 pt-1 pb-1 m-2"
                href="/registerRace"
            >
                <ImportantText>Register New Race</ImportantText>
            </StyledATag>
        </div>
        <div>
            <Race class="w-9/10 mx-auto p-5 mt-5" v-if="race !== undefined" v-bind="race" />
            <ImportantText v-else>
                Race not found
            </ImportantText>
        </div>            
        <div class="bg-slate-300 dark:bg-teal-950 w-9/10 mx-auto mt-5 rounded-xl border-3 border-slate-500">
            <ImportantText 
                v-if="validAndMaybeNum[0]"
                class="p-2"
            > 
                Number of times submitted: {{ validAndMaybeNum[1] }}
            </ImportantText >
            <table 
                class="w-[90%] mx-auto border-3 border-slate-500 mb-3" 
                v-if="validAndMaybeNum[2] !== undefined && validAndMaybeNum[1] > 0"
            >
                <thead class="w-[90%]">
                    <tr class="text-xl italic">
                        <th class="text-slate-900 dark:text-slate-200 border-2 border-slate-500">Username</th>
                        <th class="text-slate-900 dark:text-slate-200 border-2 border-slate-500">Time</th>
                        <th class="text-slate-900 dark:text-slate-200 border-2 border-slate-500">Car</th>
                    </tr>
                </thead>
                <tbody>
                    <tr 
                        v-for="(timeDetails, index) in validAndMaybeNum[2]"
                        :key="index"
                        class="text-center text-slate-900 dark:text-slate-200 border-2 border-slate-500"
                    >
                        <td class="p-1">{{ timeDetails.username }}</td>
                        <td class="p-1">{{ formattedTime(timeDetails.mins, timeDetails.secs, timeDetails.millis) }}</td>
                        <td class="p-1">{{ timeDetails.car }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
