import type { DatabaseRaceType } from "~~/shared/DatabaseRaceType"
import { validateSessionAsAdmin } from "./validateSession"

export default defineEventHandler(async (event) => {
    if (!validateSessionAsAdmin(event))
        return createError({
            status: 400, 
            message: "Admin Only API call"
        })

    try  {
        const db = event.context.cloudflare.env.race_and_times
       
        const { results } = await db
            .prepare("SELECT * FROM Races")
            .all()

        return results as DatabaseRaceType[]
    } catch (error) {
        console.error(error)
        return createError({
            status: 500, 
            message: "Failed to load races database"
        })
    }
})