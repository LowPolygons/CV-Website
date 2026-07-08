import type { DatabaseTimeData } from "~~/shared/DatabaseTimeData"
import { validateSessionAsAdmin } from "./validateSession"

export default defineEventHandler(async (event) => {
    if (!validateSessionAsAdmin(event))
        return createError({
            status: 400, 
            message: "Admin Only API call"
        })

    try {
        const db = event.context.cloudflare.env.race_and_times

        const { results } = await db
            .prepare("SELECT * FROM Times")
            .all()

        return results as DatabaseTimeData[]
    } catch (error) {
        console.error("Error reading files server side: ", error)
        return createError({
            status: 500, 
            message: "Failed to load times"
        }) 
    }
})
