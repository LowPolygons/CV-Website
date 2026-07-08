import { validateSessionAsAdmin } from "./validateSession"

export default defineEventHandler(async (event) => {
    if (!validateSessionAsAdmin(event))
        return createError({
            status: 400, 
            message: "Admin Only API call"
        })

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

        return body
    } catch (error) {
        return createError({
            status: 500, 
            message: "Failed to authenticate an approval request"
        }) 
    }
})