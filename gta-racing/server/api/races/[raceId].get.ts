import { readFile } from "node:fs/promises"
import { Err, Ok, type ApiResponse } from "~~/shared/api_response"
import { join } from "node:path"
import { getRouterParam } from 'h3'
import type { StoredTimeData } from "~~/shared/StoredTimeData"
import { RaceType } from "~~/shared/RaceType"

export default defineEventHandler(async (event) => {
    try {
        const desiredRace = Number(getRouterParam(event, "raceId"))

        const races: Array<RaceType> = await readFile(
            join(process.cwd(), "/server/data/races.json"), "utf8")
            .then((data: string) => JSON.parse(data))
        
        const filteredRace = races.filter((race) => race.id === desiredRace)

        if (filteredRace.length === 0) return Err(405, "The Provided race ID does not exist in the database")
        if (filteredRace.length !== 1) return Err(501, "Server side error: multiple races have an identical ID")

        return Ok(filteredRace[0])
    } catch (error) {
        console.error("Error reading files server side: ", error)
        return Err(500, "Failed to load times") 
    }
})