<script setup lang="ts">
import races from "~/data/races.json"
import type { ApiResponse } from "~/shared/api_response"
import type { TimesFormat } from "~/shared/api_return_type"

const route = useRoute()

const race = computed(() => {
    if (route.params.id === undefined) return undefined

    try {
        const index = parseInt(route.params.id.toString())

        if (Number.isNaN(index)) return undefined

        return races.at(index)
    } catch (e) { return undefined } 
})

async function get_times(race_name: string): Promise<[boolean, number]> {
    if (route.params.id === undefined) return [false, 0]; 

    try {
        const timeData: ApiResponse<Array<TimesFormat>> = await $fetch(`/api/${race_name}`)

        if (timeData.status == 200 &&
            timeData.content !== undefined
        ) {
            timeData.content.forEach((item) => console.log(item))

            return [true, timeData.content.length]
        } else {
            return [false, 0]
        }
    } catch (error) {
        console.error("Captured Error: ", error)
        return [false, 0]
    }
}

const validAndMaybeNum: [boolean, number] = race.value !== undefined ? await get_times(race.value.name) : [false, 0]

</script>

<template>
    <div>
        <Race class="race" v-if="race !== undefined" v-bind="race" />
        <h1 v-else>Race not found</h1>

        <ImportantText v-if="validAndMaybeNum[0]"> Number of times submitted: {{ validAndMaybeNum[1] }}</ImportantText >
        <a href="/">Back</a>
    </div>
</template>
