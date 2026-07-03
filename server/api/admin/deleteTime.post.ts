import { Err, Ok } from "~~/shared/api_response"
import { validateSessionAsAdmin } from "./validateSession"

export default defineEventHandler(async (event) => {
    if (!validateSessionAsAdmin(event))
        return Err(400, "Admin Only API call")

    type FormatOfTargetTime = {
        timeId: number
    }
    try {
        const body = await readBody(event) as FormatOfTargetTime

        const db = event.context.cloudflare.env.race_and_times
       
        await db
            .prepare(`DELETE FROM Times WHERE time_id = ?`)
            .bind(body.timeId)
            .run()

        return Ok(body)
    } catch (error) {
        return Err(500, "Failed to authenticate a deletion") 
    }
})