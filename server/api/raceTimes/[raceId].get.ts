import { readFile } from "node:fs/promises"
import { Err, Ok, type ApiResponse } from "~~/shared/api_response"
import { join } from "node:path"
import { getRouterParam } from 'h3'
import type { StoredTimeData } from "~~/shared/StoredTimeData"
import type { DatabaseTimeData } from "~~/shared/DatabaseTimeData"

export default defineEventHandler(async (event) => {
    try {
        const db = event.context.cloudflare.env.race_and_times

        const desiredRace = Number(getRouterParam(event, "raceId"))

        if (desiredRace === undefined)
            return Err(400, "Improper API request, raceId router param undefined")

        const { results } = await db
            .prepare("SELECT * FROM Times WHERE race_id = ?")
            .bind(desiredRace)
            .all()

        const times: Array<StoredTimeData> = ( results as DatabaseTimeData[])
            .map((time) => ({
                raceId: time.race_id,
                username: time.username,
                car: time.car,
                mins: time.mins,
                secs: time.secs,
                millis: time.millis
            }))

        const filtered = times.filter((element) => {
            return (element.raceId) ? (element.raceId === desiredRace) : false
        })

        return Ok(filtered)

    } catch (error) {
        console.error("Error reading files server side: ", error)
        return Err(500, "Failed to load times") 
    }
})