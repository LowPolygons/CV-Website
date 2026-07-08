import { validateSessionAsAdmin } from "./validateSession"

export default defineEventHandler(async (event) => {
    if (!validateSessionAsAdmin(event))
        return createError({
            status: 400, 
            message: "Admin Only API call"
        })

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

        return body
    } catch (error) {
        return createError({
            status: 500, 
            message: "Failed to authenticate race deletion"
        }) 
    }
})