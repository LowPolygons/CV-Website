import { Err, Ok } from "~~/shared/api_response"
import type { DatabaseTimeData } from "~~/shared/DatabaseTimeData"
import { validateSessionAsAdmin } from "./validateSession"

export default defineEventHandler(async (event) => {
    if (!validateSessionAsAdmin(event))
        return Err(400, "Admin Only API call")

    try {
        const db = event.context.cloudflare.env.race_and_times

        const { results } = await db
            .prepare("SELECT * FROM Times")
            .all()

        return Ok(results as DatabaseTimeData[])
    } catch (error) {
        console.error("Error reading files server side: ", error)
        return Err(500, "Failed to load times") 
    }
})
