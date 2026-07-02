import { Err, Ok, type ApiResponse } from "~~/shared/api_response"
import { getRouterParam } from 'h3'
import { TimePacket } from "~~/shared/TimePacket"
import { DatabaseTimeData } from "~~/shared/DatabaseTimeData"

export default defineEventHandler(async (event) => {
    try {
        const db = event.context.cloudflare.env.race_and_times

        const relevantRace = Number(getRouterParam(event, "raceId"))

        if (relevantRace === undefined)
            return Err(400, "Race Router Param undefined")

        const timeData = await readBody(event) as TimePacket

        const { results } = await db
            .prepare("SELECT * FROM Races WHERE race_id = ?")
            .bind(relevantRace)
            .all()

        if ((results as DatabaseTimeData[]).find((race) => race.race_id === relevantRace) === undefined)
            return Err(500, "Provided race is not in dataset")

        await db.prepare(`INSERT INTO Times 
            (username, mins, secs, millis, car, race_id) 
            VALUES (?, ?, ?, ?, ?, ?)`)
            .bind(
                timeData.username, 
                timeData.mins, 
                timeData.secs, 
                timeData.millis, 
                timeData.car, 
                relevantRace
            )
            .run()

        return Ok(timeData)
    } catch (error) {
        console.error(error)
        return Err(600, "Improper API request: " + error)
    }
})