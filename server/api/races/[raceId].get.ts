import { readFile } from "node:fs/promises"
import { Err, Ok, type ApiResponse } from "~~/shared/api_response"
import { join } from "node:path"
import { getRouterParam } from 'h3'
import type { StoredTimeData } from "~~/shared/StoredTimeData"
import { RaceType } from "~~/shared/RaceType"
import { DatabaseRaceType } from "~~/shared/DatabaseRaceType"

export default defineEventHandler(async (event) => {
    try {
        const desiredRace = Number(getRouterParam(event, "raceId"))

        const db = event.context.cloudflare.env.race_and_times
        
        const { results } = await db
            .prepare("SELECT * FROM Races")
            .all()

        const filteredRace: Array<RaceType> = (results as DatabaseRaceType[])
            .filter((race) => race.race_id === desiredRace)
            .map((race) => ({
                name: race.name,
                description: race.description,
                approved: Boolean(race.approved),
                imageUrl: race.image_url,
                id: race.race_id
            }))

        if (filteredRace.length === 0) return Err(405, "The Provided race ID does not exist in the database")
        if (filteredRace.length !== 1) return Err(501, "Server side error: multiple races have an identical ID")

        return Ok(filteredRace[0])
    } catch (error) {
        console.error("Error reading files server side: ", error)
        return Err(500, "Failed to load times") 
    }
})