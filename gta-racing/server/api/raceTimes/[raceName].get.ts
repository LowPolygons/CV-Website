import { readFile } from "node:fs/promises"
import { Err, Ok, type ApiResponse } from "~~/shared/api_response"
import { join } from "node:path"
import { getRouterParam } from 'h3'
import type { StoredTimeData } from "~~/shared/StoredTimeData"

export default defineEventHandler(async (event) => {
    const desiredRace = getRouterParam(event, "raceName")

    if (desiredRace === undefined)
        return Err(400, "Improper API request, raceName router param undefined")

    try {
        const times: Array<StoredTimeData> = await readFile(
            join(process.cwd(), "/server/data/times.json"), "utf8")
            .then((data: string) => JSON.parse(data))

        const filtered = times.filter((element) => {
            return (element.raceName.toLowerCase() === desiredRace.toLowerCase())
        })

        return Ok(filtered)

    } catch (error) {
        console.error("Error reading files server side: ", error)
        return Err(500, "Failed to load times") 
    }
})