import { Err, Ok } from "~~/shared/api_response"
import type { DatabaseRaceType } from "~~/shared/DatabaseRaceType"
import { validateSessionAsAdmin } from "./validateSession"

export default defineEventHandler(async (event) => {
    if (!validateSessionAsAdmin(event))
        return Err(400, "Admin Only API call")

    try  {
        const db = event.context.cloudflare.env.race_and_times
       
        const { results } = await db
            .prepare("SELECT * FROM Races")
            .all()

        return Ok(results as DatabaseRaceType[])
    } catch (error) {
        console.error(error)
        return Err(500, "Failed to load races database")
    }
})