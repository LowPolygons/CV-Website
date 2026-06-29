import { readFile, writeFile } from "node:fs/promises"
import { Err, Ok, type ApiResponse } from "~~/shared/api_response"
import { join } from "node:path"
import { getRouterParam } from 'h3'
import type { StoredTimeData } from "~~/shared/StoredTimeData"
import { TimePacket } from "~~/shared/TimePacket"
import type { RaceType } from "~~/shared/RaceType.ts"

export default defineEventHandler(async (event) => {
    const relevantRace = getRouterParam(event, "raceName")

    if (relevantRace === undefined)
        return Err(400, "Race Router Param undefined")

    try {
        const timeData = await readBody(event) as TimePacket

        const existingRaces: Array<RaceType> = await readFile(
            join(process.cwd(), "/app/data/races.json"), "utf8")
            .then((data: string) => JSON.parse(data))

        if (existingRaces.find(race => race.name.toLowerCase() === relevantRace.trim().toLowerCase()) === undefined)
            return Err(500, "Provided race is not in dataset")

        const existingTimes: Array<StoredTimeData> = await readFile(
            join(process.cwd(), "/server/data/times.json"), "utf8")
            .then((data: string) => {
                if (data === "") data = "[]"
                return JSON.parse(data)
            })                

        existingTimes.push({
            raceName: relevantRace,
            username: timeData.username,
            mins: timeData.mins,
            secs: timeData.secs,
            millis: timeData.millis
        })

        await writeFile(
            join(process.cwd(), "/server/data/times.json"), 
            JSON.stringify(existingTimes, null, 2)
        )

        return Ok(timeData)
    } catch (error) {
        console.error(error)
        return Err(600, "Improper API request: " + error)
    }
})