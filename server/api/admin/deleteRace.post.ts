import { Err, Ok } from "~~/shared/api_response"
import { validateSessionAsAdmin } from "./validateSession"

export default defineEventHandler(async (event) => {
    if (!validateSessionAsAdmin(event))
        return Err(400, "Admin Only API call")

    type FormatOfTargetRace  = {
        raceId: number
    }
    try {
        const body = await readBody(event) as FormatOfTargetRace 

        const db = event.context.cloudflare.env.race_and_times
       
        await db
            .prepare(`DELETE FROM Races WHERE race_id = ?`)
            .bind(body.raceId)
            .run()

        return Ok(body)
    } catch (error) {
        return Err(500, "Failed to authenticate a deletion") 
    }
})