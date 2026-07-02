import { Err, Ok } from "~~/shared/api_response"
import { validateSessionAsAdmin } from "./validateSession"

export default defineEventHandler(async (event) => {
    if (!validateSessionAsAdmin(event))
        return Err(400, "Admin Only API call")

    type FormatOfApproveRace  = {
        raceId: number
    }
    try {
        const body = await readBody(event) as FormatOfApproveRace 

        const db = event.context.cloudflare.env.race_and_times
       
        await db
            .prepare(`UPDATE Races SET approved = 1 WHERE race_id = ?`)
            .bind(body.raceId)
            .run()

        return Ok(body)
    } catch (error) {
        return Err(500, "Failed to authenticate user login") 
    }
})